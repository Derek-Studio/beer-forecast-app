import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#0D1B2A" },
          headerTintColor: "#fff",
          contentStyle: { backgroundColor: "#0D1B2A" },
          headerBackTitle: "",
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="hourly" options={{ title: "Hourly Forecast" }} />
        <Stack.Screen name="forecast" options={{ title: "14-Day Forecast" }} />
        <Stack.Screen name="map" options={{ title: "Nearby Pubs", headerTitleAlign: "center" }} />
        <Stack.Screen name="pub/[id]" options={{ title: "" }} />
      </Stack>
    </QueryClientProvider>
  );
}
