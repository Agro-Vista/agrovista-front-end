import { createContext, useContext, useState } from "react"
import type { ResultadoEvento, EventoHistorico, EventoPendente } from "@/types/history"
import {
  ALERTAS_EMITIDOS,
  EVENTOS,
  EVENTOS_PENDENTES_MOCK,
  TAXA_ACERTO,
} from "@/data/history"

type HistoricoContextData = {
  pendentes: EventoPendente[]
  eventos: EventoHistorico[]
  taxaAcerto: number
  alertasEmitidos: number
  validar: (id: number, resultado: ResultadoEvento) => void
}

const HistoricoContext = createContext<HistoricoContextData>({} as HistoricoContextData)

export function HistoricoProvider({ children }: { children: React.ReactNode }) {
  const [pendentes, setPendentes] = useState<EventoPendente[]>(EVENTOS_PENDENTES_MOCK)
  const [eventos, setEventos] = useState<EventoHistorico[]>(EVENTOS)
  const [taxaAcerto, setTaxaAcerto] = useState(TAXA_ACERTO)
  const [alertasEmitidos, setAlertasEmitidos] = useState(ALERTAS_EMITIDOS)

  const validar = (id: number, resultado: ResultadoEvento) => {
    const pendente = pendentes.find((p) => p.id === id)
    if (!pendente) return

    const novoEvento: EventoHistorico = {
      id,
      titulo: pendente.titulo,
      talhaoNome: pendente.talhaoNome,
      data: pendente.data,
      resultado,
      descricao: "Validado por você.",
    }

    setPendentes((prev) => prev.filter((p) => p.id !== id))
    setEventos((prev) => {
      const todos = [novoEvento, ...prev]
      const corretos = todos.filter((e) => e.resultado === "CORRETO").length
      const parciais = todos.filter((e) => e.resultado === "PARCIAL").length
      setTaxaAcerto(Math.round(((corretos + parciais * 0.5) / todos.length) * 100))
      return todos
    })
    setAlertasEmitidos((prev) => prev + 1)
  }

  return (
    <HistoricoContext.Provider value={{ pendentes, eventos, taxaAcerto, alertasEmitidos, validar }}>
      {children}
    </HistoricoContext.Provider>
  )
}

export const useHistorico = () => useContext(HistoricoContext)
