import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type Lang = "np" | "en";

type Dict = Record<string, { np: string; en: string }>;

export const dict: Dict = {
  "app.name": { np: "विद्या ईआरपी", en: "Vidya ERP" },
  "app.school": { np: "श्री हिमालय आदर्श माध्यमिक विद्यालय", en: "Shree Himalaya Adarsha Secondary School" },
  "app.tagline": { np: "नेपालको आधुनिक विद्यालय व्यवस्थापन प्रणाली", en: "Nepal's modern school management platform" },
  "nav.dashboard": { np: "ड्यासबोर्ड", en: "Dashboard" },
  "nav.admissions": { np: "भर्ना", en: "Admissions" },
  "nav.students": { np: "विद्यार्थी", en: "Students" },
  "nav.teachers": { np: "शिक्षक", en: "Teachers" },
  "nav.academics": { np: "शैक्षिक", en: "Academics" },
  "nav.timetable": { np: "समयतालिका", en: "Timetable" },
  "nav.attendance": { np: "हाजिरी", en: "Attendance" },
  "nav.exams": { np: "परीक्षा", en: "Examinations" },
  "nav.results": { np: "नतिजा", en: "Results" },
  "nav.fees": { np: "शुल्क", en: "Fees" },
  "nav.homework": { np: "गृहकार्य", en: "Homework" },
  "nav.lms": { np: "अनलाइन कक्षा", en: "LMS / Learning" },
  "nav.library": { np: "पुस्तकालय", en: "Library" },
  "nav.transport": { np: "यातायात", en: "Transport" },
  "nav.hostel": { np: "छात्रावास", en: "Hostel" },
  "nav.hr": { np: "कर्मचारी", en: "HR & Staff" },
  "nav.accounting": { np: "लेखा", en: "Accounting" },
  "nav.communication": { np: "सञ्चार", en: "Communication" },
  "nav.calendar": { np: "पात्रो", en: "School Calendar" },
  "nav.analytics": { np: "तथ्याङ्क", en: "Analytics" },
  "nav.settings": { np: "सेटिङ", en: "Settings" },
  "nav.teacherPortal": { np: "शिक्षक पोर्टल", en: "Teacher Portal" },
  "nav.studentPortal": { np: "विद्यार्थी पोर्टल", en: "Student Portal" },
  "nav.parentPortal": { np: "अभिभावक पोर्टल", en: "Parent Portal" },
  "nav.notifications": { np: "सूचना", en: "Notifications" },
  "group.overview": { np: "सिंहावलोकन", en: "Overview" },
  "group.people": { np: "मानिसहरू", en: "People" },
  "group.academic": { np: "शैक्षिक व्यवस्थापन", en: "Academic" },
  "group.finance": { np: "आर्थिक", en: "Finance" },
  "group.operations": { np: "सञ्चालन", en: "Operations" },
  "group.portals": { np: "पोर्टलहरू", en: "Portals" },
  "group.system": { np: "प्रणाली", en: "System" },
  "common.search": { np: "खोज्नुहोस्...", en: "Search anything..." },
  "common.viewAll": { np: "सबै हेर्नुहोस्", en: "View all" },
  "common.export": { np: "निर्यात", en: "Export" },
  "common.filter": { np: "फिल्टर", en: "Filter" },
  "common.save": { np: "सुरक्षित गर्नुहोस्", en: "Save" },
  "common.cancel": { np: "रद्द", en: "Cancel" },
  "common.today": { np: "आज", en: "Today" },
  "common.thisWeek": { np: "यो हप्ता", en: "This week" },
  "common.thisMonth": { np: "यो महिना", en: "This month" },
  "common.thisYear": { np: "यो वर्ष", en: "This year" },
  "common.loading": { np: "लोड हुँदैछ...", en: "Loading..." },
  "common.class": { np: "कक्षा", en: "Class" },
  "common.section": { np: "सेक्सन", en: "Section" },
  "common.roll": { np: "रोल नं.", en: "Roll No." },
  "common.status": { np: "स्थिति", en: "Status" },
  "common.actions": { np: "कार्य", en: "Actions" },
  "common.name": { np: "नाम", en: "Name" },
  "greet.morning": { np: "शुभ प्रभात", en: "Good morning" },
  "login.welcome": { np: "पुनः स्वागत छ", en: "Welcome back" },
  "login.username": { np: "प्रयोगकर्ता नाम वा इमेल", en: "Username or email" },
  "login.password": { np: "पासवर्ड", en: "Password" },
  "login.remember": { np: "मलाई सम्झनुहोस्", en: "Remember me" },
  "login.forgot": { np: "पासवर्ड बिर्सनुभयो?", en: "Forgot password?" },
  "login.submit": { np: "लगइन गर्नुहोस्", en: "Sign in" },
  "login.role": { np: "भूमिका छान्नुहोस्", en: "Choose your role" },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };

const I18nContext = createContext<Ctx>({ lang: "np", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("np");
  const t = useCallback((key: string) => dict[key]?.[lang] ?? key, [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

/** Pick between a Nepali and English literal without adding a dictionary key. */
export function useBi() {
  const { lang } = useI18n();
  return useCallback((np: string, en: string) => (lang === "np" ? np : en), [lang]);
}
