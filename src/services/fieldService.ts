import { storage, STORAGE_KEYS } from "@/lib/storage"
import type { Field } from "@/types/field"

export const fieldService = {
  criar: async (data: Omit<Field, "id">): Promise<Field> => {
    const fields = (await storage.get<Field[]>(STORAGE_KEYS.TALHOES)) ?? []
    const novo: Field = { ...data, id: Date.now() }
    await storage.set(STORAGE_KEYS.TALHOES, [...fields, novo])
    return novo
  },

  buscar: async (id: number): Promise<Field | null> => {
    const fields = (await storage.get<Field[]>(STORAGE_KEYS.TALHOES)) ?? []
    return fields.find((f) => f.id === id) ?? null
  },

  listar: async (propriedadeId: number): Promise<Field[]> => {
    const fields = (await storage.get<Field[]>(STORAGE_KEYS.TALHOES)) ?? []
    return fields.filter((f) => f.propriedadeId === propriedadeId)
  },

  atualizar: async (id: number, data: Partial<Omit<Field, "id">>): Promise<Field> => {
    const fields = (await storage.get<Field[]>(STORAGE_KEYS.TALHOES)) ?? []
    const idx = fields.findIndex((f) => f.id === id)
    if (idx === -1) throw new Error("Field not found")
    const updated: Field = { ...fields[idx]!, ...data }
    const all = [...fields]
    all[idx] = updated
    await storage.set(STORAGE_KEYS.TALHOES, all)
    return updated
  },

  deletar: async (id: number): Promise<void> => {
    const fields = (await storage.get<Field[]>(STORAGE_KEYS.TALHOES)) ?? []
    await storage.set(STORAGE_KEYS.TALHOES, fields.filter((f) => f.id !== id))
  },
}
