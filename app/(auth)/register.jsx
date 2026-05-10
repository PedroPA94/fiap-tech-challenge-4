import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, ActivityIndicator, Alert } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useState } from "react";
import Button from "../../src/presentation/components/button";
import Input from "../../src/presentation/components/input";
import Typography from "../../src/presentation/components/typography";
import { useForm } from "../../src/presentation/hooks/useForm";
import { useValidators } from "../../src/presentation/hooks/useValidators";
import {
  colors,
  spacing,
  typography,
} from "../../src/presentation/styles/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAuth } from "../../src/presentation/state/hooks/useAuth";

const Register = () => {
  const router = useRouter();
  const { register, isLoading: authLoading } = useAuth();
  const { validateEmail, validateText } = useValidators();
  const [registroError, setRegistroError] = useState(null);

  const validateRegister = (values) => {
    const errors = {};

    const nameError = validateText(values.name, 3);
    if (nameError) errors.name = nameError;

    const emailError = validateEmail(values.email);
    if (emailError) errors.email = emailError;

    const passwordError = validateText(values.password, 6);
    if (passwordError) errors.password = passwordError;

    return errors;
  };

  const { values, errors, handleFormChange, handleFormSubmit } = useForm(
    { name: "", email: "", password: "" },
    validateRegister,
  );

  const handleRegister = async (validValues) => {
    setRegistroError(null);

    try {
      await register(validValues.name, validValues.email, validValues.password);
      Alert.alert("Sucesso", "Conta criada com sucesso! Bem-vindo!");
    } catch (error) {
      const errorMsg = error.message || "Erro ao criar conta";
      setRegistroError(errorMsg);
      Alert.alert("Erro", errorMsg);
    }
  };

  const goToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.content}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageTitle}>
          <Typography weight="bold" style={styles.title}>
            Criar conta
          </Typography>
          <Typography style={styles.subtitle}>
            Comece a organizar sua vida financeira {"\n"}hoje mesmo!
          </Typography>
        </View>
        <Animated.View
          style={styles.animatedContainer}
          entering={FadeInDown.duration(350).springify()}
        >
          {registroError && (
            <Typography
              style={{ color: colors.danger, marginBottom: spacing.md }}
            >
              {registroError}
            </Typography>
          )}

          <View style={styles.inputContainer}>
            <Input
              value={values.name}
              onChangeText={(text) => handleFormChange("name", text)}
              label="Nome completo"
              placeholder="Seu nome"
              icon={
                <Ionicons name="person-outline" size={20} color="#94A3B8" />
              }
              error={!!errors.name}
              errorMsg={errors.name}
              editable={!authLoading}
            />
            <Input
              value={values.email}
              onChangeText={(text) => handleFormChange("email", text)}
              label="Email"
              placeholder="exemplo@email.com"
              icon={<Ionicons name="mail-outline" size={20} color="#94A3B8" />}
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              errorMsg={errors.email}
              textContentType="email"
              editable={!authLoading}
            />
            <Input
              value={values.password}
              onChangeText={(text) => handleFormChange("password", text)}
              label="Senha"
              placeholder="••••••••"
              icon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#94A3B8"
                />
              }
              autoCapitalize="none"
              error={!!errors.password}
              errorMsg={errors.password}
              textContentType="password"
              secureTextEntry
              editable={!authLoading}
            />
          </View>
          <Button
            onPress={() => handleFormSubmit(handleRegister)}
            style={{ marginTop: spacing.md }}
            disabled={authLoading}
          >
            {authLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              "Cadastrar"
            )}
          </Button>
          <Button onPress={goToLogin} secondary disabled={authLoading}>
            Voltar ao login
          </Button>
        </Animated.View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Register;

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
  pageTitle: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    textAlign: "left",
    fontSize: typography.size.xl,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: "left",
    fontSize: typography.size.md,
  },
  animatedContainer: {
    gap: spacing.lg,
  },
  inputContainer: {
    gap: spacing.lg,
  },
});
