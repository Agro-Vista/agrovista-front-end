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
import { ABAS, MARCADORES, type Aba } from "@/data/homeConstants"
import { StatCard } from "@/components/StatCard"
import { PageHeader } from "@/components/PageHeader"
import type { AlertItemData } from "@/components/AlertItem"
import { WeatherAlertCard } from "@/components/WeatherAlertCard"
import { getWeatherAlerts } from "@/services/weatherAlertsService"
import { useSession } from "@/context/SessionContext"

export default function HomeScreen() {
  const { session } = useSession()
  const [abaAtiva, setAbaAtiva] = useState<Aba>("Mapa")
  const [avisosAPI, setAvisosAPI] = useState<AlertItemData[]>([])
  const [loadingAvisos, setLoadingAvisos] = useState(false)
  const [erroAvisos, setErroAvisos] = useState(false)

  useEffect(() => {
    void fetchAvisos()
  }, [])

  const fetchAvisos = async () => {
    setLoadingAvisos(true)
    try {
      const data = await getWeatherAlerts()
      setAvisosAPI(data)
    } catch {
      setErroAvisos(true)
    } finally {
      setLoadingAvisos(false)
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
          {ABAS.map((aba) => {
            const ativa = abaAtiva === aba
            return (
              <TouchableOpacity
                key={aba}
                onPress={() => setAbaAtiva(aba)}
                className={`px-[18px] py-[7px] rounded-full border ${
                  ativa ? "bg-verde border-verde" : "bg-card border-bordaVisivel"
                }`}
              >
                <Text
                  className={`text-[13px] font-medium ${
                    ativa ? "text-[#111111]" : "text-textoSecundario"
                  }`}
                >
                  {aba}
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
        {abaAtiva === "Mapa" && (
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
              {["20%", "40%", "60%", "80%"].map((x) => (
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

            {/* Alertas recentes */}
            <View className="mx-4 mt-[22px]">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-[11px] font-bold tracking-[1.2px] text-textoTerciario">
                  ALERTAS RECENTES
                </Text>
                {avisosAPI.length > 0 && (
                  <View className="flex-row items-center gap-1">
                    <View className="w-[6px] h-[6px] rounded-full bg-verde" />
                    <Text className="text-[10px] text-verde">INMET · ao vivo</Text>
                  </View>
                )}
              </View>

              {loadingAvisos ? (
                <ActivityIndicator color={colors.verde} className="my-6" />
              ) : erroAvisos || avisosAPI.length === 0 ? (
                <View className="items-center py-8 gap-[10px]">
                  <Ionicons name="cloud-offline-outline" size={36} color={colors.textoTerciario} />
                  <Text className="text-[14px] text-textoSecundario font-semibold">
                    {erroAvisos ? "Sem conexão com a INMET" : "Nenhum alerta ativo"}
                  </Text>
                  <Text className="text-[12px] text-textoTerciario text-center">
                    {erroAvisos
                      ? "Verifique sua conexão e tente novamente."
                      : "Todas as regiões monitoradas estão sem alertas no momento."}
                  </Text>
                </View>
              ) : (
                avisosAPI.map((alerta, idx) => (
                  <WeatherAlertCard key={idx} aviso={alerta} />
                ))
              )}
            </View>
          </>
        )}

        {/* ABA: ALERTAS */}
        {abaAtiva === "Alertas" && (
          <View className="mx-4 mt-1">
            <Text className="text-[11px] font-bold tracking-[1.2px] text-textoTerciario mb-3">
              TODOS OS ALERTAS ATIVOS
            </Text>
            {avisosAPI.length === 0 ? (
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
              avisosAPI.map((alerta, idx) => (
                <WeatherAlertCard key={idx} aviso={alerta} />
              ))
            )}
          </View>
        )}

        {/* ABA: REGIÕES */}
        {abaAtiva === "Regiões" && (
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
        {abaAtiva === "IA" && (
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
    </View>
  )
}
