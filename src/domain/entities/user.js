import { sanitizationUtils } from "../utils/sanitizationUtils";

// Limites de caracteres
const CONSTRAINTS = {
  name: { min: 3, max: 100 },
  email: { min: 5, max: 255 },
};

export const makeUser = (data) => {
  const sanitizedEmail = sanitizationUtils.sanitizeEmail(data.email);
  const sanitizedName = sanitizationUtils.sanitizeText(
    data.name,
    CONSTRAINTS.name.max,
  );

  if (!sanitizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedEmail)) {
    throw new Error("Email inválido");
  }

  if (
    !sanitizationUtils.validateLength(
      sanitizedEmail,
      CONSTRAINTS.email.min,
      CONSTRAINTS.email.max,
    )
  ) {
    throw new Error(
      `Email deve ter entre ${CONSTRAINTS.email.min} e ${CONSTRAINTS.email.max} caracteres`,
    );
  }

  if (!sanitizedName?.trim()) {
    throw new Error("Nome é obrigatório");
  }

  if (
    !sanitizationUtils.validateLength(
      sanitizedName,
      CONSTRAINTS.name.min,
      CONSTRAINTS.name.max,
    )
  ) {
    throw new Error(
      `Nome deve ter entre ${CONSTRAINTS.name.min} e ${CONSTRAINTS.name.max} caracteres`,
    );
  }

  return Object.freeze({
    id: data.id,
    email: sanitizedEmail,
    name: sanitizationUtils.normalizeWhitespace(sanitizedName),

    isEmailValid: function () {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    },

    getFirstName: function () {
      return this.name.split(" ")[0];
    },

    toJSON() {
      return {
        id: this.id,
        email: this.email,
        name: this.name,
      };
    },
  });
};
