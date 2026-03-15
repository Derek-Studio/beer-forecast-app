import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#F59E0B",
          headerStyle: { backgroundColor: "#1a1a1a" },
          headerTintColor: "#fff",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Nearby",
            tabBarLabel: "Nearby",
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: "Map",
            tabBarLabel: "Map",
            // Hide Map tab on web — react-native-maps doesn't work on web
            href: Platform.OS === "web" ? null : "/map",
          }}
        />
        <Tabs.Screen
          name="pub/[id]"
          options={{
            href: null, // Never show this in the tab bar
          }}
        />
      </Tabs>
    </QueryClientProvider>
  );
}
