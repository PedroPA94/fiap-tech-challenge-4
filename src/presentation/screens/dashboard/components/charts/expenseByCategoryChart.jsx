import { View, StyleSheet } from "react-native";
import { useMemo } from "react";
import { PieChart } from "react-native-gifted-charts";
import Card from "../../../../components/card";
import Typography from "../../../../components/typography";
import { colors, spacing, radius, categories } from "../../../../styles/theme";
import { useAnalytics } from "../../../../state/hooks/useAnalytics";
import { ActivityIndicator } from "react-native-web";

const ExpenseByCategoryChart = () => {
  const { analytics, isLoading } = useAnalytics();

  const chartData = useMemo(() => {
    if (!analytics?.expensesByCategory) return [];

    const entries = Object.entries(analytics.expensesByCategory);

    const total = entries.reduce((sum, [, value]) => sum + value, 0);

    return entries
      .map(([categoryKey, value]) => {
        const category = categories[categoryKey] || categories.other;
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;

        return {
          value,
          percentage,
          text: `${percentage}%`,
          color: category.baseColor,
          label: category.label,
          categoryKey,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [analytics]);

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

  if (isLoading) {
    return (
      <Card>
        <View style={{ paddingVertical: spacing.lg }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Card>
    );
  }

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
