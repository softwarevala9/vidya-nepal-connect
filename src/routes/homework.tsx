import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Paperclip, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import {
  EmptyState,
  LoadingSwitch,
  PageHeader,
  ProgressBar,
  SectionCard,
  SkeletonCardGrid,
  StatCard,
  StatusPill,
  statusToneFor,
  bsStringToLabel,
} from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { homework, students, subjectMeta } from "@/data/seed";
import { Illus } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export const Route = createFileRoute("/homework")({
  head: () => ({
    meta: [
      { title: "Homework & Assignments — Submissions Tracker | Vidya ERP" },
      { name: "description", content: "Assign homework, track submissions per class and grade student work with feedback." },
      { property: "og:title", content: "Homework & Assignments — Vidya ERP" },
      { property: "og:description", content: "Assign, collect and grade homework with live submission tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeworkPage,
});

type Task = (typeof homework)[number];

function HomeworkPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Task[]>(homework);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Task | null>(null);

  const filtered = useMemo(
    () => rows.filter((h) => `${h.title} ${h.subject} ${h.grade}`.toLowerCase().includes(query.toLowerCase())),
    [rows, query],
  );

  const open = rows.filter((h) => h.status === "Open").length;
  const overdue = rows.filter((h) => h.status === "Overdue").length;
  const submitted = rows.reduce((s, h) => s + h.submitted, 0);
  const total = rows.reduce((s, h) => s + h.total, 0);

  const closeTask = (id: string) => {
    setRows((r) => r.map((h) => (h.id === id ? { ...h, status: "Closed" } : h)));
    setActive(null);
    toast.success(bi("गृहकार्य बन्द गरियो", "Assignment closed"), { description: id });
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        illus="homework"
        emoji="✏️"
        title={bi("गृहकार्य", "Homework & Assignments")}
        subtitle={bi(
          "गृहकार्य तोक्नुहोस्, बुझाइको अनुगमन गर्नुहोस् र प्रतिक्रिया सहित मूल्याङ्कन गर्नुहोस्।",
          "Assign work, track submissions class by class and grade with feedback.",
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <NewHomeworkDialog
              onCreate={(t) => {
                setRows((r) => [t, ...r]);
                toast.success(bi("गृहकार्य तोकियो", "Homework assigned"), { description: t.title });
              }}
            />
          </>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard illus="homework" emoji="✏️" label={bi("कुल गृहकार्य", "Assignments")} value={rows.length} tone="primary" />
          <StatCard illus="lms" emoji="🟢" label={bi("खुला", "Open")} value={open} tone="info" />
          <StatCard illus="attendance" emoji="📥" label={bi("बुझाइएको", "Submissions")} value={submitted} tone="success" trend={`${Math.round((submitted / Math.max(1, total)) * 100)}%`} />
          <StatCard illus="exams" emoji="⚠️" label={bi("म्याद नाघेको", "Overdue")} value={overdue} tone="warning" />
        </div>
      )}

      <Tabs defaultValue="board" className="mt-6">
        <TabsList>
          <TabsTrigger value="board">🗂️ {bi("बोर्ड", "Board")}</TabsTrigger>
          <TabsTrigger value="submissions">📥 {bi("बुझाइ", "Submissions")}</TabsTrigger>
        </TabsList>

        <TabsContent value="board" className="mt-4">
          <SectionCard
            title={bi("गृहकार्य बोर्ड", "Assignment board")}
            description={bi("कार्डमा क्लिक गरी विवरण खोल्नुहोस्", "Open a card to review submissions")}
            action={
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={bi("खोज्नुहोस्…", "Search…")} className="h-9 w-52 pl-9" />
              </div>
            }
          >
            {filtered.length === 0 ? (
              <EmptyState
                illus="homework"
                emoji="✏️"
                title={bi("गृहकार्य भेटिएन", "No assignments found")}
                description={bi("नयाँ गृहकार्य तोक्नुहोस् वा खोज परिवर्तन गर्नुहोस्।", "Assign new homework or change your search.")}
                action={<Button variant="outline" onClick={() => setQuery("")}>{bi("रिसेट", "Reset")}</Button>}
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((h) => {
                  const meta = subjectMeta[h.subject];
                  const pct = Math.round((h.submitted / h.total) * 100);
                  return (
                    <Card
                      key={h.id}
                      onClick={() => setActive(h)}
                      className="card-3d sheen animate-rise cursor-pointer gap-0 p-5 transition-all hover:-translate-y-1 hover:shadow-lift"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="grid size-10 place-items-center rounded-xl bg-accent text-lg">{meta?.emoji ?? "📘"}</span>
                        <StatusPill tone={statusToneFor(h.status)}>{h.status}</StatusPill>
                      </div>
                      <p className="np mt-3 text-sm font-semibold">{h.title}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {h.grade} · {lang === "np" ? (meta?.np ?? h.subject) : h.subject}
                      </p>
                      <div className="mt-4">
                        <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{bi("बुझाइ", "Submitted")} {h.submitted}/{h.total}</span>
                          <span className="font-semibold">{pct}%</span>
                        </div>
                        <ProgressBar value={pct} tone={pct === 100 ? "success" : pct > 50 ? "primary" : "warning"} />
                      </div>
                      <p className="np mt-3 text-[11px] text-muted-foreground">🗓️ {bi("म्याद", "Due")} {bsStringToLabel(h.due, lang)}</p>
                    </Card>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="submissions" className="mt-4">
          <SectionCard title={bi("भर्खरका बुझाइ", "Recent submissions")} description={bi("कक्षा १० 'ए' — गणित अभ्यास ४.२", "Grade 10A — Mathematics Exercise 4.2")}>
            <ul className="space-y-3">
              {students.slice(0, 8).map((s, i) => (
                <li key={s.id} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-all hover:-translate-y-0.5 hover:shadow-card">
                  <Avatar className="size-10"><AvatarImage src={s.avatar} alt={s.name} /><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="np text-sm font-semibold">{lang === "np" ? s.nameNp : s.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      <Paperclip className="mr-1 inline size-3" />
                      {i % 3 === 0 ? "exercise-4.2.pdf" : "notebook-scan.jpg"} · {bi("कक्षा", "Grade")} {s.grade}{s.section}
                    </p>
                  </div>
                  <StatusPill tone={i % 4 === 3 ? "amber" : "green"}>{i % 4 === 3 ? bi("ढिलो", "Late") : bi("समयमै", "On time")}</StatusPill>
                  <Button size="sm" variant="ghost" onClick={() => toast.success(bi("अंक सुरक्षित भयो", "Marks saved"), { description: s.name })}>
                    <CheckCircle2 className="size-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {active ? (
            <>
              <SheetHeader>
                <SheetTitle className="np">{active.title}</SheetTitle>
                <SheetDescription>{active.id} · {active.grade} · {active.subject}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="rounded-2xl border border-border p-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{bi("बुझाइ", "Submitted")}</span>
                    <span className="font-semibold">{active.submitted} / {active.total}</span>
                  </div>
                  <ProgressBar value={(active.submitted / active.total) * 100} tone="success" />
                  <p className="np mt-3 text-xs text-muted-foreground">🗓️ {bi("म्याद", "Due")} {bsStringToLabel(active.due, lang)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="flex-1" onClick={() => closeTask(active.id)} disabled={active.status === "Closed"}>
                    ✅ {bi("बन्द गर्नुहोस्", "Close assignment")}
                  </Button>
                  <Button variant="outline" onClick={() => toast.success(bi("सम्झना पठाइयो", "Reminder sent to pending students"))}>
                    🔔 {bi("सम्झना", "Remind")}
                  </Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { illus: "lms" as const, np: "अनलाइन पाठ", en: "Attach lesson material" },
          { illus: "communication" as const, np: "अभिभावकलाई सूचना", en: "Notify guardians" },
          { illus: "analytics" as const, np: "बुझाइ रिपोर्ट", en: "Submission report" },
        ].map((q) => (
          <Card
            key={q.en}
            className="card-3d animate-rise flex cursor-pointer flex-row items-center gap-3 p-4 transition-all hover:-translate-y-1 hover:shadow-lift"
            onClick={() => toast.success(lang === "np" ? q.np : q.en)}
          >
            <Illus name={q.illus} size={30} />
            <span className="np text-sm font-semibold">{lang === "np" ? q.np : q.en}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NewHomeworkDialog({ onCreate }: { onCreate: (t: Task) => void }) {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [grade, setGrade] = useState("10A");
  const [due, setDue] = useState("2083-09-26");
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (!title.trim()) {
      toast.error(bi("शीर्षक आवश्यक छ", "Title is required"));
      return;
    }
    onCreate({ id: `HW-${Math.floor(780 + Math.random() * 90)}`, title: title.trim(), subject, grade, due, submitted: 0, total: 36, status: "Open" });
    setOpen(false);
    setTitle("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="size-4" /> {bi("गृहकार्य तोक्नुहोस्", "Assign homework")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bi("नयाँ गृहकार्य", "New assignment")}</DialogTitle>
          <DialogDescription>{bi("कक्षा र म्याद तोक्नुहोस्।", "Set the class, subject and due date.")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hw-title">{bi("शीर्षक", "Title")}</Label>
            <Input id="hw-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Trigonometry — Exercise 5.1" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="hw-subject">{bi("विषय", "Subject")}</Label>
              <Input id="hw-subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hw-grade">{bi("कक्षा", "Class")}</Label>
              <Input id="hw-grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hw-due">{bi("म्याद", "Due (BS)")}</Label>
              <Input id="hw-due" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hw-notes">{bi("निर्देशन", "Instructions")}</Label>
            <Textarea id="hw-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder={bi("विद्यार्थीका लागि निर्देशन…", "Instructions for students…")} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{bi("रद्द", "Cancel")}</Button>
          <Button onClick={submit}>{bi("तोक्नुहोस्", "Assign")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
