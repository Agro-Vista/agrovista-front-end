import type { PlanId } from "@/types/plan"

export type { PlanId } from "@/types/plan"

export type User = {
  id: number
  nome: string
  email: string
  senha: string
  telefone: string
  cpfCnpj?: string
  nomeFazenda?: string
  estado?: string
  municipio?: string
  areaHectares?: number
  cultura?: string
  cooperativa?: string
  plano?: PlanId
}
