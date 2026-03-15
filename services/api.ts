import { API_BASE_URL } from "../constants";

export type Promotion = {
  description: string;
  discount: string;
  days: string;
  time: string;
  source_url: string;
};

export type PubSummary = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  distance_km: number;
  promotions: Promotion[] | null;
};

export type PubDetail = PubSummary & {
  website: string | null;
  promotions_last_updated: string | null;
};

export async function getPubsNearby(
  lat: number,
  lng: number,
  radius_km = 2
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
