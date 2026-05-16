import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_TTL_IN_MS = 5 * 60 * 1000; // 5 minutos

export const cacheStorage = {
  setItem: async (key, value, ttl = DEFAULT_TTL_IN_MS) => {
    const payload = {
      value,
      expiresAt: Date.now() + ttl,
    };

    await AsyncStorage.setItem(key, JSON.stringify(payload));
  },

  getItem: async (key) => {
    const cached = await AsyncStorage.getItem(key);

    if (!cached) {
      return null;
    }

    try {
      const payload = JSON.parse(cached);

      if (!payload.expiresAt || Date.now() > payload.expiresAt) {
        await AsyncStorage.removeItem(key);
        return null;
      }

      return payload.value;
    } catch {
      await AsyncStorage.removeItem(key);
      return null;
    }
  },

  removeItem: async (key) => {
    await AsyncStorage.removeItem(key);
  },
};
