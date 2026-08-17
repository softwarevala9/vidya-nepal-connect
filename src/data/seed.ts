/**
 * Presentation-only seed data for Vidya ERP.
 * Nothing here is persisted — it exists purely to make the UI feel real.
 */

export const school = {
  name: "Shree Himalaya Adarsha Secondary School",
  nameNp: "श्री हिमालय आदर्श माध्यमिक विद्यालय",
  address: "Lakeside-6, Pokhara, Kaski, Gandaki Province",
  addressNp: "लेकसाइड-६, पोखरा, कास्की, गण्डकी प्रदेश",
  phone: "+977-61-462180",
  email: "office@himalayaadarsha.edu.np",
  estd: "2039 BS",
  principal: "Dr. Bishnu Prasad Sharma",
  principalNp: "डा. विष्णुप्रसाद शर्मा",
  academicYear: "2083 BS (2026/27 AD)",
  motto: "विद्या ददाति विनयम्",
  mottoEn: "Knowledge bestows humility",
};

export type Student = {
  id: string;
  name: string;
  nameNp: string;
  grade: string;
  section: string;
  roll: number;
  gender: "Male" | "Female";
  guardian: string;
  phone: string;
  attendance: number;
  gpa: number;
  dueFee: number;
  house: string;
  address: string;
  avatar: string;
};

const avatarFor = (seed: string) => `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffd5a6,c0e6d9,d9d5f5`;

const rawStudents: Array<
  [string, string, string, string, string, number, "Male" | "Female", string, string, number, number, number, string, string]
> = [
  ["STU-2083-0412", "Aarav Sharma", "आरव शर्मा", "8", "A", 12, "Male", "Rajendra Sharma", "9846012345", 96, 3.72, 0, "Annapurna", "Lakeside-6, Pokhara"],
  ["STU-2083-0413", "Sneha Gurung", "स्नेहा गुरुङ", "8", "A", 13, "Female", "Kamala Gurung", "9856023411", 98, 3.9, 0, "Machhapuchhre", "Bagar-2, Pokhara"],
  ["STU-2083-0414", "Bibek Thapa", "विवेक थापा", "8", "B", 4, "Male", "Hari Thapa", "9806112233", 88, 3.25, 4500, "Dhaulagiri", "Bindhyabasini-1, Pokhara"],
  ["STU-2083-0415", "Pratima Karki", "प्रतिमा कार्की", "9", "A", 7, "Female", "Sushila Karki", "9841556677", 93, 3.55, 2200, "Langtang", "Ranipauwa-11, Pokhara"],
  ["STU-2083-0416", "Nischal Adhikari", "निश्चल अधिकारी", "9", "B", 21, "Male", "Bhim Adhikari", "9812223344", 79, 2.95, 8600, "Annapurna", "Birauta-17, Pokhara"],
  ["STU-2083-0417", "Anjali Bhattarai", "अञ्जली भट्टराई", "10", "A", 3, "Female", "Dipak Bhattarai", "9867788990", 99, 3.95, 0, "Machhapuchhre", "Newroad-9, Pokhara"],
  ["STU-2083-0418", "Sujan Tamang", "सुजन तामाङ", "10", "A", 9, "Male", "Maya Tamang", "9803344556", 85, 3.1, 5400, "Dhaulagiri", "Hemja-4, Kaski"],
  ["STU-2083-0419", "Riya Poudel", "रिया पौडेल", "10", "B", 16, "Female", "Netra Poudel", "9856778811", 91, 3.6, 1200, "Langtang", "Sarangkot-5, Kaski"],
  ["STU-2083-0420", "Kritan Shrestha", "कृतन श्रेष्ठ", "7", "A", 2, "Male", "Anil Shrestha", "9845123789", 94, 3.45, 0, "Annapurna", "Chipledhunga-8, Pokhara"],
  ["STU-2083-0421", "Manisha Rai", "मनीषा राई", "7", "B", 18, "Female", "Gopal Rai", "9814556677", 82, 3.05, 3300, "Machhapuchhre", "Batulechaur-16, Pokhara"],
  ["STU-2083-0422", "Prashant Magar", "प्रशान्त मगर", "11", "A", 5, "Male", "Tek Bahadur Magar", "9857001122", 90, 3.4, 9800, "Dhaulagiri", "Nadipur-2, Pokhara"],
  ["STU-2083-0423", "Sabina Lama", "सबिना लामा", "12", "A", 1, "Female", "Pemba Lama", "9841009988", 97, 3.85, 0, "Langtang", "Mahendrapul-9, Pokhara"],
];

export const students: Student[] = rawStudents.map((r) => ({
  id: r[0],
  name: r[1],
  nameNp: r[2],
  grade: r[3],
  section: r[4],
  roll: r[5],
  gender: r[6],
  guardian: r[7],
  phone: r[8],
  attendance: r[9],
  gpa: r[10],
  dueFee: r[11],
  house: r[12],
  address: r[13],
  avatar: avatarFor(r[1]),
}));

export type Teacher = {
  id: string;
  name: string;
  nameNp: string;
  subject: string;
  subjectNp: string;
  classes: string;
  experience: string;
  email: string;
  phone: string;
  rating: number;
  avatar: string;
};

export const teachers: Teacher[] = [
  ["TCH-018", "Sarita Poudel", "सरिता पौडेल", "Mathematics", "गणित", "8A, 9A, 10A", "12 years", "sarita.poudel@himalayaadarsha.edu.np", "9846001122", 4.8],
  ["TCH-022", "Ram Bahadur Thapa", "राम बहादुर थापा", "Science", "विज्ञान", "9B, 10A, 10B", "9 years", "ram.thapa@himalayaadarsha.edu.np", "9856112233", 4.6],
  ["TCH-031", "Nirmala Adhikari", "निर्मला अधिकारी", "Nepali", "नेपाली", "7A, 7B, 8A", "15 years", "nirmala.adhikari@himalayaadarsha.edu.np", "9841223344", 4.9],
  ["TCH-040", "Deepak Gurung", "दीपक गुरुङ", "English", "अंग्रेजी", "8B, 9A, 11A", "7 years", "deepak.gurung@himalayaadarsha.edu.np", "9803445566", 4.5],
  ["TCH-045", "Anita Shrestha", "अनिता श्रेष्ठ", "Computer Science", "कम्प्युटर", "9A, 10B, 12A", "6 years", "anita.shrestha@himalayaadarsha.edu.np", "9867556677", 4.7],
  ["TCH-052", "Krishna Bhandari", "कृष्ण भण्डारी", "Social Studies", "सामाजिक अध्ययन", "7A, 8A, 8B", "11 years", "krishna.bhandari@himalayaadarsha.edu.np", "9812667788", 4.4],
].map((r) => ({
  id: r[0] as string,
  name: r[1] as string,
  nameNp: r[2] as string,
  subject: r[3] as string,
  subjectNp: r[4] as string,
  classes: r[5] as string,
  experience: r[6] as string,
  email: r[7] as string,
  phone: r[8] as string,
  rating: r[9] as number,
  avatar: avatarFor(r[1] as string),
}));

export const classes = [
  { grade: "6", section: "A", students: 34, teachers: 6, subjects: 8, room: "Block A · 101", incharge: "Nirmala Adhikari" },
  { grade: "7", section: "A", students: 31, teachers: 6, subjects: 8, room: "Block A · 104", incharge: "Krishna Bhandari" },
  { grade: "7", section: "B", students: 29, teachers: 6, subjects: 8, room: "Block A · 105", incharge: "Deepak Gurung" },
  { grade: "8", section: "A", students: 32, teachers: 6, subjects: 8, room: "Block B · 201", incharge: "Sarita Poudel" },
  { grade: "8", section: "B", students: 30, teachers: 6, subjects: 8, room: "Block B · 202", incharge: "Ram Bahadur Thapa" },
  { grade: "9", section: "A", students: 36, teachers: 7, subjects: 9, room: "Block B · 205", incharge: "Anita Shrestha" },
  { grade: "9", section: "B", students: 33, teachers: 7, subjects: 9, room: "Block B · 206", incharge: "Deepak Gurung" },
  { grade: "10", section: "A", students: 38, teachers: 7, subjects: 9, room: "Block C · 301", incharge: "Sarita Poudel" },
  { grade: "10", section: "B", students: 35, teachers: 7, subjects: 9, room: "Block C · 302", incharge: "Ram Bahadur Thapa" },
  { grade: "11", section: "A", students: 41, teachers: 8, subjects: 6, room: "Block C · 305", incharge: "Anita Shrestha" },
  { grade: "12", section: "A", students: 39, teachers: 8, subjects: 6, room: "Block C · 306", incharge: "Krishna Bhandari" },
];

export const subjects = [
  { code: "NEP-101", name: "Nepali", nameNp: "नेपाली", emoji: "📖", credit: 4, teacher: "Nirmala Adhikari", full: 100 },
  { code: "ENG-102", name: "English", nameNp: "अंग्रेजी", emoji: "🇬🇧", credit: 4, teacher: "Deepak Gurung", full: 100 },
  { code: "MAT-103", name: "Mathematics", nameNp: "गणित", emoji: "🧮", credit: 4, teacher: "Sarita Poudel", full: 100 },
  { code: "SCI-104", name: "Science", nameNp: "विज्ञान", emoji: "🔬", credit: 4, teacher: "Ram Bahadur Thapa", full: 100 },
  { code: "SOC-105", name: "Social Studies", nameNp: "सामाजिक अध्ययन", emoji: "🌏", credit: 4, teacher: "Krishna Bhandari", full: 100 },
  { code: "COM-106", name: "Computer Science", nameNp: "कम्प्युटर विज्ञान", emoji: "💻", credit: 2, teacher: "Anita Shrestha", full: 50 },
  { code: "HPE-107", name: "Health & Physical Ed.", nameNp: "स्वास्थ्य तथा शारीरिक शिक्षा", emoji: "🏅", credit: 2, teacher: "Bikash Karki", full: 50 },
  { code: "OPT-108", name: "Optional Mathematics", nameNp: "ऐच्छिक गणित", emoji: "📐", credit: 4, teacher: "Sarita Poudel", full: 100 },
];

export const admissions = [
  { id: "ADM-2083-091", name: "Aayush Chaudhary", nameNp: "आयुष चौधरी", grade: "6", status: "Pending", applied: "2083-03-18", parent: "Ram Prasad Chaudhary", phone: "9845667788", score: null as number | null },
  { id: "ADM-2083-092", name: "Sristi Neupane", nameNp: "सृष्टि न्यौपाने", grade: "9", status: "Reviewing", applied: "2083-03-16", parent: "Laxmi Neupane", phone: "9861223344", score: 78 },
  { id: "ADM-2083-093", name: "Rohan K.C.", nameNp: "रोहन के.सी.", grade: "11", status: "Approved", applied: "2083-03-12", parent: "Bimala K.C.", phone: "9807889900", score: 91 },
  { id: "ADM-2083-094", name: "Prerana Limbu", nameNp: "प्रेरणा लिम्बू", grade: "7", status: "Approved", applied: "2083-03-11", parent: "Dhan Bahadur Limbu", phone: "9852334455", score: 86 },
  { id: "ADM-2083-095", name: "Sagar Bista", nameNp: "सागर बिष्ट", grade: "10", status: "Rejected", applied: "2083-03-09", parent: "Nirmala Bista", phone: "9818990011", score: 42 },
  { id: "ADM-2083-096", name: "Ishwori Pariyar", nameNp: "ईश्वरी परियार", grade: "8", status: "Reviewing", applied: "2083-03-19", parent: "Buddhi Pariyar", phone: "9866001122", score: 69 },
];

export const timetable = {
  days: [
    { np: "आइतबार", en: "Sunday" },
    { np: "सोमबार", en: "Monday" },
    { np: "मंगलबार", en: "Tuesday" },
    { np: "बुधबार", en: "Wednesday" },
    { np: "बिहिबार", en: "Thursday" },
    { np: "शुक्रबार", en: "Friday" },
  ],
  periods: [
    { period: 1, time: "10:00 – 10:45" },
    { period: 2, time: "10:45 – 11:30" },
    { period: 3, time: "11:30 – 12:15" },
    { period: 4, time: "12:45 – 13:30" },
    { period: 5, time: "13:30 – 14:15" },
    { period: 6, time: "14:15 – 15:00" },
  ],
  grid: [
    ["Nepali", "Mathematics", "Science", "English", "Social Studies", "Computer"],
    ["Mathematics", "English", "Nepali", "Science", "Computer", "Health & PE"],
    ["Science", "Social Studies", "Mathematics", "Nepali", "English", "Optional Math"],
    ["English", "Nepali", "Computer", "Mathematics", "Science", "Social Studies"],
    ["Social Studies", "Science", "English", "Optional Math", "Nepali", "Mathematics"],
    ["Computer", "Health & PE", "Social Studies", "English", "Mathematics", "Library"],
  ],
  rooms: ["B-201", "B-202", "Lab-1", "B-201", "B-204", "IT Lab"],
};

export const subjectMeta: Record<string, { emoji: string; np: string; tone: string }> = {
  Nepali: { emoji: "📖", np: "नेपाली", tone: "chart-1" },
  English: { emoji: "🇬🇧", np: "अंग्रेजी", tone: "chart-3" },
  Mathematics: { emoji: "🧮", np: "गणित", tone: "chart-5" },
  Science: { emoji: "🔬", np: "विज्ञान", tone: "chart-2" },
  "Social Studies": { emoji: "🌏", np: "सामाजिक", tone: "chart-4" },
  Computer: { emoji: "💻", np: "कम्प्युटर", tone: "chart-3" },
  "Health & PE": { emoji: "🏅", np: "स्वास्थ्य", tone: "chart-2" },
  "Optional Math": { emoji: "📐", np: "ऐच्छिक गणित", tone: "chart-5" },
  Library: { emoji: "📚", np: "पुस्तकालय", tone: "chart-4" },
};

export const attendanceToday = students.map((s, i) => ({
  student: s,
  status: (["present", "present", "present", "late", "present", "absent", "present", "leave", "present", "present", "present", "present"] as const)[i] ?? "present",
}));

export const attendanceTrend = [
  { label: "बैशाख", en: "Baisakh", value: 93 },
  { label: "जेठ", en: "Jestha", value: 95 },
  { label: "असार", en: "Ashadh", value: 91 },
  { label: "साउन", en: "Shrawan", value: 88 },
  { label: "भदौ", en: "Bhadra", value: 92 },
  { label: "असोज", en: "Ashwin", value: 86 },
  { label: "कार्तिक", en: "Kartik", value: 94 },
  { label: "मंसिर", en: "Mangsir", value: 96 },
];

export const growthData = [
  { year: "2079", students: 682 },
  { year: "2080", students: 754 },
  { year: "2081", students: 823 },
  { year: "2082", students: 901 },
  { year: "2083", students: 1024 },
];

export const feeCollection = [
  { month: "बैशाख", en: "Baisakh", collected: 3820000, pending: 640000 },
  { month: "जेठ", en: "Jestha", collected: 4150000, pending: 510000 },
  { month: "असार", en: "Ashadh", collected: 3960000, pending: 720000 },
  { month: "साउन", en: "Shrawan", collected: 4420000, pending: 380000 },
  { month: "भदौ", en: "Bhadra", collected: 4610000, pending: 455000 },
  { month: "असोज", en: "Ashwin", collected: 4285000, pending: 610000 },
];

export const examPerformance = [
  { subject: "Nepali", first: 78, second: 82, final: 85 },
  { subject: "English", first: 72, second: 76, final: 81 },
  { subject: "Mathematics", first: 68, second: 74, final: 79 },
  { subject: "Science", first: 75, second: 79, final: 83 },
  { subject: "Social", first: 80, second: 83, final: 86 },
  { subject: "Computer", first: 88, second: 90, final: 92 },
];

export const classPerformance = classes.slice(0, 8).map((c, i) => ({
  name: `${c.grade}${c.section}`,
  gpa: [3.42, 3.18, 3.05, 3.61, 3.29, 3.48, 3.12, 3.74][i] ?? 3.2,
}));

export const exams = [
  { id: "EX-201", name: "First Terminal Examination", nameNp: "प्रथम त्रैमासिक परीक्षा", type: "Terminal", from: "2083-04-02", to: "2083-04-11", grades: "6 – 10", status: "Completed" },
  { id: "EX-202", name: "Second Terminal Examination", nameNp: "द्वितीय त्रैमासिक परीक्षा", type: "Terminal", from: "2083-07-14", to: "2083-07-23", grades: "6 – 10", status: "Completed" },
  { id: "EX-203", name: "SEE Pre-Board", nameNp: "एसईई प्रि-बोर्ड", type: "Board Prep", from: "2083-10-05", to: "2083-10-14", grades: "10", status: "Ongoing" },
  { id: "EX-204", name: "NEB Grade 12 Model", nameNp: "एनईबी कक्षा १२ मोडेल", type: "NEB", from: "2083-10-20", to: "2083-10-29", grades: "12", status: "Scheduled" },
  { id: "EX-205", name: "Annual Examination", nameNp: "वार्षिक परीक्षा", type: "Annual", from: "2083-12-03", to: "2083-12-14", grades: "6 – 9", status: "Scheduled" },
];

export const marksheet = [
  { subject: "Nepali", np: "नेपाली", full: 100, theory: 62, practical: 22, obtained: 84, grade: "A", gp: 3.6 },
  { subject: "English", np: "अंग्रेजी", full: 100, theory: 58, practical: 21, obtained: 79, grade: "A", gp: 3.55 },
  { subject: "Mathematics", np: "गणित", full: 100, theory: 66, practical: 23, obtained: 89, grade: "A+", gp: 3.9 },
  { subject: "Science", np: "विज्ञान", full: 100, theory: 60, practical: 24, obtained: 84, grade: "A", gp: 3.6 },
  { subject: "Social Studies", np: "सामाजिक अध्ययन", full: 100, theory: 63, practical: 20, obtained: 83, grade: "A", gp: 3.6 },
  { subject: "Computer Science", np: "कम्प्युटर विज्ञान", full: 50, theory: 28, practical: 18, obtained: 46, grade: "A+", gp: 4.0 },
  { subject: "Health & Physical Ed.", np: "स्वास्थ्य तथा शारीरिक शिक्षा", full: 50, theory: 30, practical: 14, obtained: 44, grade: "A", gp: 3.6 },
];

export const feeStructure = [
  { head: "Admission Fee", np: "भर्ना शुल्क", grade: "6 – 8", amount: 8500, frequency: "One-time" },
  { head: "Monthly Tuition", np: "मासिक शिक्षण शुल्क", grade: "6 – 8", amount: 3200, frequency: "Monthly" },
  { head: "Monthly Tuition", np: "मासिक शिक्षण शुल्क", grade: "9 – 10", amount: 3900, frequency: "Monthly" },
  { head: "Examination Fee", np: "परीक्षा शुल्क", grade: "All", amount: 1500, frequency: "Per term" },
  { head: "Transport (Lakeside route)", np: "यातायात (लेकसाइड मार्ग)", grade: "All", amount: 2100, frequency: "Monthly" },
  { head: "Library & Lab", np: "पुस्तकालय तथा प्रयोगशाला", grade: "All", amount: 1200, frequency: "Yearly" },
  { head: "Hostel (Twin sharing)", np: "छात्रावास (दुई जना)", grade: "All", amount: 9500, frequency: "Monthly" },
];

export const invoices = [
  { id: "INV-2083-1841", student: "Aarav Sharma", grade: "8A", amount: 6800, paid: 6800, method: "eSewa", date: "2083-09-14", status: "Paid" },
  { id: "INV-2083-1842", student: "Bibek Thapa", grade: "8B", amount: 6800, paid: 2300, method: "Khalti", date: "2083-09-14", status: "Partial" },
  { id: "INV-2083-1843", student: "Pratima Karki", grade: "9A", amount: 7400, paid: 5200, method: "Fonepay", date: "2083-09-15", status: "Partial" },
  { id: "INV-2083-1844", student: "Nischal Adhikari", grade: "9B", amount: 7400, paid: 0, method: "—", date: "2083-09-15", status: "Overdue" },
  { id: "INV-2083-1845", student: "Anjali Bhattarai", grade: "10A", amount: 7900, paid: 7900, method: "Bank Transfer", date: "2083-09-16", status: "Paid" },
  { id: "INV-2083-1846", student: "Sujan Tamang", grade: "10A", amount: 7900, paid: 2500, method: "Cash", date: "2083-09-16", status: "Partial" },
  { id: "INV-2083-1847", student: "Sabina Lama", grade: "12A", amount: 9200, paid: 9200, method: "eSewa", date: "2083-09-17", status: "Paid" },
];

export const paymentMethods = [
  { name: "eSewa", emoji: "💚", note: "Wallet · Instant confirmation", tone: "success" },
  { name: "Khalti", emoji: "💜", note: "Wallet · Instant confirmation", tone: "chart-5" },
  { name: "Fonepay", emoji: "🔷", note: "QR · All Nepali banks", tone: "info" },
  { name: "Bank Transfer", emoji: "🏦", note: "Nabil Bank · A/C 0201017500123", tone: "chart-4" },
  { name: "Cash", emoji: "💵", note: "School accounts counter", tone: "warning" },
];

export const homework = [
  { id: "HW-771", title: "Quadratic equations — Exercise 4.2", subject: "Mathematics", grade: "10A", due: "2083-09-21", submitted: 31, total: 38, status: "Open" },
  { id: "HW-772", title: "Essay: महाकवि देवकोटाको योगदान", subject: "Nepali", grade: "9A", due: "2083-09-19", submitted: 36, total: 36, status: "Closed" },
  { id: "HW-773", title: "Photosynthesis lab report", subject: "Science", grade: "9B", due: "2083-09-22", submitted: 18, total: 33, status: "Open" },
  { id: "HW-774", title: "Nepal's federal structure — mind map", subject: "Social Studies", grade: "8A", due: "2083-09-18", submitted: 27, total: 32, status: "Overdue" },
  { id: "HW-775", title: "HTML portfolio page", subject: "Computer", grade: "10B", due: "2083-09-24", submitted: 12, total: 35, status: "Open" },
];

export const courses = [
  { id: "CRS-01", title: "Algebra Foundations", titleNp: "बीजगणितको आधार", subject: "Mathematics", emoji: "🧮", lessons: 24, hours: 12, progress: 68, teacher: "Sarita Poudel" },
  { id: "CRS-02", title: "Living World of Science", titleNp: "विज्ञानको जीवित संसार", subject: "Science", emoji: "🔬", lessons: 18, hours: 9, progress: 45, teacher: "Ram Bahadur Thapa" },
  { id: "CRS-03", title: "नेपाली व्याकरण कक्षा", titleNp: "नेपाली व्याकरण कक्षा", subject: "Nepali", emoji: "📖", lessons: 20, hours: 10, progress: 82, teacher: "Nirmala Adhikari" },
  { id: "CRS-04", title: "Everyday English Speaking", titleNp: "दैनिक अंग्रेजी बोलचाल", subject: "English", emoji: "🇬🇧", lessons: 16, hours: 8, progress: 30, teacher: "Deepak Gurung" },
  { id: "CRS-05", title: "Geography of Nepal", titleNp: "नेपालको भूगोल", subject: "Social Studies", emoji: "🌏", lessons: 14, hours: 7, progress: 55, teacher: "Krishna Bhandari" },
  { id: "CRS-06", title: "Intro to Programming", titleNp: "प्रोग्रामिङ परिचय", subject: "Computer", emoji: "💻", lessons: 22, hours: 14, progress: 12, teacher: "Anita Shrestha" },
];

export const books = [
  { id: "LIB-1201", title: "मुनामदन", author: "लक्ष्मीप्रसाद देवकोटा", category: "Nepali Literature", copies: 24, available: 9, emoji: "📗" },
  { id: "LIB-1202", title: "Palpasa Café", author: "Narayan Wagle", category: "Fiction", copies: 15, available: 3, emoji: "📘" },
  { id: "LIB-1203", title: "Concepts of Physics", author: "H.C. Verma", category: "Science", copies: 18, available: 11, emoji: "📙" },
  { id: "LIB-1204", title: "शिरीषको फूल", author: "पारिजात", category: "Nepali Literature", copies: 20, available: 0, emoji: "📕" },
  { id: "LIB-1205", title: "Atlas of Nepal", author: "Survey Department", category: "Reference", copies: 8, available: 5, emoji: "🗺️" },
  { id: "LIB-1206", title: "Introduction to Algorithms", author: "Cormen et al.", category: "Computer", copies: 6, available: 2, emoji: "💻" },
];

export const bookIssues = [
  { book: "Palpasa Café", student: "Anjali Bhattarai", grade: "10A", issued: "2083-09-02", due: "2083-09-16", fine: 50, status: "Overdue" },
  { book: "मुनामदन", student: "Aarav Sharma", grade: "8A", issued: "2083-09-10", due: "2083-09-24", fine: 0, status: "Issued" },
  { book: "Concepts of Physics", student: "Sabina Lama", grade: "12A", issued: "2083-09-12", due: "2083-09-26", fine: 0, status: "Issued" },
  { book: "शिरीषको फूल", student: "Pratima Karki", grade: "9A", issued: "2083-08-28", due: "2083-09-11", fine: 120, status: "Overdue" },
];

export const routes = [
  { id: "RT-01", name: "Lakeside – Bagar", vehicle: "Ba 2 Kha 4471", driver: "Sanu Kaji Gurung", students: 34, stops: 9, status: "On route", eta: "07:42" },
  { id: "RT-02", name: "Bindhyabasini – Nadipur", vehicle: "Ga 1 Cha 2210", driver: "Bhim Bahadur Thapa", students: 28, stops: 7, status: "Completed", eta: "07:20" },
  { id: "RT-03", name: "Hemja – Sarangkot", vehicle: "Ba 4 Ja 1188", driver: "Dil Kumar Rai", students: 22, stops: 11, status: "Delayed", eta: "07:58" },
  { id: "RT-04", name: "Birauta – Chhorepatan", vehicle: "Ba 2 Kha 7734", driver: "Nirmal Pariyar", students: 31, stops: 8, status: "On route", eta: "07:49" },
];

export const hostelRooms = [
  { block: "Annapurna Block", room: "A-101", beds: 4, occupied: 4, warden: "Sabitri Neupane", type: "Boys" },
  { block: "Annapurna Block", room: "A-102", beds: 4, occupied: 3, warden: "Sabitri Neupane", type: "Boys" },
  { block: "Machhapuchhre Block", room: "M-201", beds: 3, occupied: 3, warden: "Kabita Ghimire", type: "Girls" },
  { block: "Machhapuchhre Block", room: "M-202", beds: 3, occupied: 1, warden: "Kabita Ghimire", type: "Girls" },
  { block: "Dhaulagiri Block", room: "D-301", beds: 2, occupied: 0, warden: "Prem Bahadur Basnet", type: "Boys" },
  { block: "Dhaulagiri Block", room: "D-302", beds: 2, occupied: 2, warden: "Prem Bahadur Basnet", type: "Boys" },
];

export const staff = [
  { id: "EMP-101", name: "Sarita Poudel", role: "Senior Teacher", dept: "Mathematics", salary: 62000, ssf: 6820, tax: 3100, status: "Active" },
  { id: "EMP-114", name: "Ram Bahadur Thapa", role: "Teacher", dept: "Science", salary: 54000, ssf: 5940, tax: 2700, status: "Active" },
  { id: "EMP-127", name: "Bina Shrestha", role: "Accountant", dept: "Accounts", salary: 48000, ssf: 5280, tax: 2400, status: "Active" },
  { id: "EMP-133", name: "Hari Prasad Ojha", role: "Librarian", dept: "Library", salary: 38000, ssf: 4180, tax: 1900, status: "On leave" },
  { id: "EMP-140", name: "Sanu Kaji Gurung", role: "Driver", dept: "Transport", salary: 29000, ssf: 3190, tax: 0, status: "Active" },
  { id: "EMP-152", name: "Kabita Ghimire", role: "Warden", dept: "Hostel", salary: 34000, ssf: 3740, tax: 1300, status: "Active" },
];

export const ledger = [
  { date: "2083-09-17", particular: "Monthly tuition collection — Grade 10", type: "Income", amount: 486000, mode: "eSewa" },
  { date: "2083-09-16", particular: "Science lab equipment — Pokhara Scientific", type: "Expense", amount: 128500, mode: "Bank Transfer" },
  { date: "2083-09-15", particular: "Staff salary — Bhadra", type: "Expense", amount: 2740000, mode: "Bank Transfer" },
  { date: "2083-09-14", particular: "Transport fee collection", type: "Income", amount: 214000, mode: "Fonepay" },
  { date: "2083-09-13", particular: "Library book purchase — Sajha Prakashan", type: "Expense", amount: 64200, mode: "Cheque" },
  { date: "2083-09-12", particular: "Admission fee — new intake", type: "Income", amount: 331500, mode: "Cash" },
];

export const notices = [
  { id: "NT-441", title: "दशैं तथा तिहार बिदा सूचना", titleEn: "Dashain & Tihar holiday notice", body: "विद्यालय असोज २५ गतेदेखि कार्तिक ८ गतेसम्म बन्द रहनेछ। कक्षा कार्तिक ९ गतेदेखि नियमित सञ्चालन हुनेछ।", audience: "All", date: "2083-09-16", pinned: true, emoji: "🪔" },
  { id: "NT-442", title: "SEE Pre-Board routine published", titleEn: "SEE Pre-Board routine published", body: "Grade 10 students can collect the pre-board examination routine from the class teacher or download it from the student portal.", audience: "Grade 10", date: "2083-09-15", pinned: true, emoji: "📝" },
  { id: "NT-443", title: "अभिभावक भेटघाट कार्यक्रम", titleEn: "Parent–teacher meeting", body: "कक्षा ६ देखि ९ का अभिभावकहरूका लागि भेटघाट कार्यक्रम असोज २० गते बिहान ८ बजे विद्यालय हलमा हुनेछ।", audience: "Parents", date: "2083-09-14", pinned: false, emoji: "👨‍👩‍👧" },
  { id: "NT-444", title: "Inter-house football tournament", titleEn: "Inter-house football tournament", body: "Annapurna, Machhapuchhre, Dhaulagiri and Langtang houses will compete at the school ground from Ashwin 22.", audience: "Students", date: "2083-09-12", pinned: false, emoji: "🏆" },
];

export const messages = [
  { from: "Sarita Poudel", role: "Mathematics Teacher", preview: "Aarav's algebra progress has improved a lot this term.", time: "10:24", unread: true },
  { from: "Accounts Office", role: "Finance", preview: "Bhadra invoice receipt has been generated for your child.", time: "09:10", unread: true },
  { from: "Nirmala Adhikari", role: "Nepali Teacher", preview: "निबन्ध प्रतियोगिताका लागि नाम दर्ता गर्नुहोला।", time: "Yesterday", unread: false },
  { from: "Transport Desk", role: "Operations", preview: "Route RT-03 will run 10 minutes late tomorrow morning.", time: "Yesterday", unread: false },
];

export const notifications = [
  { id: 1, group: "Today", emoji: "🎓", title: "New admission application", body: "Aayush Chaudhary applied for Grade 6.", time: "12 min ago", tone: "info" },
  { id: 2, group: "Today", emoji: "📝", title: "Assignment due tomorrow", body: "Quadratic equations — Exercise 4.2 (Grade 10A).", time: "1 hr ago", tone: "warning" },
  { id: 3, group: "Today", emoji: "💰", title: "Fee reminder sent", body: "Reminder delivered to 42 guardians for Bhadra dues.", time: "3 hrs ago", tone: "success" },
  { id: 4, group: "Yesterday", emoji: "📢", title: "School notice published", body: "Dashain & Tihar holiday notice is now live.", time: "Ashwin 16", tone: "info" },
  { id: 5, group: "Yesterday", emoji: "🏆", title: "Results published", body: "Second terminal results released for Grades 6–10.", time: "Ashwin 16", tone: "success" },
  { id: 6, group: "Earlier", emoji: "📅", title: "Event reminder", body: "Parent–teacher meeting on Ashwin 20, 8:00 AM.", time: "Ashwin 14", tone: "info" },
  { id: 7, group: "Earlier", emoji: "🚌", title: "Transport update", body: "Route RT-03 (Hemja–Sarangkot) delayed by 10 minutes.", time: "Ashwin 13", tone: "warning" },
];

export type CalendarEvent = {
  day: number;
  title: string;
  titleNp: string;
  type: "school" | "exam" | "result" | "academic" | "sports" | "cultural" | "meeting" | "holiday" | "admission";
  time?: string;
};

export const calendarEvents: CalendarEvent[] = [
  { day: 2, title: "Second term classes resume", titleNp: "दोस्रो सत्रको कक्षा सुरु", type: "academic", time: "10:00" },
  { day: 4, title: "Science exhibition", titleNp: "विज्ञान प्रदर्शनी", type: "school", time: "11:00" },
  { day: 7, title: "Constitution Day holiday", titleNp: "संविधान दिवस बिदा", type: "holiday" },
  { day: 9, title: "Inter-house football final", titleNp: "अन्तर-हाउस फुटबल फाइनल", type: "sports", time: "14:00" },
  { day: 12, title: "SEE pre-board begins", titleNp: "एसईई प्रि-बोर्ड सुरु", type: "exam", time: "09:00" },
  { day: 15, title: "Admission counselling day", titleNp: "भर्ना परामर्श दिवस", type: "admission", time: "10:30" },
  { day: 17, title: "Parent–teacher meeting", titleNp: "अभिभावक शिक्षक भेटघाट", type: "meeting", time: "08:00" },
  { day: 20, title: "Second terminal results", titleNp: "दोस्रो त्रैमासिक नतिजा", type: "result", time: "13:00" },
  { day: 23, title: "Cultural programme — Teej", titleNp: "सांस्कृतिक कार्यक्रम — तीज", type: "cultural", time: "12:00" },
  { day: 25, title: "Dashain vacation begins", titleNp: "दशैं बिदा सुरु", type: "holiday" },
];

export const eventTypeMeta: Record<CalendarEvent["type"], { emoji: string; label: string; labelNp: string; tone: string }> = {
  school: { emoji: "🏫", label: "School event", labelNp: "विद्यालय कार्यक्रम", tone: "info" },
  exam: { emoji: "📝", label: "Examination", labelNp: "परीक्षा", tone: "primary" },
  result: { emoji: "🎓", label: "Result", labelNp: "नतिजा", tone: "success" },
  academic: { emoji: "📚", label: "Academic", labelNp: "शैक्षिक", tone: "chart-3" },
  sports: { emoji: "🏆", label: "Sports", labelNp: "खेलकुद", tone: "warning" },
  cultural: { emoji: "🎭", label: "Cultural", labelNp: "सांस्कृतिक", tone: "chart-5" },
  meeting: { emoji: "👨‍👩‍👧", label: "Parent meeting", labelNp: "अभिभावक भेट", tone: "chart-4" },
  holiday: { emoji: "🇳🇵", label: "Nepal holiday", labelNp: "सार्वजनिक बिदा", tone: "destructive" },
  admission: { emoji: "📢", label: "Admission", labelNp: "भर्ना", tone: "chart-2" },
};

export const achievements = [
  { emoji: "🏆", title: "District Mathematics Olympiad — 2nd place", titleNp: "जिल्ला गणित ओलम्पियाड — दोस्रो स्थान", date: "2083-08-12" },
  { emoji: "🥇", title: "Inter-house debate champion", titleNp: "अन्तर-हाउस वादविवाद विजेता", date: "2083-07-04" },
  { emoji: "⭐", title: "100% attendance — Shrawan", titleNp: "शतप्रतिशत हाजिरी — साउन", date: "2083-05-30" },
  { emoji: "🔬", title: "Best science project — water filtration", titleNp: "उत्कृष्ट विज्ञान परियोजना — पानी छान्ने", date: "2083-04-18" },
];

export const npr = (n: number) => `रु ${n.toLocaleString("en-IN")}`;
