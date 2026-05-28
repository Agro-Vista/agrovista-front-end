import { z } from "zod"

export const cadastroContaSchema = z.object({
  nome: z.string().min(3, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
  telefone: z.string().min(10, "Telefone inválido"),
})

export const cadastroPropriedadeSchema = z.object({
  nomeFazenda: z.string().min(2, "Nome obrigatório"),
  municipio: z.string().min(2, "Município obrigatório"),
  estado: z.string().min(2, "Estado obrigatório"),
  areaHectares: z.coerce.number().min(1, "Área obrigatória"),
})

export const cadastroTalhaoSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  cultura: z.string().min(2, "Cultura obrigatória"),
  areaHectares: z.coerce.number().min(1, "Área obrigatória"),
})

export type CadastroContaForm = z.infer<typeof cadastroContaSchema>
export type CadastroPropriedadeForm = z.infer<typeof cadastroPropriedadeSchema>
export type CadastroTalhaoForm = z.infer<typeof cadastroTalhaoSchema>
