import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors, radius, spacing, typography } from "../styles/theme";
import Typography from "./typography";

const Input = ({ label, icon, style, error = false, errorMsg, ...props }) => {
  const [focused, setFocused] = useState(false);

  const containerStyles = [
    styles.inputContainer,
    focused && !error && styles.focused,
    error && styles.errorContainer,
  ];

  return (
    <View>
      {label && <Typography style={styles.label}>{label}</Typography>}

      <View style={containerStyles}>
        {icon && <View style={styles.icon}>{icon}</View>}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </View>

      {error && errorMsg && (
        <Typography style={styles.errorText}>{errorMsg}</Typography>
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
    color: colors.textPrimary,
    fontSize: typography.size.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  errorContainer: {
    borderColor: colors.danger,
    borderWidth: 2,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
  },
  errorText: {
    marginTop: spacing.xs,
    paddingLeft: spacing.xs,
    fontSize: typography.size.xs,
    color: colors.danger,
  },
});
