# beer-forecast-app

React Native + Expo frontend for the Beer Forecast project.

## What it does

Displays nearby pubs with their drink promotions/deals. Uses the `beer-forecast` FastAPI backend running at `localhost:8000`.

## Key screens

- **Nearby tab** (`/`) — lists pubs sorted by distance, requests GPS permission on load
- **Map tab** (`/map`) — shows pub markers on a map (native only; hidden on web)
- **Pub detail** (`/pub/[id]`) — pub info + full promotions list

## Tech stack

- Expo (managed workflow) with `expo-router` v3 for file-based routing
- `@tanstack/react-query` for data fetching and caching
- `react-native-maps` for the map view (native only)
- `expo-location` for GPS
- TypeScript throughout

## Running locally

```bash
# Start the backend first
cd /root/projects/beer-forecast
.venv/bin/uvicorn api.main:app --reload

# Start the frontend (web is fastest to iterate)
cd /root/projects/beer-forecast-app
npx expo start --web
```

## API config

`constants.ts` sets `API_BASE_URL = "http://localhost:8000"`.
For a physical device, replace with your machine's LAN IP.
