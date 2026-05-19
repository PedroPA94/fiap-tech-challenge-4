import * as SecureStore from "expo-secure-store";

/**
 * Gerenciador seguro de tokens de autenticação
 * Usa expo-secure-store para armazenar dados sensíveis de sessão. *
 *
 * Nota: As chaves devem conter apenas caracteres alfanuméricos, ".", "-", e "_"
 * conforme requisitos do expo-secure-store
 */

const TOKEN_KEY = process.env.EXPO_PUBLIC_TOKEN_KEY;
const USER_DATA_KEY = process.env.EXPO_PUBLIC_USER_DATA_KEY;

const secureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

/**
 * Salva o token de autenticação de forma segura.
 * @param {string} token - Token de autenticação
 * @returns {Promise<boolean>}
 */
const saveToken = async (token) => {
  if (!token) {
    throw new Error("Token não pode estar vazio");
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token, secureStoreOptions);
  return true;
};

/**
 * Recupera o token de autenticação armazenado
 * @returns {Promise<string|null>}
 */
const getToken = async () => {
  return SecureStore.getItemAsync(TOKEN_KEY, secureStoreOptions);
};

/**
 * Remove o token de autenticação
 * @returns {Promise<boolean>}
 */
const clearToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY, secureStoreOptions);
  return true;
};

/**
 * Salva dados do usuário de forma segura
 * @param {Object} userData - Dados do usuário
 * @returns {Promise<boolean>}
 */
const saveUserData = async (userData) => {
  if (!userData) {
    throw new Error("Dados do usuário não podem estar vazios");
  }

  await SecureStore.setItemAsync(
    USER_DATA_KEY,
    JSON.stringify(userData),
    secureStoreOptions,
  );

  return true;
};

/**
 * Recupera dados do usuário armazenados
 * @returns {Promise<Object|null>}
 */
const getUserData = async () => {
  const userData = await SecureStore.getItemAsync(
    USER_DATA_KEY,
    secureStoreOptions,
  );

  if (!userData) {
    return null;
  }

  try {
    return JSON.parse(userData);
  } catch {
    await SecureStore.deleteItemAsync(USER_DATA_KEY, secureStoreOptions);
    return null;
  }
};

/**
 * Remove dados do usuário
 * @returns {Promise<boolean>}
 */
const clearUserData = async () => {
  await SecureStore.deleteItemAsync(USER_DATA_KEY, secureStoreOptions);
  return true;
};

export const authTokenManager = {
  /**
   * Salva token e dados do usuário em uma única operação lógica.
   * @param {{ token: string, user: Object }} session
   * @returns {Promise<boolean>}
   */
  saveSession: async ({ token, user }) => {
    if (!token) {
      throw new Error("Token de autenticação inválido");
    }

    if (!user) {
      throw new Error("Dados do usuário inválidos");
    }

    await Promise.all([saveToken(token), saveUserData(user)]);

    return true;
  },

  /**
   * Recupera a sessão armazenada.
   * @returns {Promise<{ token: string, user: Object }|null>}
   */
  getSession: async () => {
    const [token, user] = await Promise.all([getToken(), getUserData()]);

    if (!token || !user) {
      return null;
    }

    return {
      token,
      user,
    };
  },

  /**
   * Remove token e dados do usuário.
   * @returns {Promise<boolean>}
   */
  clearSession: async () => {
    await Promise.all([clearToken(), clearUserData()]);

    return true;
  },

  /**
   * Limpa toda a informação de autenticação.
   * @returns {Promise<boolean>}
   */
  clearAll: async () => {
    try {
      await authTokenManager.clearSession();
      return true;
    } catch (error) {
      console.error("Erro ao limpar autenticação:", error);
      throw new Error("Falha ao limpar dados de autenticação");
    }
  },
};
