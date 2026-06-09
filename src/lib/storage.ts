import AsyncStorage from "@react-native-async-storage/async-storage"

export const STORAGE_KEYS = {
  USUARIOS: "@agrovista:usuarios",
  SESSION: "@agrovista:session",
  TALHOES: "@agrovista:talhoes",
} as const

export const storage = {
  get: async <T>(key: string): Promise<T | null> => {
    const json = await AsyncStorage.getItem(key)
    return json !== null ? (JSON.parse(json) as T) : null
  },

  set: async <T>(key: string, value: T): Promise<void> => {
    await AsyncStorage.setItem(key, JSON.stringify(value))
  },

  remove: async (key: string): Promise<void> => {
    await AsyncStorage.removeItem(key)
  },
}
