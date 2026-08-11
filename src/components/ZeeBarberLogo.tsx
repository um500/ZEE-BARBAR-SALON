import React from 'react';

interface ZeeBarberLogoProps {
  className?: string;
}

export const ZeeBarberLogo: React.FC<ZeeBarberLogoProps> = ({ className = "h-9 sm:h-10 w-auto" }) => {
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Zee Barber Shop Logo"
    >
      {/* Emblem / Shield Box */}
      <rect x="2" y="2" width="56" height="56" rx="14" fill="#181418" stroke="#8B1A2B" strokeWidth="2.5" />
      <rect x="6" y="6" width="48" height="48" rx="10" fill="url(#wineGrad)" opacity="0.15" />
      
      {/* Scissors Icon in Emblem */}
      <path
        d="M20 20 L30 30 L20 40 M20 20 A 4 4 0 1 0 16 16 A 4 4 0 0 0 20 20 M20 40 A 4 4 0 1 0 16 44 A 4 4 0 0 0 20 40 M40 20 L30 30 L40 40 M40 20 A 4 4 0 1 1 44 16 A 4 4 0 0 1 40 20 M40 40 A 4 4 0 1 1 44 44 A 4 4 0 0 1 40 40"
        stroke="#C93B4E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="30" r="3" fill="#8B1A2B" stroke="#F5F5F5" strokeWidth="1.5" />

      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="wineGrad" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B1A2B" />
          <stop offset="1" stopColor="#C93B4E" />
        </linearGradient>
      </defs>
    </svg>
  );
};

