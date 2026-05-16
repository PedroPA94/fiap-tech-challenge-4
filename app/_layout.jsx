import {
  Inter_400Regular,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Provider } from "react-redux";
import { store } from "../src/presentation/state/store";
import { useAuth } from "../src/presentation/state/hooks/useAuth";

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
      <Provider store={store}>
        <RootNavigation />
      </Provider>
    </SafeAreaProvider>
  );
}

function RootNavigation() {
  const { isAuthenticated, isLoadingSecure } = useAuth();

  if (isLoadingSecure) {
    return null;
  }

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
