import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import IconButton from "../../../components/iconButton";
import Typography from "../../../components/typography";
import { colors, spacing, typography } from "../../../styles/theme";
import { useAuth } from "../../../state/hooks/useAuth";

const Header = () => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const userName = user.getFirstName() || "Usuário";

  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <Ionicons name="person-circle" color={colors.primary} size={60} />
        <View>
          <Typography style={styles.subtitle}>Boas-vindas,</Typography>
          <Typography weight="bold" style={styles.title}>
            {userName}
          </Typography>
        </View>
      </View>
      <IconButton
        icon={<Ionicons name="log-out-outline" size={25} color="#94A3B8" />}
        secondary
        onPress={handleLogout}
      />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingEnd: spacing.sm,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  title: {
    textAlign: "start",
    fontSize: typography.size.xl,
  },
  subtitle: {
    textAlign: "start",
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },
});
