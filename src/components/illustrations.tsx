import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Premium 3D-style educational illustrations, drawn as inline SVG so they
 * inherit the existing Vidya ERP palette (all colours come from theme tokens).
 * Each illustration is a small, glossy object with soft lighting: a coloured
 * base plate, a rendered object and a specular highlight.
 */

export type IllusName =
  | "students"
  | "teachers"
  | "classes"
  | "attendance"
  | "fees"
  | "exams"
  | "transport"
  | "library"
  | "results"
  | "admissions"
  | "calendar"
  | "hostel"
  | "hr"
  | "accounting"
  | "communication"
  | "lms"
  | "analytics"
  | "homework"
  | "timetable"
  | "settings"
  | "school";

type Tone = "primary" | "success" | "info" | "warning" | "chart-5" | "chart-4" | "chart-3" | "chart-2";

const toneVar: Record<Tone, string> = {
  primary: "var(--color-primary)",
  success: "var(--color-success)",
  info: "var(--color-info)",
  warning: "var(--color-warning)",
  "chart-5": "var(--color-chart-5)",
  "chart-4": "var(--color-chart-4)",
  "chart-3": "var(--color-chart-3)",
  "chart-2": "var(--color-chart-2)",
};

export const illusTone: Record<IllusName, Tone> = {
  students: "primary",
  teachers: "info",
  classes: "chart-5",
  attendance: "success",
  fees: "success",
  exams: "warning",
  transport: "warning",
  library: "chart-4",
  results: "warning",
  admissions: "chart-3",
  calendar: "chart-3",
  hostel: "chart-5",
  hr: "info",
  accounting: "chart-2",
  communication: "primary",
  lms: "chart-3",
  analytics: "chart-5",
  homework: "chart-4",
  timetable: "info",
  settings: "chart-2",
  school: "primary",
};

function Body({ name, a, b }: { name: IllusName; a: string; b: string }) {
  const s = { fill: `url(#${a})` };
  const soft: CSSProperties = { fill: `url(#${b})` };

  switch (name) {
    case "students":
      return (
        <g>
          <circle cx="26" cy="24" r="9" style={soft} />
          <path d="M12 50c0-8.2 6.6-14 14-14s14 5.8 14 14z" style={s} />
          <circle cx="44" cy="29" r="7" style={s} opacity={0.85} />
          <path d="M34 52c0-6.6 4.8-11 10-11s10 4.4 10 11z" style={soft} opacity={0.9} />
        </g>
      );
    case "teachers":
      return (
        <g>
          <rect x="8" y="10" width="34" height="24" rx="3" style={soft} />
          <path d="M12 16h20M12 22h24M12 28h14" stroke="var(--color-card)" strokeWidth="2.4" strokeLinecap="round" opacity={0.75} />
          <circle cx="47" cy="24" r="7" style={s} />
          <path d="M35 54c0-7.3 5.4-12 12-12s12 4.7 12 12z" style={s} />
        </g>
      );
    case "classes":
    case "school":
      return (
        <g>
          <path d="M32 8l24 12v6H8v-6z" style={s} />
          <rect x="13" y="26" width="38" height="26" rx="3" style={soft} />
          <rect x="20" y="34" width="9" height="9" rx="1.6" fill="var(--color-card)" opacity={0.85} />
          <rect x="35" y="34" width="9" height="9" rx="1.6" fill="var(--color-card)" opacity={0.85} />
          <rect x="28" y="44" width="8" height="8" rx="1.4" style={s} />
          <path d="M32 4v6" stroke={`url(#${a})`} strokeWidth="2.4" strokeLinecap="round" />
        </g>
      );
    case "attendance":
      return (
        <g>
          <rect x="14" y="10" width="36" height="44" rx="6" style={soft} />
          <rect x="24" y="6" width="16" height="9" rx="4" style={s} />
          <path d="M22 30l6 6 14-14" stroke={`url(#${a})`} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M22 44h20" stroke="var(--color-card)" strokeWidth="3" strokeLinecap="round" opacity={0.8} />
        </g>
      );
    case "fees":
    case "accounting":
      return (
        <g>
          <ellipse cx="32" cy="46" rx="20" ry="7" style={soft} />
          <rect x="12" y="30" width="40" height="16" rx="4" style={s} />
          <ellipse cx="32" cy="30" rx="20" ry="7" style={soft} />
          <circle cx="32" cy="22" r="11" style={s} />
          <path d="M32 16v12M28.5 19.5h6M29 24.5h6" stroke="var(--color-card)" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    case "exams":
    case "homework":
      return (
        <g>
          <rect x="12" y="10" width="34" height="44" rx="5" style={soft} />
          <path d="M19 22h20M19 30h20M19 38h12" stroke="var(--color-card)" strokeWidth="2.6" strokeLinecap="round" opacity={0.85} />
          <path d="M44 40l12-13 5 5-12 13-6 1z" style={s} />
        </g>
      );
    case "transport":
      return (
        <g>
          <rect x="7" y="18" width="46" height="24" rx="6" style={s} />
          <rect x="12" y="23" width="14" height="10" rx="2.4" fill="var(--color-card)" opacity={0.9} />
          <rect x="30" y="23" width="14" height="10" rx="2.4" fill="var(--color-card)" opacity={0.9} />
          <rect x="7" y="36" width="46" height="6" rx="3" style={soft} />
          <circle cx="18" cy="46" r="5.5" style={soft} />
          <circle cx="44" cy="46" r="5.5" style={soft} />
        </g>
      );
    case "library":
    case "lms":
      return (
        <g>
          <rect x="10" y="34" width="44" height="10" rx="2.6" style={s} />
          <rect x="14" y="24" width="36" height="10" rx="2.6" style={soft} />
          <rect x="18" y="14" width="28" height="10" rx="2.6" style={s} opacity={0.9} />
          <path d="M14 44h36" stroke={`url(#${b})`} strokeWidth="6" strokeLinecap="round" opacity={0.55} />
        </g>
      );
    case "results":
      return (
        <g>
          <path d="M20 10h24v14a12 12 0 01-24 0z" style={s} />
          <path d="M20 13H12v4c0 5 3.6 8 8 8M44 13h8v4c0 5-3.6 8-8 8" stroke={`url(#${b})`} strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <rect x="28" y="36" width="8" height="9" rx="2" style={soft} />
          <rect x="19" y="45" width="26" height="8" rx="3" style={s} />
        </g>
      );
    case "admissions":
      return (
        <g>
          <rect x="13" y="9" width="34" height="42" rx="5" style={soft} />
          <path d="M20 20h20M20 28h20M20 36h13" stroke="var(--color-card)" strokeWidth="2.6" strokeLinecap="round" opacity={0.85} />
          <circle cx="45" cy="43" r="11" style={s} />
          <path d="M40 43l4 4 7-8" stroke="var(--color-card)" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "calendar":
    case "timetable":
      return (
        <g>
          <rect x="9" y="14" width="46" height="40" rx="6" style={soft} />
          <rect x="9" y="14" width="46" height="12" rx="6" style={s} />
          <path d="M20 8v10M44 8v10" stroke={`url(#${a})`} strokeWidth="4" strokeLinecap="round" />
          <rect x="17" y="32" width="8" height="7" rx="2" style={s} opacity={0.8} />
          <rect x="28" y="32" width="8" height="7" rx="2" style={s} />
          <rect x="39" y="32" width="8" height="7" rx="2" style={s} opacity={0.55} />
          <rect x="17" y="43" width="8" height="7" rx="2" style={s} opacity={0.55} />
          <rect x="28" y="43" width="8" height="7" rx="2" style={s} opacity={0.8} />
        </g>
      );
    case "hostel":
      return (
        <g>
          <rect x="8" y="30" width="48" height="22" rx="4" style={soft} />
          <rect x="12" y="20" width="16" height="12" rx="3" style={s} />
          <path d="M8 34h48" stroke="var(--color-card)" strokeWidth="2.4" opacity={0.7} />
          <rect x="34" y="36" width="18" height="10" rx="3" style={s} />
          <path d="M6 30l26-18 26 18" stroke={`url(#${a})`} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "hr":
      return (
        <g>
          <rect x="8" y="18" width="48" height="32" rx="6" style={soft} />
          <rect x="24" y="11" width="16" height="8" rx="3" style={s} />
          <circle cx="24" cy="31" r="6" style={s} />
          <path d="M15 45c0-5.2 4-8.6 9-8.6s9 3.4 9 8.6z" style={s} />
          <path d="M38 29h12M38 36h10" stroke="var(--color-card)" strokeWidth="2.6" strokeLinecap="round" opacity={0.85} />
        </g>
      );
    case "communication":
      return (
        <g>
          <path d="M14 26l26-11v30L14 34z" style={s} />
          <rect x="7" y="25" width="9" height="10" rx="3" style={soft} />
          <path d="M20 36l4 14h7l-4-12z" style={soft} />
          <path d="M46 22c4 4.6 4 13.4 0 18" stroke={`url(#${a})`} strokeWidth="3.4" fill="none" strokeLinecap="round" />
          <path d="M53 16c7 8 7 22 0 30" stroke={`url(#${b})`} strokeWidth="3.4" fill="none" strokeLinecap="round" />
        </g>
      );
    case "analytics":
      return (
        <g>
          <rect x="9" y="12" width="46" height="40" rx="6" style={soft} />
          <rect x="17" y="30" width="7" height="14" rx="2.4" style={s} />
          <rect x="28" y="24" width="7" height="20" rx="2.4" style={s} />
          <rect x="39" y="18" width="7" height="26" rx="2.4" style={s} />
          <path d="M17 26l11-8 11 6 8-8" stroke={`url(#${a})`} strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.75} />
        </g>
      );
    case "settings":
    default:
      return (
        <g>
          <circle cx="32" cy="32" r="17" style={soft} />
          <circle cx="32" cy="32" r="7.5" fill="var(--color-card)" />
          <g stroke={`url(#${a})`} strokeWidth="5" strokeLinecap="round">
            <path d="M32 8v7M32 49v7M8 32h7M49 32h7M15 15l5 5M44 44l5 5M49 15l-5 5M20 44l-5 5" />
          </g>
        </g>
      );
  }
}

export function Illus({
  name,
  tone,
  className,
  size = 44,
  float = false,
}: {
  name: IllusName;
  tone?: Tone | undefined;
  className?: string | undefined;
  size?: number | undefined;
  float?: boolean | undefined;
}) {
  const uid = useId().replace(/:/g, "");
  const a = `ig-${uid}-a`;
  const b = `ig-${uid}-b`;
  const c = toneVar[tone ?? illusTone[name]];

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={cn("shrink-0 drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)]", float && "animate-float", className)}
      role="presentation"
      aria-hidden
    >
      <defs>
        <linearGradient id={a} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="1" />
          <stop offset="100%" stopColor={c} stopOpacity="0.62" />
        </linearGradient>
        <linearGradient id={b} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor={c} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c} stopOpacity="0.28" />
        </linearGradient>
        <radialGradient id={`${a}-hl`} cx="0.3" cy="0.2" r="0.7">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>
      <Body name={name} a={a} b={b} />
      <ellipse cx="26" cy="18" rx="20" ry="13" fill={`url(#${a}-hl)`} pointerEvents="none" />
    </svg>
  );
}

/** Small badge plate that hosts an illustration inside cards. */
export function IllusBadge({
  name,
  tone,
  size = 34,
  className,
}: {
  name: IllusName;
  tone?: Tone | undefined;
  size?: number | undefined;
  className?: string | undefined;
}) {
  const c = toneVar[tone ?? illusTone[name]];
  return (
    <span
      className={cn("grid place-items-center rounded-2xl p-2 transition-transform duration-300 group-hover:scale-110", className)}
      style={{
        background: `linear-gradient(150deg, color-mix(in oklab, ${c} 22%, transparent), color-mix(in oklab, ${c} 6%, transparent))`,
        boxShadow: `inset 0 1px 0 color-mix(in oklab, white 45%, transparent), 0 8px 18px -12px ${c}`,
      }}
    >
      <Illus name={name} tone={tone} size={size} />
    </span>
  );
}

/* --------------------------- Time-of-day scene --------------------------- */

export type DayPhase = "morning" | "afternoon" | "evening" | "night";

export function phaseFor(hour: number): DayPhase {
  if (hour < 11) return "morning";
  if (hour < 16) return "afternoon";
  if (hour < 19) return "evening";
  return "night";
}

export const phaseMeta: Record<DayPhase, { np: string; en: string; emoji: string }> = {
  morning: { np: "शुभ प्रभात", en: "Good morning", emoji: "🌄" },
  afternoon: { np: "शुभ दिन", en: "Good afternoon", emoji: "🌤️" },
  evening: { np: "शुभ साँझ", en: "Good evening", emoji: "🌇" },
  night: { np: "शुभ रात्री", en: "Good night", emoji: "🌙" },
};

const phaseSky: Record<DayPhase, [string, string]> = {
  morning: ["color-mix(in oklab, var(--color-warning) 40%, transparent)", "color-mix(in oklab, var(--color-info) 22%, transparent)"],
  afternoon: ["color-mix(in oklab, var(--color-info) 34%, transparent)", "color-mix(in oklab, var(--color-chart-2) 22%, transparent)"],
  evening: ["color-mix(in oklab, var(--color-primary) 38%, transparent)", "color-mix(in oklab, var(--color-warning) 26%, transparent)"],
  night: ["color-mix(in oklab, var(--color-chart-5) 34%, transparent)", "color-mix(in oklab, var(--color-info) 20%, transparent)"],
};

/**
 * Compact animated school scene for the top bar: sky changes with Nepal local
 * time, clouds drift, the flag waves and the sun/moon rises gently.
 */
export function SchoolScene({ phase, className, height = 44 }: { phase: DayPhase; className?: string; height?: number }) {
  const [c1, c2] = phaseSky[phase];
  const night = phase === "night";
  return (
    <svg viewBox="0 0 160 48" height={height} className={cn("overflow-visible", className)} role="presentation" aria-hidden>
      <defs>
        <linearGradient id={`sky-${phase}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <clipPath id={`clip-${phase}`}>
          <rect x="0" y="0" width="160" height="48" rx="14" />
        </clipPath>
      </defs>
      <g clipPath={`url(#clip-${phase})`}>
        <rect x="0" y="0" width="160" height="48" rx="14" fill={`url(#sky-${phase})`} />
        {/* sun / moon */}
        <circle
          cx="128"
          cy={night ? 16 : 14}
          r={night ? 6 : 8}
          fill={night ? "color-mix(in oklab, var(--color-foreground) 30%, white)" : "color-mix(in oklab, var(--color-warning) 85%, white)"}
          className="animate-float"
          opacity={0.95}
        />
        {night ? (
          <g fill="var(--color-foreground)" opacity="0.5">
            <circle cx="100" cy="10" r="1.2" className="animate-twinkle" />
            <circle cx="112" cy="22" r="1" className="animate-twinkle" style={{ animationDelay: "0.8s" }} />
            <circle cx="146" cy="26" r="1.1" className="animate-twinkle" style={{ animationDelay: "1.6s" }} />
          </g>
        ) : null}
        {/* drifting clouds */}
        <g className="animate-drift" fill="color-mix(in oklab, white 70%, transparent)" opacity="0.7">
          <ellipse cx="30" cy="14" rx="12" ry="5" />
          <ellipse cx="40" cy="12" rx="8" ry="5" />
          <ellipse cx="96" cy="20" rx="9" ry="4" />
        </g>
        {/* hills */}
        <path d="M-10 44c18-16 30-16 46 0z" fill="color-mix(in oklab, var(--color-chart-2) 45%, transparent)" />
        <path d="M96 46c20-20 34-20 54 0z" fill="color-mix(in oklab, var(--color-info) 35%, transparent)" />
        {/* school building */}
        <g>
          <path d="M58 30l16-9 16 9v16H58z" fill="color-mix(in oklab, var(--color-primary) 70%, transparent)" />
          <rect x="66" y="34" width="7" height="7" rx="1.6" fill="color-mix(in oklab, var(--color-warning) 85%, white)" opacity={night ? 1 : 0.75} />
          <rect x="77" y="34" width="7" height="7" rx="1.6" fill="color-mix(in oklab, var(--color-warning) 85%, white)" opacity={night ? 1 : 0.75} />
          {/* flag */}
          <path d="M74 21v-12" stroke="color-mix(in oklab, var(--color-foreground) 55%, transparent)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M74 9l8 3-8 3z" fill="var(--color-primary)" className="animate-wave" style={{ transformOrigin: "74px 12px" }} />
        </g>
        <rect x="0" y="44" width="160" height="6" fill="color-mix(in oklab, var(--color-success) 40%, transparent)" />
      </g>
    </svg>
  );
}

/**
 * Large animated login illustration: school campus with floating books,
 * drifting clouds, waving flag and a studying student. Motion is slow and
 * subtle so the screen stays professional.
 */
export function CampusScene({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 260" className={cn("w-full", className)} role="img" aria-label="Illustration of a Nepali school campus">
      <defs>
        <linearGradient id="cs-sky" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="color-mix(in oklab, var(--color-primary) 30%, transparent)" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--color-info) 22%, transparent)" />
        </linearGradient>
        <linearGradient id="cs-wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="color-mix(in oklab, var(--color-primary) 82%, white)" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--color-primary) 55%, transparent)" />
        </linearGradient>
        <linearGradient id="cs-roof" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="color-mix(in oklab, var(--color-chart-5) 80%, white)" />
          <stop offset="100%" stopColor="color-mix(in oklab, var(--color-chart-5) 50%, transparent)" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="400" height="260" rx="28" fill="url(#cs-sky)" opacity="0.55" />

      {/* Himalayan range */}
      <path d="M-10 170c50-70 82-70 130 0z" fill="color-mix(in oklab, var(--color-info) 30%, transparent)" />
      <path d="M250 175c46-78 80-78 130 0z" fill="color-mix(in oklab, var(--color-chart-5) 26%, transparent)" />
      <path d="M40 132c8-12 14-12 22 0z" fill="color-mix(in oklab, white 75%, transparent)" />
      <path d="M305 138c8-13 14-13 22 0z" fill="color-mix(in oklab, white 75%, transparent)" />

      {/* clouds */}
      <g className="animate-drift" opacity="0.75" fill="color-mix(in oklab, white 78%, transparent)">
        <ellipse cx="80" cy="52" rx="26" ry="11" />
        <ellipse cx="100" cy="46" rx="18" ry="11" />
      </g>
      <g className="animate-drift-slow" opacity="0.6" fill="color-mix(in oklab, white 78%, transparent)">
        <ellipse cx="290" cy="70" rx="22" ry="9" />
        <ellipse cx="306" cy="65" rx="15" ry="9" />
      </g>

      {/* main school building */}
      <g>
        <path d="M120 130l80-46 80 46v90H120z" fill="url(#cs-wall)" />
        <path d="M108 132L200 78l92 54z" fill="url(#cs-roof)" />
        <rect x="186" y="176" width="28" height="44" rx="4" fill="color-mix(in oklab, var(--color-warning) 70%, white)" />
        {[142, 236].map((x) => (
          <g key={x}>
            <rect x={x} y="150" width="26" height="22" rx="4" fill="color-mix(in oklab, white 82%, transparent)" />
            <rect x={x} y="186" width="26" height="22" rx="4" fill="color-mix(in oklab, white 70%, transparent)" />
          </g>
        ))}
        {/* flag pole */}
        <path d="M200 78V38" stroke="color-mix(in oklab, var(--color-foreground) 45%, transparent)" strokeWidth="3" strokeLinecap="round" />
        <path d="M200 38l22 8-22 8z" fill="var(--color-primary)" className="animate-wave" style={{ transformOrigin: "200px 46px" }} />
      </g>

      {/* floating books */}
      <g className="animate-float">
        <rect x="52" y="118" width="42" height="12" rx="3" fill="color-mix(in oklab, var(--color-chart-2) 80%, white)" />
        <rect x="56" y="108" width="34" height="11" rx="3" fill="color-mix(in oklab, var(--color-chart-4) 80%, white)" />
      </g>
      <g className="animate-float" style={{ animationDelay: "1.4s" }}>
        <rect x="312" y="150" width="38" height="11" rx="3" fill="color-mix(in oklab, var(--color-chart-3) 80%, white)" />
        <rect x="316" y="141" width="30" height="10" rx="3" fill="color-mix(in oklab, var(--color-success) 75%, white)" />
      </g>

      {/* graduation cap */}
      <g className="animate-float" style={{ animationDelay: "0.7s" }}>
        <path d="M330 96l24 10-24 10-24-10z" fill="color-mix(in oklab, var(--color-chart-5) 78%, white)" />
        <path d="M344 112v12" stroke="color-mix(in oklab, var(--color-warning) 85%, white)" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* student studying */}
      <g>
        <rect x="60" y="206" width="90" height="8" rx="4" fill="color-mix(in oklab, var(--color-foreground) 20%, transparent)" />
        <circle cx="92" cy="176" r="13" fill="color-mix(in oklab, var(--color-warning) 70%, white)" className="animate-nod" style={{ transformOrigin: "92px 190px" }} />
        <path d="M74 206c0-11 8-18 18-18s18 7 18 18z" fill="color-mix(in oklab, var(--color-info) 70%, white)" />
        <rect x="112" y="192" width="34" height="14" rx="3" fill="color-mix(in oklab, var(--color-primary) 65%, white)" />
      </g>

      {/* ground */}
      <path d="M0 220h400v40H0z" fill="color-mix(in oklab, var(--color-success) 30%, transparent)" />

      {/* particles */}
      <g fill="color-mix(in oklab, var(--color-primary) 60%, transparent)">
        <circle cx="46" cy="70" r="3" className="animate-twinkle" />
        <circle cx="358" cy="46" r="2.4" className="animate-twinkle" style={{ animationDelay: "1s" }} />
        <circle cx="268" cy="112" r="2" className="animate-twinkle" style={{ animationDelay: "2s" }} />
        <circle cx="130" cy="60" r="2.2" className="animate-twinkle" style={{ animationDelay: "1.5s" }} />
      </g>
    </svg>
  );
}
