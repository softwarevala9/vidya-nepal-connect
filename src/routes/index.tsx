import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  Counter,
  DateStamp,
  EmptyState,
  LoadingSwitch,
  PageHeader,
  ProgressBar,
  SectionCard,
  SkeletonCardGrid,
  SkeletonChart,
  SkeletonTable,
  StatCard,
  StatusPill,
  bsStringToLabel,
  statusToneFor,
} from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import {
  attendanceTrend,
  calendarEvents,
  classPerformance,
  eventTypeMeta,
  examPerformance,
  feeCollection,
  growthData,
  notices,
  npr,
  school,
  students,
} from "@/data/seed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Vidya ERP Nepal School Management" },
      { name: "description", content: "Live overview of students, attendance, fee collection, exams and school events in Bikram Sambat for Nepali schools." },
      { property: "og:title", content: "Admin Dashboard — Vidya ERP" },
      { property: "og:description", content: "Students, attendance, fees, exams and BS calendar in one premium Nepali school dashboard." },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  { emoji: "👨‍🎓", np: "विद्यार्थी थप्नुहोस्", en: "Add Student", to: "/students" },
  { emoji: "👩‍🏫", np: "शिक्षक थप्नुहोस्", en: "Add Teacher", to: "/teachers" },
  { emoji: "📝", np: "परीक्षा सिर्जना", en: "Create Exam", to: "/exams" },
  { emoji: "💰", np: "शुल्क संकलन", en: "Collect Fee", to: "/fees" },
  { emoji: "📢", np: "सूचना पठाउनुहोस्", en: "Send Notice", to: "/communication" },
  { emoji: "📆", np: "कार्यक्रम बनाउनुहोस्", en: "Create Event", to: "/calendar" },
] as const;

function Dashboard() {
  const { lang } = useI18n();
  const [loading, setLoading] = useState(false);
  const bi = (np: string, en: string) => (lang === "np" ? np : en);

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        emoji="🏫"
        title={`${bi("शुभ प्रभात, प्रधानाध्यापक", "Good morning, Principal")} 👋`}
        subtitle={bi(
          `${school.nameNp} — आजको विद्यालय अवस्था एकै नजरमा।`,
          `${school.name} — today's school at a glance.`,
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <DateStamp />
            <NoticeDialog />
          </>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={8} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard emoji="👨‍🎓" label={bi("कुल विद्यार्थी", "Total students")} value={1024} trend="+12.4%" tone="primary" />
          <StatCard emoji="👩‍🏫" label={bi("शिक्षक तथा कर्मचारी", "Teachers & staff")} value={68} trend="+4" tone="info" />
          <StatCard emoji="🏫" label={bi("सञ्चालित कक्षा", "Active classes")} value={24} tone="chart-5" />
          <StatCard emoji="📊" label={bi("आजको हाजिरी", "Attendance today")} value={94.6} decimals={1} suffix="%" trend="+1.8%" tone="success" />
          <StatCard emoji="💰" label={bi("असोज संकलन", "Ashwin collection")} value={4285000} prefix="रु " tone="success" trend="+6.2%" />
          <StatCard emoji="📝" label={bi("सञ्चालित परीक्षा", "Exams in progress")} value={2} tone="warning" />
          <StatCard emoji="🚌" label={bi("यातायात मार्ग", "Transport routes")} value={4} tone="info" />
          <StatCard emoji="📚" label={bi("जारी पुस्तक", "Books on loan")} value={186} tone="chart-5" />
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {quickActions.map((a) => (
          <Link
            key={a.en}
            to={a.to}
            className="group surface flex flex-col items-center gap-2 px-3 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
          >
            <span className="text-2xl transition-transform duration-300 group-hover:scale-115">{a.emoji}</span>
            <span className="text-xs font-semibold">{bi(a.np, a.en)}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title={bi("विद्यार्थी वृद्धि (वि.सं.)", "Student growth (BS years)")}
          description={bi("पछिल्लो पाँच शैक्षिक वर्ष", "Last five academic years")}
          action={<StatusPill tone="green" emoji="📈">+42% / 5 yrs</StatusPill>}
        >
          {loading ? (
            <SkeletonChart />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={growthData}>
                <defs>
                  <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="students" stroke="var(--color-primary)" strokeWidth={3} fill="url(#growth)" animationDuration={1200} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard
          title={bi("हाजिरी प्रवृत्ति", "Attendance trend")}
          description={bi("मासिक औसत प्रतिशत", "Monthly average percentage")}
        >
          {loading ? (
            <SkeletonChart />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey={lang === "np" ? "label" : "en"} tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                <YAxis domain={[70, 100]} tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke="var(--color-success)" strokeWidth={3} dot={{ r: 3 }} animationDuration={1200} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title={bi("शुल्क संकलन", "Fee collection")}
          description={bi("संकलित बनाम बाँकी (रुपैयाँ)", "Collected vs pending (NPR)")}
          action={
            <Button asChild size="sm" variant="outline" className="rounded-full">
              <Link to="/fees">{bi("शुल्क खण्ड", "Open fees")}</Link>
            </Button>
          }
        >
          {loading ? (
            <SkeletonChart />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={feeCollection} barGap={6}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey={lang === "np" ? "month" : "en"} tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                <YAxis tickFormatter={(v: number) => `${v / 100000}L`} tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                <Tooltip
                  formatter={(v: number) => npr(v)}
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="collected" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} animationDuration={1000} />
                <Bar dataKey="pending" fill="var(--color-chart-4)" radius={[6, 6, 0, 0]} animationDuration={1200} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard title={bi("कक्षागत औसत जीपीए", "Class performance (GPA)")} description={bi("दोस्रो त्रैमासिक", "Second terminal")}>
          {loading ? (
            <SkeletonChart />
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={classPerformance} layout="vertical">
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" domain={[0, 4]} tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                <YAxis type="category" dataKey="name" width={40} tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="gpa" radius={[0, 6, 6, 0]} animationDuration={1100}>
                  {classPerformance.map((c, i) => (
                    <Cell key={c.name} fill={`var(--color-chart-${(i % 5) + 1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <SectionCard title={bi("विषयगत परीक्षा प्रदर्शन", "Exam performance by subject")} className="xl:col-span-2">
          {loading ? (
            <SkeletonChart />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={examPerformance}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="subject" tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="first" name="First term" fill="var(--color-chart-3)" radius={[5, 5, 0, 0]} />
                <Bar dataKey="second" name="Second term" fill="var(--color-chart-1)" radius={[5, 5, 0, 0]} />
                <Bar dataKey="final" name="Projected final" fill="var(--color-chart-2)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </SectionCard>

        <SectionCard
          title={bi("आगामी कार्यक्रम", "Upcoming events")}
          description={bi("असोज २०८३", "Ashwin 2083 BS")}
          action={
            <Link to="/calendar" className="text-xs font-semibold text-primary hover:underline">
              {bi("पात्रो", "Calendar")} →
            </Link>
          }
        >
          {loading ? (
            <SkeletonTable rows={4} />
          ) : (
            <ul className="space-y-3">
              {calendarEvents.slice(4, 9).map((e) => {
                const meta = eventTypeMeta[e.type];
                return (
                  <li key={e.title} className="flex items-start gap-3 rounded-xl p-2 transition-colors hover:bg-muted/60">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-lg">{meta.emoji}</span>
                    <div className="min-w-0">
                      <p className="np truncate text-sm font-semibold">{lang === "np" ? e.titleNp : e.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {bsStringToLabel(`2083-06-${String(e.day).padStart(2, "0")}`, lang)} {e.time ? `· ${e.time}` : ""}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <SectionCard
          className="xl:col-span-2"
          title={bi("पछिल्ला सूचनाहरू", "Latest notices")}
          action={
            <Button asChild size="sm" variant="ghost" className="rounded-full">
              <Link to="/communication">{bi("सबै", "All")} →</Link>
            </Button>
          }
        >
          {loading ? (
            <SkeletonTable rows={3} />
          ) : (
            <ul className="space-y-3">
              {notices.slice(0, 3).map((n) => (
                <li key={n.id} className="group flex gap-3 rounded-2xl border border-border p-4 transition-all hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-card">
                  <span className="text-2xl">{n.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="np text-sm font-semibold">{lang === "np" ? n.title : n.titleEn}</p>
                      {n.pinned ? <StatusPill tone="amber" emoji="📌">Pinned</StatusPill> : null}
                    </div>
                    <p className="np mt-1 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {bsStringToLabel(n.date, lang)} · {n.audience}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title={bi("आजको हाजिरी सारांश", "Today's attendance")}>
            <div className="space-y-4">
              {[
                { label: bi("उपस्थित", "Present"), value: 94.6, tone: "success", emoji: "🟢" },
                { label: bi("अनुपस्थित", "Absent"), value: 3.1, tone: "destructive", emoji: "🔴" },
                { label: bi("ढिलो", "Late"), value: 1.6, tone: "warning", emoji: "🟡" },
                { label: bi("बिदा", "On leave"), value: 0.7, tone: "info", emoji: "🔵" },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
                    <span>
                      {row.emoji} {row.label}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      <Counter value={row.value} decimals={1} suffix="%" />
                    </span>
                  </div>
                  <ProgressBar value={row.value} tone={row.tone} />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title={bi("शीर्ष विद्यार्थी", "Top performers")} description={bi("जीपीए अनुसार", "Ranked by GPA")}>
            <ul className="space-y-3">
              {[...students]
                .sort((a, b) => b.gpa - a.gpa)
                .slice(0, 4)
                .map((s, i) => (
                  <li key={s.id} className="flex items-center gap-3">
                    <span className="text-sm">{["🥇", "🥈", "🥉", "⭐"][i]}</span>
                    <Avatar className="size-9">
                      <AvatarImage src={s.avatar} alt={s.name} />
                      <AvatarFallback>{s.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="np truncate text-sm font-semibold">{lang === "np" ? s.nameNp : s.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Grade {s.grade}
                        {s.section}
                      </p>
                    </div>
                    <StatusPill tone="green">GPA {s.gpa.toFixed(2)}</StatusPill>
                  </li>
                ))}
            </ul>
          </SectionCard>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <SectionCard title={bi("शुल्क बक्यौता चेतावनी", "Fee defaulters")} description={bi("तत्काल फलोअप आवश्यक", "Needs immediate follow-up")}>
          <ul className="divide-y divide-border">
            {students
              .filter((s) => s.dueFee > 0)
              .slice(0, 4)
              .map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="np truncate text-sm font-medium">{lang === "np" ? s.nameNp : s.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {s.id} · Grade {s.grade}
                      {s.section}
                    </p>
                  </div>
                  <StatusPill tone={statusToneFor("overdue")}>{npr(s.dueFee)}</StatusPill>
                </li>
              ))}
          </ul>
        </SectionCard>

        <Card className="animate-rise gap-0 overflow-hidden p-0">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold">{bi("पुस्तकालय अनुरोध", "Library requests")}</h2>
            <p className="text-xs text-muted-foreground">{bi("आज कुनै नयाँ अनुरोध छैन", "Nothing new today")}</p>
          </div>
          <div className="p-5">
            <EmptyState
              emoji="📚"
              title={bi("अहिले कुनै अनुरोध छैन", "No book requests yet")}
              description={bi(
                "विद्यार्थीले पुस्तक अनुरोध गरेपछि यहाँ देखिनेछ।",
                "When students request a book, it will appear here for approval.",
              )}
              action={
                <Button size="sm" className="rounded-full" onClick={() => toast.success("📚 Library catalogue opened")}>
                  {bi("पुस्तकालय हेर्नुहोस्", "Open library")}
                </Button>
              }
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function NoticeDialog() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full gradient-hero shadow-glow">📢 {bi("सूचना पठाउनुहोस्", "Send notice")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>📢 {bi("नयाँ सूचना", "New notice")}</DialogTitle>
          <DialogDescription>
            {bi("सूचना विद्यार्थी, शिक्षक र अभिभावकलाई पठाइनेछ।", "Notices reach students, teachers and guardians instantly.")}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nt">{bi("शीर्षक", "Title")}</Label>
            <Input id="nt" placeholder={bi("जस्तै: दशैं बिदा सूचना", "e.g. Dashain holiday notice")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nb">{bi("विवरण", "Message")}</Label>
            <textarea
              id="nb"
              rows={4}
              className="w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
              placeholder={bi("सूचनाको विवरण लेख्नुहोस्...", "Write the announcement...")}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-full">{bi("रद्द", "Cancel")}</Button>
          <Button className="rounded-full" onClick={() => toast.success("🎉 Notice published to 1,024 students and 812 guardians")}>
            {bi("प्रकाशित गर्नुहोस्", "Publish")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
