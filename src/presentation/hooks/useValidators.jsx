import { useCallback } from "react";

// Limites de caracteres para validação em tempo real
const CHAR_LIMITS = {
  name: 100,
  email: 255,
  description: 500,
  password: 128,
};

const PASSWORD_REGEX =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\d)(?=.*?[#?!@$%^&*-]).{8,128}$/;

export function useValidators() {
  const requiredField = "Campo obrigatório";

  const validateEmail = useCallback((value, required = true) => {
    const email = value?.trim() ?? "";

    if (required && !email) {
      return requiredField;
    }

    if (email.length > CHAR_LIMITS.email) {
      return `Email não pode exceder ${CHAR_LIMITS.email} caracteres`;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Email inválido";
    }

    return "";
  }, []);

  const validateText = useCallback(
    (value, min = 1, max = CHAR_LIMITS.description, required = true) => {
      const texto = value?.trim() ?? "";

      if (required && !texto) {
        return requiredField;
      }

      if (texto && texto.length < min) {
        return `Deve ter no mínimo ${min} caracteres`;
      }

      if (texto && texto.length > max) {
        return `Não pode exceder ${max} caracteres`;
      }

      return "";
    },
    [],
  );

  const validateValue = useCallback((value, required = true) => {
    if (required && !value?.trim()) {
      return "Valor obrigatório";
    }

    if (value && Number.isNaN(Number.parseFloat(value))) {
      return "Insira um valor numérico válido";
    }

    return "";
  }, []);

  const validateName = useCallback(
    (value, required = true) => {
      return validateText(value, 3, CHAR_LIMITS.name, required);
    },
    [validateText],
  );

  const validatePassword = useCallback((value, required = true) => {
    const password = value?.trim() ?? "";

    if (required && !password) {
      return requiredField;
    }

    if (password && password.length < 8) {
      return "Senha deve ter no mínimo 8 caracteres";
    }

    if (password && password.length > CHAR_LIMITS.password) {
      return `Senha não pode exceder ${CHAR_LIMITS.password} caracteres`;
    }

    if (password && !PASSWORD_REGEX.test(password)) {
      return "Senha deve incluir ao menos uma letra maiúscula, minúscula, número e símbolo";
    }

    return "";
  }, []);

  return {
    validateEmail,
    validateText,
    validateValue,
    validateName,
    validatePassword,
    CHAR_LIMITS,
  };
}
