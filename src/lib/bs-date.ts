/**
 * Bikram Sambat (BS) <-> Gregorian (AD) conversion utilities.
 * Reference anchor: 1 Baisakh 2075 BS = 14 April 2018 AD.
 * Presentation-only helper for the school calendar UI.
 */

export const BS_START_YEAR = 2075;

const BS_MONTH_DAYS: Record<number, number[]> = {
  2075: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2076: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2077: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2078: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2079: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2081: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 30],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2083: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2086: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2087: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2088: [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2089: [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 31],
  2090: [30, 31, 32, 32, 31, 30, 30, 30, 29, 30, 29, 31],
};

const ANCHOR_AD = Date.UTC(2018, 3, 14);
const DAY = 86400000;

export const BS_MONTHS_NP = [
  "बैशाख",
  "जेठ",
  "असार",
  "साउन",
  "भदौ",
  "असोज",
  "कार्तिक",
  "मंसिर",
  "पुष",
  "माघ",
  "फागुन",
  "चैत",
];

export const BS_MONTHS_EN = [
  "Baisakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

export const WEEKDAYS_NP = ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"];
export const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export type BsDate = { year: number; month: number; day: number };

export function daysInBsMonth(year: number, month: number): number {
  return BS_MONTH_DAYS[year]?.[month - 1] ?? 30;
}

export function adToBs(date: Date): BsDate {
  const utc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  let diff = Math.floor((utc - ANCHOR_AD) / DAY);
  let year = BS_START_YEAR;
  let month = 1;
  while (diff > 0) {
    const dim = daysInBsMonth(year, month);
    if (diff < dim) break;
    diff -= dim;
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return { year, month, day: diff + 1 };
}

export function bsToAd(bs: BsDate): Date {
  let days = 0;
  let y = BS_START_YEAR;
  let m = 1;
  while (y < bs.year || (y === bs.year && m < bs.month)) {
    days += daysInBsMonth(y, m);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  days += bs.day - 1;
  return new Date(ANCHOR_AD + days * DAY);
}

const NP_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];

export function toNepaliDigits(value: number | string): string {
  return String(value).replace(/\d/g, (d) => NP_DIGITS[Number(d)] ?? d);
}

export function formatBs(bs: BsDate, lang: "np" | "en" = "np"): string {
  if (lang === "np") {
    return `${toNepaliDigits(bs.day)} ${BS_MONTHS_NP[bs.month - 1]} ${toNepaliDigits(bs.year)}`;
  }
  return `${bs.day} ${BS_MONTHS_EN[bs.month - 1]} ${bs.year} BS`;
}

export function formatAd(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** Fixed "today" so the seeded UI always tells a consistent story. */
export const TODAY_AD = new Date(2026, 6, 17);
export const TODAY_BS = adToBs(TODAY_AD);
