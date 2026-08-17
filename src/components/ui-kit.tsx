import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TODAY_AD, TODAY_BS, formatAd, formatBs, toNepaliDigits } from "@/lib/bs-date";
import { useI18n } from "@/lib/i18n";

/* ---------------------------------- Page --------------------------------- */

export function PageHeader({
  emoji,
  title,
  subtitle,
  actions,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <div className="animate-rise mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-2xl shadow-card">
          {emoji}
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string | undefined;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("animate-rise gap-0 overflow-hidden p-0", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold">{title}</h2>
          {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </Card>
  );
}

/* --------------------------------- Numbers -------------------------------- */

export function Counter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  nepali = false,
}: {
  value: number;
  decimals?: number | undefined;
  prefix?: string | undefined;
  suffix?: string | undefined;
  nepali?: boolean | undefined;
}) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(value * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value]);

  const text = display.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <span className="tabular-nums">
      {prefix}
      {nepali ? toNepaliDigits(text) : text}
      {suffix}
    </span>
  );
}

export function StatCard({
  emoji,
  label,
  value,
  decimals = 0,
  prefix,
  suffix,
  trend,
  tone = "primary",
}: {
  emoji: string;
  label: string;
  value: number;
  decimals?: number | undefined;
  prefix?: string | undefined;
  suffix?: string | undefined;
  trend?: string | undefined;
  tone?: "primary" | "success" | "info" | "warning" | "chart-5";
}) {
  const toneRing: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/12 text-success",
    info: "bg-info/12 text-info",
    warning: "bg-warning/18 text-warning-foreground",
    "chart-5": "bg-chart-5/12 text-chart-5",
  };
  return (
    <Card className="animate-rise group relative gap-0 overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="pointer-events-none absolute -top-10 -right-10 size-24 rounded-full bg-accent/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="flex items-start justify-between">
        <span className={cn("grid size-11 place-items-center rounded-xl text-xl", toneRing[tone])}>{emoji}</span>
        {trend ? (
          <span className="rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-semibold text-success">{trend}</span>
        ) : null}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight">
        <Counter value={value} decimals={decimals} prefix={prefix} suffix={suffix} />
      </p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </Card>
  );
}

/* --------------------------------- Status --------------------------------- */

const statusTones: Record<string, string> = {
  green: "bg-success/12 text-success border-success/25",
  red: "bg-destructive/10 text-destructive border-destructive/25",
  amber: "bg-warning/18 text-warning-foreground border-warning/35",
  blue: "bg-info/12 text-info border-info/25",
  grey: "bg-muted text-muted-foreground border-border",
  violet: "bg-chart-5/12 text-chart-5 border-chart-5/25",
};

export function StatusPill({
  tone = "grey",
  emoji,
  children,
}: {
  tone?: (keyof typeof statusTones | string) | undefined;
  emoji?: string | undefined;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
        statusTones[tone] ?? statusTones["grey"],
      )}
    >
      {emoji ? <span aria-hidden>{emoji}</span> : null}
      {children}
    </span>
  );
}

export const statusToneFor = (status: string): string => {
  const s = status.toLowerCase();
  if (["paid", "approved", "present", "submitted", "active", "completed", "on route", "issued"].includes(s)) return "green";
  if (["pending", "partial", "late", "reviewing", "ongoing", "delayed", "on leave", "open"].includes(s)) return "amber";
  if (["overdue", "rejected", "absent", "closed"].includes(s)) return "red";
  if (["leave", "scheduled", "draft"].includes(s)) return "blue";
  return "grey";
};

/* ------------------------------- Empty/Load ------------------------------- */

export function EmptyState({
  emoji,
  title,
  description,
  action,
}: {
  emoji: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="animate-pop flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
      <span className="animate-float text-5xl" aria-hidden>
        {emoji}
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function SkeletonCardGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface p-5">
          <div className="shimmer size-11 rounded-xl" />
          <div className="shimmer mt-4 h-6 w-24 rounded-md" />
          <div className="shimmer mt-2 h-3 w-32 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="shimmer h-3.5 w-2/5 rounded-md" />
            <div className="shimmer h-3 w-1/4 rounded-md" />
          </div>
          <div className="shimmer h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="flex h-56 items-end gap-3">
      {[40, 68, 52, 84, 60, 92, 48].map((h, i) => (
        <div key={i} className="shimmer flex-1 rounded-t-lg" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

/** Toggle used across pages to preview loading skeletons. */
export function LoadingSwitch({ loading, onChange }: { loading: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!loading)}
      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {loading ? "⏹ Show data" : "⏳ Preview loading"}
    </button>
  );
}

/* --------------------------------- Dates ---------------------------------- */

export function DateStamp({ className }: { className?: string }) {
  const { lang } = useI18n();
  return (
    <div className={cn("flex items-center gap-2 text-xs", className)}>
      <span className="np rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
        {formatBs(TODAY_BS, lang)}
      </span>
      <span className="hidden rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground sm:inline">
        {formatAd(TODAY_AD)} AD
      </span>
    </div>
  );
}

export function BsAdDate({ bs, ad }: { bs: string; ad: string }) {
  return (
    <div className="leading-tight">
      <p className="np text-sm font-semibold">{bs}</p>
      <p className="text-[11px] text-muted-foreground">{ad}</p>
    </div>
  );
}

/** Converts a "2083-09-17" style BS string into a display pair. */
export function bsStringToLabel(value: string, lang: "np" | "en" = "np") {
  const [y, m, d] = value.split("-").map(Number);
  const months = ["बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज", "कार्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत"];
  const monthsEn = ["Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin", "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"];
  if (!y || !m || !d) return value;
  return lang === "np"
    ? `${toNepaliDigits(d)} ${months[m - 1]} ${toNepaliDigits(y)}`
    : `${d} ${monthsEn[m - 1]} ${y}`;
}

/* --------------------------------- Charts --------------------------------- */

export function ProgressBar({ value, tone = "primary" }: { value: number; tone?: string }) {
  const tones: Record<string, string> = {
    primary: "bg-primary",
    success: "bg-success",
    info: "bg-info",
    warning: "bg-warning",
    destructive: "bg-destructive",
  };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className={cn("h-full rounded-full transition-[width] duration-1000 ease-out", tones[tone] ?? tones["primary"])}
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}
