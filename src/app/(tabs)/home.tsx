import { useState, useEffect } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"
import { dashboard, usuario } from "@/data/mockData"
import { ABAS, MARCADORES, type Aba } from "@/data/home"
import { StatCard } from "@/components/StatCard"
import { PageHeader } from "@/components/PageHeader"
import type { AlertItemData } from "@/types/alert"
import type { EventoPendente } from "@/types/history"
import { WeatherAlertCard } from "@/components/WeatherAlertCard"
import { ModalValidation } from "@/components/ModalValidation"
import { getWeatherAlerts } from "@/services/weatherAlertsService"
import { useSession } from "@/context/SessionContext"
import { useHistory } from "@/context/HistoricoContext"

export default function HomeScreen() {
  const { session } = useSession()
  const { pending, validate } = useHistory()
  const [eventToValidate, setEventToValidate] = useState<EventoPendente | null>(null)
  const [activeTab, setActiveTab] = useState<Aba>("Mapa")
  const [apiAlerts, setApiAlerts] = useState<AlertItemData[]>([])
  const [loadingAlerts, setLoadingAlerts] = useState(false)
  const [alertsError, setAlertsError] = useState(false)

  const handleValidate = (id: number, result: Parameters<typeof validate>[1]) => {
    validate(id, result)
    const next = pending.find((p) => p.id !== id)
    setEventToValidate(next ?? null)
  }

  useEffect(() => {
    void fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    setLoadingAlerts(true)
    try {
      const data = await getWeatherAlerts()
      setApiAlerts(data)
    } catch {
      setAlertsError(true)
    } finally {
      setLoadingAlerts(false)
    }
  }

  return (
    <View className="flex-1 bg-bg">

      {/* Topo fixo (header + tabs) */}
      <View>
        <PageHeader
          alertasAtivos={dashboard.alertasAtivos}
          nome={session.nome || usuario.nome}
        />

        {/* Sub-abas */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 10, alignItems: "center" }}
        >
          {ABAS.map((tab) => {
            const isActive = activeTab === tab
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`px-[18px] py-[7px] rounded-full border ${
                  isActive ? "bg-verde border-verde" : "bg-card border-bordaVisivel"
                }`}
              >
                <Text
                  className={`text-[13px] font-medium ${
                    isActive ? "text-[#111111]" : "text-textoSecundario"
                  }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* Conteúdo */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        {/* ABA: MAPA */}
        {activeTab === "Mapa" && (
          <>
            <View
              className="mx-4 rounded-2xl overflow-hidden h-[180px] border"
              style={{ backgroundColor: "#081408", borderColor: colors.verde + "30" }}
            >
              {[40, 80, 120, 160].map((y) => (
                <View
                  key={y}
                  style={{
                    position: "absolute",
                    top: y, left: 0, right: 0,
                    height: 1,
                    backgroundColor: colors.verde + "0a",
                  }}
                />
              ))}
              {(["20%", "40%", "60%", "80%"] as `${number}%`[]).map((x) => (
                <View
                  key={x}
                  style={{
                    position: "absolute",
                    top: 0, bottom: 0, left: x,
                    width: 1,
                    backgroundColor: colors.verde + "0a",
                  }}
                />
              ))}

              <View className="absolute top-[10px] left-[12px] right-[12px] flex-row justify-between">
                <Text className="text-[11px]" style={{ color: colors.verde + "aa" }}>
                  Centro-Oeste · Brasil
                </Text>
                <Text className="text-[11px]" style={{ color: colors.verde + "66" }}>N ↑</Text>
              </View>

              {MARCADORES.map((m) => (
                <View
                  key={m.label}
                  className="absolute flex-row items-center gap-[5px]"
                  style={{ top: m.top, left: m.left }}
                >
                  <View
                    className="w-[10px] h-[10px] rounded-full"
                    style={{ backgroundColor: m.cor, elevation: 4 }}
                  />
                  <View className="px-[5px] py-[2px] rounded" style={{ backgroundColor: "#000000cc" }}>
                    <Text className="text-[10px]" style={{ color: m.cor }}>{m.label}</Text>
                  </View>
                </View>
              ))}

              <View className="absolute bottom-[10px] left-[12px] right-[12px] flex-row justify-between">
                <Text className="text-[10px] text-textoTerciario">
                  LAT -13.42{"  "}LON -55.71
                </Text>
                <Text className="text-[10px] text-verde font-semibold">SAT · LIVE</Text>
              </View>
            </View>

            {/* Cards métricas 2x2 */}
            <View className="mx-4 mt-3 flex-row flex-wrap gap-[10px]">
              <StatCard
                icon="radio-outline"
                title="Satélites ativos"
                value={String(dashboard.satelitesAtivos)}
                sub="dados a cada 6h"
              />
              <StatCard
                icon="location-outline"
                title="Regiões monitoradas"
                value={String(dashboard.regioesMonitoradas)}
                sub="municípios"
              />
              <StatCard
                icon="analytics-outline"
                title="Precisão da IA"
                value={`${dashboard.precisaoIA}%`}
                sub="últimos 30 dias"
                valueColor={colors.verde}
              />
              <StatCard
                icon="time-outline"
                title="Última atualização"
                value={dashboard.ultimaAtualizacao}
                sub={dashboard.fonteDados}
              />
            </View>

            {/* Pendentes para validar */}
            {pending.length > 0 && (
              <TouchableOpacity
                className="mx-4 mt-3 rounded-2xl border flex-row items-center gap-3 p-4"
                style={{ backgroundColor: colors.ambarBackground, borderColor: colors.ambar + "50" }}
                onPress={() => setEventToValidate(pending[0])}
                activeOpacity={0.7}
              >
                <View
                  className="w-9 h-9 rounded-[10px] items-center justify-center"
                  style={{ backgroundColor: colors.ambar + "30" }}
                >
                  <Ionicons name="time-outline" size={18} color={colors.ambar} />
                </View>
                <View className="flex-1">
                  <Text className="text-[13px] font-semibold text-textoPrimario">
                    {pending.length === 1
                      ? "1 alerta aguarda sua validação"
                      : `${pending.length} alertas aguardam validação`}
                  </Text>
                  <Text className="text-[11px] text-textoSecundario mt-[2px]">
                    Seu feedback melhora a precisão da IA
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.ambar} />
              </TouchableOpacity>
            )}

            {/* Alertas recentes */}
            <View className="mx-4 mt-[22px]">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-[11px] font-bold tracking-[1.2px] text-textoTerciario">
                  ALERTAS RECENTES
                </Text>
                {apiAlerts.length > 0 && (
                  <View className="flex-row items-center gap-1">
                    <View className="w-[6px] h-[6px] rounded-full bg-verde" />
                    <Text className="text-[10px] text-verde">INMET · ao vivo</Text>
                  </View>
                )}
              </View>

              {loadingAlerts ? (
                <ActivityIndicator color={colors.verde} className="my-6" />
              ) : alertsError || apiAlerts.length === 0 ? (
                <View className="items-center py-8 gap-[10px]">
                  <Ionicons name="cloud-offline-outline" size={36} color={colors.textoTerciario} />
                  <Text className="text-[14px] text-textoSecundario font-semibold">
                    {alertsError ? "Sem conexão com a INMET" : "Nenhum alerta ativo"}
                  </Text>
                  <Text className="text-[12px] text-textoTerciario text-center">
                    {alertsError
                      ? "Verifique sua conexão e tente novamente."
                      : "Todas as regiões monitoradas estão sem alertas no momento."}
                  </Text>
                </View>
              ) : (
                apiAlerts.map((item, idx) => (
                  <WeatherAlertCard key={idx} alert={item} />
                ))
              )}
            </View>
          </>
        )}

        {/* ABA: ALERTAS */}
        {activeTab === "Alertas" && (
          <View className="mx-4 mt-1">
            <Text className="text-[11px] font-bold tracking-[1.2px] text-textoTerciario mb-3">
              TODOS OS ALERTAS ATIVOS
            </Text>
            {apiAlerts.length === 0 ? (
              <View className="items-center py-8 gap-[10px]">
                <Ionicons name="checkmark-circle-outline" size={36} color={colors.textoTerciario} />
                <Text className="text-[14px] text-textoSecundario font-semibold">
                  Nenhum alerta ativo
                </Text>
                <Text className="text-[12px] text-textoTerciario">
                  Todas as regiões estão normais.
                </Text>
              </View>
            ) : (
              apiAlerts.map((item, idx) => (
                <WeatherAlertCard key={idx} alert={item} />
              ))
            )}
          </View>
        )}

        {/* ABA: REGIÕES */}
        {activeTab === "Regiões" && (
          <View className="mx-4 mt-10 items-center gap-3">
            <View className="w-16 h-16 rounded-[20px] bg-card border border-bordaSutil items-center justify-center">
              <Ionicons name="map-outline" size={28} color={colors.textoTerciario} />
            </View>
            <Text className="text-base font-semibold text-textoPrimario">
              Regiões monitoradas
            </Text>
            <Text className="text-[13px] text-textoSecundario text-center leading-5">
              {dashboard.regioesMonitoradas} municípios cobertos{"\n"}em tempo real via satélite
            </Text>
            <Text className="text-[32px] font-bold text-verde mt-2">
              {dashboard.regioesMonitoradas}
            </Text>
            <Text className="text-[12px] text-textoTerciario">
              municípios · {dashboard.fonteDados}
            </Text>
          </View>
        )}

        {/* ABA: IA */}
        {activeTab === "IA" && (
          <View className="mx-4 mt-10 items-center gap-3">
            <View
              className="w-16 h-16 rounded-[20px] bg-verdeBackground border items-center justify-center"
              style={{ borderColor: colors.verde + "40" }}
            >
              <Ionicons name="analytics-outline" size={28} color={colors.verde} />
            </View>
            <Text className="text-base font-semibold text-textoPrimario">
              Inteligência Artificial
            </Text>
            <Text className="text-[13px] text-textoSecundario text-center leading-5">
              Modelos treinados com dados do{"\n"}NASA FIRMS, INPE e INMET
            </Text>
            <Text className="text-[48px] font-bold text-verde mt-2">
              {dashboard.precisaoIA}%
            </Text>
            <Text className="text-[12px] text-textoTerciario">
              precisão · últimos 30 dias
            </Text>
          </View>
        )}
      </ScrollView>

      <ModalValidation
        event={eventToValidate}
        onValidate={handleValidate}
        onClose={() => setEventToValidate(null)}
      />
    </View>
  )
}
