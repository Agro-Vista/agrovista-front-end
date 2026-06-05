import { createContext, useContext, useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { ResultadoEvento, EventoHistorico, EventoPendente } from "@/types/history"
import {
  ALERTAS_EMITIDOS,
  EVENTOS,
  EVENTOS_PENDENTES_MOCK,
  TAXA_ACERTO,
} from "@/data/history"

const STORAGE_KEY = "agrovista_validated_ids"

type HistoryContextData = {
  pending: EventoPendente[]
  events: EventoHistorico[]
  successRate: number
  emittedAlerts: number
  validate: (id: number, result: ResultadoEvento) => void
}

const HistoryContext = createContext<HistoryContextData>({} as HistoryContextData)

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState<EventoPendente[]>(EVENTOS_PENDENTES_MOCK)
  const [events, setEvents] = useState<EventoHistorico[]>(EVENTOS)
  const [successRate, setSuccessRate] = useState(TAXA_ACERTO)
  const [emittedAlerts, setEmittedAlerts] = useState(ALERTAS_EMITIDOS)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!raw) return
      const validatedIds: number[] = JSON.parse(raw)
      setPending((prev) => prev.filter((p) => !validatedIds.includes(p.id)))
    })
  }, [])

  const validate = (id: number, result: ResultadoEvento) => {
    const item = pending.find((p) => p.id === id)
    if (!item) return

    const newEvent: EventoHistorico = {
      id,
      titulo: item.titulo,
      talhaoNome: item.talhaoNome,
      data: item.data,
      resultado: result,
      descricao: item.descricao,
    }

    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      const existing: number[] = raw ? JSON.parse(raw) : []
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, id]))
    })

    setPending((prev) => prev.filter((p) => p.id !== id))
    setEvents((prev) => {
      const all = [newEvent, ...prev]
      const correct = all.filter((e) => e.resultado === "CORRETO").length
      const partial = all.filter((e) => e.resultado === "PARCIAL").length
      setSuccessRate(Math.round(((correct + partial * 0.5) / all.length) * 100))
      return all
    })
    setEmittedAlerts((prev) => prev + 1)
  }

  return (
    <HistoryContext.Provider value={{ pending, events, successRate, emittedAlerts, validate }}>
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = () => useContext(HistoryContext)
