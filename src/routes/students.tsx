import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  Counter,
  EmptyState,
  LoadingSwitch,
  PageHeader,
  ProgressBar,
  SectionCard,
  SkeletonTable,
  StatCard,
  StatusPill,
} from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { achievements, homework, marksheet, npr, students, type Student } from "@/data/seed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/students")({
  head: () => ({
    meta: [
      { title: "Students — Digital Student Profiles | Vidya ERP" },
      { name: "description", content: "Browse student records, digital profiles, attendance, GPA, fees and achievements across every grade and section." },
      { property: "og:title", content: "Students — Vidya ERP" },
      { property: "og:description", content: "Digital student profiles with attendance, GPA, fees and achievements." },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);

  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          (grade === "all" || s.grade === grade) &&
          (s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.nameNp.includes(query) ||
            s.id.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, grade],
  );

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        emoji="👨‍🎓"
        title={bi("विद्यार्थी व्यवस्थापन", "Student management")}
        subtitle={bi(
          "डिजिटल विद्यार्थी प्रोफाइल, हाजिरी, नतिजा र शुल्क एकै ठाउँमा।",
          "Digital student profiles with attendance, results, fees and achievements.",
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <AddStudentDialog />
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard emoji="👨‍🎓" label={bi("कुल विद्यार्थी", "Total students")} value={1024} tone="primary" trend="+38" />
        <StatCard emoji="👧" label={bi("छात्रा", "Girls")} value={512} tone="chart-5" />
        <StatCard emoji="✅" label={bi("औसत हाजिरी", "Average attendance")} value={92.4} decimals={1} suffix="%" tone="success" />
        <StatCard emoji="💰" label={bi("शुल्क बक्यौता", "Fee dues")} value={342000} prefix="रु " tone="warning" />
      </div>

      <Card className="mt-6 gap-0 overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={bi("नाम वा आईडीले खोज्नुहोस्...", "Search by name or student ID...")}
              className="h-10 rounded-full pl-9"
            />
          </div>
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="w-full rounded-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{bi("सबै कक्षा", "All grades")}</SelectItem>
              {["7", "8", "9", "10", "11", "12"].map((g) => (
                <SelectItem key={g} value={g}>
                  {bi("कक्षा", "Grade")} {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-full">
            <SlidersHorizontal className="size-4" /> {bi("फिल्टर", "Filter")}
          </Button>
        </div>

        <div className="p-4">
          {loading ? (
            <SkeletonTable rows={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              emoji="👨‍🎓"
              title={bi("कुनै विद्यार्थी भेटिएन", "No students found")}
              description={bi(
                "खोज शब्द वा फिल्टर परिवर्तन गरेर पुनः प्रयास गर्नुहोस्।",
                "Try a different search term or clear the grade filter.",
              )}
              action={
                <Button variant="outline" className="rounded-full" onClick={() => { setQuery(""); setGrade("all"); }}>
                  {bi("फिल्टर हटाउनुहोस्", "Clear filters")}
                </Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{bi("विद्यार्थी", "Student")}</TableHead>
                    <TableHead className="hidden sm:table-cell">{bi("कक्षा", "Class")}</TableHead>
                    <TableHead className="hidden md:table-cell">{bi("अभिभावक", "Guardian")}</TableHead>
                    <TableHead className="hidden lg:table-cell">{bi("हाजिरी", "Attendance")}</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead className="text-right">{bi("शुल्क", "Fees")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow
                      key={s.id}
                      onClick={() => setSelected(s)}
                      className="cursor-pointer transition-colors hover:bg-accent/40"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarImage src={s.avatar} alt={s.name} />
                            <AvatarFallback>{s.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="np truncate text-sm font-semibold">{lang === "np" ? s.nameNp : s.name}</p>
                            <p className="text-[11px] text-muted-foreground">{s.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">
                        {s.grade}
                        {s.section} · Roll {s.roll}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        <p>{s.guardian}</p>
                        <p className="text-[11px] text-muted-foreground">{s.phone}</p>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell w-40">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={s.attendance} tone={s.attendance > 90 ? "success" : "warning"} />
                          <span className="text-xs tabular-nums">{s.attendance}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusPill tone={s.gpa >= 3.5 ? "green" : s.gpa >= 3 ? "amber" : "red"}>{s.gpa.toFixed(2)}</StatusPill>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {s.dueFee === 0 ? (
                          <StatusPill tone="green" emoji="✅">{bi("भुक्तानी", "Paid")}</StatusPill>
                        ) : (
                          <StatusPill tone="red">{npr(s.dueFee)}</StatusPill>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </Card>

      <StudentDrawer student={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function StudentDrawer({ student, onClose }: { student: Student | null; onClose: () => void }) {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  if (!student) return null;

  return (
    <Sheet open={!!student} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="gradient-hero p-6 text-primary-foreground">
          <SheetTitle className="sr-only">{student.name}</SheetTitle>
          <SheetDescription className="sr-only">Digital student profile</SheetDescription>
          <div className="flex items-center gap-4">
            <Avatar className="size-20 border-4 border-primary-foreground/25">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>{student.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="np text-xl font-bold">{lang === "np" ? student.nameNp : student.name}</p>
              <p className="text-xs opacity-85">
                {student.id} · {bi("कक्षा", "Grade")} {student.grade}
                {student.section} · {bi("रोल", "Roll")} {student.roll}
              </p>
              <p className="mt-2 inline-block rounded-full bg-primary-foreground/15 px-2.5 py-1 text-[11px] font-semibold">
                🇳🇵 {bi("शैक्षिक वर्ष", "Academic year")} २०८३ BS
              </p>
            </div>
          </div>
        </SheetHeader>

        <div className="grid grid-cols-2 gap-3 px-6 sm:grid-cols-4">
          {[
            { emoji: "✅", label: bi("हाजिरी", "Attendance"), value: `${student.attendance}%` },
            { emoji: "🎓", label: "GPA", value: student.gpa.toFixed(2) },
            { emoji: "💰", label: bi("बाँकी", "Dues"), value: student.dueFee ? npr(student.dueFee) : "—" },
            { emoji: "📝", label: bi("गृहकार्य", "Homework"), value: "3" },
          ].map((s) => (
            <div key={s.label} className="surface p-3 text-center">
              <p className="text-lg">{s.emoji}</p>
              <p className="mt-1 text-sm font-bold">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="profile" className="p-6">
          <TabsList className="flex w-full flex-wrap">
            <TabsTrigger value="profile">{bi("प्रोफाइल", "Profile")}</TabsTrigger>
            <TabsTrigger value="results">{bi("नतिजा", "Results")}</TabsTrigger>
            <TabsTrigger value="homework">{bi("गृहकार्य", "Homework")}</TabsTrigger>
            <TabsTrigger value="badges">{bi("उपलब्धि", "Achievements")}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 space-y-3">
            {[
              [bi("पूरा नाम", "Full name"), student.name],
              [bi("नेपाली नाम", "Nepali name"), student.nameNp],
              [bi("लिङ्ग", "Gender"), student.gender],
              [bi("अभिभावक", "Guardian"), `${student.guardian} · ${student.phone}`],
              [bi("ठेगाना", "Address"), student.address],
              [bi("हाउस", "House"), student.house],
              [bi("भर्ना मिति", "Admission date"), "१ बैशाख २०८३ BS · 14 April 2026 AD"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-border pb-2 text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="np text-right font-medium">{v}</span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="results" className="mt-4 space-y-2">
            {marksheet.slice(0, 5).map((m) => (
              <div key={m.subject} className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm">
                <span className="np">{lang === "np" ? m.np : m.subject}</span>
                <span className="flex items-center gap-2">
                  <span className="tabular-nums text-muted-foreground">
                    {m.obtained}/{m.full}
                  </span>
                  <StatusPill tone="green">{m.grade}</StatusPill>
                </span>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="homework" className="mt-4 space-y-2">
            {homework.slice(0, 3).map((h) => (
              <div key={h.id} className="rounded-xl border border-border p-3">
                <p className="text-sm font-medium">{h.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {h.subject} · {bi("बुझाउने", "Due")} {h.due} BS
                </p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="badges" className="mt-4 space-y-2">
            {achievements.map((a) => (
              <div key={a.title} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="text-2xl">{a.emoji}</span>
                <div>
                  <p className="np text-sm font-medium">{lang === "np" ? a.titleNp : a.title}</p>
                  <p className="text-[11px] text-muted-foreground">{a.date} BS</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 border-t border-border p-4">
          <Button className="flex-1 rounded-full" onClick={() => toast.success("🎉 Profile saved successfully")}>
            {bi("सुरक्षित", "Save")}
          </Button>
          <Button variant="outline" className="flex-1 rounded-full" onClick={onClose}>
            {bi("बन्द गर्नुहोस्", "Close")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AddStudentDialog() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full gradient-hero shadow-glow">
          <UserPlus className="size-4" /> {bi("विद्यार्थी थप्नुहोस्", "Add student")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>👨‍🎓 {bi("नयाँ विद्यार्थी", "New student")}</DialogTitle>
          <DialogDescription>
            {bi("आधारभूत विवरण भर्नुहोस्। यो प्रस्तुतीकरण मात्र हो।", "Fill the basic details. This is a presentation-only form.")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{bi("नाम (अंग्रेजी)", "Name (English)")}</Label>
            <Input placeholder="Aarav Sharma" />
          </div>
          <div className="space-y-1.5">
            <Label>{bi("नाम (नेपाली)", "Name (Nepali)")}</Label>
            <Input className="np" placeholder="आरव शर्मा" />
          </div>
          <div className="space-y-1.5">
            <Label>{bi("कक्षा", "Grade")}</Label>
            <Select defaultValue="8">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["6", "7", "8", "9", "10", "11", "12"].map((g) => (
                  <SelectItem key={g} value={g}>Grade {g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{bi("सेक्सन", "Section")}</Label>
            <Select defaultValue="A">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{bi("जन्म मिति (वि.सं.)", "Date of birth (BS)")}</Label>
            <Input placeholder="२०६८-०५-१२" className="np" />
          </div>
          <div className="space-y-1.5">
            <Label>{bi("अभिभावक सम्पर्क", "Guardian phone")}</Label>
            <Input placeholder="98XXXXXXXX" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-full">{bi("रद्द", "Cancel")}</Button>
          <Button className="rounded-full" onClick={() => toast.success("🎉 Student added successfully")}>
            {bi("विद्यार्थी थप्नुहोस्", "Add student")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { Counter };
