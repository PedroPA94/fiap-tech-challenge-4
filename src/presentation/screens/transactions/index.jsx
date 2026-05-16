import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FlatList, StyleSheet, View, ActivityIndicator } from "react-native";
import Animated, { Easing, FadeInLeft } from "react-native-reanimated";
import Typography from "../../components/typography";
import { spacing, typography, colors } from "../../styles/theme";
import TransactionItem from "./components/transactionItem";
import TransactionsFilter from "./components/transactionsFilter";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTransactions } from "../../state/hooks/useTransactions";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const TransactionsScreen = () => {
  const router = useRouter();

  const {
    transactions,
    isLoading,
    isLoadingMore,
    hasMore,
    loadTransactions,
    loadMore,
    setFilters,
  } = useTransactions();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  useEffect(() => {
    setFilters({
      category: selectedCategory,
      date: selectedDate,
    });

    loadTransactions();
  }, [selectedCategory, selectedDate]);

  const formattedTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.matchesSearch(debouncedSearch))
      .map((t) => ({
        ...t,
        formattedDate: new Intl.DateTimeFormat("pt-BR").format(
          new Date(t.date),
        ),
      }));
  }, [transactions, debouncedSearch]);

  const editTransaction = useCallback(
    (id) => {
      router.push("(modals)/transaction?id=" + id);
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <AnimatedTransactionItem
          item={item}
          editTransaction={editTransaction}
        />
      );
    },
    [editTransaction],
  );

  const ListHeader = useMemo(
    () => (
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
    ),
    [search, selectedCategory, selectedDate],
  );

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
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          data={formattedTransactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.md,
          }}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Typography style={styles.emptyText}>
                Nenhuma transação encontrada
              </Typography>
            </View>
          }
          onEndReached={() => {
            if (!isLoadingMore && hasMore) {
              loadMore();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator style={{ marginVertical: spacing.md }} />
            ) : null
          }
          refreshing={isLoading}
          onRefresh={() => loadTransactions()}
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

const AnimatedTransactionItem = React.memo(({ item, editTransaction }) => {
  return (
    <Animated.View collapsable={false} entering={FadeInLeft.duration(250)}>
      <TransactionItem
        category={item.category}
        value={item.value}
        description={item.description}
        date={item.date}
        onPress={() => editTransaction(item.id)}
      />
    </Animated.View>
  );
});

AnimatedTransactionItem.displayName = "AnimatedTransactionItem";
