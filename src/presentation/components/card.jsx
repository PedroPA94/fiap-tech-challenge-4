import { Pressable, StyleSheet, View } from "react-native";
import { colors, radius, spacing } from "../styles/theme";

const Card = ({ children, kind = "neutral", style, onPress }) => {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          kind === "primary" && styles.primary,
          pressed && styles.pressed,
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[styles.card, kind === "primary" && styles.primary, style]}>
      {children}
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
});
