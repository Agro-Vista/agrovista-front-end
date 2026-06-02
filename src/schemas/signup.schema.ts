import { z } from "zod"

export const accountSchema = z.object({
  nome: z.string().min(3, "Nome obrigatório"),
  email: z.email("E-mail inválido"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
  telefone: z.string().min(10, "Telefone inválido"),
})

export const propertySchema = z.object({
  nomeFazenda: z.string().min(2, "Nome obrigatório"),
  municipio: z.string().min(2, "Município obrigatório"),
  estado: z.string().min(2, "Estado obrigatório"),
  areaHectares: z.number().min(1, "Área obrigatória"),
})

export const createFieldSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  cultura: z.string().min(2, "Cultura obrigatória"),
  areaHectares: z.number().min(1, "Área obrigatória"),
})

export const signupSchema = z
  .object({
    nome: z.string().min(3, "Nome obrigatório"),
    cpfCnpj: z.string().min(14, "CPF inválido"),
    telefone: z.string().min(14, "Telefone inválido"),
    email: z.email("E-mail inválido"),
    senha: z.string().min(8, "Mínimo 8 caracteres"),
    confirmarSenha: z.string().min(8, "Mínimo 8 caracteres"),
    nomeFazenda: z.string().min(2, "Nome obrigatório"),
    estado: z.string().min(2, "Estado obrigatório"),
    municipio: z.string().min(2, "Município obrigatório"),
    areaHectares: z.number().min(1, "Área obrigatória"),
    cultura: z.string().min(1, "Selecione uma cultura"),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })

export type AccountForm = z.infer<typeof accountSchema>
export type PropertyForm = z.infer<typeof propertySchema>
export type CreateFieldForm = z.infer<typeof createFieldSchema>
export type SignupForm = z.infer<typeof signupSchema>
