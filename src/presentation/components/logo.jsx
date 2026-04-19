import Entypo from "@expo/vector-icons/Entypo";
import { StyleSheet, View } from "react-native";
import { colors, radius, shadow } from "../styles/theme";

const Logo = () => {
  return (
    <View style={styles.container}>
      <Entypo name="wallet" size={32} color="white" />
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({
  container: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadow,
  },
});
