import "react-native-get-random-values";
import CryptoJS from "crypto-js";

/**
 * Utilidade para criptografia de dados sensíveis
 * Usa a chave de encriptação da variável de ambiente
 */

const ENCRYPTION_KEY = process.env.EXPO_PUBLIC_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error(
    "EXPO_PUBLIC_ENCRYPTION_KEY não definida. Configure a variável de ambiente.",
  );
}

export const encryptionUtils = {
  /**
   * Encripta um valor usando AES-256
   * @param {string} plainText - Texto a ser encriptado
   * @returns {string} Texto encriptado em formato base64
   */
  encrypt: (plainText) => {
    if (!plainText) return null;

    try {
      const encrypted = CryptoJS.AES.encrypt(
        plainText,
        ENCRYPTION_KEY,
      ).toString();
      return encrypted;
    } catch (error) {
      console.error("Erro ao encriptar dados:", error);
      throw new Error("Falha ao encriptar dados sensíveis");
    }
  },

  /**
   * Desencripta um valor encriptado com AES-256
   * @param {string} encryptedText - Texto encriptado
   * @returns {string} Texto desencriptado
   */
  decrypt: (encryptedText) => {
    if (!encryptedText) return null;

    try {
      const decrypted = CryptoJS.AES.decrypt(
        encryptedText,
        ENCRYPTION_KEY,
      ).toString(CryptoJS.enc.Utf8);
      return decrypted;
    } catch (error) {
      console.error("Erro ao desencriptar dados:", error);
      throw new Error("Falha ao desencriptar dados");
    }
  },

  /**
   * Encripta um objeto JSON
   * @param {Object} obj - Objeto a ser encriptado
   * @returns {string} JSON encriptado
   */
  encryptObject: (obj) => {
    if (!obj) return null;

    try {
      const jsonString = JSON.stringify(obj);
      return encryptionUtils.encrypt(jsonString);
    } catch (error) {
      console.error("Erro ao encriptar objeto:", error);
      throw new Error("Falha ao encriptar objeto");
    }
  },

  /**
   * Desencripta um objeto JSON
   * @param {string} encryptedJson - JSON encriptado
   * @returns {Object} Objeto desencriptado
   */
  decryptObject: (encryptedJson) => {
    if (!encryptedJson) return null;

    try {
      const jsonString = encryptionUtils.decrypt(encryptedJson);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Erro ao desencriptar objeto:", error);
      throw new Error("Falha ao desencriptar objeto");
    }
  },
};
