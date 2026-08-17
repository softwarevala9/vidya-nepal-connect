import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, LoadingSwitch, PageHeader, SectionCard, SkeletonTable, StatCard, StatusPill, bsStringToLabel, statusToneFor } from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { admissions } from "@/data/seed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export const Route = createFileRoute("/admissions")({
  head: () => ({
    meta: [
      { title: "Admissions — Applications & Entrance | Vidya ERP" },
      { name: "description", content: "Track admission applications, interviews, entrance exams, documents and admission fees for the 2083 BS intake." },
      { property: "og:title", content: "Admissions — Vidya ERP" },
      { property: "og:description", content: "Applications, interviews, entrance exams and admission fees in one pipeline." },
    ],
  }),
  component: AdmissionsPage,
});

const statusEmoji: Record<string, string> = { Pending: "🟡", Reviewing: "🔵", Approved: "🟢", Rejected: "🔴" };

function AdmissionsPage() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("all");
  const [detail, setDetail] = useState<(typeof admissions)[number] | null>(null);

  const rows = tab === "all" ? admissions : admissions.filter((a) => a.status.toLowerCase() === tab);

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        emoji="🎓"
        title={bi("भर्ना व्यवस्थापन", "Admissions")}
        subtitle={bi("आवेदनदेखि भर्ना शुल्कसम्मको पूर्ण प्रक्रिया।", "The full pipeline from application to admission fee.")}
        actions={
          <>
            <LoadingSwitch loading={loading} onChange={setLoading} />
            <NewApplication />
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard emoji="📨" label={bi("कुल आवेदन", "Total applications")} value={214} tone="primary" trend="+18" />
        <StatCard emoji="🟢" label={bi("स्वीकृत", "Approved")} value={132} tone="success" />
        <StatCard emoji="🔵" label={bi("समीक्षामा", "Under review")} value={46} tone="info" />
        <StatCard emoji="💰" label={bi("भर्ना शुल्क संकलन", "Admission fee collected")} value={1122000} prefix="रु " tone="warning" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-3">
        <SectionCard className="xl:col-span-2" title={bi("आवेदन सूची", "Application list")} description={bi("शैक्षिक वर्ष २०८३ वि.सं.", "Academic year 2083 BS")}>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="all">{bi("सबै", "All")}</TabsTrigger>
              <TabsTrigger value="pending">🟡 {bi("पेन्डिङ", "Pending")}</TabsTrigger>
              <TabsTrigger value="reviewing">🔵 {bi("समीक्षा", "Reviewing")}</TabsTrigger>
              <TabsTrigger value="approved">🟢 {bi("स्वीकृत", "Approved")}</TabsTrigger>
              <TabsTrigger value="rejected">🔴 {bi("अस्वीकृत", "Rejected")}</TabsTrigger>
            </TabsList>
            <TabsContent value={tab} className="mt-4">
              {loading ? (
                <SkeletonTable rows={5} />
              ) : rows.length === 0 ? (
                <EmptyState emoji="📨" title={bi("यो चरणमा आवेदन छैन", "No applications in this stage")} description={bi("नयाँ आवेदन आएपछि यहाँ देखिनेछ।", "New applications will show up here as they arrive.")} />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{bi("आवेदक", "Applicant")}</TableHead>
                        <TableHead className="hidden sm:table-cell">{bi("कक्षा", "Grade")}</TableHead>
                        <TableHead className="hidden md:table-cell">{bi("मिति", "Applied")}</TableHead>
                        <TableHead className="hidden lg:table-cell">{bi("प्रवेश अंक", "Entrance")}</TableHead>
                        <TableHead className="text-right">{bi("स्थिति", "Status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((a) => (
                        <TableRow key={a.id} onClick={() => setDetail(a)} className="cursor-pointer transition-colors hover:bg-accent/40">
                          <TableCell>
                            <p className="np text-sm font-semibold">{lang === "np" ? a.nameNp : a.name}</p>
                            <p className="text-[11px] text-muted-foreground">{a.id}</p>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">Grade {a.grade}</TableCell>
                          <TableCell className="hidden md:table-cell np text-sm">{bsStringToLabel(a.applied, lang)}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">{a.score ?? "—"}</TableCell>
                          <TableCell className="text-right">
                            <StatusPill tone={statusToneFor(a.status)} emoji={statusEmoji[a.status]}>{a.status}</StatusPill>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title={bi("भर्ना चरण", "Admission stages")}>
            <ol className="relative space-y-5 border-l border-dashed border-border pl-5">
              {[
                { emoji: "📝", np: "अनलाइन आवेदन", en: "Online application", done: true },
                { emoji: "📄", np: "कागजात प्रमाणीकरण", en: "Document verification", done: true },
                { emoji: "🧮", np: "प्रवेश परीक्षा", en: "Entrance examination", done: true },
                { emoji: "🗣️", np: "अन्तर्वार्ता", en: "Interview", done: false },
                { emoji: "💰", np: "भर्ना शुल्क", en: "Admission fee", done: false },
              ].map((s) => (
                <li key={s.en} className="relative">
                  <span className={`absolute -left-[30px] grid size-6 place-items-center rounded-full text-[11px] ${s.done ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}`}>
                    {s.done ? "✓" : "•"}
                  </span>
                  <p className="np text-sm font-medium">{s.emoji} {lang === "np" ? s.np : s.en}</p>
                  <p className="text-[11px] text-muted-foreground">{s.done ? bi("सम्पन्न", "Completed") : bi("बाँकी", "Pending")}</p>
                </li>
              ))}
            </ol>
          </SectionCard>

          <Card className="gap-0 overflow-hidden p-0">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-base font-semibold">{bi("आजका अन्तर्वार्ता", "Interviews today")}</h2>
            </div>
            <div className="p-5">
              <EmptyState emoji="🗣️" title={bi("आज कुनै अन्तर्वार्ता छैन", "No interviews scheduled")} description={bi("अन्तर्वार्ता तालिका बनाएपछि यहाँ देखिनेछ।", "Schedule an interview and it will appear here.")} />
            </div>
          </Card>
        </div>
      </div>

      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
          {detail ? (
            <>
              <SheetHeader>
                <SheetTitle className="np">{lang === "np" ? detail.nameNp : detail.name}</SheetTitle>
                <SheetDescription>{detail.id} · Grade {detail.grade}</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 px-4 pb-6">
                <StatusPill tone={statusToneFor(detail.status)} emoji={statusEmoji[detail.status]}>{detail.status}</StatusPill>
                <div className="space-y-2">
                  {[
                    [bi("अभिभावक", "Guardian"), detail.parent],
                    [bi("सम्पर्क", "Phone"), detail.phone],
                    [bi("आवेदन मिति", "Applied"), bsStringToLabel(detail.applied, lang)],
                    [bi("प्रवेश अंक", "Entrance score"), detail.score ? `${detail.score}/100` : "—"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-border pb-2 text-sm">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="np font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold">📄 {bi("कागजातहरू", "Documents")}</p>
                  <ul className="space-y-2">
                    {["Birth certificate", "Transfer certificate", "Character certificate", "Passport photo"].map((d) => (
                      <li key={d} className="flex items-center justify-between rounded-xl border border-border px-3 py-2 text-sm">
                        <span>📎 {d}</span>
                        <StatusPill tone="green">✓</StatusPill>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 rounded-full" onClick={() => toast.success("🎉 Application approved")}>{bi("स्वीकृत", "Approve")}</Button>
                  <Button variant="outline" className="flex-1 rounded-full" onClick={() => toast.error("⚠️ Application marked as rejected")}>
                    {bi("अस्वीकृत", "Reject")}
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

function NewApplication() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full gradient-hero shadow-glow">🎓 {bi("नयाँ आवेदन", "New application")}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>🎓 {bi("नयाँ भर्ना आवेदन", "New admission application")}</DialogTitle>
          <DialogDescription>{bi("आवेदकको विवरण भर्नुहोस्।", "Capture the applicant's details.")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{bi("आवेदकको नाम", "Applicant name")}</Label>
            <Input placeholder="Aayush Chaudhary" />
          </div>
          <div className="space-y-1.5">
            <Label>{bi("कक्षा", "Applying for grade")}</Label>
            <Select defaultValue="6">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["6", "7", "8", "9", "10", "11"].map((g) => <SelectItem key={g} value={g}>Grade {g}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{bi("अभिभावक", "Guardian")}</Label>
            <Input placeholder="Ram Prasad Chaudhary" />
          </div>
          <div className="space-y-1.5">
            <Label>{bi("आवेदन मिति (वि.सं.)", "Applied on (BS)")}</Label>
            <Input className="np" defaultValue="२०८३-०६-१७" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-full">{bi("रद्द", "Cancel")}</Button>
          <Button className="rounded-full" onClick={() => toast.success("🎉 Application submitted successfully")}>{bi("पेश गर्नुहोस्", "Submit")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
