import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LoadingSwitch, PageHeader, SectionCard, SkeletonCardGrid, StatCard, StatusPill } from "@/components/ui-kit";
import { useI18n } from "@/lib/i18n";
import { notices } from "@/data/seed";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/student-portal")({
  head: () => ({
    meta: [
      { title: "Student Portal | Vidya ERP" },
      { name: "description", content: "Personal routine, homework, results, attendance and fees for students." },
      { property: "og:title", content: "Student Portal — Vidya ERP" },
      { property: "og:description", content: "Personal routine, homework, results, attendance and fees for students." },
    ],
  }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const bi = (np: string, en: string) => (lang === "np" ? np : en);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        emoji="🎒"
        title={bi("विद्यार्थी पोर्टल", "Student Portal")}
        subtitle="Personal routine, homework, results, attendance and fees for students."
        actions={<LoadingSwitch loading={loading} onChange={setLoading} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard emoji="🎒" label={bi("कुल", "Total records")} value={1024} tone="primary" />
        <StatCard emoji="✅" label={bi("सक्रिय", "Active")} value={968} tone="success" trend="+4.2%" />
        <StatCard emoji="⏳" label={bi("प्रक्रियामा", "In progress")} value={42} tone="warning" />
        <StatCard emoji="🗂️" label={bi("अभिलेख", "Archived")} value={14} tone="info" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <SectionCard
          className="lg:col-span-2"
          title={bi("विद्यार्थी पोर्टल", "Student Portal")}
          description={bi("शैक्षिक वर्ष २०८३ वि.सं.", "Academic year 2083 BS")}
        >
          {loading ? (
            <SkeletonCardGrid count={4} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {notices.slice(0, 4).map((n) => (
                <Card key={n.id} className="animate-rise gap-0 p-5 transition-all hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-10 place-items-center rounded-xl bg-accent text-lg">{n.emoji}</span>
                    <StatusPill tone="blue">{n.audience}</StatusPill>
                  </div>
                  <p className="np mt-3 text-sm font-semibold">{lang === "np" ? n.title : n.titleEn}</p>
                  <p className="np mt-1 text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-3 text-[11px] text-muted-foreground">🗓️ {n.date} BS</p>
                </Card>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title={bi("द्रुत जानकारी", "Quick facts")}>
          <ul className="space-y-3 text-sm">
            {[
              { e: "🏫", np: "श्री हिमालय माध्यमिक विद्यालय", en: "Shree Himalaya Secondary School" },
              { e: "📍", np: "ललितपुर, बागमती प्रदेश", en: "Lalitpur, Bagmati Province" },
              { e: "🗓️", np: "१७ असोज २०८३ · बिहिबार", en: "17 Ashwin 2083 BS · Thursday" },
              { e: "👨‍🎓", np: "१,०२४ विद्यार्थी", en: "1,024 students enrolled" },
              { e: "👩‍🏫", np: "६८ शिक्षक", en: "68 teaching staff" },
            ].map((f) => (
              <li key={f.en} className="flex items-center gap-3 rounded-xl border border-border p-3">
                <span className="text-lg">{f.e}</span>
                <span className="np">{lang === "np" ? f.np : f.en}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
