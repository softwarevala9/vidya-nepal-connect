import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Award, Download, Search, Send } from "lucide-react";
import { toast } from "sonner";
import {
  EmptyState,
  LoadingSwitch,
  PageHeader,
  ProgressBar,
  SectionCard,
  SkeletonCardGrid,
  SkeletonTable,
  StatCard,
  StatusPill,
} from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { classPerformance, marksheet, students } from "@/data/seed";
import { Illus } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results & GPA — Grade Sheets and Rankings | Vidya ERP" },
      { name: "description", content: "Publish GPA-based results, ledgers and rank lists with SMS delivery to guardians." },
      { property: "og:title", content: "Results & GPA — Vidya ERP" },
      { property: "og:description", content: "GPA grade sheets, class rankings and instant result publishing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResultsPage,
});

const gradeFor = (gpa: number) => (gpa >= 3.6 ? "A+" : gpa >= 3.2 ? "A" : gpa >= 2.8 ? "B+" : gpa >= 2.4 ? "B" : "C+");

type Row = { id: string; name: string; nameNp: string; grade: string; avatar: string; gpa: number; rank: number; attendance: number };

function ResultsPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [published, setPublished] = useState(false);
  const [active, setActive] = useState<Row | null>(null);

  const rows: Row[] = useMemo(
    () =>
      students
        .map((s, i) => ({
          id: s.id,
          name: s.name,
          nameNp: s.nameNp,
          grade: `${s.grade}${s.section}`,
          avatar: s.avatar,
          gpa: Number((3.95 - i * 0.11).toFixed(2)),
          rank: i + 1,
          attendance: 98 - i,
        }))
        .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()) || r.grade.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const avgGpa = rows.length ? rows.reduce((s, r) => s + r.gpa, 0) / rows.length : 0;
  const distribution = [
    { grade: "A+", count: rows.filter((r) => r.gpa >= 3.6).length, tone: "success" },
    { grade: "A", count: rows.filter((r) => r.gpa >= 3.2 && r.gpa < 3.6).length, tone: "info" },
    { grade: "B+", count: rows.filter((r) => r.gpa >= 2.8 && r.gpa < 3.2).length, tone: "warning" },
    { grade: "B", count: rows.filter((r) => r.gpa < 2.8).length, tone: "destructive" },
  ];
  const maxCount = Math.max(1, ...distribution.map((d) => d.count));

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        illus="results"
        emoji="🏆"
        title={bi("नतिजा तथा जीपीए", "Results & GPA")}
        subtitle={bi(
          "जीपीए आधारित ग्रेडसिट, कक्षागत श्रेणी र अभिभावकलाई तत्काल SMS।",
          "GPA-based grade sheets, class rankings and instant SMS to guardians.",
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <Button variant="outline" size="sm" onClick={() => toast.success(bi("लेजर निर्यात भयो", "Result ledger exported"))}>
              <Download className="size-4" /> {bi("लेजर", "Ledger")}
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setPublished(true);
                toast.success(bi("नतिजा प्रकाशित भयो", "Results published"), {
                  description: bi("१,०२४ अभिभावकलाई SMS पठाइयो", "SMS delivered to 1,024 guardians"),
                });
              }}
            >
              <Send className="size-4" /> {published ? bi("पुनः प्रकाशित", "Re-publish") : bi("प्रकाशित गर्नुहोस्", "Publish results")}
            </Button>
          </>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard illus="results" emoji="🏆" label={bi("औसत जीपीए", "Average GPA")} value={avgGpa} decimals={2} tone="primary" trend="+0.14" />
          <StatCard illus="students" emoji="🎓" label={bi("मूल्याङ्कन गरिएका", "Students evaluated")} value={rows.length} tone="info" />
          <StatCard illus="exams" emoji="✅" label={bi("उत्तीर्ण दर", "Pass rate")} value={97.4} decimals={1} suffix="%" tone="success" />
          <StatCard illus="analytics" emoji="⭐" label={bi("A+ ग्रेड", "A+ grades")} value={distribution[0]?.count ?? 0} tone="chart-5" />
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title={bi("कक्षागत जीपीए", "Class-wise GPA")} description={bi("दोस्रो त्रैमासिक", "Second terminal")}>
          <div className="flex h-56 items-end gap-3">
            {classPerformance.map((c) => (
              <div key={c.name} className="group flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">{c.gpa}</span>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-chart-5/60 to-chart-5 transition-all duration-500 group-hover:from-primary/60 group-hover:to-primary"
                  style={{ height: `${(c.gpa / 4) * 100}%` }}
                />
                <span className="text-[10px] font-medium text-muted-foreground">{c.name}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={bi("ग्रेड वितरण", "Grade distribution")}>
          <ul className="space-y-4">
            {distribution.map((d) => (
              <li key={d.grade}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-semibold">{d.grade}</span>
                  <span className="tabular-nums text-muted-foreground">{d.count}</span>
                </div>
                <ProgressBar value={(d.count / maxCount) * 100} tone={d.tone} />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <Tabs defaultValue="ranking" className="mt-6">
        <TabsList>
          <TabsTrigger value="ranking">🥇 {bi("श्रेणी सूची", "Rank list")}</TabsTrigger>
          <TabsTrigger value="subjects">📚 {bi("विषयगत", "Subject-wise")}</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="mt-4">
          <SectionCard
            title={bi("श्रेणी सूची", "Rank list")}
            description={bi("पङ्क्तिमा क्लिक गरी ग्रेडसिट हेर्नुहोस्", "Click a row to open the grade sheet")}
            action={
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={bi("खोज्नुहोस्…", "Search…")} className="h-9 w-52 pl-9" />
              </div>
            }
          >
            {loading ? (
              <SkeletonTable rows={6} />
            ) : rows.length === 0 ? (
              <EmptyState illus="results" emoji="🏆" title={bi("नतिजा भेटिएन", "No results found")} description={bi("अर्को नाम वा कक्षा खोज्नुहोस्।", "Try another student name or grade.")} action={<Button variant="outline" onClick={() => setQuery("")}>{bi("रिसेट", "Reset")}</Button>} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">{bi("क्रम", "Rank")}</TableHead>
                      <TableHead>{bi("विद्यार्थी", "Student")}</TableHead>
                      <TableHead>{bi("कक्षा", "Grade")}</TableHead>
                      <TableHead className="w-40">{bi("जीपीए", "GPA")}</TableHead>
                      <TableHead className="text-right">{bi("ग्रेड", "Grade point")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={r.id} className="cursor-pointer" onClick={() => setActive(r)}>
                        <TableCell>
                          <span className={`grid size-8 place-items-center rounded-full text-xs font-bold ${r.rank <= 3 ? "bg-warning/20 text-warning-foreground" : "bg-muted text-muted-foreground"}`}>
                            {r.rank}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9"><AvatarImage src={r.avatar} alt={r.name} /><AvatarFallback>{r.name.charAt(0)}</AvatarFallback></Avatar>
                            <div>
                              <p className="np text-sm font-semibold">{lang === "np" ? r.nameNp : r.name}</p>
                              <p className="font-mono text-[11px] text-muted-foreground">{r.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{r.grade}</TableCell>
                        <TableCell>
                          <ProgressBar value={(r.gpa / 4) * 100} tone="success" />
                          <p className="mt-1 text-[11px] tabular-nums text-muted-foreground">{r.gpa} / 4.0</p>
                        </TableCell>
                        <TableCell className="text-right"><StatusPill tone={r.gpa >= 3.6 ? "green" : "blue"}>{gradeFor(r.gpa)}</StatusPill></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="subjects" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {marksheet.map((m) => (
              <Card key={m.subject} className="card-3d sheen animate-rise gap-0 p-5">
                <div className="flex items-start justify-between">
                  <Illus name="exams" size={28} />
                  <StatusPill tone={m.grade === "A+" ? "green" : "blue"}>{m.grade}</StatusPill>
                </div>
                <p className="np mt-3 text-sm font-semibold">{lang === "np" ? m.np : m.subject}</p>
                <p className="mt-1 text-xs text-muted-foreground">{bi("प्राप्तांक", "Obtained")} {m.obtained} / {m.full}</p>
                <div className="mt-3"><ProgressBar value={(m.obtained / m.full) * 100} tone="primary" /></div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {active ? (
            <>
              <SheetHeader>
                <SheetTitle className="np flex items-center gap-2"><Award className="size-4" /> {lang === "np" ? active.nameNp : active.name}</SheetTitle>
                <SheetDescription>{active.id} · {bi("कक्षा", "Grade")} {active.grade} · GPA {active.gpa}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: bi("श्रेणी", "Rank"), v: `#${active.rank}` },
                    { l: bi("जीपीए", "GPA"), v: active.gpa.toFixed(2) },
                    { l: bi("हाजिरी", "Attendance"), v: `${active.attendance}%` },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-border p-3 text-center">
                      <p className="text-lg font-bold">{s.v}</p>
                      <p className="text-[11px] text-muted-foreground">{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-border">
                  {marksheet.map((m) => (
                    <div key={m.subject} className="flex items-center justify-between border-b border-border px-4 py-2.5 text-sm last:border-0">
                      <span className="np">{lang === "np" ? m.np : m.subject}</span>
                      <span className="font-semibold tabular-nums">{m.obtained} · {m.grade}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => toast.success(bi("ग्रेडसिट डाउनलोड भयो", "Grade sheet downloaded"))}><Download className="size-4" /> {bi("ग्रेडसिट", "Grade sheet")}</Button>
                  <Button variant="outline" onClick={() => toast.success(bi("अभिभावकलाई SMS पठाइयो", "SMS sent to guardian"))}><Send className="size-4" /> SMS</Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}
