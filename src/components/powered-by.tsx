import { cn } from "@/lib/utils";

/**
 * Permanent product signature. Rendered as a non-selectable, non-editable
 * badge — it must always be visible across the application.
 */
export function PoweredBy({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <div
      aria-label="Powered by Software Vala"
      contentEditable={false}
      suppressContentEditableWarning
      className={cn(
        "pointer-events-none flex items-center justify-center gap-2 select-none",
        className,
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3 py-1",
          tone === "dark"
            ? "border-white/15 bg-white/5 text-sidebar-foreground/80"
            : "border-border bg-muted/50 text-muted-foreground",
        )}
      >
        <span className="size-1.5 rounded-full bg-primary shadow-glow" />
        <span
          className="bg-clip-text text-[10px] font-black tracking-[0.22em] text-transparent uppercase"
          style={{ backgroundImage: "var(--gradient-hero)", fontFamily: "var(--font-display)" }}
        >
          Powered by Software Vala
        </span>
        <span className="text-[9px] font-bold text-primary">™</span>
      </span>
    </div>
  );
}
