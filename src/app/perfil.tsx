import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native"
import { useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"
import { useSession } from "@/context/SessionContext"
import { usuario } from "@/data/mockData"

type AntecedenciaOpcao = "24h" | "48h" | "72h"

const PROPRIEDADE_ROWS: {
  icon: keyof typeof Ionicons.glyphMap
  label: string
  value: string
}[] = [
  { icon: "business-outline", label: "Fazenda", value: usuario.fazenda },
  {
    icon: "resize-outline",
    label: "Área total",
    value: `${usuario.areaTotal} hectares`,
  },
  {
    icon: "leaf-outline",
    label: "Cultura principal",
    value: usuario.culturas.join(" + "),
  },
  {
    icon: "location-outline",
    label: "Localização",
    value: `${usuario.estado} · ${usuario.municipio}`,
  },
  {
    icon: "flag-outline",
    label: "Cooperativa",
    value: usuario.cooperativa,
  },
]

export default function PerfilScreen() {
  const { session, clearSession } = useSession()
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const nomeSessao = session.nome || usuario.nome
  const iniciais = nomeSessao
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase()

  const [alertaWhatsApp, setAlertaWhatsApp] = useState(true)
  const [alertaPush, setAlertaPush] = useState(true)
  const [relatorioEmail, setRelatorioEmail] = useState(false)
  const [antecedencia, setAntecedencia] = useState<AntecedenciaOpcao>("72h")

  const handleSair = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await clearSession()
          router.replace("/login")
        },
      },
    ])
  }

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View style={{ paddingTop: insets.top }}>
        <View className="px-4 pt-2 pb-3 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 items-center justify-center"
          >
            <Ionicons name="chevron-back" size={24} color={colors.textoPrimario} />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-[17px] font-semibold text-textoPrimario">
            Perfil
          </Text>
          <TouchableOpacity className="w-9 h-9 items-center justify-center">
            <Ionicons name="create-outline" size={22} color={colors.roxo} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        {/* Avatar + info */}
        <View className="items-center pt-4 pb-6">
          <View
            className="w-[80px] h-[80px] rounded-full border-[2px] border-verde items-center justify-center mb-3"
            style={{ backgroundColor: colors.verde + "20" }}
          >
            <Text className="text-[28px] font-bold text-verde">{iniciais}</Text>
          </View>
          <Text className="text-[20px] font-bold text-textoPrimario">
            {nomeSessao}
          </Text>
          <Text className="text-[13px] text-textoSecundario mt-[3px]">
            {usuario.municipio} · {usuario.estado}
          </Text>
          <View
            className="flex-row items-center gap-[6px] mt-3 px-4 py-[6px] rounded-full"
            style={{ backgroundColor: colors.roxo + "20" }}
          >
            <View className="w-[6px] h-[6px] rounded-full bg-roxo" />
            <Text className="text-[13px] font-medium text-roxo">
              Plano {usuario.plano} · Ativo
            </Text>
          </View>
        </View>

        {/* MINHA PROPRIEDADE */}
        <Text className="text-[11px] font-bold tracking-[1.2px] text-textoTerciario mb-2">
          MINHA PROPRIEDADE
        </Text>
        <View className="bg-card rounded-2xl border border-bordaSutil mb-5 overflow-hidden">
          {PROPRIEDADE_ROWS.map((row, idx) => (
            <View key={row.label}>
              <View className="px-4 py-[14px] flex-row items-center">
                <Ionicons
                  name={row.icon}
                  size={18}
                  color={colors.textoTerciario}
                />
                <Text className="text-[13px] text-textoTerciario ml-3 w-[120px]">
                  {row.label}
                </Text>
                <Text className="flex-1 text-[13px] font-medium text-textoPrimario text-right">
                  {row.value}
                </Text>
              </View>
              {idx < PROPRIEDADE_ROWS.length - 1 && (
                <View className="h-[1px] mx-4 bg-bordaSutil" />
              )}
            </View>
          ))}
        </View>

        {/* PREFERÊNCIAS */}
        <Text className="text-[11px] font-bold tracking-[1.2px] text-textoTerciario mb-2">
          PREFERÊNCIAS
        </Text>
        <View className="bg-card rounded-2xl border border-bordaSutil mb-3 overflow-hidden">
          <View className="px-4 py-[14px] flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-[14px] font-medium text-textoPrimario">
                Alertas via WhatsApp
              </Text>
              <Text className="text-[12px] text-textoTerciario mt-[2px]">
                Mensagens em tempo real
              </Text>
            </View>
            <Switch
              value={alertaWhatsApp}
              onValueChange={setAlertaWhatsApp}
              trackColor={{ false: colors.bordaVisivel, true: colors.verde }}
              thumbColor={colors.textoPrimario}
            />
          </View>
          <View className="h-[1px] mx-4 bg-bordaSutil" />
          <View className="px-4 py-[14px] flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-[14px] font-medium text-textoPrimario">
                Alertas via push
              </Text>
              <Text className="text-[12px] text-textoTerciario mt-[2px]">
                Notificações no celular
              </Text>
            </View>
            <Switch
              value={alertaPush}
              onValueChange={setAlertaPush}
              trackColor={{ false: colors.bordaVisivel, true: colors.verde }}
              thumbColor={colors.textoPrimario}
            />
          </View>
          <View className="h-[1px] mx-4 bg-bordaSutil" />
          <View className="px-4 py-[14px] flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-[14px] font-medium text-textoPrimario">
                Relatório semanal por e-mail
              </Text>
              <Text className="text-[12px] text-textoTerciario mt-[2px]">
                Resumo toda segunda-feira
              </Text>
            </View>
            <Switch
              value={relatorioEmail}
              onValueChange={setRelatorioEmail}
              trackColor={{ false: colors.bordaVisivel, true: colors.verde }}
              thumbColor={colors.textoPrimario}
            />
          </View>
        </View>

        {/* Antecedência dos alertas */}
        <View className="bg-card rounded-2xl border border-bordaSutil mb-5 px-4 py-[14px]">
          <Text className="text-[14px] font-medium text-textoPrimario">
            Antecedência dos alertas
          </Text>
          <Text className="text-[12px] text-textoTerciario mt-[2px] mb-3">
            Quanto antes você quer ser avisado
          </Text>
          <View className="flex-row gap-2">
            {(["24h", "48h", "72h"] as AntecedenciaOpcao[]).map((op) => {
              const ativa = antecedencia === op
              return (
                <TouchableOpacity
                  key={op}
                  onPress={() => setAntecedencia(op)}
                  className={`flex-1 py-[10px] rounded-xl items-center border ${
                    ativa
                      ? "bg-verde border-verde"
                      : "bg-cardElevado border-bordaVisivel"
                  }`}
                >
                  <Text
                    className={`text-[14px] font-semibold ${
                      ativa ? "text-[#111111]" : "text-textoSecundario"
                    }`}
                  >
                    {op}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* MINHA ASSINATURA */}
        <Text className="text-[11px] font-bold tracking-[1.2px] text-textoTerciario mb-2">
          MINHA ASSINATURA
        </Text>
        <View
          className="rounded-2xl border border-roxo mb-5 px-4 py-4"
          style={{ backgroundColor: colors.roxoBackground }}
        >
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-[15px] font-semibold text-textoPrimario">
              Plano {usuario.plano}
            </Text>
            <Ionicons name="card-outline" size={20} color={colors.roxo} />
          </View>
          <Text className="text-[28px] font-bold text-roxo">
            {usuario.valorPlano}
          </Text>
          <Text className="text-[12px] text-textoTerciario mt-[3px] mb-4">
            Próxima cobrança: 15 de junho de 2026
          </Text>
          <TouchableOpacity
            activeOpacity={0.75}
            className="rounded-xl border border-roxo py-[13px] items-center"
            style={{ backgroundColor: colors.roxo + "18" }}
          >
            <Text className="text-[14px] font-semibold text-roxo">
              Gerenciar assinatura
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONTA */}
        <Text className="text-[11px] font-bold tracking-[1.2px] text-textoTerciario mb-2">
          CONTA
        </Text>
        <View className="bg-card rounded-2xl border border-bordaSutil mb-6 overflow-hidden">
          <TouchableOpacity
            activeOpacity={0.75}
            className="px-4 py-[14px] flex-row items-center gap-3"
          >
            <View
              className="w-8 h-8 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.cardElevado }}
            >
              <Ionicons
                name="key-outline"
                size={16}
                color={colors.textoSecundario}
              />
            </View>
            <Text className="flex-1 text-[14px] font-medium text-textoPrimario">
              Alterar senha
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textoTerciario}
            />
          </TouchableOpacity>
          <View className="h-[1px] mx-4 bg-bordaSutil" />
          <TouchableOpacity
            activeOpacity={0.75}
            className="px-4 py-[14px] flex-row items-center gap-3"
          >
            <View
              className="w-8 h-8 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.cardElevado }}
            >
              <Ionicons
                name="document-text-outline"
                size={16}
                color={colors.textoSecundario}
              />
            </View>
            <Text className="flex-1 text-[14px] font-medium text-textoPrimario">
              Documentos e laudos gerados
            </Text>
            <View
              className="px-[8px] py-[3px] rounded-full mr-1"
              style={{ backgroundColor: colors.cardElevado }}
            >
              <Text className="text-[12px] font-semibold text-textoSecundario">
                {/* laudos count from mockData */}
                12
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textoTerciario}
            />
          </TouchableOpacity>
          <View className="h-[1px] mx-4 bg-bordaSutil" />
          <TouchableOpacity
            activeOpacity={0.75}
            className="px-4 py-[14px] flex-row items-center gap-3"
          >
            <View
              className="w-8 h-8 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.cardElevado }}
            >
              <Ionicons
                name="headset-outline"
                size={16}
                color={colors.textoSecundario}
              />
            </View>
            <Text className="flex-1 text-[14px] font-medium text-textoPrimario">
              Suporte via WhatsApp
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textoTerciario}
            />
          </TouchableOpacity>
          <View className="h-[1px] mx-4 bg-bordaSutil" />
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleSair}
            className="px-4 py-[14px] flex-row items-center gap-3"
          >
            <View
              className="w-8 h-8 rounded-lg items-center justify-center"
              style={{ backgroundColor: colors.vermelhoBackground }}
            >
              <Ionicons
                name="log-out-outline"
                size={16}
                color={colors.vermelho}
              />
            </View>
            <Text className="flex-1 text-[14px] font-medium text-vermelho">
              Sair da conta
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-[12px] text-textoTerciario text-center">
          v 2.6.0 · build 2026.05
        </Text>
      </ScrollView>
    </View>
  )
}
