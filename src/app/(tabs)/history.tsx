import { View, Text, ScrollView } from "react-native"

import { colors } from "@/constants/Colors"
import { PageHeader } from "@/components/PageHeader"
import { SectionTitle } from "@/components/SectionTitle"
import { EventHistory } from "@/components/EventHistory"
import { useSession } from "@/context/SessionContext"
import { useHistory } from "@/context/HistoricoContext"
import { PERIODO_DIAS } from "@/data/history"
import { dashboard, usuario } from "@/data/mockData"

export default function HistoricoScreen() {
  const { session } = useSession()
  const { events, successRate, emittedAlerts } = useHistory()

  const correct   = events.filter((e) => e.resultado === "CORRETO").length
  const partial   = events.filter((e) => e.resultado === "PARCIAL").length
  const incorrect = events.filter((e) => e.resultado === "INCORRETO").length
  const total = events.length

  return (
    <View className="flex-1 bg-bg">
      <PageHeader
        alertasAtivos={dashboard.alertasAtivos}
        nome={session.nome || usuario.nome}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      >
        {/* Título */}
        <View className="mb-6">
          <Text className="text-[28px] font-bold text-textoPrimario">
            Histórico de acurácia
          </Text>
          <Text className="text-[13px] text-textoSecundario mt-[4px]">
            Como nossos alertas se comportaram na sua fazenda
          </Text>
        </View>

        {/* Stat cards */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-card rounded-2xl border border-bordaSutil p-4">
            <Text className="text-[12px] text-textoSecundario mb-2">
              Alertas emitidos
            </Text>
            <Text className="text-[36px] font-bold text-textoPrimario leading-none">
              {emittedAlerts}
            </Text>
            <Text className="text-[12px] text-textoTerciario mt-2">
              últimos {PERIODO_DIAS} dias
            </Text>
          </View>

          <View className="flex-1 bg-card rounded-2xl border border-bordaSutil p-4">
            <Text className="text-[12px] text-textoSecundario mb-2">
              Taxa de acerto
            </Text>
            <View className="flex-row items-end">
              <Text className="text-[36px] font-bold text-verde leading-none">
                {successRate}
              </Text>
              <Text className="text-[18px] font-bold text-verde mb-[4px] ml-[2px]">
                %
              </Text>
            </View>
            <Text className="text-[12px] text-textoTerciario mt-2">
              validados por você
            </Text>
          </View>
        </View>

        {/* Distribuição */}
        <View className="bg-card rounded-2xl border border-bordaSutil p-4 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text
              className="text-[11px] font-semibold text-textoTerciario"
              style={{ letterSpacing: 1.5 }}
            >
              DISTRIBUIÇÃO
            </Text>
            <Text className="text-[12px] text-textoTerciario">n = {total}</Text>
          </View>

          {/* Barra proporcional */}
          <View
            className="rounded-full overflow-hidden mb-3"
            style={{ height: 8, flexDirection: "row" }}
          >
            {correct > 0 && (
              <View style={{ flex: correct, backgroundColor: colors.verde }} />
            )}
            {correct > 0 && partial + incorrect > 0 && (
              <View style={{ width: 2, backgroundColor: colors.bg }} />
            )}
            {partial > 0 && (
              <View style={{ flex: partial, backgroundColor: colors.ambar }} />
            )}
            {partial > 0 && incorrect > 0 && (
              <View style={{ width: 2, backgroundColor: colors.bg }} />
            )}
            {incorrect > 0 && (
              <View style={{ flex: incorrect, backgroundColor: colors.vermelho }} />
            )}
          </View>

          {/* Legenda */}
          <View className="flex-row gap-4">
            <View className="flex-row items-center gap-[6px]">
              <View className="w-[7px] h-[7px] rounded-full bg-verde" />
              <Text className="text-[12px] text-textoSecundario">Correto {correct}</Text>
            </View>
            <View className="flex-row items-center gap-[6px]">
              <View className="w-[7px] h-[7px] rounded-full bg-ambar" />
              <Text className="text-[12px] text-textoSecundario">Parcial {partial}</Text>
            </View>
            <View className="flex-row items-center gap-[6px]">
              <View className="w-[7px] h-[7px] rounded-full bg-vermelho" />
              <Text className="text-[12px] text-textoSecundario">Incorreto {incorrect}</Text>
            </View>
          </View>
        </View>

        {/* Eventos validados */}
        <SectionTitle>EVENTOS VALIDADOS</SectionTitle>

        <View className="gap-[8px]">
          {events.map((event) => (
            <EventHistory key={event.id} event={event} />
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
