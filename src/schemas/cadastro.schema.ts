import { z } from "zod"

export const cadastroContaSchema = z.object({
  nome: z.string().min(3, "Nome obrigatório"),
  email: z.email("E-mail inválido"),
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

// Schema combinado para a tela única de criação de conta + propriedade
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
    areaHectares: z.coerce.number().min(1, "Área obrigatória"),
    cultura: z.string().min(1, "Selecione uma cultura"),
  })
  .refine((d) => d.senha === d.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })

export type CadastroContaForm = z.infer<typeof cadastroContaSchema>
export type CadastroPropriedadeForm = z.infer<typeof cadastroPropriedadeSchema>
export type CadastroTalhaoForm = z.infer<typeof cadastroTalhaoSchema>
export type SignupForm = z.infer<typeof signupSchema>
