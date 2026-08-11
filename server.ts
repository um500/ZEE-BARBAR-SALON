import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for tracking bookings per slot (key: `YYYY-MM-DD_TIME_SLOT`)
const serverBookingCounts: Record<string, number> = {};

const TIME_SLOTS = [
  '09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM',
  '12:00 PM', '01:00 PM', '01:45 PM', '02:30 PM',
  '03:15 PM', '04:00 PM', '04:45 PM', '05:30 PM', '06:15 PM'
];

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === 'PM' && hours < 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
}

function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalizeDateStr(dateStr: string): string {
  if (!dateStr) return getTodayDateString();
  const lower = dateStr.toLowerCase().trim();
  if (lower === 'today' || lower === 'aaj') return getTodayDateString();
  if (lower === 'tomorrow' || lower === 'kal') {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  return dateStr;
}

function getDayOfWeek(dateStr: string): number {
  if (!dateStr) return new Date().getDay();
  const norm = normalizeDateStr(dateStr);
  const parts = norm.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);
    return dateObj.getDay();
  }
  return new Date().getDay();
}

function isSundayDate(dateStr: string): boolean {
  return getDayOfWeek(dateStr) === 0;
}

function isTodayDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const lower = dateStr.toLowerCase().trim();
  if (lower === 'today' || lower === 'aaj') return true;
  return normalizeDateStr(dateStr) === getTodayDateString();
}

function isTimeSlotPast(dateStr: string, timeSlot: string): boolean {
  const normDate = normalizeDateStr(dateStr);
  const slotMinutes = parseTimeToMinutes(timeSlot);
  const dayIndex = getDayOfWeek(normDate);

  // Sunday (0): Shop closes at 5:00 PM (17:00 / 1020 mins), last 45-min appointment slot starts at 04:00 PM (960 mins)
  if (dayIndex === 0 && slotMinutes > 960) {
    return true;
  }

  // Saturday (6): Shop closes at 6:00 PM (18:00 / 1080 mins), last 45-min appointment slot starts at 04:45 PM (1005 mins)
  if (dayIndex === 6 && slotMinutes > 1005) {
    return true;
  }

  if (!isTodayDate(normDate)) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return slotMinutes <= currentMinutes;
}

// REST API Endpoints for Booking Availability
app.get("/api/bookings/availability", (req, res) => {
  const dateQuery = (req.query.date as string) || getTodayDateString();
  const normDate = normalizeDateStr(dateQuery);
  res.json({
    date: normDate,
    isToday: isTodayDate(normDate),
    counts: serverBookingCounts
  });
});

app.post("/api/bookings/book", (req, res) => {
  const { date, timeSlot, clientName, clientPhone, serviceName } = req.body;
  const normDate = normalizeDateStr(date);

  if (!normDate || !timeSlot) {
    return res.status(400).json({ success: false, message: "Date and Time Slot are required" });
  }

  // Rule 1: Check if past for today
  if (isTimeSlotPast(normDate, timeSlot)) {
    return res.status(400).json({
      success: false,
      reason: "PAST",
      message: "This time slot has already passed for today. Please select an upcoming slot."
    });
  }

  // Rule 2: Check max 2 bookings per slot
  const key = `${normDate}_${timeSlot}`;
  const currentCount = serverBookingCounts[key] || 0;

  if (currentCount >= 2) {
    return res.status(400).json({
      success: false,
      reason: "FULL",
      message: "This time slot is fully booked (maximum 2 bookings per slot)."
    });
  }

  // Confirm booking
  serverBookingCounts[key] = currentCount + 1;
  return res.json({
    success: true,
    count: serverBookingCounts[key],
    message: "Booking confirmed successfully!"
  });
});

const SYSTEM_PROMPT = `You are the booking assistant for Zee Barber Shop.
Current Server Time & Date: ${new Date().toLocaleString()} (Today is ${getTodayDateString()}).

Your job is to collect booking details step-by-step:
1. Service
2. Date (Monday to Sunday, open 7 days a week)
3. Preferred Time Slot (Mon-Sat: 9:00 AM to 7:00 PM, Sun: 9:00 AM to 5:00 PM - last slot 4:00 PM)
4. Full Name
5. Phone Number
6. Notes (optional)

CRITICAL RULES:
1. PAST TIME SLOTS & SUNDAY CLOSING: For today's date, time slots that have already passed are INVALID. On Sundays, the shop closes at 5:00 PM, so slots after 4:00 PM are INVALID. If a user asks for an invalid slot, politely explain and suggest the next available slot.
2. MAX 2 BOOKINGS PER SLOT: Each time slot has a maximum limit of 2 bookings. Once a slot reaches 2 bookings, it is FULL.
3. Open 7 Days a week (Monday to Saturday: 9:00 AM – 7:00 PM, Sunday: 9:00 AM – 5:00 PM).

Output a final summary in this EXACT format when all details are collected:

BOOKING_SUMMARY:
Name: [name]
Phone: [phone]
Service: [service]
Date: [date]
Time: [time]
Notes: [notes or "None"]

After showing summary, ask: "Yahi details confirm kar du?"`;

app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.5,
        }
      });

      const replyText = response.text || "Aapka message mil gaya! Kripya agla detail batayein.";
      return res.json({ reply: replyText });
    } else {
      const reply = generateFallbackResponse(messages);
      return res.json({ reply });
    }
  } catch (error) {
    console.error("Chat API error:", error);
    const reply = generateFallbackResponse(req.body.messages || []);
    return res.json({ reply });
  }
});

// Intelligent fallback logic with Real-time Past & Full Slot Checks
function generateFallbackResponse(messages: Array<{ role: string; content: string }>): string {
  const userMsgs = messages.filter(m => m.role === 'user').map(m => m.content);
  const count = userMsgs.length;

  if (count === 0) {
    return "Hi! Main Zee Barber Shop ka AI booking assistant hu. Sabse pehle bataiye — aapko kaunsi service chahiye?";
  }

  const lastInput = userMsgs[userMsgs.length - 1];

  if (count === 1) {
    return `Note kar liya: ${lastInput}! Aap kis Date ko aana chahenge? (Shop 7 days Mon-Sun open hai!)`;
  } else if (count === 2) {
    return `Sahi hai! Kis Time slot par aana chahenge? (Hours: Mon-Sat 9:00 AM – 7:00 PM, Sunday 9:00 AM – 5:00 PM, e.g., 11:00 AM, 3:00 PM)`;
  } else if (count === 3) {
    // Validate Date and Time slot
    const reqDate = userMsgs[1] || 'Today';
    const reqTime = lastInput;
    const normDate = normalizeDateStr(reqDate);

    // Rule 1 check: Past slot for today
    if (isTimeSlotPast(normDate, reqTime)) {
      const upcomingSlots = TIME_SLOTS.filter(s => !isTimeSlotPast(normDate, s) && (serverBookingCounts[`${normDate}_${s}`] || 0) < 2);
      if (upcomingSlots.length > 0) {
        return `Kshama kijiye, "${reqTime}" ka time nikal chuka hai (past slot). Aaj ke agle available slots hain: ${upcomingSlots.slice(0, 3).join(', ')}. Aap inme se kaunsa chunna chahenge?`;
      } else {
        return `Kshama kijiye, aaj ke sabhi slots nikal chuke hain. Kripya kal ya kisi agle din ki date chunien.`;
      }
    }

    // Rule 2 check: Max 2 bookings per slot
    const key = `${normDate}_${reqTime}`;
    const bookedCount = serverBookingCounts[key] || 0;

    if (bookedCount >= 2) {
      const altSlots = TIME_SLOTS.filter(s => !isTimeSlotPast(normDate, s) && (serverBookingCounts[`${normDate}_${s}`] || 0) < 2);
      if (altSlots.length > 0) {
        return `Kshama kijiye, "${reqTime}" slot fully booked hai (max 2 bookings limit reached). Usi din ka nearest available slot hai: ${altSlots[0]}. Kya yeh time aapke liye sahi rahega?`;
      } else {
        return `Kshama kijiye, ${reqDate} ke sabhi time slots fully booked hain. Kripya kisi doosri date ka slot chunien.`;
      }
    }

    return `Done! Slot "${reqTime}" available hai. Aapka Full Name kya hai?`;
  } else if (count === 4) {
    return `Shukriya, ${lastInput}! Aapka WhatsApp / Mobile Phone Number kya hai?`;
  } else if (count === 5) {
    return `Aapka number note ho gaya. Kya koi special instruction ya note hai? (Agar nahi hai to 'None' likhein)`;
  } else {
    const service = userMsgs[0] || 'Zee Signature Haircut';
    const date = userMsgs[1] || 'Tomorrow';
    const time = userMsgs[2] || '11:00 AM';
    const name = userMsgs[3] || 'Valued Client';
    const phone = userMsgs[4] || 'Not provided';
    const notes = userMsgs[5] || 'None';

    return `Bahut badhiya! Aapki booking details taiyar hain:\n\nBOOKING_SUMMARY:\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\nTime: ${time}\nNotes: ${notes}\n\nYahi details confirm kar du?`;
  }
}

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
