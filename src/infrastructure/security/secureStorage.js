import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Gerenciador de armazenamento usando AsyncStorage
 */
export const secureStorage = {
  /**
   * Armazena um valor
   * @param {string} key - Chave de identificação
   * @param {string} value - Valor a ser armazenado
   * @returns {Promise<boolean>}
   */
  setItem: async (key, value) => {
    try {
      if (!key || !value) {
        throw new Error("Chave e valor são obrigatórios");
      }
      await AsyncStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Erro ao armazenar ${key}:`, error);
      throw new Error(`Falha ao armazenar dados`);
    }
  },

  /**
   * Recupera um valor armazenado
   * @param {string} key - Chave de identificação
   * @returns {Promise<string|null>}
   */
  getItem: async (key) => {
    try {
      if (!key) {
        throw new Error("Chave é obrigatória");
      }
      const value = await AsyncStorage.getItem(key);
      return value || null;
    } catch (error) {
      console.error(`Erro ao recuperar ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove um valor armazenado
   * @param {string} key - Chave de identificação
   * @returns {Promise<boolean>}
   */
  removeItem: async (key) => {
    try {
      if (!key) {
        throw new Error("Chave é obrigatória");
      }
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error);
      throw new Error(`Falha ao remover dados`);
    }
  },

  /**
   * Limpa todos os dados armazenados
   * @returns {Promise<boolean>}
   */
  clear: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error("Erro ao limpar armazenamento:", error);
      throw new Error("Falha ao limpar armazenamento seguro");
    }
  },
};
