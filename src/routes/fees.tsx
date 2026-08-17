import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Plus, Receipt, Send } from "lucide-react";
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
import { feeCollection, feeStructure, invoices, npr, paymentMethods } from "@/data/seed";
import { Illus } from "@/components/illustrations";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/fees")({
  head: () => ({
    meta: [
      { title: "Fees & Billing — Invoices, eSewa & Khalti | Vidya ERP" },
      { name: "description", content: "Fee structure, invoices, digital wallet collections and dues follow-up for Nepali schools." },
      { property: "og:title", content: "Fees & Billing — Vidya ERP" },
      { property: "og:description", content: "Invoices, eSewa/Khalti/Fonepay collections and dues follow-up." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FeesPage,
});

type Invoice = (typeof invoices)[number];

function FeesPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [active, setActive] = useState<Invoice | null>(null);
  const [rows, setRows] = useState<Invoice[]>(invoices);

  const filtered = useMemo(
    () =>
      rows.filter(
        (i) =>
          (status === "all" || i.status.toLowerCase() === status) &&
          (i.student.toLowerCase().includes(query.toLowerCase()) || i.id.toLowerCase().includes(query.toLowerCase())),
      ),
    [rows, query, status],
  );

  const billed = rows.reduce((s, i) => s + i.amount, 0);
  const collected = rows.reduce((s, i) => s + i.paid, 0);
  const due = billed - collected;
  const maxMonth = Math.max(...feeCollection.map((m) => m.collected));

  const markPaid = (id: string) => {
    setRows((r) => r.map((i) => (i.id === id ? { ...i, paid: i.amount, status: "Paid", method: "eSewa" } : i)));
    setActive(null);
    toast.success(bi("भुक्तानी रेकर्ड गरियो", "Payment recorded"), { description: id });
  };

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        illus="fees"
        emoji="💰"
        title={bi("शुल्क तथा बिलिङ", "Fees & Billing")}
        subtitle={bi(
          "शुल्क संरचना, बिजक, डिजिटल वालेट संकलन र बाँकी रकमको अनुगमन।",
          "Fee structure, invoices, digital wallet collection and dues follow-up.",
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <Button variant="outline" size="sm" onClick={() => toast.success(bi("CSV निर्यात भयो", "Exported to CSV"))}>
              <Download className="size-4" /> {bi("निर्यात", "Export")}
            </Button>
            <NewInvoiceDialog
              onCreate={(inv) => {
                setRows((r) => [inv, ...r]);
                toast.success(bi("बिजक बनाइयो", "Invoice created"), { description: inv.id });
              }}
            />
          </>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard illus="fees" emoji="💰" label={bi("कुल बिल", "Total billed")} value={billed} prefix="रु " tone="primary" />
          <StatCard illus="accounting" emoji="✅" label={bi("संकलित", "Collected")} value={collected} prefix="रु " tone="success" trend="+8.4%" />
          <StatCard illus="exams" emoji="⏳" label={bi("बाँकी", "Outstanding")} value={due} prefix="रु " tone="warning" />
          <StatCard illus="students" emoji="🧾" label={bi("बिजक संख्या", "Invoices")} value={rows.length} tone="info" />
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title={bi("मासिक संकलन", "Monthly collection")}
          description={bi("शैक्षिक वर्ष २०८३ वि.सं.", "Academic year 2083 BS")}
        >
          <div className="flex h-56 items-end gap-3">
            {feeCollection.map((m) => (
              <div key={m.month} className="group flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {npr(m.collected)}
                </span>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-primary/60 to-primary transition-all duration-500 group-hover:from-success/60 group-hover:to-success"
                  style={{ height: `${(m.collected / maxMonth) * 100}%` }}
                />
                <span className="np text-[10px] font-medium text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={bi("भुक्तानी माध्यम", "Payment channels")} description={bi("नेपाली डिजिटल वालेट", "Nepali digital wallets")}>
          <ul className="space-y-3">
            {paymentMethods.map((p) => (
              <li
                key={p.name}
                className="flex items-center gap-3 rounded-xl border border-border p-3 transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-lg">{p.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{p.note}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.success(bi("भुक्तानी लिंक पठाइयो", "Payment link sent"), { description: p.name })}
                >
                  <Send className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <Tabs defaultValue="invoices" className="mt-6">
        <TabsList>
          <TabsTrigger value="invoices">🧾 {bi("बिजक", "Invoices")}</TabsTrigger>
          <TabsTrigger value="structure">📋 {bi("शुल्क संरचना", "Fee structure")}</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4">
          <SectionCard
            title={bi("बिजक सूची", "Invoice register")}
            description={bi("क्लिक गरेर विवरण हेर्नुहोस्", "Click a row to open the receipt drawer")}
            action={
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={bi("खोज्नुहोस्…", "Search student or ID…")}
                  className="h-9 w-52"
                />
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{bi("सबै", "All status")}</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
          >
            {loading ? (
              <SkeletonTable rows={6} />
            ) : filtered.length === 0 ? (
              <EmptyState
                illus="fees"
                emoji="🧾"
                title={bi("कुनै बिजक भेटिएन", "No invoices found")}
                description={bi("खोज वा फिल्टर परिवर्तन गर्नुहोस्।", "Try a different search term or status filter.")}
                action={
                  <Button variant="outline" onClick={() => { setQuery(""); setStatus("all"); }}>
                    {bi("फिल्टर हटाउनुहोस्", "Clear filters")}
                  </Button>
                }
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{bi("बिजक", "Invoice")}</TableHead>
                      <TableHead>{bi("विद्यार्थी", "Student")}</TableHead>
                      <TableHead>{bi("रकम", "Amount")}</TableHead>
                      <TableHead className="w-44">{bi("भुक्तानी", "Paid")}</TableHead>
                      <TableHead>{bi("माध्यम", "Method")}</TableHead>
                      <TableHead className="text-right">{bi("स्थिति", "Status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((i) => (
                      <TableRow key={i.id} className="cursor-pointer" onClick={() => setActive(i)}>
                        <TableCell className="font-mono text-xs">{i.id}</TableCell>
                        <TableCell>
                          <p className="text-sm font-semibold">{i.student}</p>
                          <p className="text-[11px] text-muted-foreground">{bi("कक्षा", "Grade")} {i.grade}</p>
                        </TableCell>
                        <TableCell className="font-semibold">{npr(i.amount)}</TableCell>
                        <TableCell>
                          <ProgressBar value={(i.paid / i.amount) * 100} tone={i.paid === i.amount ? "success" : "warning"} />
                          <p className="mt-1 text-[11px] text-muted-foreground">{npr(i.paid)}</p>
                        </TableCell>
                        <TableCell className="text-sm">{i.method}</TableCell>
                        <TableCell className="text-right">
                          <StatusPill tone={statusToneFor(i.status)}>{i.status}</StatusPill>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="structure" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {feeStructure.map((f) => (
              <Card key={`${f.head}-${f.grade}`} className="card-3d sheen animate-rise gap-0 p-5">
                <div className="flex items-start justify-between gap-3">
                  <Illus name="fees" size={30} />
                  <StatusPill tone="blue">{f.frequency}</StatusPill>
                </div>
                <p className="np mt-3 text-sm font-semibold">{lang === "np" ? f.np : f.head}</p>
                <p className="text-[11px] text-muted-foreground">{bi("कक्षा", "Grade")} {f.grade}</p>
                <p className="mt-3 text-xl font-bold text-primary">{npr(f.amount)}</p>
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
                <SheetTitle className="flex items-center gap-2">
                  <Receipt className="size-4" /> {active.id}
                </SheetTitle>
                <SheetDescription>
                  {active.student} · {bi("कक्षा", "Grade")} {active.grade}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <div className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{bi("कुल रकम", "Total")}</span>
                    <span className="font-semibold">{npr(active.amount)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{bi("भुक्तानी", "Paid")}</span>
                    <span className="font-semibold text-success">{npr(active.paid)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{bi("बाँकी", "Due")}</span>
                    <span className="font-semibold text-destructive">{npr(active.amount - active.paid)}</span>
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={(active.paid / active.amount) * 100} tone="success" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="flex-1" onClick={() => markPaid(active.id)} disabled={active.paid === active.amount}>
                    ✅ {bi("पूर्ण भुक्तानी", "Mark fully paid")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.success(bi("रसिद डाउनलोड भयो", "Receipt downloaded"), { description: active.id })}
                  >
                    <Download className="size-4" /> {bi("रसिद", "Receipt")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.success(bi("अभिभावकलाई SMS पठाइयो", "SMS reminder sent to guardian"))}
                  >
                    <Send className="size-4" /> {bi("सम्झना", "Remind")}
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

function NewInvoiceDialog({ onCreate }: { onCreate: (inv: Invoice) => void }) {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState("");
  const [grade, setGrade] = useState("8A");
  const [amount, setAmount] = useState("6800");

  const submit = () => {
    if (!student.trim()) {
      toast.error(bi("विद्यार्थीको नाम आवश्यक छ", "Student name is required"));
      return;
    }
    onCreate({
      id: `INV-2083-${Math.floor(1900 + Math.random() * 90)}`,
      student: student.trim(),
      grade,
      amount: Number(amount) || 0,
      paid: 0,
      method: "—",
      date: "2083-09-17",
      status: "Overdue",
    });
    setOpen(false);
    setStudent("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" /> {bi("नयाँ बिजक", "New invoice")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bi("नयाँ बिजक बनाउनुहोस्", "Create invoice")}</DialogTitle>
          <DialogDescription>{bi("शुल्क बिजक तयार गर्नुहोस्।", "Raise a new fee invoice for a student.")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inv-student">{bi("विद्यार्थी", "Student")}</Label>
            <Input id="inv-student" value={student} onChange={(e) => setStudent(e.target.value)} placeholder="Aarav Sharma" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="inv-grade">{bi("कक्षा", "Grade")}</Label>
              <Input id="inv-grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-amount">{bi("रकम", "Amount")}</Label>
              <Input id="inv-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{bi("रद्द", "Cancel")}</Button>
          <Button onClick={submit}>{bi("बनाउनुहोस्", "Create")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
