import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Input from "../../../components/input";
import Typography from "../../../components/typography";
import { categories, colors, spacing, typography } from "../../../styles/theme";

const TransactionsFilter = ({
  search,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedDate,
  onDateChange,
}) => {
  const categoryOptions = Object.entries(categories)
    .sort(([keyA, valueA], [keyB, valueB]) => {
      if (keyA === "income") return -1;
      if (keyB === "income") return 1;

      return valueA.label.localeCompare(valueB.label, "pt-BR");
    })
    .map(([key, value]) => ({
      id: key,
      label: value.label,
      color: value.baseColor,
    }));

  const [showDatePicker, setShowDatePicker] = useState(false);

  const clearDate = () => {
    onDateChange(null);
  };

  const handleDateSelect = (event, date) => {
    setShowDatePicker(false);

    if (!date || event.type === "dismissed") {
      clearDate();
      return;
    }

    const formatted =
      String(date.getDate()).padStart(2, "0") +
      "/" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "/" +
      date.getFullYear();

    onDateChange(formatted);
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Buscar transação..."
        value={search}
        onChangeText={onSearchChange}
        icon={<Ionicons name="search" size={20} color={colors.textSecondary} />}
        style={styles.input}
      />

      <View style={styles.dateFilterContainer}>
        <Typography style={styles.sectionLabel}>Data</Typography>

        <View style={styles.dateInputWrapper}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Input
              placeholder="DD/MM/AAAA"
              value={selectedDate || ""}
              editable={false}
              pointerEvents="none"
              icon={
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.textSecondary}
                />
              }
            />
          </TouchableOpacity>

          {selectedDate && (
            <TouchableOpacity style={styles.clearButton} onPress={clearDate}>
              <Ionicons
                name="close-circle"
                size={30}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={handleDateSelect}
            />
          )}
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <Typography style={styles.sectionLabel}>Categorias</Typography>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollContent}
        >
          {categoryOptions.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() =>
                onCategoryChange(
                  selectedCategory === category.id ? null : category.id,
                )
              }
            >
              <View
                style={[
                  styles.categoryDot,
                  { backgroundColor: category.color },
                  selectedCategory === category.id && styles.categoryDotActive,
                ]}
              />
              <Typography
                style={[
                  styles.categoryLabel,
                  selectedCategory === category.id &&
                    styles.categoryLabelActive,
                ]}
              >
                {category.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default TransactionsFilter;

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  filterButtons: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  filterButton: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  dateFilterContainer: {
    gap: spacing.sm,
  },
  sectionLabel: {
    fontSize: typography.size.sm,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  categoriesContainer: {
    gap: spacing.sm,
  },
  categoriesScrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  categoryButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  categoryDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryLabel: {
    fontSize: typography.size.xs,
    color: colors.textPrimary,
  },
  categoryLabelActive: {
    fontWeight: "bold",
    color: colors.primary,
  },
  dateInputWrapper: {
    position: "relative",
  },
  clearButton: {
    position: "absolute",
    right: spacing.md,
    top: "40%",
    transform: [{ translateY: -10 }],
  },
});
