import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors, radius, spacing, typography } from "../styles/theme";
import Typography from "./typography";
import PropTypes from "prop-types";

const Input = ({
  label,
  icon,
  style,
  error = false,
  errorMsg,
  hint,
  ...props
}) => {
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

      {hint && !error && (
        <Typography style={styles.hintText}>{hint}</Typography>
      )}
    </View>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
  ]),
  error: PropTypes.bool,
  errorMsg: PropTypes.string,
  hint: PropTypes.string,
};

Input.defaultProps = {
  label: undefined,
  icon: null,
  style: undefined,
  error: false,
  errorMsg: undefined,
  hint: undefined,
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
  hintText: {
    marginTop: spacing.xs,
    paddingLeft: spacing.xs,
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },
  errorText: {
    marginTop: spacing.xs,
    paddingLeft: spacing.xs,
    fontSize: typography.size.xs,
    color: colors.danger,
  },
});
