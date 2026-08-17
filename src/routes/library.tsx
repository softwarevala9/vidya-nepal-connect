import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BookPlus, Search, Undo2 } from "lucide-react";
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
import { bookIssues, books, npr } from "@/data/seed";
import { Illus } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — Catalogue, Issues & Fines | Vidya ERP" },
      { name: "description", content: "Manage the school library catalogue, issue and return books, and track overdue fines." },
      { property: "og:title", content: "Library — Vidya ERP" },
      { property: "og:description", content: "Catalogue, issue/return desk and overdue fine tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

type Book = (typeof books)[number];
type Issue = (typeof bookIssues)[number];

function LibraryPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [catalogue, setCatalogue] = useState<Book[]>(books);
  const [issues, setIssues] = useState<Issue[]>(bookIssues);

  const filtered = useMemo(
    () => catalogue.filter((b) => `${b.title} ${b.author} ${b.category}`.toLowerCase().includes(query.toLowerCase())),
    [catalogue, query],
  );

  const copies = catalogue.reduce((s, b) => s + b.copies, 0);
  const available = catalogue.reduce((s, b) => s + b.available, 0);
  const overdue = issues.filter((i) => i.status === "Overdue").length;
  const fines = issues.reduce((s, i) => s + i.fine, 0);

  const returnBook = (book: string) => {
    setIssues((r) => r.filter((i) => i.book !== book));
    setCatalogue((c) => c.map((b) => (b.title === book ? { ...b, available: b.available + 1 } : b)));
    toast.success(bi("पुस्तक फिर्ता भयो", "Book returned"), { description: book });
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        illus="library"
        emoji="📖"
        title={bi("पुस्तकालय", "Library")}
        subtitle={bi(
          "पुस्तक सूची, निष्कासन तथा फिर्ता डेस्क र म्याद नाघेको जरिवाना अनुगमन।",
          "Catalogue, issue & return desk and overdue fine tracking.",
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <IssueBookDialog
              books={catalogue}
              onIssue={(i) => {
                setIssues((r) => [i, ...r]);
                setCatalogue((c) => c.map((b) => (b.title === i.book ? { ...b, available: Math.max(0, b.available - 1) } : b)));
                toast.success(bi("पुस्तक निष्कासन भयो", "Book issued"), { description: `${i.book} → ${i.student}` });
              }}
            />
          </>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard illus="library" emoji="📚" label={bi("कुल प्रति", "Total copies")} value={copies} tone="primary" />
          <StatCard illus="lms" emoji="✅" label={bi("उपलब्ध", "Available")} value={available} tone="success" />
          <StatCard illus="homework" emoji="📤" label={bi("निष्कासित", "On loan")} value={issues.length} tone="info" />
          <StatCard illus="fees" emoji="⚠️" label={bi("जरिवाना", "Fines due")} value={fines} prefix="रु " tone="warning" trend={`${overdue} overdue`} />
        </div>
      )}

      <Tabs defaultValue="catalogue" className="mt-6">
        <TabsList>
          <TabsTrigger value="catalogue">📚 {bi("पुस्तक सूची", "Catalogue")}</TabsTrigger>
          <TabsTrigger value="issues">📤 {bi("निष्कासन", "Issued books")}</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogue" className="mt-4">
          <SectionCard
            title={bi("पुस्तक सूची", "Catalogue")}
            description={bi("नेपाली साहित्य, विज्ञान र सन्दर्भ पुस्तक", "Nepali literature, science and reference titles")}
            action={
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={bi("पुस्तक खोज्नुहोस्…", "Search books…")} className="h-9 w-56 pl-9" />
              </div>
            }
          >
            {loading ? (
              <SkeletonCardGrid count={6} />
            ) : filtered.length === 0 ? (
              <EmptyState illus="library" emoji="📚" title={bi("पुस्तक भेटिएन", "No books found")} description={bi("अर्को शीर्षक वा लेखक खोज्नुहोस्।", "Try another title, author or category.")} action={<Button variant="outline" onClick={() => setQuery("")}>{bi("रिसेट", "Reset")}</Button>} />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((b) => (
                  <Card key={b.id} className="card-3d sheen animate-rise gap-0 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <span className="grid size-11 place-items-center rounded-xl bg-accent text-2xl">{b.emoji}</span>
                      <StatusPill tone={b.available === 0 ? "red" : b.available < 4 ? "amber" : "green"}>
                        {b.available}/{b.copies}
                      </StatusPill>
                    </div>
                    <p className="np mt-3 text-sm font-semibold">{b.title}</p>
                    <p className="np text-[11px] text-muted-foreground">{b.author}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">🏷️ {b.category} · <span className="font-mono">{b.id}</span></p>
                    <div className="mt-3"><ProgressBar value={(b.available / b.copies) * 100} tone={b.available === 0 ? "destructive" : "success"} /></div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-4"
                      disabled={b.available === 0}
                      onClick={() => toast.success(bi("आरक्षण गरियो", "Reserved for pickup"), { description: b.title })}
                    >
                      {b.available === 0 ? bi("उपलब्ध छैन", "Not available") : bi("आरक्षण गर्नुहोस्", "Reserve")}
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="issues" className="mt-4">
          <SectionCard title={bi("निष्कासित पुस्तक", "Issued books")} description={bi("म्याद नाघेमा दैनिक रु १० जरिवाना", "Overdue fine of Rs 10 per day")}>
            {loading ? (
              <SkeletonTable rows={4} />
            ) : issues.length === 0 ? (
              <EmptyState illus="library" emoji="📤" title={bi("सबै पुस्तक फिर्ता भए", "All books returned")} description={bi("हाल कुनै पुस्तक निष्कासनमा छैन।", "Nothing is currently on loan.")} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{bi("पुस्तक", "Book")}</TableHead>
                      <TableHead>{bi("विद्यार्थी", "Student")}</TableHead>
                      <TableHead>{bi("निष्कासन", "Issued")}</TableHead>
                      <TableHead>{bi("फिर्ता म्याद", "Due")}</TableHead>
                      <TableHead>{bi("जरिवाना", "Fine")}</TableHead>
                      <TableHead className="text-right">{bi("कार्य", "Action")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {issues.map((i) => (
                      <TableRow key={`${i.book}-${i.student}`}>
                        <TableCell className="np text-sm font-semibold">{i.book}</TableCell>
                        <TableCell>
                          <p className="text-sm">{i.student}</p>
                          <p className="text-[11px] text-muted-foreground">{bi("कक्षा", "Grade")} {i.grade}</p>
                        </TableCell>
                        <TableCell className="np text-xs">{bsStringToLabel(i.issued, lang)}</TableCell>
                        <TableCell className="np text-xs">{bsStringToLabel(i.due, lang)}</TableCell>
                        <TableCell>{i.fine > 0 ? <StatusPill tone="red">{npr(i.fine)}</StatusPill> : <StatusPill tone={statusToneFor(i.status)}>{i.status}</StatusPill>}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => returnBook(i.book)}>
                            <Undo2 className="size-4" /> {bi("फिर्ता", "Return")}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>
      </Tabs>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { illus: "library" as const, np: "नयाँ पुस्तक दर्ता", en: "Register new title" },
          { illus: "analytics" as const, np: "पठन रिपोर्ट", en: "Reading report" },
          { illus: "communication" as const, np: "जरिवाना सम्झना", en: "Send fine reminders" },
        ].map((q) => (
          <Card key={q.en} className="card-3d animate-rise flex cursor-pointer flex-row items-center gap-3 p-4 transition-all hover:-translate-y-1 hover:shadow-lift" onClick={() => toast.success(lang === "np" ? q.np : q.en)}>
            <Illus name={q.illus} size={30} />
            <span className="np text-sm font-semibold">{lang === "np" ? q.np : q.en}</span>
          </Card>
        ))}
      </div>
    </div>
  );
}

function IssueBookDialog({ books: list, onIssue }: { books: Book[]; onIssue: (i: Issue) => void }) {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState(list[0]?.title ?? "");
  const [student, setStudent] = useState("");
  const [grade, setGrade] = useState("9A");

  const submit = () => {
    if (!student.trim()) {
      toast.error(bi("विद्यार्थीको नाम आवश्यक छ", "Student name is required"));
      return;
    }
    onIssue({ book, student: student.trim(), grade, issued: "2083-09-17", due: "2083-10-01", fine: 0, status: "Issued" });
    setOpen(false);
    setStudent("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><BookPlus className="size-4" /> {bi("पुस्तक निष्कासन", "Issue book")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bi("पुस्तक निष्कासन", "Issue a book")}</DialogTitle>
          <DialogDescription>{bi("१४ दिनको लागि निष्कासन हुनेछ।", "Books are issued for 14 days.")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lb-book">{bi("पुस्तक", "Book")}</Label>
            <select
              id="lb-book"
              value={book}
              onChange={(e) => setBook(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
            >
              {list.map((b) => (
                <option key={b.id} value={b.title}>{b.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lb-student">{bi("विद्यार्थी", "Student")}</Label>
              <Input id="lb-student" value={student} onChange={(e) => setStudent(e.target.value)} placeholder="Sabina Lama" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lb-grade">{bi("कक्षा", "Grade")}</Label>
              <Input id="lb-grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{bi("रद्द", "Cancel")}</Button>
          <Button onClick={submit}>{bi("निष्कासन", "Issue")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
