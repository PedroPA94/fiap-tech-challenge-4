import { Stack } from "expo-router";
import { colors } from "../../src/presentation/styles/theme";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="register"
        options={{
          headerTitle: "",
          headerTransparent: false,
          animation: "fade",
          headerBackVisible: true,
        }}
      />
    </Stack>
  );
}
