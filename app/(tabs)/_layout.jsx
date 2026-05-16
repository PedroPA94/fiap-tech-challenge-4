import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import PropTypes from "prop-types";
import { colors } from "../../src/presentation/styles/theme";

const HomeTabIcon = ({ color, focused }) => (
  <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />
);

HomeTabIcon.propTypes = {
  color: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired,
};

const TransactionsTabIcon = ({ color, focused }) => (
  <Ionicons
    name={focused ? "receipt" : "receipt-outline"}
    size={22}
    color={color}
  />
);

TransactionsTabIcon.propTypes = {
  color: PropTypes.string.isRequired,
  focused: PropTypes.bool.isRequired,
};

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
          tabBarIcon: HomeTabIcon,
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Extrato",
          tabBarIcon: TransactionsTabIcon,
        }}
      />
    </Tabs>
  );
}
