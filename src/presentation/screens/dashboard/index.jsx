import { StyleSheet, View, ScrollView } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { shadow, spacing } from "../../styles/theme";
import Balance from "./components/balance";
import Header from "./components/header";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import IconButton from "../../components/iconButton";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "../../contexts/TransactionsContext";
import { useEffect } from "react";
import ExpenseByCategoryChart from "./components/charts/expenseByCategoryChart";
import CashFlowChart from "./components/charts/cashFlowChart";

const DashboardScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loadTransactions, transactions } = useTransactions();

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadTransactions();
      } catch (err) {
        console.error("Erro ao carregar transações:", err);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTransaction = () => {
    router.push("/(modals)/transaction");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.headerContainer}>
        <Header />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInDown.delay(200).duration(350).springify()}
        >
          <Balance />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600).duration(350).springify()}
          style={styles.chartsContainer}
        >
          <ExpenseByCategoryChart transactions={transactions} />
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(350).springify()}
          style={styles.chartsContainer}
        >
          <CashFlowChart transactions={transactions} />
        </Animated.View>
      </ScrollView>

      <View style={[styles.addButton, { bottom: insets.bottom }]}>
        <IconButton
          onPress={addTransaction}
          icon={<Ionicons name="add" size={24} color="white" />}
          round
          style={shadow}
        />
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  chartsContainer: {
    width: "100%",
  },
  addButton: {
    position: "absolute",
    right: 30,
  },
});
