import { useState, useEffect } from "react";
import { FlatList, StyleSheet, View, ActivityIndicator } from "react-native";
import Animated, { Easing, FadeInLeft } from "react-native-reanimated";
import Typography from "../../components/typography";
import { spacing, typography, colors } from "../../styles/theme";
import TransactionItem from "./components/transactionItem";
import TransactionsFilter from "./components/transactionsFilter";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTransactions } from "../../state/hooks/useTransactions";

const TransactionsScreen = () => {
  const router = useRouter();
  const { transactions, isLoading, loadTransactions } = useTransactions();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter((transaction) => {
    if (selectedCategory && !transaction.matchesCategory(selectedCategory)) {
      return false;
    }

    if (!transaction.matchesDate(selectedDate)) return false;

    if (!transaction.matchesSearch(search)) return false;

    return true;
  });

  const formattedTransactions = filteredTransactions.map((t) => ({
    ...t,
    formattedDate: new Intl.DateTimeFormat("pt-BR").format(new Date(t.date)),
  }));

  const editTransaction = (id) => {
    router.push("(modals)/transaction?id=" + id);
  };

  if (isLoading && transactions.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Typography weight="bold" style={styles.title}>
          Transações
        </Typography>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Typography weight="bold" style={styles.title}>
        Transações
      </Typography>

      <View style={styles.transactionsWrapper}>
        <FlatList
          ListHeaderComponent={
            <View style={{ marginBottom: spacing.lg }}>
              <TransactionsFilter
                search={search}
                onSearchChange={setSearch}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </View>
          }
          data={formattedTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <AnimatedTransactionItem
              item={item}
              index={index}
              editTransaction={editTransaction}
            />
          )}
          ItemSeparatorComponent={<View style={{ height: spacing.md }} />}
          contentContainerStyle={{
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.md,
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography style={styles.emptyText}>
                Nenhuma transação encontrada
              </Typography>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default TransactionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: typography.size.lg,
  },
  transactionsWrapper: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: typography.size.md,
  },
});

const AnimatedTransactionItem = ({ item, index, editTransaction }) => {
  return (
    <Animated.View
      collapsable={false}
      entering={FadeInLeft.delay(index * 50)
        .duration(320)
        .easing(Easing.out(Easing.cubic))}
    >
      <TransactionItem
        category={item.category}
        value={item.value}
        description={item.description}
        date={item.formattedDate}
        onPress={() => editTransaction(item.id)}
      />
    </Animated.View>
  );
};
