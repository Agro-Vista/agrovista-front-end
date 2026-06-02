export type PlanId = "free" | "produtor" | "cooperativa"

export type Plan = {
  id: PlanId
  nome: string
  badge: string
  badgeCor: string
  badgeBg: string
  subtexto: string
  precoMensal: number
  precoAnual: number
  destaque: boolean
  features: { texto: string; incluido: boolean }[]
  ctaLabel: string
  ctaCor: string
  ctaTextCor: string
}
