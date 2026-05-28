export type NivelAlerta = "BAIXO" | "MEDIO" | "ALTO"
export type TipoAlerta =
  | "RISCO_HIDRICO"
  | "FRENTE_FRIA"
  | "JANELA_PLANTIO"
  | "GEADA"
  | "VENTO_FORTE"

export type Alerta = {
  id: number
  talhaoId: number
  talhaoNome: string
  tipo: TipoAlerta
  nivel: NivelAlerta
  ativo: boolean
  createdAt: string
  descricao: string
}
