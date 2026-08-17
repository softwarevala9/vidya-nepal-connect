import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Plus, Wallet } from "lucide-react";
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
  bsStringToLabel,
} from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { feeCollection, ledger, npr, staff } from "@/data/seed";
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

export const Route = createFileRoute("/accounting")({
  head: () => ({
    meta: [
      { title: "Accounting — Ledger, Payroll & SSF | Vidya ERP" },
      { name: "description", content: "Double-entry ledger, income vs expense, staff payroll with SSF and tax deductions." },
      { property: "og:title", content: "Accounting — Vidya ERP" },
      { property: "og:description", content: "Ledger, income vs expense analysis and Nepali payroll with SSF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountingPage,
});

type Entry = (typeof ledger)[number];

function AccountingPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Entry[]>(ledger);
  const [type, setType] = useState("all");

  const filtered = useMemo(() => rows.filter((e) => type === "all" || e.type.toLowerCase() === type), [rows, type]);
  const income = rows.filter((e) => e.type === "Income").reduce((s, e) => s + e.amount, 0);
  const expense = rows.filter((e) => e.type === "Expense").reduce((s, e) => s + e.amount, 0);
  const net = income - expense;
  const payroll = staff.reduce((s, e) => s + e.salary, 0);
  const maxMonth = Math.max(...feeCollection.map((m) => m.collected + m.pending));

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        illus="accounting"
        emoji="💳"
        title={bi("लेखा तथा तलब", "Accounting & Payroll")}
        subtitle={bi(
          "आय-व्यय खाता, नगद प्रवाह र सामाजिक सुरक्षा कोष सहितको तलब व्यवस्थापन।",
          "Income and expense ledger, cash flow and staff payroll with SSF and tax.",
        )}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <Button variant="outline" size="sm" onClick={() => toast.success(bi("लेखा रिपोर्ट निर्यात भयो", "Financial report exported"))}>
              <Download className="size-4" /> {bi("रिपोर्ट", "Report")}
            </Button>
            <NewEntryDialog
              onCreate={(e) => {
                setRows((r) => [e, ...r]);
                toast.success(bi("प्रविष्टि थपियो", "Ledger entry added"), { description: e.particular });
              }}
            />
          </>
        }
      />

      {loading ? (
        <SkeletonCardGrid count={4} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard illus="fees" emoji="📈" label={bi("कुल आय", "Total income")} value={income} prefix="रु " tone="success" trend="+6.1%" />
          <StatCard illus="accounting" emoji="📉" label={bi("कुल खर्च", "Total expense")} value={expense} prefix="रु " tone="warning" />
          <StatCard illus="analytics" emoji="⚖️" label={bi("खुद नाफा/घाटा", "Net balance")} value={net} prefix="रु " tone={net >= 0 ? "primary" : "chart-5"} />
          <StatCard illus="hr" emoji="👥" label={bi("मासिक तलब", "Monthly payroll")} value={payroll} prefix="रु " tone="info" />
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2" title={bi("संकलन बनाम बाँकी", "Collected vs pending")} description={bi("मासिक तुलना", "Month-by-month comparison")}>
          <div className="flex h-56 items-end gap-4">
            {feeCollection.map((m) => (
              <div key={m.month} className="group flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end gap-1">
                  <div className="flex-1 rounded-t-lg bg-gradient-to-t from-success/60 to-success transition-all duration-500" style={{ height: `${(m.collected / maxMonth) * 100}%` }} title={npr(m.collected)} />
                  <div className="flex-1 rounded-t-lg bg-gradient-to-t from-warning/50 to-warning transition-all duration-500" style={{ height: `${(m.pending / maxMonth) * 100}%` }} title={npr(m.pending)} />
                </div>
                <span className="np text-[10px] font-medium text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-success" /> {bi("संकलित", "Collected")}</span>
            <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-warning" /> {bi("बाँकी", "Pending")}</span>
          </div>
        </SectionCard>

        <SectionCard title={bi("बैंक तथा नगद", "Bank & cash")}>
          <ul className="space-y-3">
            {[
              { np: "नबिल बैंक — मुख्य खाता", en: "Nabil Bank — main account", amount: 8420000, emoji: "🏦" },
              { np: "ग्लोबल आईएमई — तलब खाता", en: "Global IME — payroll account", amount: 3110000, emoji: "🏛️" },
              { np: "इसेवा व्यापारिक खाता", en: "eSewa merchant wallet", amount: 486000, emoji: "💚" },
              { np: "नगद मौज्दात", en: "Cash in hand", amount: 128400, emoji: "💵" },
            ].map((a) => (
              <li key={a.en} className="flex items-center gap-3 rounded-xl border border-border p-3 transition-all hover:-translate-y-0.5 hover:shadow-card">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-lg">{a.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="np truncate text-sm font-semibold">{lang === "np" ? a.np : a.en}</p>
                  <p className="text-[11px] text-muted-foreground">{npr(a.amount)}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <Tabs defaultValue="ledger" className="mt-6">
        <TabsList>
          <TabsTrigger value="ledger">📒 {bi("खाता", "Ledger")}</TabsTrigger>
          <TabsTrigger value="payroll">👥 {bi("तलब", "Payroll")}</TabsTrigger>
        </TabsList>

        <TabsContent value="ledger" className="mt-4">
          <SectionCard
            title={bi("आय-व्यय खाता", "Income & expense ledger")}
            description={bi("शैक्षिक वर्ष २०८३ वि.सं.", "Academic year 2083 BS")}
            action={
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-9 w-36"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{bi("सबै", "All entries")}</SelectItem>
                  <SelectItem value="income">{bi("आय", "Income")}</SelectItem>
                  <SelectItem value="expense">{bi("खर्च", "Expense")}</SelectItem>
                </SelectContent>
              </Select>
            }
          >
            {loading ? (
              <SkeletonTable rows={6} />
            ) : filtered.length === 0 ? (
              <EmptyState illus="accounting" emoji="📒" title={bi("प्रविष्टि छैन", "No entries")} description={bi("फिल्टर परिवर्तन गर्नुहोस् वा नयाँ प्रविष्टि थप्नुहोस्।", "Change the filter or add a new ledger entry.")} action={<Button variant="outline" onClick={() => setType("all")}>{bi("सबै हेर्नुहोस्", "Show all")}</Button>} />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{bi("मिति", "Date (BS)")}</TableHead>
                      <TableHead>{bi("विवरण", "Particulars")}</TableHead>
                      <TableHead>{bi("माध्यम", "Mode")}</TableHead>
                      <TableHead className="text-right">{bi("रकम", "Amount")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((e, i) => (
                      <TableRow key={`${e.date}-${i}`}>
                        <TableCell className="np text-xs">{bsStringToLabel(e.date, lang)}</TableCell>
                        <TableCell className="np text-sm font-medium">{e.particular}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{e.mode}</TableCell>
                        <TableCell className="text-right">
                          <StatusPill tone={e.type === "Income" ? "green" : "red"}>
                            {e.type === "Income" ? "+" : "−"} {npr(e.amount)}
                          </StatusPill>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="payroll" className="mt-4">
          <SectionCard
            title={bi("कर्मचारी तलब", "Staff payroll")}
            description={bi("सामाजिक सुरक्षा कोष (११%) र कर कट्टी सहित", "Includes Social Security Fund (11%) and tax deduction")}
            action={<Button size="sm" onClick={() => toast.success(bi("तलब प्रक्रिया सुरु भयो", "Payroll run started"), { description: npr(payroll) })}><Wallet className="size-4" /> {bi("तलब चलाउनुहोस्", "Run payroll")}</Button>}
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{bi("कर्मचारी", "Employee")}</TableHead>
                    <TableHead>{bi("विभाग", "Department")}</TableHead>
                    <TableHead>{bi("तलब", "Gross")}</TableHead>
                    <TableHead>SSF</TableHead>
                    <TableHead>{bi("कर", "Tax")}</TableHead>
                    <TableHead className="text-right">{bi("खुद तलब", "Net pay")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <p className="text-sm font-semibold">{s.name}</p>
                        <p className="text-[11px] text-muted-foreground">{s.role} · <span className="font-mono">{s.id}</span></p>
                      </TableCell>
                      <TableCell className="text-sm">{s.dept}</TableCell>
                      <TableCell className="text-sm">{npr(s.salary)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{npr(s.ssf)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{npr(s.tax)}</TableCell>
                      <TableCell className="text-right font-semibold">{npr(s.salary - s.ssf - s.tax)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { np: "कुल तलब", en: "Gross payroll", v: payroll, tone: "primary" },
                { np: "कुल SSF", en: "Total SSF", v: staff.reduce((s, e) => s + e.ssf, 0), tone: "info" },
                { np: "कुल कर", en: "Total tax", v: staff.reduce((s, e) => s + e.tax, 0), tone: "warning" },
              ].map((c) => (
                <Card key={c.en} className="card-3d animate-rise gap-0 p-4">
                  <div className="flex items-center justify-between">
                    <Illus name="accounting" size={26} />
                    <span className="text-sm font-bold">{npr(c.v)}</span>
                  </div>
                  <p className="np mt-2 text-[11px] text-muted-foreground">{lang === "np" ? c.np : c.en}</p>
                  <div className="mt-2"><ProgressBar value={(c.v / payroll) * 100} tone={c.tone} /></div>
                </Card>
              ))}
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NewEntryDialog({ onCreate }: { onCreate: (e: Entry) => void }) {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [open, setOpen] = useState(false);
  const [particular, setParticular] = useState("");
  const [amount, setAmount] = useState("50000");
  const [type, setType] = useState("Income");
  const [mode, setMode] = useState("eSewa");

  const submit = () => {
    if (!particular.trim()) {
      toast.error(bi("विवरण आवश्यक छ", "Particulars are required"));
      return;
    }
    onCreate({ date: "2083-09-17", particular: particular.trim(), type, amount: Number(amount) || 0, mode });
    setOpen(false);
    setParticular("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="size-4" /> {bi("प्रविष्टि", "New entry")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bi("नयाँ खाता प्रविष्टि", "New ledger entry")}</DialogTitle>
          <DialogDescription>{bi("आय वा खर्च दर्ता गर्नुहोस्।", "Record an income or expense transaction.")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ac-part">{bi("विवरण", "Particulars")}</Label>
            <Input id="ac-part" value={particular} onChange={(e) => setParticular(e.target.value)} placeholder="Computer lab upgrade" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="ac-type">{bi("प्रकार", "Type")}</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="ac-type" className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Income">{bi("आय", "Income")}</SelectItem>
                  <SelectItem value="Expense">{bi("खर्च", "Expense")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ac-amt">{bi("रकम", "Amount")}</Label>
              <Input id="ac-amt" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ac-mode">{bi("माध्यम", "Mode")}</Label>
              <Input id="ac-mode" value={mode} onChange={(e) => setMode(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{bi("रद्द", "Cancel")}</Button>
          <Button onClick={submit}>{bi("सुरक्षित", "Save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
