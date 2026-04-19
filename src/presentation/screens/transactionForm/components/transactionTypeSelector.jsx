import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "../../../components/typography";
import { colors, radius, spacing, typography } from "../../../styles/theme";

export default function TransactionTypeSelector({ type, onTypeChange }) {
  return (
    <View style={styles.typeSelector}>
      <TouchableOpacity
        style={[
          styles.typeButton,
          type === "expense" && styles.typeButtonActive,
        ]}
        onPress={() => onTypeChange("expense")}
      >
        <Typography
          weight="bold"
          style={[
            styles.typeButtonText,
            type === "expense" && styles.typeButtonTextActive,
          ]}
        >
          Despesa
        </Typography>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.typeButton,
          type === "income" && styles.typeButtonActive,
        ]}
        onPress={() => onTypeChange("income")}
      >
        <Typography
          weight="bold"
          style={[
            styles.typeButtonText,
            type === "income" && styles.typeButtonTextActive,
            { color: colors.success },
          ]}
        >
          Receita
        </Typography>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  typeSelector: {
    flexDirection: "row",
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderRadius: radius.lg,
    marginBottom: spacing.xl,
    gap: spacing.xs,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: colors.white,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeButtonText: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
  },
  typeButtonTextActive: {
    color: colors.danger,
  },
});
