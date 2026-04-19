import { StyleSheet, TextInput, View } from "react-native";
import Typography from "../../../components/typography";
import { colors, spacing, typography } from "../../../styles/theme";

export default function TransactionValueInput({
  type,
  value,
  onChangeText,
  error,
  errorMsg,
}) {
  return (
    <View style={styles.valueSection}>
      <Typography style={styles.valueLabel}>Valor</Typography>
      <View style={styles.valueInputGroup}>
        <Typography
          weight="bold"
          style={[
            styles.valueCurrency,
            {
              color: type === "income" ? colors.success : colors.danger,
            },
          ]}
        >
          R$
        </Typography>
        <TextInput
          placeholder="0,00"
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          style={[
            styles.valueInput,
            {
              color: type === "income" ? colors.success : colors.danger,
            },
          ]}
        />
      </View>
      {error && errorMsg && (
        <Typography style={styles.errorText}>{errorMsg}</Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  valueSection: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  valueLabel: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    textTransform: "uppercase",
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  valueInputGroup: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  valueCurrency: {
    fontSize: typography.size.lg,
    marginRight: spacing.sm,
  },
  valueInput: {
    fontSize: 48,
    fontFamily: typography.fontFamily.semibold,
    textAlign: "center",
    width: 200,
  },
  errorText: {
    marginTop: spacing.xs,
    paddingLeft: spacing.xs,
    fontSize: typography.size.xs,
    color: colors.danger,
  },
});
