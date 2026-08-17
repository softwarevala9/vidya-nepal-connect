import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { LoadingSwitch, PageHeader, SectionCard, SkeletonCardGrid, StatCard, StatusPill } from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { calendarEvents, eventTypeMeta, type CalendarEvent } from "@/data/seed";
import {
  BS_MONTHS_EN,
  BS_MONTHS_NP,
  TODAY_BS,
  WEEKDAYS_EN,
  WEEKDAYS_NP,
  bsToAd,
  daysInBsMonth,
  formatAd,
  toNepaliDigits,
} from "@/lib/bs-date";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Academic Calendar — Bikram Sambat Events & Holidays | Vidya ERP" },
      { name: "description", content: "Bikram Sambat academic calendar with exams, holidays, meetings, sports and cultural events." },
      { property: "og:title", content: "Academic Calendar — Vidya ERP" },
      { property: "og:description", content: "BS calendar with exams, holidays and school events." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState(TODAY_BS.year);
  const [month, setMonth] = useState(TODAY_BS.month);
  const [events, setEvents] = useState<CalendarEvent[]>(calendarEvents);
  const [selected, setSelected] = useState<number | null>(null);

  const total = daysInBsMonth(year, month);
  const firstWeekday = useMemo(() => bsToAd({ year, month, day: 1 }).getUTCDay(), [year, month]);
  const isCurrentMonth = year === TODAY_BS.year && month === TODAY_BS.month;

  const byDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    events.forEach((e) => map.set(e.day, [...(map.get(e.day) ?? []), e]));
    return map;
  }, [events]);

  const shift = (dir: number) => {
    let m = month + dir;
    let y = year;
    if (m > 12) { m = 1; y += 1; }
    if (m < 1) { m = 12; y -= 1; }
    setMonth(m);
    setYear(y);
    setSelected(null);
  };

  const holidays = events.filter((e) => e.type === "holiday").length;
  const exams = events.filter((e) => e.type === "exam").length;
  const selectedEvents = selected ? (byDay.get(selected) ?? []) : [];

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        illus="calendar"
        emoji="📆"
        title={bi("शैक्षिक पात्रो", "Academic calendar")}
        subtitle={bi(
          "विक्रम सम्बत् पात्रोमा परीक्षा, बिदा, भेटघाट र सांस्कृतिक कार्यक्रम।",
          "Bikram Sambat calendar with exams, holidays, meetings and cultural events.",
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <NewEventDialog
              onCreate={(e) => {
                setEvents((x) => [...x, e]);
                toast.success(bi("कार्यक्रम थपियो", "Event added"), { description: e.title });
              }}
            />
          </>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard illus="calendar" emoji="📆" label={bi("यस महिनाका कार्यक्रम", "Events this month")} value={events.length} tone="primary" />
          <StatCard illus="exams" emoji="📝" label={bi("परीक्षा", "Examination days")} value={exams} tone="warning" />
          <StatCard illus="school" emoji="🪔" label={bi("बिदा", "Holidays")} value={holidays} tone="info" />
          <StatCard illus="hr" emoji="👨‍👩‍👧" label={bi("भेटघाट", "Meetings")} value={events.filter((e) => e.type === "meeting").length} tone="success" />
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title={`${lang === "np" ? BS_MONTHS_NP[month - 1] : BS_MONTHS_EN[month - 1]} ${lang === "np" ? toNepaliDigits(year) : year} ${lang === "np" ? "" : "BS"}`}
          description={bi("दिनमा क्लिक गरी कार्यक्रम हेर्नुहोस्", "Click a day to see its events")}
          action={
            <div className="flex items-center gap-1">
              <Button size="icon" variant="outline" className="size-8" onClick={() => shift(-1)} aria-label="Previous month"><ChevronLeft className="size-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => { setYear(TODAY_BS.year); setMonth(TODAY_BS.month); }}>{bi("आज", "Today")}</Button>
              <Button size="icon" variant="outline" className="size-8" onClick={() => shift(1)} aria-label="Next month"><ChevronRight className="size-4" /></Button>
            </div>
          }
        >
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {(lang === "np" ? WEEKDAYS_NP : WEEKDAYS_EN).map((d) => (
              <div key={d} className="np pb-2 text-[11px] font-semibold text-muted-foreground">{d}</div>
            ))}
            {Array.from({ length: firstWeekday }).map((_, i) => <div key={`pad-${i}`} />)}
            {Array.from({ length: total }).map((_, i) => {
              const day = i + 1;
              const dayEvents = byDay.get(day) ?? [];
              const isToday = isCurrentMonth && day === TODAY_BS.day;
              const isSaturday = (firstWeekday + i) % 7 === 6;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelected(day)}
                  className={cn(
                    "group relative aspect-square rounded-xl border border-border/70 p-1.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lift",
                    isToday && "border-primary bg-primary/10",
                    isSaturday && !isToday && "bg-destructive/5",
                  )}
                >
                  <span className={cn("np text-xs font-semibold", isSaturday && "text-destructive", isToday && "text-primary")}>
                    {lang === "np" ? toNepaliDigits(day) : day}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-0.5">
                    {dayEvents.slice(0, 3).map((e, idx) => (
                      <span key={idx} className="text-[10px] leading-none">{eventTypeMeta[e.type].emoji}</span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title={bi("आगामी कार्यक्रम", "Upcoming events")}>
          <ul className="space-y-3">
            {[...events].sort((a, b) => a.day - b.day).slice(0, 7).map((e, i) => {
              const meta = eventTypeMeta[e.type];
              return (
                <li key={`${e.day}-${i}`} className="animate-rise flex items-start gap-3 rounded-xl border border-border p-3 transition-all hover:-translate-y-0.5 hover:shadow-lift">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-base">{meta.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="np text-sm font-semibold">{lang === "np" ? e.titleNp : e.title}</p>
                    <p className="np text-[11px] text-muted-foreground">
                      {lang === "np" ? toNepaliDigits(e.day) : e.day} {lang === "np" ? BS_MONTHS_NP[month - 1] : BS_MONTHS_EN[month - 1]}
                      {e.time ? ` · ${e.time}` : ""}
                    </p>
                  </div>
                  <StatusPill tone={meta.tone === "primary" ? "violet" : meta.tone}>
                    <span className="np">{lang === "np" ? meta.labelNp : meta.label}</span>
                  </StatusPill>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>

      <SectionCard className="mt-6" title={bi("कार्यक्रम प्रकार", "Event legend")}>
        <div className="flex flex-wrap gap-2">
          {Object.entries(eventTypeMeta).map(([key, meta]) => (
            <StatusPill key={key} tone={meta.tone === "primary" ? "violet" : meta.tone} emoji={meta.emoji}>
              <span className="np">{lang === "np" ? meta.labelNp : meta.label}</span>
            </StatusPill>
          ))}
        </div>
      </SectionCard>

      <Sheet open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="np">
              {selected ? `${lang === "np" ? toNepaliDigits(selected) : selected} ${lang === "np" ? BS_MONTHS_NP[month - 1] : BS_MONTHS_EN[month - 1]} ${lang === "np" ? toNepaliDigits(year) : year}` : ""}
            </SheetTitle>
            <SheetDescription>{selected ? `${formatAd(bsToAd({ year, month, day: selected }))} AD` : ""}</SheetDescription>
          </SheetHeader>
          <div className="space-y-3 px-4 pb-6">
            {selectedEvents.length === 0 ? (
              <Card className="animate-pop border-dashed p-8 text-center">
                <p className="text-4xl">🗓️</p>
                <p className="mt-3 text-sm font-semibold">{bi("कुनै कार्यक्रम छैन", "No events scheduled")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{bi("यो दिन नियमित कक्षा सञ्चालन हुनेछ।", "Regular classes run on this day.")}</p>
              </Card>
            ) : (
              selectedEvents.map((e, i) => {
                const meta = eventTypeMeta[e.type];
                return (
                  <Card key={i} className="card-3d animate-rise gap-0 p-4">
                    <div className="flex items-start justify-between">
                      <span className="text-2xl">{meta.emoji}</span>
                      <StatusPill tone={meta.tone === "primary" ? "violet" : meta.tone}>
                        <span className="np">{lang === "np" ? meta.labelNp : meta.label}</span>
                      </StatusPill>
                    </div>
                    <p className="np mt-3 text-sm font-semibold">{lang === "np" ? e.titleNp : e.title}</p>
                    {e.time ? <p className="mt-1 text-[11px] text-muted-foreground">🕐 {e.time}</p> : null}
                    <Button size="sm" variant="outline" className="mt-4" onClick={() => toast.success(bi("सम्झना सेट भयो", "Reminder set"))}>
                      🔔 {bi("सम्झना", "Remind me")}
                    </Button>
                  </Card>
                );
              })
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function NewEventDialog({ onCreate }: { onCreate: (e: CalendarEvent) => void }) {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("18");
  const [time, setTime] = useState("10:00");

  const submit = () => {
    if (!title.trim()) {
      toast.error(bi("शीर्षक आवश्यक छ", "Title is required"));
      return;
    }
    onCreate({ day: Number(day) || 1, title: title.trim(), titleNp: title.trim(), type: "school", time });
    setTitle("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><CalendarPlus className="size-4" /> {bi("कार्यक्रम थप्नुहोस्", "Add event")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bi("नयाँ कार्यक्रम", "New event")}</DialogTitle>
          <DialogDescription>{bi("विक्रम सम्बत् मितिमा कार्यक्रम थप्नुहोस्।", "Schedule an event on the Bikram Sambat calendar.")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ev-title">{bi("शीर्षक", "Title")}</Label>
            <Input id="ev-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={bi("वार्षिकोत्सव", "Annual day rehearsal")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ev-day">{bi("गते", "Day")}</Label>
              <Input id="ev-day" type="number" min={1} max={32} value={day} onChange={(e) => setDay(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ev-time">{bi("समय", "Time")}</Label>
              <Input id="ev-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{bi("रद्द", "Cancel")}</Button>
          <Button onClick={submit}>{bi("थप्नुहोस्", "Add event")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
