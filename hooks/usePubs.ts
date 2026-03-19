import { useQuery } from "@tanstack/react-query";
import { getAllPubs, getPub, getPubsNearby } from "../services/api";

export function useNearbyPubs(lat: number | null, lng: number | null, radius_km?: number) {
  return useQuery({
    queryKey: ["pubs", "nearby", lat, lng, radius_km],
    queryFn: () =>
      lat !== null && lng !== null
        ? getPubsNearby(lat, lng, radius_km)
        : getAllPubs(),
    enabled: true,
  });
}

export function usePub(id: number) {
  return useQuery({
    queryKey: ["pub", id],
    queryFn: () => getPub(id),
  });
}
