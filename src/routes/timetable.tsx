import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LoadingSwitch, PageHeader, SectionCard, SkeletonTable, StatusPill } from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { subjectMeta, teachers, timetable } from "@/data/seed";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timetable")({
  head: () => ({
    meta: [
      { title: "Timetable — Weekly Class Routine | Vidya ERP" },
      { name: "description", content: "Visual weekly school routine from Sunday to Friday with period, time, subject, teacher and room for every class." },
      { property: "og:title", content: "Timetable — Vidya ERP" },
      { property: "og:description", content: "Sunday to Friday routine with periods, subjects, teachers and rooms." },
    ],
  }),
  component: TimetablePage,
});

function TimetablePage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [cls, setCls] = useState("8A");

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        emoji="📅"
        title={bi("समयतालिका", "Class timetable")}
        subtitle={bi("आइतबारदेखि शुक्रबारसम्मको साप्ताहिक रुटिन।", "Weekly routine running Sunday through Friday, the Nepali school week.")}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <Select value={cls} onValueChange={setCls}>
              <SelectTrigger className="w-40 rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["7A", "7B", "8A", "8B", "9A", "9B", "10A", "10B"].map((c) => (
                  <SelectItem key={c} value={c}>{bi("कक्षा", "Grade")} {c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        }
      />

      <SectionCard title={`${bi("कक्षा", "Grade")} ${cls} — ${bi("साप्ताहिक तालिका", "weekly routine")}`} description={bi("प्रत्येक पिरियड ४५ मिनेट", "Each period runs 45 minutes")}>
        {loading ? (
          <SkeletonTable rows={6} />
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-[110px_repeat(6,1fr)] gap-2">
                <div />
                {timetable.days.map((d) => (
                  <div key={d.en} className="np rounded-xl bg-muted px-2 py-2 text-center text-xs font-bold">
                    {lang === "np" ? d.np : d.en}
                  </div>
                ))}
                {timetable.periods.map((p, rowIdx) => (
                  <div key={p.period} className="contents">
                    <div className="flex flex-col justify-center rounded-xl bg-secondary px-3 py-2">
                      <p className="text-xs font-bold">
                        {bi("पिरियड", "Period")} {p.period}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{p.time}</p>
                    </div>
                    {timetable.days.map((d, colIdx) => {
                      const subject = timetable.grid[rowIdx]?.[colIdx] ?? "Nepali";
                      const meta = subjectMeta[subject];
                      const teacher = teachers[(rowIdx + colIdx) % teachers.length];
                      return (
                        <div
                          key={`${p.period}-${d.en}`}
                          className={cn(
                            "group rounded-xl border border-border bg-card p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card",
                          )}
                        >
                          <p className="flex items-center gap-1 text-xs font-semibold">
                            <span>{meta?.emoji ?? "📘"}</span>
                            <span className="np truncate">{lang === "np" ? (meta?.np ?? subject) : subject}</span>
                          </p>
                          <p className="mt-1 truncate text-[10px] text-muted-foreground">👩‍🏫 {teacher?.name.split(" ")[0]}</p>
                          <p className="text-[10px] text-muted-foreground">📍 {timetable.rooms[colIdx]}</p>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title={bi("आजका कक्षाहरू", "Today's classes")} description={bi("बिहिबार", "Thursday")}>
          <ul className="space-y-3">
            {timetable.periods.map((p, i) => {
              const subject = timetable.grid[i]?.[4] ?? "Nepali";
              const meta = subjectMeta[subject];
              const active = i === 2;
              return (
                <li
                  key={p.period}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl border p-3 transition-all",
                    active ? "border-primary/50 bg-primary/5 shadow-glow" : "border-border hover:bg-muted/50",
                  )}
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-accent text-lg">{meta?.emoji ?? "📘"}</span>
                  <div className="min-w-0 flex-1">
                    <p className="np text-sm font-semibold">{lang === "np" ? (meta?.np ?? subject) : subject}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {p.time} · 📍 {timetable.rooms[i]} · 👩‍🏫 {teachers[i % teachers.length]?.name}
                    </p>
                  </div>
                  {active ? <StatusPill tone="green" emoji="🔴">{bi("चलिरहेको", "Live now")}</StatusPill> : null}
                </li>
              );
            })}
          </ul>
        </SectionCard>

        <Card className="animate-rise gap-0 p-5">
          <h2 className="text-base font-semibold">🧩 {bi("विषय रङ सङ्केत", "Subject legend")}</h2>
          <ul className="mt-4 space-y-2.5">
            {Object.entries(subjectMeta).map(([name, m]) => (
              <li key={name} className="flex items-center gap-3 text-sm">
                <span className="grid size-8 place-items-center rounded-lg bg-muted">{m.emoji}</span>
                <span className="np">{lang === "np" ? m.np : name}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
