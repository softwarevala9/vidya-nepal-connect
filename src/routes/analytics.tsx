import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Download, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  LoadingSwitch,
  PageHeader,
  ProgressBar,
  SectionCard,
  SkeletonCardGrid,
  SkeletonChart,
  StatCard,
  StatusPill,
} from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import {
  attendanceTrend,
  classPerformance,
  examPerformance,
  feeCollection,
  growthData,
  npr,
  students,
  subjectMeta,
} from "@/data/seed";
import { Illus } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Enrolment, Attendance & Revenue Insights | Vidya ERP" },
      { name: "description", content: "School-wide analytics on enrolment growth, attendance trends, GPA and fee revenue." },
      { property: "og:title", content: "Analytics — Vidya ERP" },
      { property: "og:description", content: "Enrolment growth, attendance trends, GPA and revenue insights." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

function Sparkline({ values, tone = "primary" }: { values: number[]; tone?: string }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);
  const points = values
    .map((v, i) => `${(i / Math.max(1, values.length - 1)) * 100},${100 - ((v - min) / span) * 90 - 5}`)
    .join(" ");
  const stroke = tone === "success" ? "var(--color-success)" : tone === "warning" ? "var(--color-warning)" : "var(--color-primary)";
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-24 w-full">
      <defs>
        <linearGradient id={`sp-${tone}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,100 ${points} 100,100`} fill={`url(#sp-${tone})`} />
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function AnalyticsPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState("year");

  const revenue = feeCollection.reduce((s, m) => s + m.collected, 0);
  const pending = feeCollection.reduce((s, m) => s + m.pending, 0);
  const avgAttendance = Math.round(attendanceTrend.reduce((s, m) => s + m.value, 0) / attendanceTrend.length);
  const avgGpa = classPerformance.reduce((s, c) => s + c.gpa, 0) / classPerformance.length;
  const maxGrowth = Math.max(...growthData.map((g) => g.students));

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        illus="analytics"
        emoji="📊"
        title={bi("विश्लेषण", "Analytics")}
        subtitle={bi(
          "भर्ना वृद्धि, हाजिरी प्रवृत्ति, जीपीए र शुल्क राजस्वको समग्र चित्र।",
          "Enrolment growth, attendance trends, GPA and fee revenue at a glance.",
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="term">{bi("यो सत्र", "This term")}</SelectItem>
                <SelectItem value="year">{bi("शैक्षिक वर्ष", "Academic year")}</SelectItem>
                <SelectItem value="five">{bi("५ वर्ष", "Last 5 years")}</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={() => toast.success(bi("रिपोर्ट निर्यात भयो", "Analytics report exported"))}>
              <Download className="size-4" /> {bi("निर्यात", "Export")}
            </Button>
          </>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard illus="students" emoji="👨‍🎓" label={bi("कुल विद्यार्थी", "Total enrolment")} value={1024} tone="primary" trend="+13.6%" />
          <StatCard illus="attendance" emoji="✅" label={bi("औसत हाजिरी", "Average attendance")} value={avgAttendance} suffix="%" tone="success" />
          <StatCard illus="results" emoji="🎓" label={bi("औसत जीपीए", "Average GPA")} value={avgGpa} decimals={2} tone="chart-5" trend="+0.12" />
          <StatCard illus="fees" emoji="💰" label={bi("वार्षिक राजस्व", "Revenue collected")} value={revenue} prefix="रु " tone="info" />
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title={bi("भर्ना वृद्धि", "Enrolment growth")}
          description={bi("२०७९ – २०८३ वि.सं.", "2079 – 2083 BS")}
        >
          {loading ? (
            <SkeletonChart />
          ) : (
            <div className="flex h-56 items-end gap-5">
              {growthData.map((g) => (
                <div key={g.year} className="group flex flex-1 flex-col items-center gap-2">
                  <span className="text-[11px] font-bold text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">{g.students}</span>
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-primary/50 to-primary transition-all duration-700 group-hover:from-chart-5/60 group-hover:to-chart-5"
                    style={{ height: `${(g.students / maxGrowth) * 100}%` }}
                  />
                  <span className="np text-[11px] font-semibold text-muted-foreground">{g.year}</span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title={bi("हाजिरी प्रवृत्ति", "Attendance trend")} description={bi("मासिक औसत %", "Monthly average %")}>
          {loading ? <SkeletonChart /> : <Sparkline values={attendanceTrend.map((a) => a.value)} tone="success" />}
          <div className="mt-3 flex flex-wrap gap-2">
            {attendanceTrend.slice(-4).map((a) => (
              <StatusPill key={a.en} tone={a.value >= 92 ? "green" : a.value >= 88 ? "amber" : "red"}>
                <span className="np">{lang === "np" ? a.label : a.en}</span> {a.value}%
              </StatusPill>
            ))}
          </div>
        </SectionCard>
      </div>

      <Tabs defaultValue="academic" className="mt-6">
        <TabsList>
          <TabsTrigger value="academic">🎓 {bi("शैक्षिक", "Academic")}</TabsTrigger>
          <TabsTrigger value="finance">💰 {bi("वित्तीय", "Financial")}</TabsTrigger>
          <TabsTrigger value="insights">✨ {bi("अन्तर्दृष्टि", "Insights")}</TabsTrigger>
        </TabsList>

        <TabsContent value="academic" className="mt-4">
          <div className="grid gap-5 lg:grid-cols-2">
            <SectionCard title={bi("विषयगत प्रगति", "Subject progress")} description={bi("प्रथम → वार्षिक", "First term → final")}>
              <ul className="space-y-4">
                {examPerformance.map((p) => {
                  const meta = subjectMeta[p.subject];
                  return (
                    <li key={p.subject}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="np font-medium">{meta?.emoji ?? "📘"} {lang === "np" ? (meta?.np ?? p.subject) : p.subject}</span>
                        <span className="font-semibold tabular-nums text-success">+{p.final - p.first}%</span>
                      </div>
                      <ProgressBar value={p.final} tone="primary" />
                    </li>
                  );
                })}
              </ul>
            </SectionCard>

            <SectionCard title={bi("कक्षागत जीपीए", "GPA by class")}>
              <div className="grid gap-3 sm:grid-cols-2">
                {classPerformance.map((c) => (
                  <Card key={c.name} className="card-3d animate-rise gap-0 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{c.name}</span>
                      <StatusPill tone={c.gpa >= 3.5 ? "green" : c.gpa >= 3.2 ? "blue" : "amber"}>{c.gpa.toFixed(2)}</StatusPill>
                    </div>
                    <div className="mt-3"><ProgressBar value={(c.gpa / 4) * 100} tone="chart-5" /></div>
                  </Card>
                ))}
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="mt-4">
          <div className="grid gap-5 lg:grid-cols-3">
            <SectionCard className="lg:col-span-2" title={bi("राजस्व प्रवृत्ति", "Revenue trend")} description={bi("मासिक संकलन", "Monthly collection")}>
              <Sparkline values={feeCollection.map((f) => f.collected)} tone="primary" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { np: "संकलित", en: "Collected", v: npr(revenue), tone: "green" },
                  { np: "बाँकी", en: "Pending", v: npr(pending), tone: "amber" },
                  { np: "संकलन दर", en: "Collection rate", v: `${Math.round((revenue / (revenue + pending)) * 100)}%`, tone: "blue" },
                ].map((s) => (
                  <div key={s.en} className="rounded-xl border border-border p-3 text-center">
                    <p className="text-sm font-bold">{s.v}</p>
                    <p className="np mt-1 text-[11px] text-muted-foreground">{lang === "np" ? s.np : s.en}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title={bi("शुल्क शीर्षक", "Revenue mix")}>
              <ul className="space-y-4">
                {[
                  { np: "शिक्षण शुल्क", en: "Tuition", pct: 62 },
                  { np: "यातायात", en: "Transport", pct: 14 },
                  { np: "छात्रावास", en: "Hostel", pct: 12 },
                  { np: "परीक्षा", en: "Examination", pct: 7 },
                  { np: "अन्य", en: "Other", pct: 5 },
                ].map((r) => (
                  <li key={r.en}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="np font-medium">{lang === "np" ? r.np : r.en}</span>
                      <span className="tabular-nums text-muted-foreground">{r.pct}%</span>
                    </div>
                    <ProgressBar value={r.pct} tone="success" />
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { illus: "attendance" as const, np: "असोजमा हाजिरी ६% घट्यो — चाडपर्वको प्रभाव।", en: "Attendance dipped 6% in Ashwin — festival season effect." },
              { illus: "fees" as const, np: "इसेवा मार्फत ४८% शुल्क संकलन भयो।", en: "48% of fees now collected through eSewa." },
              { illus: "results" as const, np: "कक्षा १० को जीपीए ०.१४ ले सुधार भयो।", en: "Grade 10 GPA improved by 0.14 this term." },
              { illus: "transport" as const, np: "मार्ग RT-03 औसत ८ मिनेट ढिलो छ।", en: "Route RT-03 runs 8 minutes late on average." },
              { illus: "library" as const, np: "नेपाली साहित्य सबैभन्दा धेरै पढिने वर्ग हो।", en: "Nepali literature is the most borrowed category." },
              { illus: "admissions" as const, np: "भर्ना आवेदन गत वर्षभन्दा २२% बढी।", en: "Admission enquiries are up 22% year on year." },
            ].map((i) => (
              <Card key={i.en} className="card-3d sheen animate-rise gap-0 p-5">
                <div className="flex items-start justify-between">
                  <Illus name={i.illus} size={30} />
                  <Sparkles className="size-4 text-primary" />
                </div>
                <p className="np mt-3 text-sm font-medium">{lang === "np" ? i.np : i.en}</p>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {bi(`कुल ${students.length} विद्यार्थीको नमुना डेटामा आधारित`, `Based on a live sample of ${students.length} student records`)}
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
