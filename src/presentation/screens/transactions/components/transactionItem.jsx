import { StyleSheet, View } from "react-native";
import Card from "../../../components/card";
import InfoTile from "../../../components/infoTile";
import Typography from "../../../components/typography";
import { categories, colors, spacing, typography } from "../../../styles/theme";
import { Ionicons } from "@expo/vector-icons";

const TransactionItem = ({ value, date, description, category, onPress }) => {
  const categoryData = categories[category] ?? categories.other;

  const isNegative = value < 0;

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value));

  const displayValue = isNegative
    ? `- R$ ${formattedValue}`
    : `R$ ${formattedValue}`;

  const valueColor = isNegative ? colors.danger : colors.success;

  return (
    <Card style={styles.container}>
      <InfoTile
        value={description}
        tone="light"
        category={categoryData}
        reversed
      />

      <View style={styles.inner}>
        <Typography style={styles.date}>{date}</Typography>

        <Typography weight="bold" style={{ color: valueColor }}>
          {displayValue}
        </Typography>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="grey"
        style={styles.chevron}
        onPress={onPress}
      />
    </Card>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
  },
  inner: {
    alignItems: "flex-end",
    paddingEnd: spacing.xs,
  },
  date: {
    color: colors.textSecondary,
    fontSize: typography.size.xs,
  },
  chevron: {
    position: "absolute",
    right: 6,
  },
});
