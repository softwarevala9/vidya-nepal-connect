import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BedDouble, Plus, UtensilsCrossed } from "lucide-react";
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
} from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { hostelRooms, npr, students } from "@/data/seed";
import { Illus } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const Route = createFileRoute("/hostel")({
  head: () => ({
    meta: [
      { title: "Hostel — Rooms, Wardens & Mess Menu | Vidya ERP" },
      { name: "description", content: "Manage hostel blocks, bed allotment, warden duty and the weekly Nepali mess menu." },
      { property: "og:title", content: "Hostel — Vidya ERP" },
      { property: "og:description", content: "Blocks, bed allotment, warden roster and weekly mess menu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HostelPage,
});

type Room = (typeof hostelRooms)[number];

const mess = [
  { day: "आइतबार", dayEn: "Sunday", meal: "दाल भात तरकारी, अचार", mealEn: "Dal bhat, seasonal tarkari, achar", emoji: "🍛" },
  { day: "सोमबार", dayEn: "Monday", meal: "रोटी, आलु तामा, सलाद", mealEn: "Roti, aloo tama, salad", emoji: "🫓" },
  { day: "मंगलबार", dayEn: "Tuesday", meal: "मःम (भेज/चिकेन)", mealEn: "Momo (veg / chicken)", emoji: "🥟" },
  { day: "बुधबार", dayEn: "Wednesday", meal: "दाल भात, कुखुराको मासु", mealEn: "Dal bhat with chicken curry", emoji: "🍗" },
  { day: "बिहिबार", dayEn: "Thursday", meal: "चाउमिन, तरकारी सुप", mealEn: "Chowmein with veg soup", emoji: "🍜" },
  { day: "शुक्रबार", dayEn: "Friday", meal: "दाल भात, माछा", mealEn: "Dal bhat with fish", emoji: "🐟" },
  { day: "शनिबार", dayEn: "Saturday", meal: "खिर, सेल रोटी", mealEn: "Kheer and sel roti", emoji: "🍮" },
];

function HostelPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>(hostelRooms);
  const [active, setActive] = useState<Room | null>(null);

  const beds = rooms.reduce((s, r) => s + r.beds, 0);
  const occupied = rooms.reduce((s, r) => s + r.occupied, 0);
  const vacant = beds - occupied;

  const allot = (room: string) => {
    setRooms((r) => r.map((x) => (x.room === room ? { ...x, occupied: Math.min(x.beds, x.occupied + 1) } : x)));
    setActive(null);
    toast.success(bi("बेड आवंटन गरियो", "Bed allotted"), { description: room });
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        illus="hostel"
        emoji="🏠"
        title={bi("छात्रावास", "Hostel")}
        subtitle={bi(
          "ब्लक, बेड आवंटन, वार्डेन ड्युटी र साप्ताहिक मेस मेनु।",
          "Blocks, bed allotment, warden duty roster and the weekly mess menu.",
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <Button variant="outline" size="sm" onClick={() => toast.success(bi("राति हाजिरी सुरु भयो", "Night roll call started"))}>
              🌙 {bi("राति हाजिरी", "Night roll call")}
            </Button>
            <NewRoomDialog
              onCreate={(r) => {
                setRooms((p) => [r, ...p]);
                toast.success(bi("कोठा थपियो", "Room added"), { description: r.room });
              }}
            />
          </>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard illus="hostel" emoji="🛏️" label={bi("कुल बेड", "Total beds")} value={beds} tone="primary" />
          <StatCard illus="students" emoji="🧑‍🎓" label={bi("आवासी विद्यार्थी", "Residents")} value={occupied} tone="info" />
          <StatCard illus="attendance" emoji="✅" label={bi("खाली बेड", "Vacant beds")} value={vacant} tone="success" />
          <StatCard illus="fees" emoji="💰" label={bi("मासिक शुल्क", "Monthly hostel fee")} value={9500} prefix="रु " tone="warning" />
        </div>
      )}

      <Tabs defaultValue="rooms" className="mt-6">
        <TabsList>
          <TabsTrigger value="rooms">🛏️ {bi("कोठा", "Rooms")}</TabsTrigger>
          <TabsTrigger value="residents">🧑‍🎓 {bi("आवासी", "Residents")}</TabsTrigger>
          <TabsTrigger value="mess">🍛 {bi("मेस मेनु", "Mess menu")}</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="mt-4">
          {rooms.length === 0 ? (
            <EmptyState illus="hostel" emoji="🛏️" title={bi("कोठा छैन", "No rooms yet")} description={bi("पहिलो कोठा दर्ता गर्नुहोस्।", "Register the first hostel room.")} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {rooms.map((r) => {
                const full = r.occupied >= r.beds;
                return (
                  <Card
                    key={r.room}
                    onClick={() => setActive(r)}
                    className="card-3d sheen animate-rise cursor-pointer gap-0 p-5 transition-all hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="flex items-start justify-between">
                      <Illus name="hostel" size={30} />
                      <StatusPill tone={full ? "red" : r.occupied === 0 ? "blue" : "green"}>
                        {full ? bi("भरिएको", "Full") : `${r.beds - r.occupied} ${bi("खाली", "free")}`}
                      </StatusPill>
                    </div>
                    <p className="mt-3 text-sm font-semibold">{r.room} · {r.type}</p>
                    <p className="text-[11px] text-muted-foreground">{r.block}</p>
                    <p className="text-[11px] text-muted-foreground">🧑‍💼 {r.warden}</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      {Array.from({ length: r.beds }).map((_, i) => (
                        <span key={i} className={`h-2.5 flex-1 rounded-full ${i < r.occupied ? "bg-primary" : "bg-muted"}`} />
                      ))}
                    </div>
                    <p className="mt-2 text-[11px] text-muted-foreground">{r.occupied}/{r.beds} {bi("बेड प्रयोगमा", "beds occupied")}</p>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="residents" className="mt-4">
          <SectionCard title={bi("आवासी विद्यार्थी", "Resident students")} description={bi("राति हाजिरी — १७ असोज २०८३", "Night attendance — 17 Ashwin 2083 BS")}>
            <ul className="space-y-3">
              {students.slice(0, 6).map((s, i) => (
                <li key={s.id} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-all hover:-translate-y-0.5 hover:shadow-card">
                  <Avatar className="size-10"><AvatarImage src={s.avatar} alt={s.name} /><AvatarFallback>{s.name.charAt(0)}</AvatarFallback></Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="np text-sm font-semibold">{lang === "np" ? s.nameNp : s.name}</p>
                    <p className="text-[11px] text-muted-foreground">🛏️ {hostelRooms[i % hostelRooms.length]?.room} · {bi("कक्षा", "Grade")} {s.grade}{s.section}</p>
                  </div>
                  <StatusPill tone={i === 4 ? "amber" : "green"}>{i === 4 ? bi("बिदामा", "On leave") : bi("उपस्थित", "Present")}</StatusPill>
                </li>
              ))}
            </ul>
          </SectionCard>
        </TabsContent>

        <TabsContent value="mess" className="mt-4">
          <SectionCard
            title={bi("साप्ताहिक मेस मेनु", "Weekly mess menu")}
            description={bi("बिहान ७:३० · दिउँसो १:०० · बेलुका ७:३०", "Breakfast 7:30 · Lunch 1:00 · Dinner 7:30")}
            action={<Button size="sm" variant="outline" onClick={() => toast.success(bi("मेनु प्रकाशित भयो", "Menu published to parents"))}><UtensilsCrossed className="size-4" /> {bi("प्रकाशित", "Publish")}</Button>}
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {mess.map((m) => (
                <Card key={m.dayEn} className="card-3d animate-rise gap-0 p-4">
                  <span className="text-2xl">{m.emoji}</span>
                  <p className="np mt-2 text-sm font-semibold">{lang === "np" ? m.day : m.dayEn}</p>
                  <p className="np mt-1 text-[11px] text-muted-foreground">{lang === "np" ? m.meal : m.mealEn}</p>
                </Card>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {active ? (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2"><BedDouble className="size-4" /> {active.room}</SheetTitle>
                <SheetDescription>{active.block} · {active.type}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{bi("भरिएको", "Occupancy")}</span>
                    <span className="font-semibold">{active.occupied}/{active.beds}</span>
                  </div>
                  <div className="mt-3"><ProgressBar value={(active.occupied / active.beds) * 100} tone={active.occupied >= active.beds ? "warning" : "success"} /></div>
                  <p className="mt-3 text-xs text-muted-foreground">🧑‍💼 {bi("वार्डेन", "Warden")}: {active.warden}</p>
                  <p className="mt-1 text-xs text-muted-foreground">💰 {bi("मासिक शुल्क", "Monthly fee")}: {npr(9500)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="flex-1" disabled={active.occupied >= active.beds} onClick={() => allot(active.room)}>
                    ➕ {bi("बेड आवंटन", "Allot a bed")}
                  </Button>
                  <Button variant="outline" onClick={() => toast.success(bi("मर्मत अनुरोध पठाइयो", "Maintenance request raised"), { description: active.room })}>
                    🛠️ {bi("मर्मत", "Maintenance")}
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

function NewRoomDialog({ onCreate }: { onCreate: (r: Room) => void }) {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [open, setOpen] = useState(false);
  const [room, setRoom] = useState("");
  const [block, setBlock] = useState("Annapurna Block");
  const [beds, setBeds] = useState("4");

  const submit = () => {
    if (!room.trim()) {
      toast.error(bi("कोठा नम्बर आवश्यक छ", "Room number is required"));
      return;
    }
    onCreate({ block, room: room.trim(), beds: Number(beds) || 2, occupied: 0, warden: "Sabitri Neupane", type: "Boys" });
    setOpen(false);
    setRoom("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="size-4" /> {bi("कोठा थप्नुहोस्", "Add room")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bi("नयाँ कोठा", "New hostel room")}</DialogTitle>
          <DialogDescription>{bi("ब्लक र बेड संख्या तोक्नुहोस्।", "Choose the block and number of beds.")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="hs-room">{bi("कोठा", "Room no.")}</Label>
              <Input id="hs-room" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="A-103" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hs-beds">{bi("बेड", "Beds")}</Label>
              <Input id="hs-beds" type="number" value={beds} onChange={(e) => setBeds(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hs-block">{bi("ब्लक", "Block")}</Label>
            <Input id="hs-block" value={block} onChange={(e) => setBlock(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{bi("रद्द", "Cancel")}</Button>
          <Button onClick={submit}>{bi("थप्नुहोस्", "Add")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
