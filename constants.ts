// Override with EXPO_PUBLIC_API_URL env var at build time, e.g.:
//   EXPO_PUBLIC_API_URL=http://46.224.206.197:8000 npx expo export --platform web
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000";
