import { StyleSheet, TouchableOpacity } from "react-native";
import { colors, radius, shadow, spacing } from "../styles/theme";
import Typography from "./typography";

const Button = ({ children, onPress, secondary, style }) => {
  return (
    <TouchableOpacity
      style={[
        style,
        styles.base,
        secondary ? styles.secondary : styles.primary,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Typography
        weight="bold"
        style={secondary ? styles.textSecondary : styles.textPrimary}
      >
        {children}
      </Typography>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadow,
  },
  secondary: {
    backgroundColor: colors.background,
    borderWidth: 0,
  },
  textPrimary: {
    color: colors.white,
  },
  textSecondary: {
    color: colors.textSecondary,
  },
});
