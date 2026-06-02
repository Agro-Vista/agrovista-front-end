import { storage, STORAGE_KEYS } from "@/lib/storage"
import type { User } from "@/types/user"

export const userService = {
  criar: async (data: Omit<User, "id">): Promise<User> => {
    const users = (await storage.get<User[]>(STORAGE_KEYS.USUARIOS)) ?? []
    if (users.some((u) => u.email === data.email)) {
      throw new Error("E-mail já cadastrado")
    }
    const novo: User = { ...data, id: Date.now() }
    await storage.set(STORAGE_KEYS.USUARIOS, [...users, novo])
    return novo
  },

  buscar: async (id: number): Promise<User | null> => {
    const users = (await storage.get<User[]>(STORAGE_KEYS.USUARIOS)) ?? []
    return users.find((u) => u.id === id) ?? null
  },

  atualizar: async (id: number, data: Partial<Omit<User, "id">>): Promise<User> => {
    const users = (await storage.get<User[]>(STORAGE_KEYS.USUARIOS)) ?? []
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) throw new Error("User not found")
    const updated: User = { ...users[idx]!, ...data }
    const all = [...users]
    all[idx] = updated
    await storage.set(STORAGE_KEYS.USUARIOS, all)
    return updated
  },

  deletar: async (id: number): Promise<void> => {
    const users = (await storage.get<User[]>(STORAGE_KEYS.USUARIOS)) ?? []
    await storage.set(STORAGE_KEYS.USUARIOS, users.filter((u) => u.id !== id))
  },

  login: async (email: string, senha: string): Promise<User | null> => {
    const users = (await storage.get<User[]>(STORAGE_KEYS.USUARIOS)) ?? []
    return users.find((u) => u.email === email && u.senha === senha) ?? null
  },
}
