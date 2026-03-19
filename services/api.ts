import { API_BASE_URL } from "../constants";

export type Schedule = {
  recurring: boolean;
  days: string[];       // ["monday", "thursday"]
  date: string;         // ISO date for one-off, "" if recurring
  time_open: string;    // "17:00" or ""
  time_close: string;   // "21:00" or ""
  all_day: boolean;     // true if no specific time window
};

export type Deal = {
  title: string;
  description: string;
  category: string;
  schedule: Schedule;
  source_url: string;
  screenshot_path?: string;
  screenshot_min_height?: number;
};

export type Event = {
  title: string;
  description: string;
  category: string;
  schedule: Schedule;
  source_url: string;
  screenshot_path?: string;
  screenshot_min_height?: number;
};

export type OpeningTime = {
  day: string;   // "monday"
  open: string;  // "10:00"
  close: string; // "23:00"
};

export type SocialMedia = {
  platform: string;
  url: string;
  username: string;
};

export type PubSummary = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  distance_km?: number;
  venue_emoji?: string;
  website?: string | null;
  deals: Deal[];
  events: Event[];
};

export type PubDetail = PubSummary & {
  opening_times: OpeningTime[];
  venue_description: { text: string; source_url: string } | null;
  facilities: { name: string; source_url: string }[];
  social_media: SocialMedia[];
  promotions_last_updated: string | null;
};

export async function getPubsNearby(
  lat: number,
  lng: number,
  radius_km = 20
): Promise<PubSummary[]> {
  const res = await fetch(
    `${API_BASE_URL}/pubs/nearby?lat=${lat}&lng=${lng}&radius_km=${radius_km}`
  );
  if (!res.ok) throw new Error("Failed to fetch nearby pubs");
  return res.json();
}

export async function getAllPubs(): Promise<PubSummary[]> {
  const res = await fetch(`${API_BASE_URL}/pubs`);
  if (!res.ok) throw new Error("Failed to fetch pubs");
  return res.json();
}

export async function getPub(id: number): Promise<PubDetail> {
  const res = await fetch(`${API_BASE_URL}/pubs/${id}`);
  if (!res.ok) throw new Error("Failed to fetch pub");
  return res.json();
}
