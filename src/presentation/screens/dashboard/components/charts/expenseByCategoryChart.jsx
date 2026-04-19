import { View, StyleSheet } from "react-native";
import { useMemo } from "react";
import { PieChart } from "react-native-gifted-charts";
import Card from "../../../../components/card";
import Typography from "../../../../components/typography";
import { transformExpensesByCategoryData } from "../../../../utils/chartDataTransformers";
import { colors, spacing, radius } from "../../../../styles/theme";

const ExpenseByCategoryChart = ({ transactions = [] }) => {
  const chartData = useMemo(() => {
    const data = transformExpensesByCategoryData(transactions);
    return data;
  }, [transactions]);

  const renderLegend = () => {
    if (chartData.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Typography style={styles.emptyText}>
            Sem despesas registradas
          </Typography>
        </View>
      );
    }

    return (
      <View style={styles.legend}>
        {chartData.map((item, index) => (
          <View key={`${item.categoryKey}-${index}`} style={styles.legendItem}>
            <View
              style={[styles.legendColor, { backgroundColor: item.color }]}
            />
            <View style={styles.legendInfo}>
              <Typography style={styles.legendLabel}>{item.label}</Typography>
              <Typography style={styles.legendValue}>
                {item.percentage}%
              </Typography>
            </View>
          </View>
        ))}
      </View>
    );
  };

  if (chartData.length === 0) {
    return (
      <Card>
        <Typography weight="bold" style={styles.title}>
          Despesas por categoria
        </Typography>
        <View style={styles.emptyState}>
          <Typography style={styles.emptyText}>
            Nenhuma despesa registrada
          </Typography>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <Typography weight="bold" style={styles.title}>
        Despesas por categoria
      </Typography>

      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          strokeWidth={4}
          strokeColor="#fff"
          donut
          radius={80}
          innerRadius={50}
          innerCircleColor={colors.white}
        />
      </View>

      {renderLegend()}
    </Card>
  );
};

export default ExpenseByCategoryChart;

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.lg,
    height: 300,
  },
  centerLabel: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabelText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  legend: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: radius.sm,
  },
  legendInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  legendLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  legendValue: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "600",
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
