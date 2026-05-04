import { secureStorage } from "./secureStorage";

/**
 * Gerenciador seguro de tokens de autenticação
 * Armazena tokens de forma criptografada no Keychain do dispositivo
 *
 * Nota: As chaves devem conter apenas caracteres alpanuméricos, ".", "-", e "_"
 * conforme requisitos do expo-secure-store
 */

const TOKEN_KEY = "bytebank_auth_token";
const USER_DATA_KEY = "bytebank_user_data";

export const authTokenManager = {
  /**
   * Salva o token de autenticação de forma segura
   * @param {string} token - Token JWT
   * @returns {Promise<boolean>}
   */
  saveToken: async (token) => {
    if (!token) {
      throw new Error("Token não pode estar vazio");
    }
    return await secureStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Recupera o token de autenticação armazenado
   * @returns {Promise<string|null>}
   */
  getToken: async () => {
    return await secureStorage.getItem(TOKEN_KEY);
  },

  /**
   * Remove o token de autenticação
   * @returns {Promise<boolean>}
   */
  clearToken: async () => {
    return await secureStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Verifica se um token está armazenado
   * @returns {Promise<boolean>}
   */
  hasToken: async () => {
    const token = await authTokenManager.getToken();
    return !!token;
  },

  /**
   * Salva dados do usuário de forma segura
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<boolean>}
   */
  saveUserData: async (userData) => {
    if (!userData) {
      throw new Error("Dados do usuário não podem estar vazios");
    }
    const userDataString = JSON.stringify(userData);
    return await secureStorage.setItem(USER_DATA_KEY, userDataString);
  },

  /**
   * Recupera dados do usuário armazenados
   * @returns {Promise<Object|null>}
   */
  getUserData: async () => {
    const userData = await secureStorage.getItem(USER_DATA_KEY);
    if (!userData) return null;
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Erro ao parsear dados do usuário:", error);
      return null;
    }
  },

  /**
   * Remove dados do usuário
   * @returns {Promise<boolean>}
   */
  clearUserData: async () => {
    return await secureStorage.removeItem(USER_DATA_KEY);
  },

  /**
   * Limpa toda a informação de autenticação (logout)
   * @returns {Promise<boolean>}
   */
  clearAll: async () => {
    try {
      await authTokenManager.clearToken();
      await authTokenManager.clearUserData();
      return true;
    } catch (error) {
      console.error("Erro ao limpar autenticação:", error);
      throw new Error("Falha ao limpar dados de autenticação");
    }
  },
};
