import { useCallback } from "react";

export function useValidators() {
  const requiredField = "Campo obrigatório";

  const validateEmail = useCallback((value, required = true) => {
    const email = value?.trim() ?? "";

    if (required && !email) {
      return requiredField;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Email inválido";
    }

    return "";
  }, []);

  const validateText = useCallback((value, min = 1, required = true) => {
    const texto = value?.trim() ?? "";

    if (required && !texto) {
      return requiredField;
    }

    if (texto && texto.length < min) {
      return `Deve ter no mínimo ${min} caracteres`;
    }

    return "";
  }, []);

  const validateValue = useCallback((value, required = true) => {
    if (required && !value?.trim()) {
      return "Valor obrigatório";
    }

    if (value && isNaN(parseFloat(value))) {
      return "Insira um valor numérico válido";
    }

    return "";
  }, []);

  return {
    validateEmail,
    validateText,
    validateValue,
  };
}
