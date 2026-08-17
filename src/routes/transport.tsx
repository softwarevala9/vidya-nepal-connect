import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bus, MapPin, Phone, Plus } from "lucide-react";
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
} from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { routes } from "@/data/seed";
import { Illus } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const Route = createFileRoute("/transport")({
  head: () => ({
    meta: [
      { title: "Transport — Bus Routes, Stops & Live Status | Vidya ERP" },
      { name: "description", content: "Track school bus routes across Pokhara, driver assignments, stops and live arrival status." },
      { property: "og:title", content: "Transport — Vidya ERP" },
      { property: "og:description", content: "Bus routes, drivers, stops and live arrival tracking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TransportPage,
});

type RouteRow = (typeof routes)[number];

const stopsByRoute: Record<string, { name: string; time: string; picked: number }[]> = {
  "RT-01": [
    { name: "Lakeside Chowk", time: "06:55", picked: 6 },
    { name: "Barahi Path", time: "07:04", picked: 5 },
    { name: "Hallan Chowk", time: "07:12", picked: 7 },
    { name: "Bagar", time: "07:26", picked: 9 },
    { name: "School gate", time: "07:42", picked: 7 },
  ],
};

function TransportPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<RouteRow[]>(routes);
  const [active, setActive] = useState<RouteRow | null>(null);

  const riders = rows.reduce((s, r) => s + r.students, 0);
  const onRoute = rows.filter((r) => r.status === "On route").length;
  const delayed = rows.filter((r) => r.status === "Delayed").length;

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        illus="transport"
        emoji="🚌"
        title={bi("यातायात", "Transport")}
        subtitle={bi(
          "पोखराका बस मार्ग, चालक, स्टप र लाइभ आगमन स्थिति।",
          "School bus routes across Pokhara, drivers, stops and live arrival status.",
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <Button variant="outline" size="sm" onClick={() => toast.success(bi("अभिभावकलाई सूचना पठाइयो", "Delay alert sent to guardians"))}>
              📢 {bi("ढिलाइ सूचना", "Delay alert")}
            </Button>
            <NewRouteDialog
              onCreate={(r) => {
                setRows((p) => [r, ...p]);
                toast.success(bi("नयाँ मार्ग थपियो", "Route added"), { description: r.name });
              }}
            />
          </>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard illus="transport" emoji="🚌" label={bi("कुल मार्ग", "Active routes")} value={rows.length} tone="primary" />
          <StatCard illus="students" emoji="🧒" label={bi("यात्रु विद्यार्थी", "Students riding")} value={riders} tone="info" />
          <StatCard illus="attendance" emoji="🟢" label={bi("मार्गमा", "On route now")} value={onRoute} tone="success" />
          <StatCard illus="calendar" emoji="⏱️" label={bi("ढिलो", "Delayed")} value={delayed} tone="warning" />
        </div>
      )}

      <Tabs defaultValue="routes" className="mt-6">
        <TabsList>
          <TabsTrigger value="routes">🚌 {bi("मार्ग", "Routes")}</TabsTrigger>
          <TabsTrigger value="stops">📍 {bi("स्टप", "Stops")}</TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="mt-4">
          {rows.length === 0 ? (
            <EmptyState illus="transport" emoji="🚌" title={bi("कुनै मार्ग छैन", "No routes yet")} description={bi("पहिलो बस मार्ग थप्नुहोस्।", "Add your first bus route to get started.")} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {rows.map((r) => (
                <Card
                  key={r.id}
                  onClick={() => setActive(r)}
                  className="card-3d sheen animate-rise cursor-pointer gap-0 p-5 transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="flex items-start justify-between">
                    <Illus name="transport" size={30} />
                    <StatusPill tone={statusToneFor(r.status)}>{r.status}</StatusPill>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground">🚐 {r.vehicle}</p>
                  <p className="text-[11px] text-muted-foreground">👨‍✈️ {r.driver}</p>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>🧒 {r.students} · 📍 {r.stops}</span>
                    <span className="font-semibold text-primary">ETA {r.eta}</span>
                  </div>
                  <div className="mt-2"><ProgressBar value={r.status === "Completed" ? 100 : r.status === "Delayed" ? 55 : 78} tone={r.status === "Delayed" ? "warning" : "success"} /></div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stops" className="mt-4">
          <SectionCard title={bi("मार्ग RT-01 का स्टप", "Route RT-01 stops")} description={bi("लेकसाइड – बगर", "Lakeside – Bagar")}>
            <ol className="relative space-y-5 border-l border-dashed border-border pl-6">
              {(stopsByRoute["RT-01"] ?? []).map((s, i) => (
                <li key={s.name} className="relative">
                  <span className="absolute -left-[31px] grid size-6 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border p-3">
                    <div>
                      <p className="text-sm font-semibold">📍 {s.name}</p>
                      <p className="text-[11px] text-muted-foreground">🧒 {s.picked} {bi("विद्यार्थी", "students")}</p>
                    </div>
                    <StatusPill tone="blue">{s.time}</StatusPill>
                  </div>
                </li>
              ))}
            </ol>
          </SectionCard>
        </TabsContent>
      </Tabs>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {active ? (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2"><Bus className="size-4" /> {active.name}</SheetTitle>
                <SheetDescription>{active.id} · {active.vehicle}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: bi("विद्यार्थी", "Students"), v: String(active.students) },
                    { l: bi("स्टप", "Stops"), v: String(active.stops) },
                    { l: "ETA", v: active.eta },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl border border-border p-3 text-center">
                      <p className="text-lg font-bold">{s.v}</p>
                      <p className="text-[11px] text-muted-foreground">{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-border p-4 text-sm">
                  <p>👨‍✈️ {active.driver}</p>
                  <p className="mt-1 text-muted-foreground">📞 +977 98{Math.floor(10000000 + Math.random() * 8999999)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="flex-1" onClick={() => toast.success(bi("लाइभ ट्र्याकिङ सुरु", "Live tracking started"), { description: active.name })}>
                    <MapPin className="size-4" /> {bi("लाइभ ट्र्याक", "Track live")}
                  </Button>
                  <Button variant="outline" onClick={() => toast.success(bi("चालकलाई कल गरियो", "Calling driver"), { description: active.driver })}>
                    <Phone className="size-4" /> {bi("कल", "Call")}
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

function NewRouteDialog({ onCreate }: { onCreate: (r: RouteRow) => void }) {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [vehicle, setVehicle] = useState("Ba 2 Kha ");
  const [driver, setDriver] = useState("");

  const submit = () => {
    if (!name.trim() || !driver.trim()) {
      toast.error(bi("मार्ग र चालकको नाम आवश्यक छ", "Route name and driver are required"));
      return;
    }
    onCreate({ id: `RT-0${Math.floor(5 + Math.random() * 4)}`, name: name.trim(), vehicle, driver: driver.trim(), students: 0, stops: 0, status: "Scheduled", eta: "07:45" });
    setOpen(false);
    setName("");
    setDriver("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="size-4" /> {bi("नयाँ मार्ग", "Add route")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bi("नयाँ बस मार्ग", "New bus route")}</DialogTitle>
          <DialogDescription>{bi("सवारी र चालक तोक्नुहोस्।", "Assign a vehicle and driver to the route.")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rt-name">{bi("मार्ग", "Route name")}</Label>
            <Input id="rt-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Prithvi Chowk – Ranipauwa" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="rt-vehicle">{bi("सवारी नम्बर", "Vehicle")}</Label>
              <Input id="rt-vehicle" value={vehicle} onChange={(e) => setVehicle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rt-driver">{bi("चालक", "Driver")}</Label>
              <Input id="rt-driver" value={driver} onChange={(e) => setDriver(e.target.value)} placeholder="Nirmal Pariyar" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{bi("रद्द", "Cancel")}</Button>
          <Button onClick={submit}>{bi("थप्नुहोस्", "Add route")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
