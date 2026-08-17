import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarPlus, ClipboardList, Printer } from "lucide-react";
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
  statusToneFor,
  bsStringToLabel,
} from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { examPerformance, exams, marksheet, subjectMeta } from "@/data/seed";
import { Illus } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/exams")({
  head: () => ({
    meta: [
      { title: "Examinations — Terminal, SEE & NEB Routines | Vidya ERP" },
      { name: "description", content: "Plan terminal, SEE pre-board and NEB examinations with routines, seat plans and admit cards." },
      { property: "og:title", content: "Examinations — Vidya ERP" },
      { property: "og:description", content: "Exam routines, seat plans, admit cards and subject performance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExamsPage,
});

type Exam = (typeof exams)[number];

const seatPlan = [
  { room: "Hall A · Ground floor", capacity: 60, allotted: 58, invigilator: "Sarita Poudel" },
  { room: "Hall B · Ground floor", capacity: 60, allotted: 60, invigilator: "Ram Bahadur Thapa" },
  { room: "Room 204 · Science block", capacity: 40, allotted: 33, invigilator: "Anita Shrestha" },
  { room: "Room 205 · Science block", capacity: 40, allotted: 28, invigilator: "Deepak Gurung" },
];

function ExamsPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Exam[]>(exams);
  const [active, setActive] = useState<Exam | null>(null);

  const ongoing = rows.filter((e) => e.status === "Ongoing").length;
  const scheduled = rows.filter((e) => e.status === "Scheduled").length;
  const completed = rows.filter((e) => e.status === "Completed").length;

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        illus="exams"
        emoji="📝"
        title={bi("परीक्षा व्यवस्थापन", "Examinations")}
        subtitle={bi(
          "त्रैमासिक, एसईई प्रि-बोर्ड र एनईबी परीक्षाको रुटिन, सिट प्लान र प्रवेशपत्र।",
          "Terminal, SEE pre-board and NEB routines with seat plans and admit cards.",
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <Button variant="outline" size="sm" onClick={() => toast.success(bi("प्रवेशपत्र तयार भयो", "Admit cards generated"), { description: bi("१०२४ विद्यार्थी", "1,024 students") })}>
              <Printer className="size-4" /> {bi("प्रवेशपत्र", "Admit cards")}
            </Button>
            <ScheduleExamDialog
              onCreate={(e) => {
                setRows((r) => [e, ...r]);
                toast.success(bi("परीक्षा तालिका थपियो", "Exam scheduled"), { description: e.name });
              }}
            />
          </>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard illus="exams" emoji="📝" label={bi("कुल परीक्षा", "Exams this year")} value={rows.length} tone="primary" />
          <StatCard illus="attendance" emoji="🟢" label={bi("चलिरहेको", "Ongoing")} value={ongoing} tone="warning" />
          <StatCard illus="calendar" emoji="📅" label={bi("तालिकाबद्ध", "Scheduled")} value={scheduled} tone="info" />
          <StatCard illus="results" emoji="🏆" label={bi("सम्पन्न", "Completed")} value={completed} tone="success" trend="+2" />
        </div>
      )}

      <Tabs defaultValue="routine" className="mt-6">
        <TabsList>
          <TabsTrigger value="routine">🗓️ {bi("रुटिन", "Routine")}</TabsTrigger>
          <TabsTrigger value="seats">🪑 {bi("सिट प्लान", "Seat plan")}</TabsTrigger>
          <TabsTrigger value="performance">📊 {bi("नतिजा प्रवृत्ति", "Performance")}</TabsTrigger>
          <TabsTrigger value="marksheet">🧾 {bi("नमुना मार्कसिट", "Marksheet")}</TabsTrigger>
        </TabsList>

        <TabsContent value="routine" className="mt-4">
          <SectionCard title={bi("परीक्षा तालिका", "Examination schedule")} description={bi("शैक्षिक वर्ष २०८३ वि.सं.", "Academic year 2083 BS")}>
            {loading ? (
              <SkeletonTable rows={5} />
            ) : rows.length === 0 ? (
              <EmptyState illus="exams" emoji="📝" title={bi("कुनै परीक्षा छैन", "No exams scheduled")} description={bi("नयाँ परीक्षा तालिका थप्नुहोस्।", "Schedule your first examination.")} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{bi("परीक्षा", "Examination")}</TableHead>
                      <TableHead>{bi("प्रकार", "Type")}</TableHead>
                      <TableHead>{bi("कक्षा", "Grades")}</TableHead>
                      <TableHead>{bi("मिति", "Dates (BS)")}</TableHead>
                      <TableHead className="text-right">{bi("स्थिति", "Status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((e) => (
                      <TableRow key={e.id} className="cursor-pointer" onClick={() => setActive(e)}>
                        <TableCell>
                          <p className="np text-sm font-semibold">{lang === "np" ? e.nameNp : e.name}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">{e.id}</p>
                        </TableCell>
                        <TableCell><StatusPill tone="violet">{e.type}</StatusPill></TableCell>
                        <TableCell className="text-sm">{e.grades}</TableCell>
                        <TableCell className="np text-xs">
                          {bsStringToLabel(e.from, lang)} → {bsStringToLabel(e.to, lang)}
                        </TableCell>
                        <TableCell className="text-right"><StatusPill tone={statusToneFor(e.status)}>{e.status}</StatusPill></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="seats" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {seatPlan.map((s) => (
              <Card key={s.room} className="card-3d sheen animate-rise gap-0 p-5">
                <div className="flex items-start justify-between">
                  <Illus name="classes" size={28} />
                  <StatusPill tone={s.allotted >= s.capacity ? "red" : "green"}>
                    {s.allotted}/{s.capacity}
                  </StatusPill>
                </div>
                <p className="mt-3 text-sm font-semibold">{s.room}</p>
                <p className="text-[11px] text-muted-foreground">👩‍🏫 {s.invigilator}</p>
                <div className="mt-3"><ProgressBar value={(s.allotted / s.capacity) * 100} tone={s.allotted >= s.capacity ? "warning" : "success"} /></div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="mt-4">
          <SectionCard title={bi("विषयगत औसत", "Subject-wise average")} description={bi("प्रथम → द्वितीय → वार्षिक", "First → second → final term")}>
            <ul className="space-y-4">
              {examPerformance.map((p) => {
                const meta = subjectMeta[p.subject];
                return (
                  <li key={p.subject}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="np font-medium">
                        {meta?.emoji ?? "📘"} {lang === "np" ? (meta?.np ?? p.subject) : p.subject}
                      </span>
                      <span className="font-semibold tabular-nums">{p.final}%</span>
                    </div>
                    <div className="flex gap-1">
                      <ProgressBar value={p.first} tone="info" />
                      <ProgressBar value={p.second} tone="warning" />
                      <ProgressBar value={p.final} tone="success" />
                    </div>
                  </li>
                );
              })}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="marksheet" className="mt-4">
          <SectionCard
            title={bi("नमुना मार्कसिट", "Sample marksheet")}
            description={bi("आरभ शर्मा · कक्षा ८ 'ए'", "Aarav Sharma · Grade 8A")}
            action={<Button size="sm" variant="outline" onClick={() => toast.success(bi("PDF डाउनलोड भयो", "Marksheet PDF downloaded"))}><Printer className="size-4" /> PDF</Button>}
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{bi("विषय", "Subject")}</TableHead>
                    <TableHead>{bi("पूर्णांक", "Full")}</TableHead>
                    <TableHead>{bi("सैद्धान्तिक", "Theory")}</TableHead>
                    <TableHead>{bi("प्रयोगात्मक", "Practical")}</TableHead>
                    <TableHead>{bi("प्राप्तांक", "Obtained")}</TableHead>
                    <TableHead className="text-right">{bi("ग्रेड", "Grade")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marksheet.map((m) => (
                    <TableRow key={m.subject}>
                      <TableCell className="np font-medium">{lang === "np" ? m.np : m.subject}</TableCell>
                      <TableCell>{m.full}</TableCell>
                      <TableCell>{m.theory}</TableCell>
                      <TableCell>{m.practical}</TableCell>
                      <TableCell className="font-semibold">{m.obtained}</TableCell>
                      <TableCell className="text-right"><StatusPill tone={m.grade === "A+" ? "green" : "blue"}>{m.grade} · {m.gp}</StatusPill></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {active ? (
            <>
              <SheetHeader>
                <SheetTitle className="np flex items-center gap-2">
                  <ClipboardList className="size-4" /> {lang === "np" ? active.nameNp : active.name}
                </SheetTitle>
                <SheetDescription>{active.id} · {active.type} · {bi("कक्षा", "Grades")} {active.grades}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="rounded-2xl border border-border p-4 text-sm">
                  <p className="np">🗓️ {bsStringToLabel(active.from, lang)} → {bsStringToLabel(active.to, lang)}</p>
                  <p className="mt-2 text-muted-foreground">🪑 {bi("४ परीक्षा हल तोकिएको", "4 examination halls allotted")}</p>
                  <p className="mt-1 text-muted-foreground">👩‍🏫 {bi("१२ निरीक्षक तोकिएका", "12 invigilators assigned")}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="flex-1" onClick={() => { toast.success(bi("रुटिन प्रकाशित भयो", "Routine published")); setActive(null); }}>
                    📢 {bi("रुटिन प्रकाशित", "Publish routine")}
                  </Button>
                  <Button variant="outline" onClick={() => toast.success(bi("प्रवेशपत्र छापियो", "Admit cards printed"))}>
                    <Printer className="size-4" /> {bi("प्रवेशपत्र", "Admit cards")}
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ScheduleExamDialog({ onCreate }: { onCreate: (e: Exam) => void }) {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [grades, setGrades] = useState("6 – 10");
  const [from, setFrom] = useState("2083-11-02");
  const [to, setTo] = useState("2083-11-11");

  const submit = () => {
    if (!name.trim()) {
      toast.error(bi("परीक्षाको नाम आवश्यक छ", "Exam name is required"));
      return;
    }
    onCreate({ id: `EX-${Math.floor(210 + Math.random() * 80)}`, name: name.trim(), nameNp: name.trim(), type: "Terminal", from, to, grades, status: "Scheduled" });
    setOpen(false);
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><CalendarPlus className="size-4" /> {bi("परीक्षा थप्नुहोस्", "Schedule exam")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bi("नयाँ परीक्षा", "Schedule examination")}</DialogTitle>
          <DialogDescription>{bi("मिति वि.सं. मा राख्नुहोस्।", "Enter dates in Bikram Sambat (YYYY-MM-DD).")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ex-name">{bi("नाम", "Name")}</Label>
            <Input id="ex-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Third Terminal Examination" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ex-grades">{bi("कक्षा", "Grades")}</Label>
              <Input id="ex-grades" value={grades} onChange={(e) => setGrades(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ex-from">{bi("देखि", "From")}</Label>
              <Input id="ex-from" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ex-to">{bi("सम्म", "To")}</Label>
              <Input id="ex-to" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{bi("रद्द", "Cancel")}</Button>
          <Button onClick={submit}>{bi("सुरक्षित", "Save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
