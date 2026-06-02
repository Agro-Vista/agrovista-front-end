import { useCallback, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router, useFocusEffect, type Href } from "expo-router"

import { colors } from "@/constants/Colors"
import { PageHeader } from "@/components/PageHeader"
import { Sparkline } from "@/components/Sparkline"
import { useSession } from "@/context/SessionContext"
import { fieldService } from "@/services/fieldService"
import { STATUS_CFG, STATUS_DESCRICAO } from "@/data/fieldConstants"
import { dashboard, usuario } from "@/data/mockData"
import type { Field } from "@/types/field"

export default function TalhoesScreen() {
  const { session } = useSession()
  const [talhoes, setTalhoes] = useState<Field[]>([])

  useFocusEffect(
    useCallback(() => {
      if (!session.propriedadeId) return
      void fieldService.listar(session.propriedadeId).then(setTalhoes)
    }, [session.propriedadeId])
  )

  const totalHa = talhoes.reduce((acc, t) => acc + t.areaHectares, 0)
  const countOk = talhoes.filter((t) => t.status === "OK").length
  const countAtencao = talhoes.filter((t) => t.status === "ATENCAO").length
  const countRisco = talhoes.filter((t) => t.status === "RISCO").length

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
        <View className="mb-4">
          <View className="flex-row items-start justify-between">
            <Text className="text-[28px] font-bold text-textoPrimario">
              Meus talhões
            </Text>
            <Text className="text-[13px] text-textoSecundario mt-[6px]">
              {totalHa} ha · {talhoes.length} talhões
            </Text>
          </View>
          <Text className="text-[13px] text-textoTerciario mt-[3px]">
            {usuario.fazenda} · {usuario.municipio} · {usuario.estado}
          </Text>
        </View>

        {/* Pills de resumo */}
        {talhoes.length > 0 && (
          <View className="flex-row gap-2 mb-5">
            {countOk > 0 && (
              <View
                className="flex-row items-center px-3 py-[6px] rounded-full bg-verdeBackground border"
                style={{ borderColor: colors.verde + "60" }}
              >
                <Text className="text-[13px] font-semibold text-verde">{countOk} OK</Text>
              </View>
            )}
            {countAtencao > 0 && (
              <View
                className="flex-row items-center px-3 py-[6px] rounded-full bg-ambarBackground border"
                style={{ borderColor: colors.ambar + "60" }}
              >
                <Text className="text-[13px] font-semibold text-ambar">{countAtencao} Atenção</Text>
              </View>
            )}
            {countRisco > 0 && (
              <View
                className="flex-row items-center px-3 py-[6px] rounded-full bg-vermelhoBackground border"
                style={{ borderColor: colors.vermelho + "60" }}
              >
                <Text className="text-[13px] font-semibold text-vermelho">{countRisco} Risco</Text>
              </View>
            )}
          </View>
        )}

        {/* Estado vazio */}
        {talhoes.length === 0 && (
          <View
            className="rounded-2xl border border-bordaSutil bg-card items-center py-10 mb-4"
            style={{ gap: 8 }}
          >
            <Ionicons name="leaf-outline" size={36} color={colors.textoTerciario} />
            <Text className="text-textoSecundario text-[15px] font-semibold">
              Nenhum talhão cadastrado
            </Text>
            <Text className="text-textoTerciario text-[13px] text-center px-6">
              Adicione seu primeiro talhão para começar a monitorar sua lavoura.
            </Text>
          </View>
        )}

        {/* Cards de talhão */}
        {talhoes.length > 0 && (
          <View className="gap-[10px]">
            {talhoes.map((talhao) => {
              const cfg = STATUS_CFG[talhao.status]
              return (
                <TouchableOpacity
                  key={talhao.id}
                  activeOpacity={0.75}
                  onPress={() => router.push(`/fields/${talhao.id}` as Href)}
                  className="bg-card rounded-2xl border border-bordaSutil p-4"
                >
                  <View className="flex-row items-start justify-between mb-4">
                    <View className="flex-row items-center flex-1 mr-2 gap-3">
                      <View
                        className="w-10 h-10 rounded-xl items-center justify-center"
                        style={{ backgroundColor: cfg.bg }}
                      >
                        <Ionicons name={cfg.icon} size={20} color={cfg.cor} />
                      </View>
                      <View className="flex-1">
                        <Text
                          className="text-[14px] font-bold text-textoPrimario"
                          numberOfLines={1}
                        >
                          {talhao.nome}{" "}
                          <Text className="text-textoSecundario font-normal">
                            · {talhao.cultura}
                          </Text>
                        </Text>
                        <Text className="text-[12px] text-textoTerciario mt-[2px]">
                          {talhao.areaHectares} ha · atualizado agora
                        </Text>
                      </View>
                    </View>

                    <View
                      className="flex-row items-center rounded-full border px-[10px] py-[5px] gap-[5px]"
                      style={{ backgroundColor: cfg.bg, borderColor: cfg.cor + "50" }}
                    >
                      <View
                        className="w-[6px] h-[6px] rounded-full"
                        style={{ backgroundColor: cfg.cor }}
                      />
                      <Text
                        className="text-[12px] font-semibold"
                        style={{ color: cfg.cor }}
                      >
                        {cfg.label}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center justify-between">
                    <Text
                      className="text-[12px] text-textoTerciario flex-1"
                      style={{ fontFamily: "SpaceMono" }}
                      numberOfLines={1}
                    >
                      {STATUS_DESCRICAO[talhao.status]}
                    </Text>
                    <Sparkline status={talhao.status} />
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>
        )}

        {/* Card adicionar talhão */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => router.push("/fields/new" as Href)}
          className="rounded-2xl border border-roxo mt-3 bg-roxoBackground p-4"
        >
          <View className="flex-row items-center gap-3">
            <View
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.roxo + "20" }}
            >
              <Ionicons name="add" size={18} color={colors.roxo} />
            </View>
            <View className="flex-1">
              <Text className="text-[14px] font-semibold text-roxo">Adicionar talhão</Text>
              <Text className="text-[12px] text-textoTerciario mt-[2px]">
                Desenhe ou importe o polígono
              </Text>
            </View>
            <Ionicons name="open-outline" size={16} color={colors.roxo} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
