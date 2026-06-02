import { useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/constants/Colors"
import { useSession } from "@/context/SessionContext"
import { userService } from "@/services/userService"
import type { PlanId } from "@/types/plan"
import { PLANS } from "@/data/plans"
import { formatPlanPreco } from "@/lib/format"

export default function PlanSelectionScreen() {
  const insets = useSafeAreaInsets()
  const { session } = useSession()
  const { from } = useLocalSearchParams<{ from?: string }>()
  const [anual, setAnual] = useState(false)
  const [salvando, setSalvando] = useState<PlanId | null>(null)

  async function selecionarPlano(planId: PlanId) {
    if (!session.usuarioId) return
    setSalvando(planId)
    try {
      await userService.atualizar(session.usuarioId, { plano: planId })
      if (from === "signup") {
        router.replace("/(tabs)/home")
      } else {
        router.back()
      }
    } finally {
      setSalvando(null)
    }
  }

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-bordaSutil">
          {from !== "signup" ? (
            <TouchableOpacity
              className="flex-row items-center gap-1"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color={colors.roxo} />
              <Text className="text-roxo text-[16px]">Voltar</Text>
            </TouchableOpacity>
          ) : (
            <View className="w-16" />
          )}
          <Text className="text-textoPrimario text-[16px] font-bold">Escolha seu plano</Text>
          <View className="w-16" />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, paddingTop: 16 }}
      >
        <Text className="text-textoSecundario text-[14px] text-center mb-5">
          Cada alerta pode valer mais do que um ano de assinatura.
        </Text>

        {/* Toggle Mensal / Anual */}
        <View className="flex-row justify-center mb-6">
          <View className="flex-row bg-card rounded-full border border-bordaSutil p-1">
            <TouchableOpacity
              onPress={() => setAnual(false)}
              className={`px-5 py-[8px] rounded-full ${!anual ? "bg-textoPrimario" : ""}`}
            >
              <Text
                className="text-[14px] font-semibold"
                style={{ color: !anual ? colors.bg : colors.textoSecundario }}
              >
                Mensal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setAnual(true)}
              className={`flex-row items-center gap-2 px-5 py-[8px] rounded-full ${anual ? "bg-textoPrimario" : ""}`}
            >
              <Text
                className="text-[14px] font-semibold"
                style={{ color: anual ? colors.bg : colors.textoSecundario }}
              >
                Anual
              </Text>
              {!anual && (
                <View
                  className="px-2 py-[2px] rounded-full"
                  style={{ backgroundColor: colors.verdeBackground }}
                >
                  <Text className="text-verde text-[10px] font-semibold">2 meses grátis</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards */}
        {PLANS.map((plan) => (
          <View
            key={plan.id}
            className="rounded-2xl border mb-4 overflow-hidden"
            style={{
              borderColor: plan.destaque ? colors.verde : colors.bordaSutil,
              backgroundColor: plan.destaque ? colors.verdeBackground + "80" : colors.card,
            }}
          >
            <View className="px-5 pt-5 pb-5">
              {/* Badge */}
              <View
                className="self-start px-3 py-[4px] rounded-full mb-3"
                style={{ backgroundColor: plan.badgeBg }}
              >
                <Text className="text-[11px] font-semibold" style={{ color: plan.badgeCor }}>
                  {plan.badge}
                </Text>
              </View>

              {/* Name */}
              <Text className="text-[22px] font-bold text-textoPrimario">{plan.nome}</Text>

              {/* Price */}
              <View className="flex-row items-baseline gap-1 mt-1 mb-1">
                <Text className="text-[32px] font-bold text-textoPrimario">
                  {formatPlanPreco(plan, anual)}
                </Text>
                {plan.precoMensal > 0 && (
                  <Text className="text-[14px] text-textoSecundario">
                    /{anual ? "ano" : "mês"}
                  </Text>
                )}
              </View>
              <Text className="text-[13px] text-textoSecundario mb-4">{plan.subtexto}</Text>

              <View className="h-[1px] bg-bordaSutil mb-4" />

              {/* Features */}
              <View className="gap-[10px] mb-5">
                {plan.features.map((f) => (
                  <View key={f.texto} className="flex-row items-center gap-3">
                    <Ionicons
                      name={f.incluido ? "checkmark" : "close"}
                      size={16}
                      color={f.incluido ? plan.badgeCor : colors.textoTerciario}
                    />
                    <Text
                      className="text-[13px]"
                      style={{
                        color: f.incluido ? colors.textoSecundario : colors.textoTerciario,
                        textDecorationLine: f.incluido ? "none" : "line-through",
                      }}
                    >
                      {f.texto}
                    </Text>
                  </View>
                ))}
              </View>

              {/* CTA */}
              <TouchableOpacity
                onPress={() => void selecionarPlano(plan.id)}
                disabled={salvando !== null}
                className="rounded-xl py-[14px] items-center"
                style={{
                  backgroundColor: plan.ctaCor,
                  borderWidth: plan.id === "free" ? 1 : 0,
                  borderColor: colors.bordaVisivel,
                  opacity: salvando !== null && salvando !== plan.id ? 0.5 : 1,
                }}
              >
                {salvando === plan.id ? (
                  <ActivityIndicator size={18} color={plan.ctaTextCor} />
                ) : (
                  <Text
                    className="text-[15px] font-semibold"
                    style={{ color: plan.ctaTextCor }}
                  >
                    {plan.ctaLabel}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* ROI callout */}
        <View
          className="rounded-xl p-4 flex-row gap-3 items-start border"
          style={{
            backgroundColor: colors.verdeBackground,
            borderColor: colors.verde + "30",
          }}
        >
          <Ionicons name="leaf-outline" size={20} color={colors.verde} />
          <Text className="flex-1 text-[13px] text-textoSecundario leading-5">
            Evitar 5% de perda em 500 ha equivale a R$ 250.000 preservados. O plano{" "}
            <Text className="text-verde font-semibold">Produtor</Text> custa R$ 3.588/ano.
            {"\n"}
            <Text className="text-verde font-bold">ROI de 69×</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
