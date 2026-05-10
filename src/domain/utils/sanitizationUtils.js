/**
 * Utilitários de sanitização para prevenir XSS e injection attacks
 */

export const sanitizationUtils = {
  /**
   * Normaliza texto genérico
   */
  sanitizeText: (text, maxLength = 255) => {
    if (typeof text !== "string") return "";

    return text
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\p{Cc}/gu, "") // remove caracteres de controle
      .slice(0, maxLength);
  },

  /**
   * Normaliza email
   */
  sanitizeEmail: (email, maxLength = 255) => {
    if (typeof email !== "string") return "";

    return email.trim().toLowerCase().replace(/\s+/g, "").slice(0, maxLength);
  },

  /**
   * Sanitiza valores numéricos
   */
  sanitizeNumber: (value) => {
    const num = Number(value);

    if (Number.isNaN(num)) {
      throw new Error("Número inválido");
    }

    return num;
  },

  /**
   * Valida comprimento de string
   */
  validateLength: (text, min, max) => {
    if (typeof text !== "string") return false;
    const length = text.trim().length;
    return length >= min && length <= max;
  },

  /**
   * Remove espaços extras
   */
  normalizeWhitespace: (text) => {
    if (typeof text !== "string") return "";
    return text.trim().replace(/\s+/g, " ");
  },
};
