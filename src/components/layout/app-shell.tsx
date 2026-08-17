import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronLeft,
  Languages,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { bottomNav, visibleFor } from "@/components/nav-config";
import { school, notifications } from "@/data/seed";
import { DateStamp } from "@/components/ui-kit";
import { Illus, SchoolScene, phaseFor, phaseMeta } from "@/components/illustrations";
import { PoweredBy } from "@/components/powered-by";
import { roleLabels, useAuth, type Role } from "@/lib/auth";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

function Brand({ collapsed }: { collapsed: boolean }) {
  const { lang } = useI18n();
  return (
    <Link to="/" className="flex items-center gap-3 px-4 py-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl gradient-hero text-lg shadow-glow">
        🎓
      </span>
      {!collapsed && (
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-sidebar-foreground">
            {lang === "np" ? "विद्या ईआरपी" : "Vidya ERP"}
          </span>
          <span className="np block truncate text-[11px] text-sidebar-foreground/60">
            {lang === "np" ? school.nameNp : school.name}
          </span>
        </span>
      )}
    </Link>
  );
}

function NavList({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: (() => void) | undefined }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const groups = visibleFor(user?.role ?? "principal");

  return (
    <nav className="space-y-5 px-3 pb-6">
      {groups.map((group) => (
        <div key={group.key}>
          {!collapsed && (
            <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.14em] text-sidebar-foreground/45 uppercase">
              {t(group.key)}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    title={collapsed ? t(item.key) : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      collapsed && "justify-center px-0",
                      active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow ring-1 ring-white/20"
                        : "text-sidebar-foreground/75 hover:translate-x-0.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    {active && (
                      <span className="absolute inset-y-1.5 left-0 w-1 rounded-r-full bg-white/70" aria-hidden />
                    )}
                    <span className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                      <Illus name={item.illus} size={22} />
                    </span>
                    {!collapsed && <span className="truncate">{t(item.key)}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex items-center rounded-full border border-border bg-card p-0.5">
      <button
        type="button"
        onClick={() => setLang("np")}
        className={cn(
          "np rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
          lang === "np" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        नेपाली
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
          lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        )}
      >
        EN
      </button>
    </div>
  );
}

/** Small live school scene that follows Nepal local time. */
function DayScene() {
  const { lang } = useI18n();
  const [hour, setHour] = useState(() => new Date().getHours());
  useEffect(() => {
    const id = setInterval(() => setHour(new Date().getHours()), 60_000);
    return () => clearInterval(id);
  }, []);
  const phase = phaseFor(hour);
  const meta = phaseMeta[phase];
  return (
    <div className="hidden items-center gap-2 rounded-full border border-border bg-card/70 py-1 pr-3 pl-1.5 2xl:flex">
      <SchoolScene phase={phase} height={30} className="w-24 rounded-full" />
      <span className="np text-[11px] font-semibold text-muted-foreground">
        {lang === "np" ? meta.np : meta.en}
      </span>
    </div>
  );
}

/** Role switcher — every role sees only the modules it owns. */
function RoleSwitcher() {
  const { lang } = useI18n();
  const { user, signInAs } = useAuth();
  const role: Role = user?.role ?? "principal";
  const current = roleLabels[role];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-accent sm:flex"
        >
          <span aria-hidden>{current.emoji}</span>
          <span className="np">{lang === "np" ? current.np : current.en}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{lang === "np" ? "भूमिका बदल्नुहोस्" : "Switch role"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(roleLabels) as Role[]).map((r) => (
          <DropdownMenuItem key={r} onSelect={() => signInAs(r)}>
            <span aria-hidden>{roleLabels[r].emoji}</span>
            <span className="np">{lang === "np" ? roleLabels[r].np : roleLabels[r].en}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationBell() {
  const unread = notifications.filter((n) => n.group === "Today").length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {unread}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">🔔 Notifications</p>
          <Link to="/notifications" className="text-xs font-semibold text-primary hover:underline">
            View all
          </Link>
        </div>
        <ul className="max-h-80 divide-y divide-border overflow-y-auto">
          {notifications.slice(0, 5).map((n) => (
            <li key={n.id} className="flex gap-3 px-4 py-3 transition-colors hover:bg-muted/60">
              <span className="text-lg">{n.emoji}</span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{n.title}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{n.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function UserMenu() {
  const { lang } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="flex items-center gap-2 rounded-full border border-border bg-card p-0.5 pr-3 transition-colors hover:bg-accent">
          <Avatar className="size-8">
            <AvatarImage src="https://api.dicebear.com/7.x/notionists/svg?seed=Principal&backgroundColor=ffd5a6" alt="Principal" />
            <AvatarFallback>BS</AvatarFallback>
          </Avatar>
          <span className="hidden text-left leading-tight sm:block">
            <span className="np block text-xs font-semibold">
              {lang === "np" ? school.principalNp : school.principal}
            </span>
            <span className="block text-[10px] text-muted-foreground">
              {lang === "np" ? "प्रधानाध्यापक" : "Principal"}
            </span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{lang === "np" ? "मेरो खाता" : "My account"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings className="size-4" /> {lang === "np" ? "सेटिङ" : "Settings"}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/teacher-portal">👩‍🏫 {lang === "np" ? "शिक्षक पोर्टल" : "Teacher portal"}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/parent-portal">👨‍👩‍👧 {lang === "np" ? "अभिभावक पोर्टल" : "Parent portal"}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="text-destructive focus:text-destructive">
          <Link to="/login">
            <LogOut className="size-4" /> {lang === "np" ? "लगआउट" : "Sign out"}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className="grid size-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, lang } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col bg-sidebar transition-[width] duration-300 lg:flex",
          collapsed ? "w-[76px]" : "w-[268px]",
        )}
      >
        <Brand collapsed={collapsed} />
        <ScrollArea className="flex-1">
          <NavList collapsed={collapsed} />
        </ScrollArea>
        <div className="border-t border-sidebar-border p-3">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-sidebar-accent px-3 py-2 text-xs font-semibold text-sidebar-accent-foreground transition-colors hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
          >
            <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && (lang === "np" ? "साँघुरो बनाउनुहोस्" : "Collapse")}
          </button>
          {!collapsed && <PoweredBy tone="dark" className="mt-3" />}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="grid size-9 place-items-center rounded-full border border-border bg-card lg:hidden"
                >
                  <Menu className="size-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] border-sidebar-border bg-sidebar p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex items-center justify-between pr-3">
                  <Brand collapsed={false} />
                  <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-sidebar-foreground/60">
                    <X className="size-4" />
                  </button>
                </div>
                <ScrollArea className="h-[calc(100vh-88px)]">
                  <NavList collapsed={false} onNavigate={() => setMobileOpen(false)} />
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <div className="hidden min-w-0 flex-1 md:block">
              <div className="relative max-w-sm">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder={t("common.search")}
                  className="h-9 w-full rounded-full border border-border bg-card pr-3 pl-9 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/40"
                />
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2 md:flex-none">
              <DayScene />
              <DateStamp className="hidden xl:flex" />
              <RoleSwitcher />
              <LanguageSwitcher />
              <ThemeToggle />
              <NotificationBell />
              <UserMenu />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-border px-4 py-2 xl:hidden">
            <DateStamp />
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Languages className="size-3" /> {lang === "np" ? "नेपाली" : "English"}
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 pt-6 pb-28 sm:px-6 lg:pb-10">{children}</main>

        <footer className="hidden border-t border-border px-6 py-4 lg:block">
          <PoweredBy />
        </footer>


        {/* Mobile bottom navigation */}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl lg:hidden">
          <ul className="grid grid-cols-5">
            {bottomNav.map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <span className={cn("transition-transform duration-300", active && "-translate-y-0.5 scale-110")}>
                      <Illus name={item.illus} size={22} />
                    </span>
                    <span className="truncate">{t(item.key)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
