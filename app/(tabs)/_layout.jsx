import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { colors } from "../../src/presentation/styles/theme";

const HomeTabIcon = ({ color, focused }) => (
  <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
);

const TransactionsTabIcon = ({ color, focused }) => (
  <Ionicons
    name={focused ? "receipt" : "receipt-outline"}
    size={22}
    color={color}
  />
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarStyle: {
          backgroundColor: colors.white,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, focused }) => (
            <HomeTabIcon color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Extrato",
          tabBarIcon: ({ color, focused }) => (
            <TransactionsTabIcon color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
