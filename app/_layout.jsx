import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  AuthProvider,
  useAuth,
} from "../src/presentation/contexts/AuthContext";
import { TransactionsProvider } from "../src/presentation/contexts/TransactionsContext";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TransactionsProvider>
          <RootNavigation />
        </TransactionsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function RootNavigation() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(tabs)" />

        <Stack.Screen
          name="(modals)/transaction"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}
