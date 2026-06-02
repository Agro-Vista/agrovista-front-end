import { storage, STORAGE_KEYS } from "@/lib/storage"
import type { Talhao } from "@/types/talhao"

export const talhaoService = {
  criar: async (data: Omit<Talhao, "id">): Promise<Talhao> => {
    const talhoes = (await storage.get<Talhao[]>(STORAGE_KEYS.TALHOES)) ?? []
    const novo: Talhao = { ...data, id: Date.now() }
    await storage.set(STORAGE_KEYS.TALHOES, [...talhoes, novo])
    return novo
  },

  buscar: async (id: number): Promise<Talhao | null> => {
    const talhoes = (await storage.get<Talhao[]>(STORAGE_KEYS.TALHOES)) ?? []
    return talhoes.find((t) => t.id === id) ?? null
  },

  listar: async (propriedadeId: number): Promise<Talhao[]> => {
    const talhoes = (await storage.get<Talhao[]>(STORAGE_KEYS.TALHOES)) ?? []
    return talhoes.filter((t) => t.propriedadeId === propriedadeId)
  },

  atualizar: async (id: number, data: Partial<Omit<Talhao, "id">>): Promise<Talhao> => {
    const talhoes = (await storage.get<Talhao[]>(STORAGE_KEYS.TALHOES)) ?? []
    const idx = talhoes.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error("Talhão não encontrado")
    const atualizado: Talhao = { ...talhoes[idx]!, ...data }
    const atualizados = [...talhoes]
    atualizados[idx] = atualizado
    await storage.set(STORAGE_KEYS.TALHOES, atualizados)
    return atualizado
  },

  deletar: async (id: number): Promise<void> => {
    const talhoes = (await storage.get<Talhao[]>(STORAGE_KEYS.TALHOES)) ?? []
    await storage.set(STORAGE_KEYS.TALHOES, talhoes.filter((t) => t.id !== id))
  },
}
