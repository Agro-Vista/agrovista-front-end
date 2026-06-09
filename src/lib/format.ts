import type { Plan } from "@/types/plan"

export function formatPlanPreco(plan: Plan, anual: boolean): string {
  if (plan.precoMensal === 0) return "R$ 0"
  const valor = anual ? plan.precoAnual : plan.precoMensal
  return `R$ ${valor.toLocaleString("pt-BR")}`
}
