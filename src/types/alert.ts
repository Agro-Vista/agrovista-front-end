export type AlertLevel = "BAIXO" | "MEDIO" | "ALTO"
export type AlertType =
  | "RISCO_HIDRICO"
  | "FRENTE_FRIA"
  | "JANELA_PLANTIO"
  | "GEADA"
  | "VENTO_FORTE"

export type Alert = {
  id: number
  fieldId: number
  fieldName: string
  type: AlertType
  level: AlertLevel
  active: boolean
  createdAt: string
  description: string
}
