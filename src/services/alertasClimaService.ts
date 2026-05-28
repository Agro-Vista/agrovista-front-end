import { http } from "@/lib/http"
import type { NivelAlerta, TipoAlerta } from "@/types/alerta"
import type { AlertaItemData } from "@/components/AlertaItem"

const INMET_BASE = "https://apiprevmet3.inmet.gov.br"

interface INMETAviso {
  id: number
  descricao: string
  aviso_cor: string
  id_severidade: number
  severidade: string
  estados: string
  regioes: string
  mesorregioes: string
  riscos: string[]
  inicio: string
}

interface INMETResponse {
  hoje: INMETAviso[]
  futuro: INMETAviso[]
}

const SIGLAS: Record<string, string> = {
  Acre: "AC", Alagoas: "AL", Amapá: "AP", Amazonas: "AM",
  Bahia: "BA", Ceará: "CE", "Distrito Federal": "DF",
  "Espírito Santo": "ES", Goiás: "GO", Maranhão: "MA",
  "Mato Grosso": "MT", "Mato Grosso do Sul": "MS", "Minas Gerais": "MG",
  Pará: "PA", Paraíba: "PB", Paraná: "PR", Pernambuco: "PE",
  Piauí: "PI", "Rio de Janeiro": "RJ", "Rio Grande do Norte": "RN",
  "Rio Grande do Sul": "RS", Rondônia: "RO", Roraima: "RR",
  "Santa Catarina": "SC", "São Paulo": "SP", Sergipe: "SE", Tocantins: "TO",
}

function mapNivel(aviso_cor: string, severidade: number): NivelAlerta {
  if (severidade >= 8) return "ALTO"
  if (aviso_cor === "#F96602" || aviso_cor === "#FF0000") return "ALTO"
  if (aviso_cor === "#FFFE00") return "MEDIO"
  return "BAIXO"
}

function mapTipo(descricao: string): TipoAlerta {
  const d = descricao.toLowerCase()
  if (d.includes("geada")) return "GEADA"
  if (d.includes("vendaval") || d.includes("tempestade") || d.includes("vento forte")) return "VENTO_FORTE"
  if (d.includes("frente fria") || d.includes("massa de ar frio")) return "FRENTE_FRIA"
  if (d.includes("seca") || d.includes("estiagem")) return "RISCO_HIDRICO"
  return "RISCO_HIDRICO"
}

function regiaoNome(aviso: INMETAviso): string {
  const estados = aviso.estados.split(",").map((e) => e.trim())
  const siglas = estados
    .slice(0, 3)
    .map((e) => SIGLAS[e] ?? e.slice(0, 2).toUpperCase())
    .join(" · ")
  const regiao = aviso.regioes.split(",")[0]?.trim() ?? ""
  return regiao ? `${siglas} · ${regiao}` : siglas
}

function formatInicio(inicio: string): string {
  const [datePart, timePart] = inicio.split(" ")
  const today = new Date().toISOString().split("T")[0]
  const prefix = datePart === today ? "Hoje" : "Amanhã"
  const hora = timePart?.replace(":", "h").slice(0, 5) ?? "00h00"
  return `${prefix}, ${hora}`
}

export const getAvisosClima = async (): Promise<AlertaItemData[]> => {
  const data = await http.get<INMETResponse>(`${INMET_BASE}/avisos/ativos`)
  const todos = [...(data.hoje ?? []), ...(data.futuro ?? [])]

  const vistos = new Set<string>()
  const resultado: AlertaItemData[] = []

  for (const aviso of todos) {
    const chave = `${aviso.descricao}|${aviso.regioes}|${aviso.aviso_cor}`
    if (vistos.has(chave)) continue
    vistos.add(chave)

    resultado.push({
      tipo: mapTipo(aviso.descricao),
      nivel: mapNivel(aviso.aviso_cor, aviso.id_severidade),
      talhaoNome: regiaoNome(aviso),
      createdAt: formatInicio(aviso.inicio),
      descricao: aviso.riscos?.[0] ?? aviso.descricao,
      label: aviso.descricao,
    })

    if (resultado.length >= 6) break
  }

  return resultado
}
