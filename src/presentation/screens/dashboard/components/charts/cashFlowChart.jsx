import { View, StyleSheet } from "react-native";
import { useMemo } from "react";
import { BarChart } from "react-native-gifted-charts";
import Card from "../../../../components/card";
import Typography from "../../../../components/typography";
import { transformCashFlowData } from "../../../../utils/chartDataTransformers";
import { colors, spacing } from "../../../../styles/theme";

const INCOME_COLOR = colors.success;
const EXPENSE_COLOR = colors.danger;

const CashFlowChart = ({ transactions = [] }) => {
  const chartData = useMemo(() => {
    const data = transformCashFlowData(transactions);
    return data;
  }, [transactions]);

  const barData = useMemo(() => {
    if (chartData.length === 0) {
      return [];
    }

    const formattedData = chartData.flatMap((item) => [
      {
        value: item.income || 0,
        frontColor: INCOME_COLOR,
        label: item.label,
        spacing: 4,
      },
      {
        value: item.expense || 0,
        frontColor: EXPENSE_COLOR,
      },
    ]);

    return formattedData;
  }, [chartData]);

  const renderLegend = () => {
    return (
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: INCOME_COLOR }]}
          />
          <Typography style={styles.legendLabel}>Receita</Typography>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendColor, { backgroundColor: EXPENSE_COLOR }]}
          />
          <Typography style={styles.legendLabel}>Despesa</Typography>
        </View>
      </View>
    );
  };

  if (chartData.length === 0 || barData.length === 0) {
    return (
      <Card>
        <Typography weight="bold" style={styles.title}>
          Fluxo de caixa
        </Typography>
        <View style={styles.emptyState}>
          <Typography style={styles.emptyText}>
            Nenhuma transação registrada
          </Typography>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <Typography weight="bold" style={styles.title}>
        Fluxo de caixa
      </Typography>

      {renderLegend()}

      <View style={styles.chartContainer}>
        <BarChart
          data={barData}
          barWidth={32}
          spacing={12}
          height={250}
          horizontal={false}
          xAxisThickness={1}
          xAxisColor={colors.border}
          yAxisThickness={0}
          yAxisTextStyle={styles.yAxisText}
          xAxisLabelTextStyle={styles.xAxisText}
          noOfSections={5}
          scrollToEnd={true}
        />
      </View>
    </Card>
  );
};

export default CashFlowChart;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
  },
  chartContainer: {
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    overflow: "hidden",
  },
  legend: {
    flexDirection: "row",
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  yAxisText: {
    fontSize: 1,
    color: "transparent",
  },
  xAxisText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
