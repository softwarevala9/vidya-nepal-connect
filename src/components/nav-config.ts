import type { IllusName } from "@/components/illustrations";
import type { Role } from "@/lib/auth";

export type NavItem = { to: string; key: string; emoji: string; illus: IllusName; roles: Role[] | "all" };
export type NavGroup = { key: string; items: NavItem[] };

const ALL: Role[] | "all" = "all";

export const navGroups: NavGroup[] = [
  {
    key: "group.overview",
    items: [
      { to: "/", key: "nav.dashboard", emoji: "🏠", illus: "school", roles: ALL },
      { to: "/analytics", key: "nav.analytics", emoji: "📊", illus: "analytics", roles: ["admin", "principal", "accountant", "hr"] },
      { to: "/calendar", key: "nav.calendar", emoji: "📆", illus: "calendar", roles: ALL },
    ],
  },
  {
    key: "group.people",
    items: [
      { to: "/admissions", key: "nav.admissions", emoji: "🎓", illus: "admissions", roles: ["admin", "principal"] },
      { to: "/students", key: "nav.students", emoji: "👨‍🎓", illus: "students", roles: ["admin", "principal", "teacher", "librarian", "transport", "hostel"] },
      { to: "/teachers", key: "nav.teachers", emoji: "👩‍🏫", illus: "teachers", roles: ["admin", "principal", "hr"] },
      { to: "/hr", key: "nav.hr", emoji: "👥", illus: "hr", roles: ["admin", "principal", "hr"] },
    ],
  },
  {
    key: "group.academic",
    items: [
      { to: "/academics", key: "nav.academics", emoji: "🏫", illus: "classes", roles: ["admin", "principal", "teacher"] },
      { to: "/timetable", key: "nav.timetable", emoji: "📅", illus: "timetable", roles: ["admin", "principal", "teacher", "student", "parent"] },
      { to: "/attendance", key: "nav.attendance", emoji: "✅", illus: "attendance", roles: ["admin", "principal", "teacher", "student", "parent", "hr"] },
      { to: "/exams", key: "nav.exams", emoji: "📝", illus: "exams", roles: ["admin", "principal", "teacher", "student"] },
      { to: "/results", key: "nav.results", emoji: "🏆", illus: "results", roles: ["admin", "principal", "teacher", "student", "parent"] },
      { to: "/homework", key: "nav.homework", emoji: "✏️", illus: "homework", roles: ["admin", "principal", "teacher", "student", "parent"] },
      { to: "/lms", key: "nav.lms", emoji: "📚", illus: "lms", roles: ["admin", "principal", "teacher", "student"] },
    ],
  },
  {
    key: "group.finance",
    items: [
      { to: "/fees", key: "nav.fees", emoji: "💰", illus: "fees", roles: ["admin", "principal", "accountant", "parent", "student"] },
      { to: "/accounting", key: "nav.accounting", emoji: "💳", illus: "accounting", roles: ["admin", "principal", "accountant"] },
    ],
  },
  {
    key: "group.operations",
    items: [
      { to: "/library", key: "nav.library", emoji: "📖", illus: "library", roles: ["admin", "principal", "librarian", "teacher", "student"] },
      { to: "/transport", key: "nav.transport", emoji: "🚌", illus: "transport", roles: ["admin", "principal", "transport", "parent"] },
      { to: "/hostel", key: "nav.hostel", emoji: "🏠", illus: "hostel", roles: ["admin", "principal", "hostel", "parent"] },
      { to: "/communication", key: "nav.communication", emoji: "📢", illus: "communication", roles: ALL },
    ],
  },
  {
    key: "group.portals",
    items: [
      { to: "/teacher-portal", key: "nav.teacherPortal", emoji: "👩‍🏫", illus: "teachers", roles: ["admin", "principal", "teacher"] },
      { to: "/student-portal", key: "nav.studentPortal", emoji: "🧑‍🎓", illus: "students", roles: ["admin", "principal", "student"] },
      { to: "/parent-portal", key: "nav.parentPortal", emoji: "👨‍👩‍👧", illus: "hr", roles: ["admin", "principal", "parent"] },
    ],
  },
  {
    key: "group.system",
    items: [
      { to: "/notifications", key: "nav.notifications", emoji: "🔔", illus: "communication", roles: ALL },
      { to: "/settings", key: "nav.settings", emoji: "⚙️", illus: "settings", roles: ALL },
    ],
  },
];

export const bottomNav: NavItem[] = [
  { to: "/", key: "nav.dashboard", emoji: "🏠", illus: "school", roles: ALL },
  { to: "/lms", key: "nav.lms", emoji: "📚", illus: "lms", roles: ALL },
  { to: "/calendar", key: "nav.calendar", emoji: "📆", illus: "calendar", roles: ALL },
  { to: "/notifications", key: "nav.notifications", emoji: "🔔", illus: "communication", roles: ALL },
  { to: "/student-portal", key: "nav.studentPortal", emoji: "👤", illus: "students", roles: ALL },
];

export const visibleFor = (role: Role) =>
  navGroups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles === "all" || i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0);
