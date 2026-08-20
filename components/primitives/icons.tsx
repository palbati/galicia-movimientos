/* Inline SVG only — no icon font, no emoji. Every glyph inherits currentColor
   and sizes from the `size` prop so they scale with the text they sit beside. */

type P = { className?: string; size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
  focusable: "false" as const,
});

export const ChevronLeft = ({ className, size = 18 }: P) => (
  <svg {...base(size)} className={className}><path d="M15 18l-6-6 6-6" /></svg>
);
export const ChevronDown = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}><path d="M6 9l6 6 6-6" /></svg>
);
export const Search = ({ className, size = 18 }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.2-3.2" />
  </svg>
);
export const Close = ({ className, size = 18 }: P) => (
  <svg {...base(size)} className={className}><path d="M18 6L6 18M6 6l12 12" /></svg>
);
export const Calendar = ({ className, size = 16 }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="5" width="18" height="16" rx="2.5" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);
export const Copy = ({ className, size = 15 }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M5 15V6a2 2 0 012-2h8" />
  </svg>
);
export const Check = ({ className, size = 15 }: P) => (
  <svg {...base(size)} className={className}><path d="M4 12.5l5 5L20 6.5" /></svg>
);
export const Info = ({ className, size = 18 }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.75v.5" />
  </svg>
);
export const User = ({ className, size = 18 }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="9" r="3.25" /><path d="M5.5 19.5a7 7 0 0113 0" />
    <circle cx="12" cy="12" r="9.25" />
  </svg>
);
export const Warning = ({ className, size = 18 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 4.5L2.8 20h18.4L12 4.5z" /><path d="M12 10v4M12 17.2v.3" />
  </svg>
);
