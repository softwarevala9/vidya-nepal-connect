import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Role = "admin" | "teacher" | "student" | "parent";

export type DemoAccount = {
  role: Role;
  emoji: string;
  labelNp: string;
  labelEn: string;
  username: string;
  password: string;
  name: string;
  nameNp: string;
  subtitle: string;
  home: string;
  avatar: string;
};

/** Presentation-only demo credentials. No backend, no network calls. */
export const demoAccounts: DemoAccount[] = [
  {
    role: "admin",
    emoji: "🏫",
    labelNp: "प्रशासक",
    labelEn: "Admin",
    username: "admin",
    password: "admin123",
    name: "Dr. Bishnu Prasad Sharma",
    nameNp: "डा. विष्णुप्रसाद शर्मा",
    subtitle: "Principal · Shree Himalaya Adarsha",
    home: "/",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Bishnu&backgroundColor=ffd5a6",
  },
  {
    role: "teacher",
    emoji: "👩‍🏫",
    labelNp: "शिक्षक",
    labelEn: "Teacher",
    username: "teacher",
    password: "teacher123",
    name: "Sarita Adhikari",
    nameNp: "सरिता अधिकारी",
    subtitle: "Mathematics · Grade 8–10",
    home: "/teacher-portal",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Sarita&backgroundColor=c0e6d9",
  },
  {
    role: "student",
    emoji: "🧑‍🎓",
    labelNp: "विद्यार्थी",
    labelEn: "Student",
    username: "student",
    password: "student123",
    name: "Aarav Sharma",
    nameNp: "आरव शर्मा",
    subtitle: "Grade 8 · Section A · Roll 12",
    home: "/student-portal",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Aarav&backgroundColor=d9d5f5",
  },
  {
    role: "parent",
    emoji: "👨‍👩‍👧",
    labelNp: "अभिभावक",
    labelEn: "Parent",
    username: "parent",
    password: "parent123",
    name: "Rajendra Sharma",
    nameNp: "राजेन्द्र शर्मा",
    subtitle: "Guardian of Aarav Sharma",
    home: "/parent-portal",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=Rajendra&backgroundColor=ffd5a6",
  },
];

const STORAGE_KEY = "vidya-erp-session";

type Ctx = {
  user: DemoAccount | null;
  ready: boolean;
  signIn: (username: string, password: string) => { ok: boolean; account?: DemoAccount; error?: string };
  signInAs: (role: Role) => DemoAccount;
  signOut: () => void;
};

const AuthContext = createContext<Ctx>({
  user: null,
  ready: false,
  signIn: () => ({ ok: false }),
  signInAs: () => demoAccounts[0]!,
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoAccount | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const role = raw as Role | null;
      const found = demoAccounts.find((a) => a.role === role) ?? null;
      setUser(found);
    } catch {
      setUser(null);
    }
    setReady(true);
  }, []);

  const persist = useCallback((account: DemoAccount | null) => {
    try {
      if (account) localStorage.setItem(STORAGE_KEY, account.role);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — session stays in memory only */
    }
  }, []);

  const signIn = useCallback<Ctx["signIn"]>(
    (username, password) => {
      const id = username.trim().toLowerCase();
      const account = demoAccounts.find(
        (a) => a.username === id || `${a.username}@himalayaadarsha.edu.np` === id,
      );
      if (!account) return { ok: false, error: "no-user" };
      if (account.password !== password) return { ok: false, error: "bad-password" };
      setUser(account);
      persist(account);
      return { ok: true, account };
    },
    [persist],
  );

  const signInAs = useCallback<Ctx["signInAs"]>(
    (role) => {
      const account = demoAccounts.find((a) => a.role === role) ?? demoAccounts[0]!;
      setUser(account);
      persist(account);
      return account;
    },
    [persist],
  );

  const signOut = useCallback(() => {
    setUser(null);
    persist(null);
  }, [persist]);

  const value = useMemo(() => ({ user, ready, signIn, signInAs, signOut }), [user, ready, signIn, signInAs, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
