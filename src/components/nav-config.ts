export type NavItem = { to: string; key: string; emoji: string };
export type NavGroup = { key: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    key: "group.overview",
    items: [
      { to: "/", key: "nav.dashboard", emoji: "🏠" },
      { to: "/analytics", key: "nav.analytics", emoji: "📊" },
      { to: "/calendar", key: "nav.calendar", emoji: "📆" },
    ],
  },
  {
    key: "group.people",
    items: [
      { to: "/admissions", key: "nav.admissions", emoji: "🎓" },
      { to: "/students", key: "nav.students", emoji: "👨‍🎓" },
      { to: "/teachers", key: "nav.teachers", emoji: "👩‍🏫" },
      { to: "/hr", key: "nav.hr", emoji: "👥" },
    ],
  },
  {
    key: "group.academic",
    items: [
      { to: "/academics", key: "nav.academics", emoji: "🏫" },
      { to: "/timetable", key: "nav.timetable", emoji: "📅" },
      { to: "/attendance", key: "nav.attendance", emoji: "✅" },
      { to: "/exams", key: "nav.exams", emoji: "📝" },
      { to: "/results", key: "nav.results", emoji: "🏆" },
      { to: "/homework", key: "nav.homework", emoji: "✏️" },
      { to: "/lms", key: "nav.lms", emoji: "📚" },
    ],
  },
  {
    key: "group.finance",
    items: [
      { to: "/fees", key: "nav.fees", emoji: "💰" },
      { to: "/accounting", key: "nav.accounting", emoji: "💳" },
    ],
  },
  {
    key: "group.operations",
    items: [
      { to: "/library", key: "nav.library", emoji: "📖" },
      { to: "/transport", key: "nav.transport", emoji: "🚌" },
      { to: "/hostel", key: "nav.hostel", emoji: "🏠" },
      { to: "/communication", key: "nav.communication", emoji: "📢" },
    ],
  },
  {
    key: "group.portals",
    items: [
      { to: "/teacher-portal", key: "nav.teacherPortal", emoji: "👩‍🏫" },
      { to: "/student-portal", key: "nav.studentPortal", emoji: "🧑‍🎓" },
      { to: "/parent-portal", key: "nav.parentPortal", emoji: "👨‍👩‍👧" },
    ],
  },
  {
    key: "group.system",
    items: [
      { to: "/notifications", key: "nav.notifications", emoji: "🔔" },
      { to: "/settings", key: "nav.settings", emoji: "⚙️" },
    ],
  },
];

export const bottomNav: NavItem[] = [
  { to: "/", key: "nav.dashboard", emoji: "🏠" },
  { to: "/lms", key: "nav.lms", emoji: "📚" },
  { to: "/calendar", key: "nav.calendar", emoji: "📆" },
  { to: "/notifications", key: "nav.notifications", emoji: "🔔" },
  { to: "/student-portal", key: "nav.studentPortal", emoji: "👤" },
];
