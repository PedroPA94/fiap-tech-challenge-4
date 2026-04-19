import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Typography from "../../../components/typography";
import {
  categories,
  colors,
  radius,
  spacing,
  typography,
} from "../../../styles/theme";

export default function TransactionCategorySelector({
  type,
  category,
  onCategoryChange,
  showCategoryPicker,
  onShowPickerChange,
  error,
  errorMsg,
}) {
  const getCategoryOptions = () => {
    return Object.entries(categories)
      .filter(([key]) => {
        if (type === "income") {
          return key === "income";
        }
        return key !== "income";
      })
      .map(([key, value]) => ({
        key,
        label: value.label,
      }));
  };

  const categoryOptions = getCategoryOptions();
  const selectedCategoryLabel =
    categories[category]?.label || "Selecione uma categoria";
  const isCategoryDisabled = type === "income";

  return (
    <View>
      <Typography style={styles.fieldLabel}>Categoria</Typography>
      <TouchableOpacity
        style={[
          styles.categorySelector,
          isCategoryDisabled && styles.categorySelectorDisabled,
        ]}
        onPress={() =>
          !isCategoryDisabled && onShowPickerChange(!showCategoryPicker)
        }
        disabled={isCategoryDisabled}
      >
        <Ionicons
          name={categories[category]?.icon || "ellipsis-horizontal-circle"}
          size={20}
          color={categories[category]?.baseColor || colors.textSecondary}
        />
        <Typography style={styles.categorySelectorText}>
          {selectedCategoryLabel}
        </Typography>
        {!isCategoryDisabled && (
          <Ionicons
            name={showCategoryPicker ? "chevron-up" : "chevron-down"}
            size={20}
            color={colors.textSecondary}
          />
        )}
      </TouchableOpacity>

      {showCategoryPicker && !isCategoryDisabled && (
        <View style={styles.categoryDropdown}>
          {categoryOptions.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={styles.categoryOption}
              onPress={() => {
                onCategoryChange(cat.key);
                onShowPickerChange(false);
              }}
            >
              <Ionicons
                name={categories[cat.key]?.icon}
                size={20}
                color={categories[cat.key]?.baseColor}
              />
              <Typography
                style={[
                  styles.categoryOptionText,
                  category === cat.key && styles.categoryOptionTextActive,
                ]}
              >
                {cat.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {error && errorMsg && (
        <Typography style={styles.errorText}>{errorMsg}</Typography>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldLabel: {
    fontSize: typography.size.sm,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  categorySelectorText: {
    flex: 1,
    color: colors.textPrimary,
  },
  categoryDropdown: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  categoryOptionText: {
    flex: 1,
    color: colors.textPrimary,
  },
  categoryOptionTextActive: {
    fontFamily: typography.fontFamily.semibold,
    color: colors.primary,
  },
  categorySelectorDisabled: {
    opacity: 0.7,
  },
  errorText: {
    marginTop: spacing.xs,
    paddingLeft: spacing.xs,
    fontSize: typography.size.xs,
    color: colors.danger,
  },
});
