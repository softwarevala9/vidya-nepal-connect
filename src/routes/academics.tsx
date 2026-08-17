import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, LoadingSwitch, PageHeader, SectionCard, SkeletonCardGrid, StatCard, StatusPill } from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { classes, subjects, teachers } from "@/data/seed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/academics")({
  head: () => ({
    meta: [
      { title: "Academics — Classes, Sections & Subjects | Vidya ERP" },
      { name: "description", content: "Manage academic years, classes, sections, subjects, departments and teacher allocation for the whole school." },
      { property: "og:title", content: "Academics — Vidya ERP" },
      { property: "og:description", content: "Classes, sections, subjects, departments and teacher allocation." },
    ],
  }),
  component: AcademicsPage,
});

function AcademicsPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        emoji="🏫"
        title={bi("शैक्षिक व्यवस्थापन", "Academics")}
        subtitle={bi("शैक्षिक वर्ष २०८३ वि.सं. — कक्षा, सेक्सन, विषय र विभाग।", "Academic year 2083 BS — classes, sections, subjects and departments.")}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <Button className="rounded-full gradient-hero shadow-glow" onClick={() => toast.success("✅ Academic year 2083 BS is active")}>
              📅 {bi("शैक्षिक वर्ष", "Academic year")} २०८३
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard emoji="🏫" label={bi("कक्षा", "Classes")} value={24} tone="primary" />
        <StatCard emoji="🔤" label={bi("सेक्सन", "Sections")} value={41} tone="info" />
        <StatCard emoji="📚" label={bi("विषय", "Subjects")} value={18} tone="chart-5" />
        <StatCard emoji="🏛️" label={bi("विभाग", "Departments")} value={7} tone="success" />
      </div>

      <Tabs defaultValue="classes" className="mt-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="classes">🏫 {bi("कक्षा", "Classes")}</TabsTrigger>
          <TabsTrigger value="subjects">📚 {bi("विषय", "Subjects")}</TabsTrigger>
          <TabsTrigger value="allocation">👩‍🏫 {bi("शिक्षक बाँडफाँट", "Teacher allocation")}</TabsTrigger>
          <TabsTrigger value="curriculum">🧭 {bi("पाठ्यक्रम", "Curriculum")}</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="mt-5">
          {loading ? (
            <SkeletonCardGrid count={8} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {classes.map((c) => (
                <Card key={`${c.grade}${c.section}`} className="animate-rise group gap-0 overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="gradient-hero px-5 py-4 text-primary-foreground">
                    <p className="text-[11px] font-semibold tracking-widest uppercase opacity-85">{bi("कक्षा", "Grade")}</p>
                    <p className="text-3xl font-bold">
                      {c.grade}
                      <span className="ml-1 text-lg opacity-85">{c.section}</span>
                    </p>
                    <p className="mt-1 text-[11px] opacity-85">📍 {c.room}</p>
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-border border-b border-border text-center">
                    {[
                      { emoji: "👨‍🎓", v: c.students },
                      { emoji: "👩‍🏫", v: c.teachers },
                      { emoji: "📚", v: c.subjects },
                    ].map((x, i) => (
                      <div key={i} className="py-3">
                        <p className="text-sm">{x.emoji}</p>
                        <p className="text-sm font-bold">{x.v}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between px-5 py-3">
                    <span className="text-[11px] text-muted-foreground">{bi("कक्षा शिक्षक", "Class teacher")}</span>
                    <span className="text-[11px] font-semibold">{c.incharge}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="subjects" className="mt-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {subjects.map((s) => (
              <Card key={s.code} className="animate-rise gap-0 p-5 transition-all hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-accent text-xl">{s.emoji}</span>
                  <StatusPill tone="blue">{s.code}</StatusPill>
                </div>
                <p className="np mt-4 text-sm font-bold">{lang === "np" ? s.nameNp : s.name}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {bi("पूर्णाङ्क", "Full marks")} {s.full} · {s.credit} {bi("क्रेडिट", "credits")}
                </p>
                <p className="mt-3 text-[11px] font-medium">👩‍🏫 {s.teacher}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="allocation" className="mt-5">
          <SectionCard title={bi("शिक्षक–विषय बाँडफाँट", "Teacher – subject allocation")}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{bi("शिक्षक", "Teacher")}</TableHead>
                    <TableHead>{bi("विषय", "Subject")}</TableHead>
                    <TableHead className="hidden sm:table-cell">{bi("कक्षा", "Classes")}</TableHead>
                    <TableHead className="text-right">{bi("अनुभव", "Experience")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((t) => (
                    <TableRow key={t.id} className="transition-colors hover:bg-accent/40">
                      <TableCell className="np font-medium">{lang === "np" ? t.nameNp : t.name}</TableCell>
                      <TableCell className="np">{lang === "np" ? t.subjectNp : t.subject}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{t.classes}</TableCell>
                      <TableCell className="text-right text-sm">{t.experience}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="curriculum" className="mt-5">
          <SectionCard title={bi("पाठ्यक्रम ढाँचा", "Curriculum framework")} description={bi("पाठ्यक्रम विकास केन्द्र (CDC) अनुरूप", "Aligned to Nepal's Curriculum Development Centre")}>
            <EmptyState
              emoji="🧭"
              title={bi("पाठ्यक्रम अपलोड बाँकी", "Curriculum not uploaded yet")}
              description={bi("कक्षा अनुसारको पाठ्यक्रम अपलोड गरेपछि यहाँ देखिनेछ।", "Upload the CDC curriculum for each grade and it will be listed here.")}
              action={<Button className="rounded-full" onClick={() => toast.success("📚 Curriculum upload panel opened")}>{bi("पाठ्यक्रम अपलोड", "Upload curriculum")}</Button>}
            />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
