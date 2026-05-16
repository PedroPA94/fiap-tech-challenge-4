import { StyleSheet, View } from "react-native";
import Card from "../../../components/card";
import InfoTile from "../../../components/infoTile";
import Typography from "../../../components/typography";
import { categories, colors, spacing, typography } from "../../../styles/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { formatCurrency } from "../../../utils/currencyFormatter";
import PropTypes from "prop-types";

const TransactionItem = ({ value, date, description, category, onPress }) => {
  const categoryData = categories[category] ?? categories.other;

  const formattedValue = formatCurrency(value);
  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat("pt-BR").format(new Date(date));
  }, [date]);

  const isNegative = value < 0;
  const valueColor = isNegative ? colors.danger : colors.success;
  const valueStyle = {
    color: valueColor,
  };

  return (
    <Card style={styles.container} onPress={onPress}>
      <InfoTile
        value={description}
        tone="light"
        category={categoryData}
        reversed
      />

      <View style={styles.inner}>
        <Typography style={styles.date}>{formattedDate}</Typography>

        <Typography weight="bold" style={valueStyle}>
          {formattedValue}
        </Typography>
      </View>

      <Ionicons name="chevron-forward" size={20} color="grey" />
    </Card>
  );
};

TransactionItem.propTypes = {
  value: PropTypes.number.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};

TransactionItem.defaultProps = {
  onPress: undefined,
};

export default React.memo(TransactionItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inner: {
    alignItems: "flex-end",
    paddingEnd: spacing.xs,
  },
  date: {
    color: colors.textSecondary,
    fontSize: typography.size.xs,
  },
});
