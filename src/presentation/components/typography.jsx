import { Text } from "react-native";
import { colors, typography } from "../styles/theme";

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

export default Typography;
