// Ícones de linha simples (24x24, stroke) — não usamos @mui/icons-material (o
// admin é Tailwind puro), então esses substituem os ícones do Argon original.
type IconProps = { className?: string };

const base = "stroke-current fill-none";
const strokeProps = { strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function DashboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

export function DoctorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M8 3v4a4 4 0 0 0 8 0V3" />
      <path d="M12 13v3a5 5 0 0 0 5 5h1" />
      <circle cx="19" cy="8" r="2" />
    </svg>
  );
}

export function VideoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <rect x="2.5" y="5.5" width="14" height="13" rx="2" />
      <path d="m21.5 8-5 3 5 3z" />
    </svg>
  );
}

export function FaqIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .9-1 1.7" />
      <circle cx="12" cy="16.5" r="0.25" fill="currentColor" />
    </svg>
  );
}

export function InsuranceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M12 3 4 6v6c0 4.5 3.2 7.7 8 9 4.8-1.3 8-4.5 8-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function ExamIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M9 2h6" />
      <path d="M10 2v6.3L4.7 17a2 2 0 0 0 1.7 3h11.2a2 2 0 0 0 1.7-3L14 8.3V2" />
      <path d="M6.5 15h11" />
    </svg>
  );
}

export function TestimonialIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M7 8.5A2.5 2.5 0 0 1 9.5 6H10a2 2 0 0 1 2 2v2.5A2.5 2.5 0 0 1 9.5 13H8" />
      <path d="M14 8.5A2.5 2.5 0 0 1 16.5 6H17a2 2 0 0 1 2 2v2.5A2.5 2.5 0 0 1 16.5 13H15" />
      <path d="M9.5 13c0 3-1.5 4-3 4.5" />
      <path d="M16.5 13c0 3-1.5 4-3 4.5" />
    </svg>
  );
}

export function ContactIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3 6.5 9 6.5 9-6.5" />
    </svg>
  );
}

export function InboxIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M3 12h4.5l1.5 3h6l1.5-3H21" />
      <path d="M5.5 5h13l2.5 7v7a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19v-7z" />
    </svg>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.7-3.3 3-5 5.5-5s4.8 1.7 5.5 5" />
      <circle cx="17.5" cy="8.5" r="2.4" />
      <path d="M15.8 14.2c2.2.2 4 1.9 4.6 4.8" />
    </svg>
  );
}

export function AccountIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c1-4 3.7-6 7-6s6 2 7 6" />
    </svg>
  );
}

export function LogoutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} {...strokeProps}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
