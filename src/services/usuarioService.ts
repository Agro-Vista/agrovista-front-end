import { storage, STORAGE_KEYS } from "@/lib/storage"
import type { User } from "@/types/user"

export const usuarioService = {
  criar: async (data: Omit<User, "id">): Promise<User> => {
    const usuarios = (await storage.get<User[]>(STORAGE_KEYS.USUARIOS)) ?? [] 
    if (usuarios.some((u) => u.email === data.email)) {
      throw new Error("E-mail já cadastrado")
    }
    const novo: User = { ...data, id: Date.now() }
    await storage.set(STORAGE_KEYS.USUARIOS, [...usuarios, novo])
    return novo
  },

  buscar: async (id: number): Promise<User | null> => {
    const usuarios = (await storage.get<User[]>(STORAGE_KEYS.USUARIOS)) ?? []
    return usuarios.find((u) => u.id === id) ?? null
  },

  atualizar: async (id: number, data: Partial<Omit<User, "id">>): Promise<User> => {
    const usuarios = (await storage.get<User[]>(STORAGE_KEYS.USUARIOS)) ?? []
    const idx = usuarios.findIndex((u) => u.id === id)
    if (idx === -1) throw new Error("Usuário não encontrado")
    const atualizado: User = { ...usuarios[idx]!, ...data }
    const atualizados = [...usuarios]
    atualizados[idx] = atualizado
    await storage.set(STORAGE_KEYS.USUARIOS, atualizados)
    return atualizado
  },

  deletar: async (id: number): Promise<void> => {
    const usuarios = (await storage.get<User[]>(STORAGE_KEYS.USUARIOS)) ?? []
    await storage.set(STORAGE_KEYS.USUARIOS, usuarios.filter((u) => u.id !== id))
  },

  login: async (email: string, senha: string): Promise<User | null> => {
    const usuarios = (await storage.get<User[]>(STORAGE_KEYS.USUARIOS)) ?? []
    return usuarios.find((u) => u.email === email && u.senha === senha) ?? null
  },
}
