import { PubSummary, Schedule } from "../services/api";

// 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
const DAY_NAMES = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export function isDealOnDay(schedule: Schedule, dayIndex: number): boolean {
  if (!schedule) return false;
  if (schedule.days.length === 0) return true; // no days set = all days
  return schedule.days.includes(DAY_NAMES[dayIndex]);
}

export function pubHasDealOnDay(pub: PubSummary, dayIndex: number): boolean {
  const hasMatchingDeal = pub.deals?.some(d => isDealOnDay(d.schedule, dayIndex)) ?? false;
  const hasMatchingEvent = pub.events?.some(e => isDealOnDay(e.schedule, dayIndex)) ?? false;
  return hasMatchingDeal || hasMatchingEvent;
}
