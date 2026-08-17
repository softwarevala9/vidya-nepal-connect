import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, LoadingSwitch, PageHeader, ProgressBar, SectionCard, SkeletonCardGrid, StatCard, StatusPill } from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { teachers, timetable, type Teacher } from "@/data/seed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/teachers")({
  head: () => ({
    meta: [
      { title: "Teachers — Faculty Directory | Vidya ERP" },
      { name: "description", content: "Faculty directory with subject allocation, class load, experience and teaching performance for every teacher." },
      { property: "og:title", content: "Teachers — Vidya ERP" },
      { property: "og:description", content: "Faculty directory with subject allocation, class load and performance." },
    ],
  }),
  component: TeachersPage,
});

function TeachersPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Teacher | null>(null);

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        emoji="👩‍🏫"
        title={bi("शिक्षक व्यवस्थापन", "Teacher management")}
        subtitle={bi("शिक्षक प्रोफाइल, विषय बाँडफाँट र कक्षा भार।", "Faculty profiles, subject allocation and class workload.")}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <AddTeacherDialog />
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard emoji="👩‍🏫" label={bi("कुल शिक्षक", "Total teachers")} value={48} tone="primary" />
        <StatCard emoji="🎓" label={bi("स्नातकोत्तर", "Master's degree")} value={31} tone="info" />
        <StatCard emoji="⭐" label={bi("औसत मूल्याङ्कन", "Average rating")} value={4.65} decimals={2} tone="success" />
        <StatCard emoji="📅" label={bi("साप्ताहिक पिरियड", "Weekly periods")} value={288} tone="chart-5" />
      </div>

      {loading ? (
        <div className="mt-6">
          <SkeletonCardGrid count={6} />
        </div>
      ) : teachers.length === 0 ? (
        <div className="mt-6">
          <EmptyState emoji="👩‍🏫" title={bi("कुनै शिक्षक छैन", "No teachers yet")} description={bi("शिक्षक थपेपछि यहाँ देखिनेछ।", "Add your first teacher to see them here.")} />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {teachers.map((t) => (
            <Card
              key={t.id}
              onClick={() => setSelected(t)}
              className="animate-rise group cursor-pointer gap-0 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-14 ring-2 ring-accent">
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback>{t.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="np truncate text-sm font-bold">{lang === "np" ? t.nameNp : t.name}</p>
                  <p className="np text-xs text-muted-foreground">{lang === "np" ? t.subjectNp : t.subject}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{t.id}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {t.classes.split(", ").map((c) => (
                  <span key={c} className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    {c}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">🎯 {t.experience}</span>
                <StatusPill tone="green" emoji="⭐">{t.rating.toFixed(1)}</StatusPill>
              </div>
            </Card>
          ))}
        </div>
      )}

      <SectionCard className="mt-6" title={bi("विषय बाँडफाँट भार", "Subject allocation load")} description={bi("साप्ताहिक पिरियड प्रतिशत", "Weekly period utilisation")}>
        <div className="space-y-4">
          {teachers.map((t, i) => (
            <div key={t.id}>
              <div className="mb-1.5 flex items-center justify-between text-xs font-medium">
                <span className="np">{lang === "np" ? t.nameNp : t.name}</span>
                <span className="text-muted-foreground">{[92, 78, 85, 64, 71, 88][i]}%</span>
              </div>
              <ProgressBar value={[92, 78, 85, 64, 71, 88][i] ?? 70} tone={i % 2 ? "info" : "primary"} />
            </div>
          ))}
        </div>
      </SectionCard>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-lg">
          {selected ? (
            <>
              <SheetHeader className="gradient-ink p-6 text-sidebar-foreground">
                <SheetTitle className="sr-only">{selected.name}</SheetTitle>
                <SheetDescription className="sr-only">Teacher profile</SheetDescription>
                <div className="flex items-center gap-4">
                  <Avatar className="size-18 border-4 border-sidebar-border">
                    <AvatarImage src={selected.avatar} alt={selected.name} />
                    <AvatarFallback>{selected.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="np text-xl font-bold">{lang === "np" ? selected.nameNp : selected.name}</p>
                    <p className="np text-xs opacity-80">{lang === "np" ? selected.subjectNp : selected.subject}</p>
                    <p className="mt-2 inline-block rounded-full bg-sidebar-accent px-2.5 py-1 text-[11px]">
                      🎓 {selected.experience} · ⭐ {selected.rating.toFixed(1)}
                    </p>
                  </div>
                </div>
              </SheetHeader>
              <div className="space-y-4 p-6">
                <div className="space-y-2">
                  {[
                    [bi("इमेल", "Email"), selected.email],
                    [bi("फोन", "Phone"), selected.phone],
                    [bi("कक्षा", "Classes"), selected.classes],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-border pb-2 text-sm">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="text-right font-medium break-all">{v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold">📅 {bi("आजको तालिका", "Today's schedule")}</p>
                  <ul className="space-y-2">
                    {timetable.periods.slice(0, 4).map((p, i) => (
                      <li key={p.period} className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm">
                        <span>
                          {bi("पिरियड", "Period")} {p.period} · {timetable.rooms[i]}
                        </span>
                        <span className="text-xs text-muted-foreground">{p.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full rounded-full" onClick={() => toast.success("✅ Teacher record updated")}>
                  {bi("प्रोफाइल अद्यावधिक", "Update profile")}
                </Button>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function AddTeacherDialog() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full gradient-hero shadow-glow">👩‍🏫 {bi("शिक्षक थप्नुहोस्", "Add teacher")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>👩‍🏫 {bi("नयाँ शिक्षक", "New teacher")}</DialogTitle>
          <DialogDescription>{bi("शिक्षकको आधारभूत विवरण।", "Basic faculty details.")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{bi("नाम", "Full name")}</Label>
            <Input placeholder="Sarita Poudel" />
          </div>
          <div className="space-y-1.5">
            <Label>{bi("विषय", "Subject")}</Label>
            <Input placeholder="Mathematics" />
          </div>
          <div className="space-y-1.5">
            <Label>{bi("अनुभव", "Experience")}</Label>
            <Input placeholder="8 years" />
          </div>
          <div className="space-y-1.5">
            <Label>{bi("सम्पर्क", "Phone")}</Label>
            <Input placeholder="98XXXXXXXX" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-full">{bi("रद्द", "Cancel")}</Button>
          <Button className="rounded-full" onClick={() => toast.success("🎉 Teacher added successfully")}>
            {bi("थप्नुहोस्", "Add teacher")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
