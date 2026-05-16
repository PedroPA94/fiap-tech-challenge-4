import { StyleSheet, TouchableOpacity, View } from "react-native";
import { colors, radius, spacing } from "../styles/theme";
import PropTypes from "prop-types";

const IconButton = ({ icon, onPress, secondary, round, style }) => {
  return (
    <TouchableOpacity
      style={[
        style,
        styles.base,
        secondary ? styles.secondary : styles.primary,
        round ? styles.round : styles.regularBorder,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon && <View style={styles.icon}>{icon}</View>}
    </TouchableOpacity>
  );
};

IconButton.propTypes = {
  icon: PropTypes.node,
  onPress: PropTypes.func,
  secondary: PropTypes.bool,
  round: PropTypes.bool,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
  ]),
};

IconButton.defaultProps = {
  icon: null,
  onPress: undefined,
  secondary: false,
  round: false,
  style: undefined,
};

export default IconButton;

const styles = StyleSheet.create({
  base: {
    justifyContent: "center",
    alignItems: "center",
    height: spacing.xxl,
    width: spacing.xxl,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.white,
  },
  round: {
    borderRadius: radius.lg,
  },
  regularBorder: {
    borderRadius: radius.sm,
  },
  icon: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
