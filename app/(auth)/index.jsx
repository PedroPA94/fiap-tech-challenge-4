import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Button from "../../src/presentation/components/button";
import Input from "../../src/presentation/components/input";
import Logo from "../../src/presentation/components/logo";
import Typography from "../../src/presentation/components/typography";
import { useAuth } from "../../src/presentation/contexts/AuthContext";
import { useForm } from "../../src/presentation/hooks/useForm";
import { useValidators } from "../../src/presentation/hooks/useValidators";
import {
  colors,
  spacing,
  typography,
} from "../../src/presentation/styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Login = () => {
  const router = useRouter();
  const { login, isLoading, error: authError } = useAuth();
  const { validateEmail, validateText } = useValidators();

  const validateLogin = (values) => {
    const errors = {};

    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;

    const passwordError = validateText(values.password, 6);
    if (passwordError) errors.password = passwordError;

    return errors;
  };

  const { values, errors, handleChange, handleSubmit } = useForm(
    { email: "", password: "" },
    validateLogin,
  );

  const register = () => {
    router.navigate("/register");
  };

  const handleLogin = async (validValues) => {
    try {
      await login(validValues.email, validValues.password);
    } catch (err) {
      console.error("Erro de login:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={styles.logoContainer}
          entering={FadeInDown.duration(350).springify()}
        >
          <Logo />
          <View style={styles.pageTitle}>
            <Typography weight="bold" style={styles.title}>
              Bytebank
            </Typography>
            <Typography style={styles.subtitle}>
              Você no controle do seu futuro
            </Typography>
          </View>
        </Animated.View>
        <Animated.View
          style={styles.inputContainer}
          entering={FadeInDown.delay(200).duration(350).springify()}
        >
          {authError && (
            <Typography style={styles.errorMessage}>{authError}</Typography>
          )}

          <Input
            value={values.email}
            onChangeText={(text) => handleChange("email", text)}
            label="Email"
            placeholder="exemplo@email.com"
            icon={<Ionicons name="mail-outline" size={20} color="#94A3B8" />}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
            errorMsg={errors.email}
            textContentType="email"
            editable={!isLoading}
          />
          <Input
            value={values.password}
            onChangeText={(text) => handleChange("password", text)}
            label="Senha"
            placeholder="••••••••"
            icon={
              <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
            }
            autoCapitalize="none"
            error={!!errors.password}
            errorMsg={errors.password}
            textContentType="password"
            secureTextEntry
            editable={!isLoading}
          />

          <Button
            onPress={() => handleSubmit(handleLogin)}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color={colors.white} /> : "Entrar"}
          </Button>
          <Button onPress={register} secondary disabled={isLoading}>
            Criar conta
          </Button>
        </Animated.View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    alignItems: "center",
    gap: spacing.xl,
    marginBottom: spacing.xl,
  },
  pageTitle: {
    gap: spacing.md,
  },
  title: {
    textAlign: "center",
    fontSize: typography.size.xl,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: "center",
    fontSize: typography.size.md,
  },
  inputContainer: {
    width: "100%",
    gap: spacing.lg,
  },
  errorMessage: {
    color: colors.danger,
    fontSize: typography.size.sm,
    textAlign: "center",
  },
});
