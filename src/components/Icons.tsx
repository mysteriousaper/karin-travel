// Stroke icons used across the site, drawn to match the design's 24px grid.
type P = { size?: number; className?: string };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

export const ArrowUpRight = ({ size = 15, className }: P) => (
  <svg {...base(size)} strokeWidth={1.9} className={className}>
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

export const ArrowRight = ({ size = 18, className }: P) => (
  <svg {...base(size)} strokeWidth={1.8} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ChevronLeft = ({ size = 16, className }: P) => (
  <svg {...base(size)} strokeWidth={1.8} className={className}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
);

export const ChevronRight = ({ size = 16, className }: P) => (
  <svg {...base(size)} strokeWidth={1.8} className={className}>
    <path d="M9 6l6 6-6 6" />
  </svg>
);

export const Plus = ({ size = 12, className }: P) => (
  <svg {...base(size)} strokeWidth={2.4} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Burger = ({ size = 20, className }: P) => (
  <svg {...base(size)} strokeWidth={1.8} className={className}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);

export const Close = ({ size = 20, className }: P) => (
  <svg {...base(size)} strokeWidth={1.8} className={className}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Play = ({ size = 20, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);

export const Phone = ({ size = 19, className }: P) => (
  <svg {...base(size)} strokeWidth={1.8} className={className}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
  </svg>
);

export const Check = ({ size = 16, className }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const Pin = ({ size = 18, className }: P) => (
  <svg {...base(size)} strokeWidth={1.8} className={className}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const Clock = ({ size = 18, className }: P) => (
  <svg {...base(size)} strokeWidth={1.8} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const WhatsAppIcon = ({ size = 18, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.2h.01c5.46 0 9.91-4.45 9.91-9.91A9.85 9.85 0 0 0 12.04 2zm5.8 14.06c-.24.68-1.42 1.3-1.95 1.35-.5.05-1.13.07-1.82-.12-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36h.56c.18.01.42-.07.66.5.24.58.83 2 .9 2.15.07.14.12.31.02.5-.1.2-.14.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.3-.13.59.17.29.74 1.22 1.59 1.98 1.1.98 2.02 1.28 2.31 1.43.29.14.46.12.63-.07.17-.2.72-.84.92-1.13.19-.29.38-.24.65-.14.26.1 1.68.79 1.97.93.29.15.48.22.55.34.07.12.07.7-.17 1.37z" />
  </svg>
);

export const TelegramIcon = ({ size = 18, className }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M21.4 4.1 2.9 11.3c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.1.9.8.9.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.5-1.4zM8.3 14.1l9.9-6.3c.5-.3.9-.1.5.2l-8.3 7.5-.3 3.5-1.8-4.9z" />
  </svg>
);

export const InstagramIcon = ({ size = 18, className }: P) => (
  <svg {...base(size)} strokeWidth={1.8} className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
  </svg>
);
