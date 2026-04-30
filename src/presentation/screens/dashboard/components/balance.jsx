import { ActivityIndicator, StyleSheet, View } from "react-native";
import Card from "../../../components/card";
import InfoTile from "../../../components/infoTile";
import Typography from "../../../components/typography";
import { colors, spacing, typography } from "../../../styles/theme";
import { formatCurrency } from "../../../utils/currencyFormatter";
import { useSummary } from "../../../state/hooks/useSummary";

const Balance = () => {
  const { summary, isLoading } = useSummary();

  return (
    <Card kind="primary" style={styles.container}>
      {isLoading ||
        (!summary && (
          <View style={{ paddingVertical: spacing.lg }}>
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        ))}

      {!isLoading && summary && (
        <>
          <View style={styles.balanceWrapper}>
            <Typography style={styles.balanceLabel}>Saldo total</Typography>

            <Typography weight="bold" style={styles.balanceValue}>
              {formatCurrency(summary.balance)}
            </Typography>
          </View>
          <View style={styles.infoWrapper}>
            <InfoTile
              value={formatCurrency(summary.totalIncome)}
              category={{
                icon: "arrow-down-circle-outline",
                label: "Receitas",
                baseColor: colors.white,
                softColor: colors.primarySoft,
              }}
            />

            <InfoTile
              value={formatCurrency(summary.totalExpenses)}
              category={{
                icon: "arrow-up-circle-outline",
                label: "Despesas",
                baseColor: colors.white,
                softColor: colors.primarySoft,
              }}
            />
          </View>
        </>
      )}
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
