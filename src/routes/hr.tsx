import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarCheck, Search, UserPlus } from "lucide-react";
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
} from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { npr, staff } from "@/data/seed";
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

export const Route = createFileRoute("/hr")({
  head: () => ({
    meta: [
      { title: "HR & Staff — Employees, Leave and Duty Roster | Vidya ERP" },
      { name: "description", content: "Employee directory, leave requests, duty roster and department-wise staffing for the school." },
      { property: "og:title", content: "HR & Staff — Vidya ERP" },
      { property: "og:description", content: "Employee records, leave approvals and duty roster management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HrPage,
});

type Employee = (typeof staff)[number];

type LeaveRequest = { id: string; name: string; type: string; typeNp: string; from: string; to: string; days: number; status: string };

const initialLeave: LeaveRequest[] = [
  { id: "LV-301", name: "Hari Prasad Ojha", type: "Sick leave", typeNp: "बिरामी बिदा", from: "2083-09-15", to: "2083-09-18", days: 4, status: "Pending" },
  { id: "LV-302", name: "Sarita Poudel", type: "Casual leave", typeNp: "आकस्मिक बिदा", from: "2083-09-21", to: "2083-09-21", days: 1, status: "Approved" },
  { id: "LV-303", name: "Sanu Kaji Gurung", type: "Festival leave", typeNp: "चाडपर्व बिदा", from: "2083-09-25", to: "2083-10-02", days: 8, status: "Pending" },
  { id: "LV-304", name: "Kabita Ghimire", type: "Maternity leave", typeNp: "सुत्केरी बिदा", from: "2083-10-01", to: "2083-12-30", days: 90, status: "Approved" },
];

function HrPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Employee[]>(staff);
  const [leave, setLeave] = useState<LeaveRequest[]>(initialLeave);
  const [active, setActive] = useState<Employee | null>(null);

  const filtered = useMemo(
    () => rows.filter((s) => `${s.name} ${s.role} ${s.dept}`.toLowerCase().includes(query.toLowerCase())),
    [rows, query],
  );

  const onLeave = rows.filter((s) => s.status === "On leave").length;
  const pending = leave.filter((l) => l.status === "Pending").length;
  const payroll = rows.reduce((s, e) => s + e.salary, 0);

  const departments = useMemo(() => {
    const map = new Map<string, number>();
    rows.forEach((r) => map.set(r.dept, (map.get(r.dept) ?? 0) + 1));
    return [...map.entries()].map(([dept, count]) => ({ dept, count }));
  }, [rows]);
  const maxDept = Math.max(1, ...departments.map((d) => d.count));

  const decide = (id: string, status: string) => {
    setLeave((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success(status === "Approved" ? bi("बिदा स्वीकृत", "Leave approved") : bi("बिदा अस्वीकृत", "Leave rejected"), { description: id });
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        illus="hr"
        emoji="👥"
        title={bi("मानव संसाधन", "HR & Staff")}
        subtitle={bi(
          "कर्मचारी अभिलेख, बिदा स्वीकृति, ड्युटी रोस्टर र विभागगत जनशक्ति।",
          "Employee records, leave approvals, duty roster and department staffing.",
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <Button variant="outline" size="sm" onClick={() => toast.success(bi("रोस्टर प्रकाशित भयो", "Duty roster published"))}>
              <CalendarCheck className="size-4" /> {bi("रोस्टर", "Roster")}
            </Button>
            <NewStaffDialog
              onCreate={(e) => {
                setRows((r) => [e, ...r]);
                toast.success(bi("कर्मचारी थपियो", "Employee added"), { description: e.name });
              }}
            />
          </>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard illus="hr" emoji="👥" label={bi("कुल कर्मचारी", "Total staff")} value={rows.length} tone="primary" />
          <StatCard illus="teachers" emoji="✅" label={bi("कार्यरत", "Active today")} value={rows.length - onLeave} tone="success" />
          <StatCard illus="calendar" emoji="🌴" label={bi("बिदा अनुरोध", "Pending leave")} value={pending} tone="warning" />
          <StatCard illus="accounting" emoji="💰" label={bi("मासिक तलब", "Monthly payroll")} value={payroll} prefix="रु " tone="info" />
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title={bi("विभागगत जनशक्ति", "Department headcount")}>
          <ul className="space-y-4">
            {departments.map((d) => (
              <li key={d.dept}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{d.dept}</span>
                  <span className="tabular-nums text-muted-foreground">{d.count}</span>
                </div>
                <ProgressBar value={(d.count / maxDept) * 100} tone="info" />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title={bi("आजको ड्युटी", "Today's duty")} description={bi("१७ असोज २०८३ · बिहिबार", "17 Ashwin 2083 BS · Thursday")}>
          <ul className="space-y-3 text-sm">
            {[
              { e: "🔔", np: "घण्टी तथा समय पालक", en: "Bell & timekeeping", who: "Ram Bahadur Thapa" },
              { e: "🚪", np: "गेट ड्युटी", en: "Gate duty", who: "Nirmal Pariyar" },
              { e: "🍛", np: "मेस निरीक्षण", en: "Mess inspection", who: "Kabita Ghimire" },
              { e: "📚", np: "पुस्तकालय डेस्क", en: "Library desk", who: "Hari Prasad Ojha" },
            ].map((d) => (
              <li key={d.en} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="text-lg">{d.e}</span>
                <div className="min-w-0 flex-1">
                  <p className="np text-sm font-semibold">{lang === "np" ? d.np : d.en}</p>
                  <p className="text-[11px] text-muted-foreground">{d.who}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <Tabs defaultValue="directory" className="mt-6">
        <TabsList>
          <TabsTrigger value="directory">📇 {bi("कर्मचारी", "Directory")}</TabsTrigger>
          <TabsTrigger value="leave">🌴 {bi("बिदा", "Leave requests")}</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="mt-4">
          <SectionCard
            title={bi("कर्मचारी सूची", "Employee directory")}
            description={bi("पङ्क्तिमा क्लिक गरी विवरण हेर्नुहोस्", "Click a row for the full employee record")}
            action={
              <div className="relative">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={bi("खोज्नुहोस्…", "Search staff…")} className="h-9 w-56 pl-9" />
              </div>
            }
          >
            {loading ? (
              <SkeletonTable rows={6} />
            ) : filtered.length === 0 ? (
              <EmptyState illus="hr" emoji="👥" title={bi("कर्मचारी भेटिएन", "No staff found")} description={bi("अर्को नाम वा विभाग खोज्नुहोस्।", "Try another name, role or department.")} action={<Button variant="outline" onClick={() => setQuery("")}>{bi("रिसेट", "Reset")}</Button>} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{bi("कर्मचारी", "Employee")}</TableHead>
                      <TableHead>{bi("विभाग", "Department")}</TableHead>
                      <TableHead>{bi("तलब", "Gross salary")}</TableHead>
                      <TableHead className="text-right">{bi("स्थिति", "Status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((s) => (
                      <TableRow key={s.id} className="cursor-pointer" onClick={() => setActive(s)}>
                        <TableCell>
                          <p className="text-sm font-semibold">{s.name}</p>
                          <p className="text-[11px] text-muted-foreground">{s.role} · <span className="font-mono">{s.id}</span></p>
                        </TableCell>
                        <TableCell className="text-sm">{s.dept}</TableCell>
                        <TableCell className="text-sm">{npr(s.salary)}</TableCell>
                        <TableCell className="text-right"><StatusPill tone={statusToneFor(s.status)}>{s.status}</StatusPill></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="leave" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {leave.map((l) => (
              <Card key={l.id} className="card-3d sheen animate-rise gap-0 p-5">
                <div className="flex items-start justify-between">
                  <Illus name="calendar" size={28} />
                  <StatusPill tone={statusToneFor(l.status)}>{l.status}</StatusPill>
                </div>
                <p className="mt-3 text-sm font-semibold">{l.name}</p>
                <p className="np text-[11px] text-muted-foreground">{lang === "np" ? l.typeNp : l.type} · {l.days} {bi("दिन", "days")}</p>
                <p className="np mt-1 text-[11px] text-muted-foreground">🗓️ {l.from} → {l.to}</p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" className="flex-1" disabled={l.status !== "Pending"} onClick={() => decide(l.id, "Approved")}>
                    ✅ {bi("स्वीकृत", "Approve")}
                  </Button>
                  <Button size="sm" variant="outline" disabled={l.status !== "Pending"} onClick={() => decide(l.id, "Rejected")}>
                    ✖
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full sm:max-w-md">
          {active ? (
            <>
              <SheetHeader>
                <SheetTitle>{active.name}</SheetTitle>
                <SheetDescription>{active.role} · {active.dept} · {active.id}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="rounded-2xl border border-border p-4 text-sm">
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">{bi("तलब", "Gross")}</span><span className="font-semibold">{npr(active.salary)}</span></div>
                  <div className="mt-2 flex items-center justify-between"><span className="text-muted-foreground">SSF (11%)</span><span>{npr(active.ssf)}</span></div>
                  <div className="mt-2 flex items-center justify-between"><span className="text-muted-foreground">{bi("कर", "Tax")}</span><span>{npr(active.tax)}</span></div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3"><span className="font-semibold">{bi("खुद तलब", "Net pay")}</span><span className="font-bold text-success">{npr(active.salary - active.ssf - active.tax)}</span></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="flex-1" onClick={() => toast.success(bi("पे-स्लिप पठाइयो", "Payslip emailed"), { description: active.name })}>📧 {bi("पे-स्लिप", "Payslip")}</Button>
                  <Button variant="outline" onClick={() => toast.success(bi("अभिलेख अद्यावधिक भयो", "Record updated"))}>✏️ {bi("सम्पादन", "Edit")}</Button>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function NewStaffDialog({ onCreate }: { onCreate: (e: Employee) => void }) {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("Teacher");
  const [dept, setDept] = useState("Science");
  const [salary, setSalary] = useState("52000");

  const submit = () => {
    if (!name.trim()) {
      toast.error(bi("नाम आवश्यक छ", "Name is required"));
      return;
    }
    const gross = Number(salary) || 0;
    onCreate({ id: `EMP-${Math.floor(160 + Math.random() * 40)}`, name: name.trim(), role, dept, salary: gross, ssf: Math.round(gross * 0.11), tax: Math.round(gross * 0.05), status: "Active" });
    setOpen(false);
    setName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><UserPlus className="size-4" /> {bi("कर्मचारी थप्नुहोस्", "Add employee")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bi("नयाँ कर्मचारी", "New employee")}</DialogTitle>
          <DialogDescription>{bi("SSF र कर स्वतः गणना हुनेछ।", "SSF and tax are calculated automatically.")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hr-name">{bi("नाम", "Full name")}</Label>
            <Input id="hr-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sunita Rai" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="hr-role">{bi("पद", "Role")}</Label>
              <Input id="hr-role" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hr-dept">{bi("विभाग", "Department")}</Label>
              <Input id="hr-dept" value={dept} onChange={(e) => setDept(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hr-salary">{bi("तलब", "Salary")}</Label>
              <Input id="hr-salary" type="number" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </div>
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
