import { Text } from "react-native";
import { colors, typography } from "../styles/theme";
import PropTypes from "prop-types";

const Typography = ({ children, weight, style }) => {
  return (
    <Text
      style={[
        {
          fontSize: typography.size.md,
          color: colors.textPrimary,
          fontFamily:
            weight === "bold"
              ? typography.fontFamily.semibold
              : typography.fontFamily.regular,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

Typography.propTypes = {
  children: PropTypes.node.isRequired,
  weight: PropTypes.oneOf(["regular", "bold"]),
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
  ]),
};

Typography.defaultProps = {
  weight: "regular",
  style: undefined,
};

export default Typography;
