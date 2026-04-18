import { StyleSheet, View } from "react-native";
import Card from "../../../components/card";
import InfoTile from "../../../components/infoTile";
import Typography from "../../../components/typography";
import { colors, spacing, typography } from "../../../styles/theme";
import { useTransactions } from "../../../contexts/TransactionsContext";

const Balance = () => {
  const { transactions } = useTransactions();

  const totalBalance = transactions.reduce((sum, t) => {
    return sum + t.value;
  }, 0);

  const totalIncome = transactions
    .filter((t) => t.isIncome())
    .reduce((sum, t) => sum + t.value, 0);

  const totalExpenses = transactions
    .filter((t) => t.isExpense())
    .reduce((sum, t) => sum + t.getAbsoluteValue(), 0);

  const formatCurrency = (value) => {
    return (
      "R$ " +
      new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value)
    );
  };

  return (
    <Card kind="primary" style={styles.container}>
      <View style={styles.balanceWrapper}>
        <Typography style={styles.balanceLabel}>Saldo total</Typography>
        <Typography weight="bold" style={styles.balanceValue}>
          {formatCurrency(totalBalance)}
        </Typography>
      </View>
      <View style={styles.infoWrapper}>
        <InfoTile
          value={formatCurrency(totalIncome)}
          category={{
            icon: "arrow-down-circle-outline",
            label: "Receitas",
            baseColor: colors.white,
            softColor: colors.primarySoft,
          }}
        />

        <InfoTile
          value={formatCurrency(totalExpenses)}
          category={{
            icon: "arrow-up-circle-outline",
            label: "Despesas",
            baseColor: colors.white,
            softColor: colors.primarySoft,
          }}
        />
      </View>
    </Card>
  );
};

export default Balance;

const styles = StyleSheet.create({
  container: {
    gap: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  balanceWrapper: {
    gap: spacing.sm,
  },
  balanceLabel: {
    color: colors.white,
    fontSize: typography.size.sm,
  },
  balanceValue: {
    color: colors.white,
    fontSize: typography.size.xl,
  },
  infoWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
