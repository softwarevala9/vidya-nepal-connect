import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Counter, LoadingSwitch, PageHeader, ProgressBar, SectionCard, SkeletonChart, SkeletonTable, StatCard, StatusPill } from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { attendanceToday, attendanceTrend, students } from "@/data/seed";
import { BS_MONTHS_NP, WEEKDAYS_EN, WEEKDAYS_NP, toNepaliDigits } from "@/lib/bs-date";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — Daily & Monthly Registers | Vidya ERP" },
      { name: "description", content: "Mark daily attendance, review monthly BS calendar heatmaps, track leave requests and monitor class attendance trends." },
      { property: "og:title", content: "Attendance — Vidya ERP" },
      { property: "og:description", content: "Daily registers, BS monthly heatmaps and leave management." },
    ],
  }),
  component: AttendancePage,
});

const statusMeta: Record<string, { emoji: string; tone: string; np: string; en: string }> = {
  present: { emoji: "🟢", tone: "green", np: "उपस्थित", en: "Present" },
  absent: { emoji: "🔴", tone: "red", np: "अनुपस्थित", en: "Absent" },
  late: { emoji: "🟡", tone: "amber", np: "ढिलो", en: "Late" },
  leave: { emoji: "🔵", tone: "blue", np: "बिदा", en: "Leave" },
};

function AttendancePage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState<Record<string, string>>(
    Object.fromEntries(attendanceToday.map((a) => [a.student.id, a.status])),
  );

  const counts = Object.values(marks).reduce<Record<string, number>>((acc, s) => {
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        emoji="✅"
        title={bi("हाजिरी व्यवस्थापन", "Attendance")}
        subtitle={bi("दैनिक हाजिरी, मासिक हिटम्याप र बिदा व्यवस्थापन।", "Daily registers, monthly heatmaps and leave management.")}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <Button className="rounded-full gradient-hero shadow-glow" onClick={() => toast.success("✅ Attendance submitted for Grade 8A")}>
              {bi("हाजिरी बुझाउनुहोस्", "Submit attendance")}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard emoji="🟢" label={bi("उपस्थित", "Present today")} value={968} tone="success" trend="94.6%" />
        <StatCard emoji="🔴" label={bi("अनुपस्थित", "Absent today")} value={32} tone="primary" />
        <StatCard emoji="🟡" label={bi("ढिलो आएका", "Late arrivals")} value={17} tone="warning" />
        <StatCard emoji="🔵" label={bi("स्वीकृत बिदा", "Approved leave")} value={7} tone="info" />
      </div>

      <Tabs defaultValue="daily" className="mt-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="daily">📋 {bi("दैनिक", "Daily")}</TabsTrigger>
          <TabsTrigger value="monthly">🗓️ {bi("मासिक", "Monthly")}</TabsTrigger>
          <TabsTrigger value="trend">📈 {bi("प्रवृत्ति", "Trend")}</TabsTrigger>
          <TabsTrigger value="leave">🏖️ {bi("बिदा", "Leave")}</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-5 grid gap-5 xl:grid-cols-3">
          <SectionCard
            className="xl:col-span-2"
            title={bi("कक्षा ८ 'A' — दैनिक हाजिरी", "Grade 8 'A' — daily register")}
            description={bi("१७ असोज २०८३ · बिहिबार", "17 Ashwin 2083 BS · Thursday")}
            action={
              <Select defaultValue="8A">
                <SelectTrigger className="w-32 rounded-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["7A", "8A", "8B", "9A", "10A"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            }
          >
            {loading ? (
              <SkeletonTable rows={6} />
            ) : (
              <ul className="space-y-2">
                {attendanceToday.map(({ student }) => {
                  const current = marks[student.id] ?? "present";
                  return (
                    <li key={student.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-border p-3 transition-colors hover:bg-muted/40">
                      <Avatar className="size-9">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="np truncate text-sm font-semibold">{lang === "np" ? student.nameNp : student.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {bi("रोल", "Roll")} {student.roll} · {student.id}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {Object.entries(statusMeta).map(([key, m]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setMarks((prev) => ({ ...prev, [student.id]: key }))}
                            className={cn(
                              "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all",
                              current === key
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:bg-accent",
                            )}
                          >
                            {m.emoji}
                          </button>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          <div className="space-y-5">
            <SectionCard title={bi("आजको सारांश", "Today's summary")}>
              <div className="space-y-4">
                {Object.entries(statusMeta).map(([key, m]) => {
                  const pct = ((counts[key] ?? 0) / attendanceToday.length) * 100;
                  return (
                    <div key={key}>
                      <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
                        <span className="np">{m.emoji} {lang === "np" ? m.np : m.en}</span>
                        <span className="text-muted-foreground">
                          <Counter value={counts[key] ?? 0} /> · {pct.toFixed(0)}%
                        </span>
                      </div>
                      <ProgressBar value={pct} tone={key === "present" ? "success" : key === "absent" ? "destructive" : key === "late" ? "warning" : "info"} />
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title={bi("कम हाजिरी भएका", "Low attendance watchlist")}>
              <ul className="space-y-3">
                {students
                  .filter((s) => s.attendance < 90)
                  .map((s) => (
                    <li key={s.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="np truncate text-sm font-medium">{lang === "np" ? s.nameNp : s.name}</p>
                        <p className="text-[11px] text-muted-foreground">Grade {s.grade}{s.section}</p>
                      </div>
                      <StatusPill tone={s.attendance < 85 ? "red" : "amber"}>{s.attendance}%</StatusPill>
                    </li>
                  ))}
              </ul>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="mt-5">
          <SectionCard title={`🗓️ ${bi("असोज २०८३ हाजिरी हिटम्याप", "Ashwin 2083 BS attendance heatmap")}`} description={bi("गाढा रङ = उच्च उपस्थिति", "Darker cell means higher attendance")}>
            <div className="grid grid-cols-7 gap-2">
              {(lang === "np" ? WEEKDAYS_NP : WEEKDAYS_EN).map((d) => (
                <div key={d} className="np pb-1 text-center text-[11px] font-bold text-muted-foreground">{d}</div>
              ))}
              {Array.from({ length: 30 }).map((_, i) => {
                const value = [96, 94, 88, 91, 97, 0, 93, 95, 87, 99, 92, 90, 0, 94, 98, 89, 96, 91, 93, 0, 97, 95, 86, 92, 94, 99, 0, 90, 93, 96][i] ?? 90;
                const intensity = value === 0 ? 0 : (value - 80) / 20;
                return (
                  <div
                    key={i}
                    title={`${i + 1} — ${value === 0 ? "Holiday" : `${value}%`}`}
                    className="group relative aspect-square rounded-lg border border-border transition-transform hover:scale-105"
                    style={{
                      backgroundColor: value === 0 ? "var(--color-muted)" : `color-mix(in oklab, var(--color-success) ${intensity * 85}%, var(--color-card))`,
                    }}
                  >
                    <span className="np absolute top-1 left-1.5 text-[10px] font-semibold">{toNepaliDigits(i + 1)}</span>
                    {value === 0 ? <span className="absolute right-1 bottom-1 text-[10px]">🇳🇵</span> : null}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
              <span>{bi("कम", "Low")}</span>
              {[0.2, 0.4, 0.6, 0.8, 1].map((v) => (
                <span key={v} className="size-4 rounded" style={{ backgroundColor: `color-mix(in oklab, var(--color-success) ${v * 85}%, var(--color-card))` }} />
              ))}
              <span>{bi("उच्च", "High")}</span>
              <span className="ml-auto">🇳🇵 {bi("सार्वजनिक बिदा", "Public holiday")}</span>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="trend" className="mt-5">
          <SectionCard title={bi("मासिक हाजिरी प्रवृत्ति", "Monthly attendance trend")} description={bi("विक्रम सम्बत् महिना अनुसार", "By Bikram Sambat month")}>
            {loading ? (
              <SkeletonChart />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={attendanceTrend}>
                  <defs>
                    <linearGradient id="att" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey={lang === "np" ? "label" : "en"} tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                  <YAxis domain={[70, 100]} tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="value" stroke="var(--color-success)" strokeWidth={3} fill="url(#att)" animationDuration={1200} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="leave" className="mt-5 grid gap-5 lg:grid-cols-2">
          <SectionCard title={bi("बिदा अनुरोध", "Leave requests")}>
            <ul className="space-y-3">
              {[
                { name: "Sujan Tamang", np: "सुजन तामाङ", reason: "Family ritual at home (Bratabandha)", days: 2, status: "Pending" },
                { name: "Riya Poudel", np: "रिया पौडेल", reason: "Medical checkup at Manipal Hospital", days: 1, status: "Approved" },
                { name: "Nischal Adhikari", np: "निश्चल अधिकारी", reason: "District football selection", days: 3, status: "Approved" },
              ].map((l) => (
                <li key={l.name} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="np text-sm font-semibold">{lang === "np" ? l.np : l.name}</p>
                    <StatusPill tone={l.status === "Approved" ? "green" : "amber"}>{l.status}</StatusPill>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{l.reason}</p>
                  <p className="mt-2 text-[11px] text-muted-foreground">🗓️ {l.days} {bi("दिन", "day(s)")}</p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <Card className="animate-rise gap-0 p-5">
            <h2 className="text-base font-semibold">👩‍🏫 {bi("शिक्षक हाजिरी", "Teacher attendance")}</h2>
            <p className="text-xs text-muted-foreground">{bi("असोज महिना", "Ashwin month")}</p>
            <div className="mt-4 space-y-4">
              {[
                { n: "Sarita Poudel", v: 98 },
                { n: "Ram Bahadur Thapa", v: 94 },
                { n: "Nirmala Adhikari", v: 100 },
                { n: "Deepak Gurung", v: 91 },
                { n: "Anita Shrestha", v: 96 },
              ].map((t) => (
                <div key={t.n}>
                  <div className="mb-1.5 flex justify-between text-xs font-medium">
                    <span>{t.n}</span>
                    <span className="text-muted-foreground">{t.v}%</span>
                  </div>
                  <ProgressBar value={t.v} tone="info" />
                </div>
              ))}
            </div>
            <p className="np mt-5 text-[11px] text-muted-foreground">
              {bi(`महिना: ${BS_MONTHS_NP[5]} २०८३`, "Month: Ashwin 2083 BS")}
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
