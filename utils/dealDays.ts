import { PubSummary } from "../services/api";

// 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
const DAY_NAMES = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_SHORT = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

function parseDayIndex(s: string): number {
  const lower = s.trim().toLowerCase();
  const full = DAY_NAMES.indexOf(lower);
  if (full !== -1) return full;
  const short = DAY_SHORT.indexOf(lower);
  return short;
}

export function isDealOnDay(days: string, dayIndex: number): boolean {
  if (!days) return false;
  const d = days.toLowerCase().trim();

  // Always-on patterns
  if (
    d === "daily" || d === "every day" || d === "all days" || d === "all day" ||
    d === "always" || d === "all week"
  ) return true;

  // Ignore non-specific values
  if (
    d === "n/a" || d === "not specified" || d === "variable" ||
    d.startsWith("specific dates") || d.startsWith("february") ||
    d.startsWith("april") || d.startsWith("various") || d.includes("/")
  ) return false;

  // "Monday to Sunday" / "Monday to Friday" / "Friday to Sunday" / "Friday - Sunday"
  const rangeMatch = d.match(/(\w+)\s+(?:to|-)\s+(\w+)/);
  if (rangeMatch) {
    const start = parseDayIndex(rangeMatch[1]);
    const end = parseDayIndex(rangeMatch[2]);
    if (start !== -1 && end !== -1) {
      if (start <= end) return dayIndex >= start && dayIndex <= end;
      // wraps around (e.g. Friday to Monday)
      return dayIndex >= start || dayIndex <= end;
    }
  }

  // "Monday, Tuesday, Wednesday" or "Saturday & Sunday"
  const parts = d.split(/[,&]+/).map(s => s.trim());
  for (const part of parts) {
    if (parseDayIndex(part) === dayIndex) return true;
  }

  // Single day
  if (parseDayIndex(d) === dayIndex) return true;

  return false;
}

export function pubHasDealOnDay(pub: PubSummary, dayIndex: number): boolean {
  if (!pub.promotions?.length) return false;
  return pub.promotions.some(p => isDealOnDay(p.days, dayIndex));
}
