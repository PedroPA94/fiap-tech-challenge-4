import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { colors, spacing, typography } from "../styles/theme";
import Typography from "./typography";

const InfoTile = ({
  category,
  value,
  tone = "dark",
  reversed = false,
  style,
}) => {
  const toneMap = {
    light: {
      labelColor: colors.textSecondary,
      valueColor: colors.textPrimary,
    },
    dark: {
      labelColor: colors.white,
      valueColor: colors.white,
    },
  };

  const selectedTone = toneMap[tone] ?? toneMap.dark;

  const first = reversed ? value : category.label;
  const second = reversed ? category.label : value;

  const firstStyle = reversed
    ? [styles.value, { color: selectedTone.valueColor }]
    : [styles.label, { color: selectedTone.labelColor }];
  const firstWeight = reversed ? "bold" : "regular";

  const secondStyle = reversed
    ? [styles.label, { color: selectedTone.labelColor }]
    : [styles.value, { color: selectedTone.valueColor }];
  const secondWeight = reversed ? "regular" : "bold";

  return (
    <View style={[styles.container, style]}>
      <View
        style={[styles.iconWrapper, { backgroundColor: category.softColor }]}
      >
        <Ionicons name={category.icon} size={25} color={category.baseColor} />
      </View>

      <View style={styles.textWrapper}>
        <Typography weight={firstWeight} style={firstStyle}>
          {first}
        </Typography>
        <Typography weight={secondWeight} style={secondStyle}>
          {second}
        </Typography>
      </View>
    </View>
  );
};

export default InfoTile;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
    flexShrink: 1,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.size.xxs,
    textTransform: "uppercase",
    letterSpacing: 0.25,
  },
  value: {
    fontSize: typography.size.sm,
  },
});
