import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Bus,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  GraduationCap,
  Landmark,
  Lock,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { school } from "@/data/seed";
import { TODAY_AD, TODAY_BS, formatAd, formatBs } from "@/lib/bs-date";
import { cn } from "@/lib/utils";
import { demoAccounts, useAuth, type Role } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Vidya ERP for Nepali Schools" },
      {
        name: "description",
        content:
          "Secure sign-in for students, teachers, parents and school administrators of Shree Himalaya Adarsha Secondary School.",
      },
      { property: "og:title", content: "Sign in — Vidya ERP" },
      { property: "og:description", content: "Secure sign-in for students, teachers, parents and school administrators." },
    ],
  }),
  component: LoginPage,
});

const slides = [
  {
    emoji: "🎓",
    Icon: GraduationCap,
    np: "भर्नादेखि नतिजासम्म — एउटै प्रणालीमा",
    en: "From admissions to results — one connected platform",
    bodyNp: "विद्यार्थी भर्ना, कक्षा व्यवस्थापन, परीक्षा र नतिजा प्रकाशन सबै विक्रम सम्बत् पात्रोसँगै।",
    bodyEn: "Admissions, classes, examinations and published results, all aligned to the Bikram Sambat calendar.",
    stats: [
      { emoji: "👨‍🎓", value: "1,024", np: "विद्यार्थी", en: "Students" },
      { emoji: "👩‍🏫", value: "68", np: "शिक्षक", en: "Teachers" },
      { emoji: "🏫", value: "24", np: "कक्षा", en: "Classes" },
    ],
  },
  {
    emoji: "📊",
    Icon: Trophy,
    np: "नतिजा र प्रगति एकै नजरमा",
    en: "Results and progress at a single glance",
    bodyNp: "GPA, ग्रेड, कक्षागत प्रदर्शन र शिक्षक मूल्याङ्कन — सजिलो चार्टमा प्रस्तुत।",
    bodyEn: "GPA, grades, class performance and teacher evaluation presented in clear, readable charts.",
    stats: [
      { emoji: "🏆", value: "3.41", np: "औसत GPA", en: "Avg GPA" },
      { emoji: "✅", value: "94%", np: "हाजिरी", en: "Attendance" },
      { emoji: "📝", value: "12", np: "परीक्षा", en: "Exams" },
    ],
  },
  {
    emoji: "🚌",
    Icon: Bus,
    np: "यातायात, छात्रावास र पुस्तकालय व्यवस्थित",
    en: "Transport, hostel and library, fully organised",
    bodyNp: "रुट, बस हाजिरी, कोठा बाँडफाँट र पुस्तक निष्कासन सबै एउटै ठाउँबाट हेर्नुहोस्।",
    bodyEn: "Track routes, bus attendance, room allocation and book issues from one operations view.",
    stats: [
      { emoji: "🚌", value: "9", np: "रुट", en: "Routes" },
      { emoji: "🏠", value: "112", np: "कोठा", en: "Rooms" },
      { emoji: "📖", value: "8,460", np: "पुस्तक", en: "Books" },
    ],
  },
];

const roleIcons: Record<Role, typeof User> = {
  admin: Landmark,
  teacher: Users,
  student: BookOpen,
  parent: ShieldCheck,
};

function LoginPage() {
  const { t, lang, setLang } = useI18n();
  const navigate = useNavigate();
  const { signIn, signInAs } = useAuth();

  const [slide, setSlide] = useState(0);
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const bi = (np: string, en: string) => (lang === "np" ? np : en);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  const go = (path: string, name: string) => {
    toast.success(bi("🎉 सफलतापूर्वक लगइन भयो", "🎉 Signed in successfully"), { description: name });
    navigate({ to: path });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = signIn(username, password);
    if (!res.ok || !res.account) {
      setBusy(false);
      setError(
        res.error === "bad-password"
          ? bi("⚠️ पासवर्ड मिलेन। पुनः प्रयास गर्नुहोस्।", "⚠️ That password doesn't match. Please try again.")
          : bi("⚠️ यो प्रयोगकर्ता फेला परेन।", "⚠️ We couldn't find that user."),
      );
      toast.error(bi("लगइन असफल", "Sign in failed"));
      return;
    }
    setError(null);
    go(res.account.home, lang === "np" ? res.account.nameNp : res.account.name);
  };

  const handleRole = (role: Role) => {
    const account = signInAs(role);
    setUsername(account.username);
    setPassword(account.password);
    go(account.home, lang === "np" ? account.nameNp : account.name);
  };

  const active = slides[slide]!;

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* ------------------------------ Slider pane ----------------------------- */}
      <div className="relative hidden overflow-hidden gradient-ink p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="paper-grid absolute inset-0 opacity-[0.16]" />
        <div className="animate-aurora pointer-events-none absolute -top-32 -right-24 size-96 rounded-full bg-primary/35 blur-3xl" />
        <div className="animate-aurora pointer-events-none absolute -bottom-40 -left-20 size-[26rem] rounded-full bg-warning/25 blur-3xl [animation-delay:-5s]" />
        <div className="animate-aurora pointer-events-none absolute top-1/3 left-1/2 size-72 rounded-full bg-info/25 blur-3xl [animation-delay:-9s]" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-2xl gradient-hero text-2xl shadow-glow">🎓</span>
            <div>
              <p className="text-sm font-bold text-sidebar-foreground">Vidya ERP</p>
              <p className="np text-[11px] text-sidebar-foreground/60">{school.nameNp}</p>
            </div>
          </div>
          <span className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold text-sidebar-foreground">
            <Sparkles className="size-3.5 text-warning" />
            {bi("नेपालमा निर्मित", "Made in Nepal")} 🇳🇵
          </span>
        </div>

        {/* Slide */}
        <div className="relative max-w-xl">
          <div key={slide} className="animate-rise">
            <span className="glass-dark inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-sidebar-foreground">
              <active.Icon className="size-4 text-warning" />
              {bi("विशेषता", "Highlight")} {slide + 1}/{slides.length}
            </span>
            <h2 className="np mt-5 text-4xl leading-tight font-bold text-sidebar-foreground xl:text-[2.7rem]">
              {bi(active.np, active.en)}
            </h2>
            <p className="np mt-4 max-w-lg text-sm leading-relaxed text-sidebar-foreground/70">
              {bi(active.bodyNp, active.bodyEn)}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {active.stats.map((s) => (
                <div key={s.en} className="glass-dark animate-tilt rounded-2xl p-4 [animation-delay:var(--d)]" style={{ "--d": `${active.stats.indexOf(s) * -2}s` } as React.CSSProperties}>
                  <span className="text-xl">{s.emoji}</span>
                  <p className="mt-2 text-xl font-bold text-sidebar-foreground">{s.value}</p>
                  <p className="np text-[11px] text-sidebar-foreground/60">{bi(s.np, s.en)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Slider controls */}
          <div className="mt-9 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() => setSlide((s) => (s - 1 + slides.length) % slides.length)}
                className="glass-dark grid size-9 place-items-center rounded-full text-sidebar-foreground transition-transform hover:scale-110"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setSlide((s) => (s + 1) % slides.length)}
                className="glass-dark grid size-9 place-items-center rounded-full text-sidebar-foreground transition-transform hover:scale-110"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
            <div className="flex flex-1 items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.en}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setSlide(i)}
                  className={cn(
                    "h-1.5 flex-1 overflow-hidden rounded-full bg-sidebar-foreground/15 transition-all",
                    i === slide && "bg-sidebar-foreground/25",
                  )}
                >
                  {i === slide ? (
                    <span
                      key={slide}
                      className="block h-full rounded-full bg-warning"
                      style={{ animation: "slideProgress 6s linear forwards" }}
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative flex flex-wrap gap-2">
          {["📚 Academics", "🎒 Students", "👩‍🏫 Teachers", "🚌 Transport", "🏆 Results", "💰 Fees", "📖 Library", "📆 BS Calendar"].map(
            (chip) => (
              <span
                key={chip}
                className="glass-dark rounded-full px-3 py-1.5 text-xs font-medium text-sidebar-foreground/85 transition-transform hover:-translate-y-0.5"
              >
                {chip}
              </span>
            ),
          )}
        </div>
      </div>

      {/* ------------------------------- Form pane ------------------------------ */}
      <div className="relative flex items-center justify-center overflow-hidden gradient-soft px-5 py-10 sm:px-10">
        <div className="animate-aurora pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="animate-aurora pointer-events-none absolute bottom-0 -left-16 size-72 rounded-full bg-info/20 blur-3xl [animation-delay:-6s]" />
        <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />

        <div className="relative w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 lg:hidden">
              <span className="grid size-10 place-items-center rounded-xl gradient-hero text-lg">🎓</span>
              <span className="text-sm font-bold">Vidya ERP</span>
            </div>
            <div className="ml-auto flex items-center rounded-full border border-border bg-card/80 p-0.5 backdrop-blur">
              <button
                type="button"
                onClick={() => setLang("np")}
                className={cn(
                  "np rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                  lang === "np" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                नेपाली
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                  lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                English
              </button>
            </div>
          </div>

          <div className="animate-rise glass neon-ring rounded-3xl p-7">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl gradient-hero text-2xl shadow-glow">🏫</span>
              <div className="min-w-0">
                <p className="np truncate text-sm font-bold">{lang === "np" ? school.nameNp : school.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  {bi("स्थापना", "Established")} {school.estd} · Pokhara, Nepal
                </p>
              </div>
            </div>

            <h1 className="np mt-6 text-2xl font-bold">{t("login.welcome")} 👋</h1>
            <p className="np mt-1 text-sm text-muted-foreground">
              {bi("भूमिका छान्नुहोस् — तुरुन्तै लगइन हुनेछ।", "Pick a role for instant sign-in, or use your credentials.")}
            </p>

            {/* Role quick-login buttons */}
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              {demoAccounts.map((a) => {
                const Icon = roleIcons[a.role];
                return (
                  <button
                    key={a.role}
                    type="button"
                    onClick={() => handleRole(a.role)}
                    className="card-3d sheen group flex items-center gap-2.5 px-3 py-2.5 text-left"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-base text-primary transition-transform group-hover:scale-110">
                      {a.emoji}
                    </span>
                    <span className="min-w-0">
                      <span className="np block truncate text-xs font-bold">{lang === "np" ? a.labelNp : a.labelEn}</span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Icon className="size-3" />
                        {bi("सिधै लगइन", "Instant login")}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="my-5 flex items-center gap-3 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              <span className="h-px flex-1 bg-border" />
              {bi("वा", "or")}
              <span className="h-px flex-1 bg-border" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label htmlFor="user" className="text-xs font-semibold">
                  {t("login.username")}
                </Label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="user"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError(null);
                    }}
                    autoComplete="username"
                    className="h-11 w-full rounded-xl border border-input bg-card/70 pr-3 pl-9 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pass" className="text-xs font-semibold">
                  {t("login.password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="pass"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    autoComplete="current-password"
                    className="h-11 w-full rounded-xl border border-input bg-card/70 pr-10 pl-9 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    aria-label="Toggle password"
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error ? (
                <p className="animate-pop rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                  {error}
                </p>
              ) : null}

              <div className="flex items-center justify-between text-xs">
                <span className="np flex items-center gap-1.5 font-medium text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-success" />
                  {bi("सुरक्षित विद्यालय पहुँच", "Secure school access")}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    toast.info(bi("पासवर्ड रिसेट लिंक पठाइयो", "Password reset link sent"), {
                      description: bi("आफ्नो विद्यालय इमेल जाँच्नुहोस्।", "Check your school email inbox."),
                    })
                  }
                  className="font-semibold text-primary hover:underline"
                >
                  {t("login.forgot")}
                </button>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={busy}
                className="sheen w-full rounded-xl gradient-hero text-base shadow-glow"
              >
                <Rocket className="size-4" />
                {t("login.submit")}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/40 p-3">
              <p className="text-[11px] font-semibold text-muted-foreground">
                🔑 {bi("डेमो प्रमाणपत्र", "Demo credentials")}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {demoAccounts.map((a) => (
                  <button
                    key={a.role}
                    type="button"
                    onClick={() => {
                      setUsername(a.username);
                      setPassword(a.password);
                      setError(null);
                    }}
                    className="rounded-lg bg-card px-2 py-1.5 text-left text-[10px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span className="font-bold text-foreground">{a.username}</span> / {a.password}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 border-t border-border pt-4 text-[11px]">
              <span className="np rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">
                {formatBs(TODAY_BS, lang)}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground">
                {formatAd(TODAY_AD)} AD
              </span>
            </div>
          </div>

          <p className="np mt-5 text-center text-[11px] text-muted-foreground">
            🇳🇵 {bi("नेपालमा नेपाली विद्यालयका लागि निर्मित", "Made in Nepal, for Nepali schools")}
          </p>
        </div>
      </div>
    </div>
  );
}
