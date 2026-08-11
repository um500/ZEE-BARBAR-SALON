import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, MessageCircle, RefreshCw, Calendar, CheckCircle2, User, Phone, Scissors, Clock, StickyNote, UserCheck, ShieldCheck } from 'lucide-react';
import { SERVICES, BARBERS, TIME_SLOTS, WHATSAPP_NUMBER } from '../data/barberData';
import { confirmBookingSlot, isTimeSlotPast, isTodayDate, getTodayDateString, getAvailabilityForDate, SlotStatus } from '../lib/bookingStore';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  isSummaryCard?: boolean;
  summaryData?: {
    name: string;
    phone: string;
    service: string;
    barber: string;
    date: string;
    time: string;
    notes: string;
  };
}

const DEFAULT_GREETING = "Hi! Main Zee Barber Shop ka AI booking assistant hu. Sabse pehle bataiye — aapko kaunsi service chahiye?";

export const AiBookingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem('zee_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: '1',
        role: 'assistant',
        content: DEFAULT_GREETING,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    sessionStorage.setItem('zee_chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const parseBookingSummary = (text: string) => {
    if (!text.includes('BOOKING_SUMMARY:')) return null;

    const nameMatch = text.match(/Name:\s*(.+)/i);
    const phoneMatch = text.match(/Phone:\s*(.+)/i);
    const serviceMatch = text.match(/Service:\s*(.+)/i);
    const barberMatch = text.match(/Barber:\s*(.+)/i);
    const dateMatch = text.match(/Date:\s*(.+)/i);
    const timeMatch = text.match(/Time:\s*(.+)/i);
    const notesMatch = text.match(/Notes:\s*(.+)/i);

    if (nameMatch || serviceMatch) {
      return {
        name: nameMatch ? nameMatch[1].trim() : 'Valued Client',
        phone: phoneMatch ? phoneMatch[1].trim() : '',
        service: serviceMatch ? serviceMatch[1].trim() : 'Zee Haircut',
        barber: barberMatch ? barberMatch[1].trim() : 'Zee (Master Barber)',
        date: dateMatch ? dateMatch[1].trim() : 'Tomorrow',
        time: timeMatch ? timeMatch[1].trim() : '11:00 AM',
        notes: notesMatch ? notesMatch[1].trim() : 'None',
      };
    }
    return null;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      let replyText = '';

      if (res.ok) {
        const data = await res.json();
        replyText = data.reply;
      }

      if (!replyText) {
        replyText = getClientFallbackReply(newMessages);
      }

      const summary = parseBookingSummary(replyText);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSummaryCard: !!summary,
        summaryData: summary || undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat fetch exception, using client fallback logic:", err);
      const fallbackReply = getClientFallbackReply(newMessages);
      const summary = parseBookingSummary(fallbackReply);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSummaryCard: !!summary,
        summaryData: summary || undefined
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Safe client fallback logic matching main booking appointment form
  const getClientFallbackReply = (currentMsgs: Message[]): string => {
    const userInputs = currentMsgs.filter(m => m.role === 'user').map(m => m.content);
    const count = userInputs.length;
    const last = userInputs[userInputs.length - 1] || '';

    if (count === 1) {
      return `Note kar liya: "${last}"!\n\nAap kis Date ko aana chahenge? (Shop 7 days Monday to Sunday open hai!)`;
    } else if (count === 2) {
      return `Sahi hai! Kis Time slot par aana chahenge?\n(Available slots: 9:00 AM to 7:00 PM, e.g. 10:00 AM, 11:00 AM, 02:00 PM, 04:00 PM)`;
    } else if (count === 3) {
      return `Slot note kar liya! Aapka Full Name kya hai?`;
    } else if (count === 4) {
      return `Shukriya, ${last}! Aapka Mobile / WhatsApp Phone Number kya hai?`;
    } else if (count === 5) {
      return `Phone number note ho gaya. Kya koi special instruction ya haircut note hai? (Agar nahi hai to 'None' batayein)`;
    } else {
      const service = userInputs[0] || 'Zee Signature Haircut';
      const date = userInputs[1] || 'Tomorrow';
      const time = userInputs[2] || '11:00 AM';
      const name = userInputs[3] || 'Valued Client';
      const phone = userInputs[4] || 'Not provided';
      const notes = userInputs[5] || 'None';

      return `Bahut badhiya! Aapki booking details taiyar hain:\n\nBOOKING_SUMMARY:\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\nTime: ${time}\nNotes: ${notes}\n\nYahi details confirm kar du?`;
    }
  };

  const handleConfirmAndSendWhatsApp = async (summary: {
    name: string;
    phone: string;
    service: string;
    barber?: string;
    date: string;
    time: string;
    notes: string;
  }) => {
    // Confirm booking in shared backend store
    await confirmBookingSlot(
      summary.date,
      summary.time,
      summary.name,
      summary.phone,
      summary.service
    );

    const text = `💈 *ZEE BARBER SHOP - APPOINTMENT REQUEST* 💈\n\n` +
      `*Service:* ${summary.service}\n` +
      `*Date:* ${summary.date}\n` +
      `*Time Slot:* ${summary.time}\n\n` +
      `*Client Name:* ${summary.name}\n` +
      `*Phone Number:* ${summary.phone}\n` +
      (summary.notes && summary.notes !== 'None' ? `*Notes:* ${summary.notes}\n` : '') +
      `\n_Sent via Zee Barber Shop AI Booking Assistant_`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');

    const successMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: "✦ Booking Request Sent to WhatsApp! ✦\n\nHum aapka appointment slot jald se jald verify aur confirm kar denge. Thank you!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, successMessage]);
  };

  const handleResetChat = () => {
    const resetMsgs: Message[] = [
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: DEFAULT_GREETING,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(resetMsgs);
    sessionStorage.removeItem('zee_chat_history');
  };

  const scrollToBookingForm = () => {
    setIsOpen(false);
    const el = document.getElementById('booking');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const userMsgCount = messages.filter(m => m.role === 'user').length;

  return (
    <>
      {/* Floating Action Round Chat Button — Fixed z-50 above mobile bar */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-4 sm:right-6 z-50 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#8B1A2B] hover:bg-[#A32034] text-white font-bold text-xs sm:text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-[#9A1C2E] shadow-[#8B1A2B]/40 cursor-pointer"
          aria-label="Open AI Booking Chat Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Bot className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
          </div>
          <span className="tracking-wide font-semibold text-white">Chat to Book</span>
          <Sparkles className="w-4 h-4 text-[#E8C4A0]" />
        </button>
      )}

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[430px] sm:h-[640px] z-50 flex flex-col bg-[#0d0d12] border border-[#8B1A2B]/40 sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#141216] via-[#111014] to-[#181014] border-b border-[#8B1A2B]/30 px-4 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#8B1A2B]/30 border border-[#8B1A2B]/60 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-[#C93B4E]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold font-serif-header text-white tracking-tight">
                    Book with Zee Barber Shop
                  </h3>
                  <span className="text-[10px] bg-[#8B1A2B]/30 text-[#C93B4E] px-1.5 py-0.5 rounded border border-[#8B1A2B]/40 font-mono">
                    AI
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online • WhatsApp Direct Confirmation
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
                title="Restart Chat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
                title="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>


          {/* Subheader fallback prompt */}
          <div className="bg-[#0a0a0f] px-4 py-1.5 border-b border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Collects appointment details step-by-step</span>
            <button
              onClick={scrollToBookingForm}
              className="text-[#C93B4E] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>Use Form Instead</span>
            </button>
          </div>

          {/* Scrollable Message Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-[#09090d]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mb-1 px-1">
                  <span>{msg.role === 'user' ? 'You' : 'Zee Assistant'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#8B1A2B] text-white font-medium rounded-tr-none shadow-md border border-[#9A1C2E]'
                      : 'bg-[#15151e] text-zinc-200 border border-zinc-800 rounded-tl-none shadow-lg'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>

                  {/* Render Structured Booking Summary Card */}
                  {msg.isSummaryCard && msg.summaryData && (
                    <div className="mt-3 pt-3 border-t border-[#8B1A2B]/40 space-y-2.5 text-xs text-zinc-100">
                      <div className="flex items-center gap-1.5 text-[#C93B4E] font-bold text-xs uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Appointment Summary</span>
                      </div>

                      <div className="bg-[#0b0b0f] p-3 rounded-xl border border-zinc-800/80 space-y-2">
                        <div className="flex items-center gap-2">
                          <Scissors className="w-3.5 h-3.5 text-[#C93B4E] shrink-0" />
                          <span className="text-zinc-400">Service:</span>
                          <span className="font-semibold text-white ml-auto">{msg.summaryData.service}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#C93B4E] shrink-0" />
                          <span className="text-zinc-400">Date:</span>
                          <span className="font-semibold text-white ml-auto">{msg.summaryData.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#C93B4E] shrink-0" />
                          <span className="text-zinc-400">Time:</span>
                          <span className="font-semibold text-[#C93B4E] ml-auto">{msg.summaryData.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-[#C93B4E] shrink-0" />
                          <span className="text-zinc-400">Name:</span>
                          <span className="font-semibold text-white ml-auto">{msg.summaryData.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-[#C93B4E] shrink-0" />
                          <span className="text-zinc-400">Phone:</span>
                          <span className="font-semibold text-white ml-auto">{msg.summaryData.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StickyNote className="w-3.5 h-3.5 text-[#C93B4E] shrink-0" />
                          <span className="text-zinc-400">Notes:</span>
                          <span className="font-semibold text-zinc-300 ml-auto truncate max-w-[150px]">{msg.summaryData.notes}</span>
                        </div>
                      </div>

                      {/* Summary Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            const inputEl = document.getElementById('chat-input-box');
                            if (inputEl) inputEl.focus();
                          }}
                          className="py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleConfirmAndSendWhatsApp(msg.summaryData!)}
                          className="flex-1 py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          Confirm & Send via WhatsApp
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Step 1 Quick Chips: Select Service */}
            {userMsgCount === 0 && (
              <div className="pt-2">
                <p className="text-[11px] text-zinc-400 mb-2 font-medium">Quick Select Service:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SERVICES.slice(0, 4).map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleSendMessage(`${s.name} ($${s.price})`)}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#8B1A2B]/20 text-zinc-300 hover:text-white border border-zinc-800 hover:border-[#8B1A2B]/50 transition-all cursor-pointer text-left flex items-center justify-between gap-2"
                    >
                      <span>{s.name}</span>
                      <span className="font-mono text-[#C93B4E] font-bold">${s.price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 Quick Chips: Select Date */}
            {userMsgCount === 1 && (
              <div className="pt-2">
                <p className="text-[11px] text-zinc-400 mb-2 font-medium">Quick Select Date:</p>
                <div className="flex flex-wrap gap-1.5">
                  {['Today', 'Tomorrow', 'This Friday', 'This Saturday'].map(d => (
                    <button
                      key={d}
                      onClick={() => handleSendMessage(d)}
                      className="text-xs px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#8B1A2B]/20 text-zinc-200 hover:text-white border border-zinc-800 hover:border-[#8B1A2B]/50 transition-all cursor-pointer"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 Quick Chips: Select Time Slot */}
            {userMsgCount === 2 && (
              <div className="pt-2">
                <p className="text-[11px] text-zinc-400 mb-2 font-medium">Quick Select Available Time Slot:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(() => {
                    const userMsgs = messages.filter(m => m.role === 'user').map(m => m.content);
                    const selectedDate = userMsgs[1] || 'Today';
                    const validSlots = TIME_SLOTS.filter(slot => !isTimeSlotPast(selectedDate, slot));
                    
                    if (validSlots.length === 0) {
                      return (
                        <p className="text-xs text-amber-400 font-sans">
                          All available time slots for this date have passed or reached closing time. Please select another date (e.g., Tomorrow).
                        </p>
                      );
                    }

                    return validSlots.slice(0, 8).map(slot => (
                      <button
                        key={slot}
                        onClick={() => handleSendMessage(slot)}
                        className="text-xs px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#8B1A2B]/20 text-zinc-200 hover:text-white border border-zinc-800 hover:border-[#8B1A2B]/50 transition-all cursor-pointer font-mono"
                      >
                        {slot}
                      </button>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-[#C93B4E] bg-[#15151e] p-3 rounded-xl w-max border border-zinc-800">
                <Bot className="w-4 h-4 animate-bounce text-[#C93B4E]" />
                <span>Zee Assistant is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Input Area */}
          <div className="bg-[#0d0d12] border-t border-zinc-800 p-3 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                id="chat-input-box"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your reply (e.g. Marcus, Tomorrow 3pm)..."
                disabled={isLoading}
                className="flex-1 bg-[#14141d] border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#8B1A2B] transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-[#8B1A2B] hover:bg-[#A32034] disabled:opacity-40 text-white font-bold transition-all cursor-pointer shrink-0 border border-[#9A1C2E]"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>


        </div>
      )}
    </>
  );
};
