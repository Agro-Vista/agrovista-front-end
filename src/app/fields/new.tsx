import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { colors } from "@/constants/Colors"
import { FieldLabel } from "@/components/FieldLabel"
import { SectionTitle } from "@/components/SectionTitle"
import { useSession } from "@/context/SessionContext"
import { ALERTAS_TALHAO, CULTURAS, TIPOS_SOLO } from "@/data/fields"
import { maskMonthYear } from "@/lib/masks"
import { fieldService } from "@/services/fieldService"

export default function NewField() {
  const insets = useSafeAreaInsets()
  const { session } = useSession()

  const [nome,       setNome]       = useState("")
  const [apelido,    setApelido]    = useState("")
  const [municipio,  setMunicipio]  = useState("")
  const [area,       setArea]       = useState("")
  const [solo,       setSolo]       = useState<string>("Latossolo")
  const [cultura,    setCultura]    = useState<string>("Soja")
  const [dataInicio, setDataInicio] = useState("")
  const [dataFim,    setDataFim]    = useState("")
  const [produtiv,   setProdutiv]   = useState("")
  const [alertaJanel, setAlertaJanel] = useState(true)
  const [alertas, setAlertas] = useState<Record<string, boolean>>(
    Object.fromEntries(ALERTAS_TALHAO.map((a) => [a.id, a.padrao]))
  )
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const toggleAlerta = (id: string) =>
    setAlertas((prev) => ({ ...prev, [id]: !prev[id] }))

  async function salvar() {
    if (!nome.trim()) {
      setErro("O nome do talhão é obrigatório.")
      return
    }
    const areaNum = Number(area.replace(/[^0-9]/g, ""))
    if (!areaNum || areaNum <= 0) {
      setErro("Informe a área em hectares.")
      return
    }
    if (!session.propriedadeId) {
      setErro("Sessão inválida. Faça login novamente.")
      return
    }

    setErro(null)
    setLoading(true)
    try {
      await fieldService.criar({
        propriedadeId: session.propriedadeId,
        nome: nome.trim(),
        apelido: apelido.trim() || undefined,
        municipio: municipio.trim() || undefined,
        cultura,
        areaHectares: areaNum,
        tipoSolo: solo,
        dataInicioPlantio: dataInicio || undefined,
        dataFimPlantio: dataFim || undefined,
        produtividadeEsperada: produtiv || undefined,
        alertas,
        alertaForaJanela: alertaJanel,
        status: "OK",
      })
      router.back()
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar talhão.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-bordaSutil">
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color={colors.roxo} />
            <Text className="text-roxo text-[16px]">Voltar</Text>
          </TouchableOpacity>
          <Text className="text-textoPrimario text-[16px] font-bold">
            Novo talhão
          </Text>
          <TouchableOpacity onPress={salvar} disabled={loading}>
            {loading ? (
              <ActivityIndicator size={16} color={colors.verde} />
            ) : (
              <Text className="text-verde text-[16px] font-semibold">Salvar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
      >
        {/* IDENTIFICAÇÃO */}
        <SectionTitle>IDENTIFICAÇÃO</SectionTitle>

        <FieldLabel>NOME DO TALHÃO</FieldLabel>
        <TextInput
          className="bg-card text-textoPrimario rounded-xl px-4 py-[14px] text-[15px] border border-bordaSutil mb-4"
          placeholder="Ex: Talhão Norte"
          placeholderTextColor={colors.textoTerciario}
          value={nome}
          onChangeText={setNome}
        />

        <FieldLabel>APELIDO OPCIONAL</FieldLabel>
        <TextInput
          className="bg-card text-textoPrimario rounded-xl px-4 py-[14px] text-[15px] border border-bordaSutil"
          placeholder="Como você chama esse pedaço"
          placeholderTextColor={colors.textoTerciario}
          value={apelido}
          onChangeText={setApelido}
        />

        {/* LOCALIZAÇÃO */}
        <SectionTitle>LOCALIZAÇÃO</SectionTitle>

        <FieldLabel>MUNICÍPIO</FieldLabel>
        <TextInput
          className="bg-card text-textoPrimario rounded-xl px-4 py-[14px] text-[15px] border border-bordaSutil mb-4"
          placeholder="Sorriso"
          placeholderTextColor={colors.textoTerciario}
          value={municipio}
          onChangeText={setMunicipio}
        />

        <FieldLabel>ESTADO</FieldLabel>
        <TouchableOpacity className="bg-card rounded-xl px-4 py-[14px] border border-bordaSutil mb-4 flex-row items-center justify-between">
          <Text className="text-textoTerciario text-[15px]">Mato Grosso</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textoTerciario} />
        </TouchableOpacity>

        <FieldLabel>COORDENADAS</FieldLabel>
        <TouchableOpacity className="bg-card rounded-xl px-4 py-[14px] border border-bordaSutil mb-4 flex-row items-center justify-between">
          <Text className="text-textoTerciario text-[15px]">Importar do GPS</Text>
          <Ionicons name="location-outline" size={18} color={colors.roxo} />
        </TouchableOpacity>

        {/* Área de polígono decorativa */}
        <TouchableOpacity
          activeOpacity={0.85}
          className="rounded-2xl overflow-hidden"
          style={{
            backgroundColor: colors.verdeBackground,
            height: 170,
            borderWidth: 1,
            borderColor: colors.verde + "25",
          }}
        >
          <View className="absolute inset-0 overflow-hidden opacity-20">
            {Array.from({ length: 18 }).map((_, i) => (
              <View
                key={i}
                className="absolute"
                style={{
                  width: 1,
                  height: 400,
                  backgroundColor: colors.verde,
                  left: i * 22 - 60,
                  top: -80,
                  transform: [{ rotate: "45deg" }],
                }}
              />
            ))}
          </View>

          <View className="flex-1 items-center justify-center">
            <View className="absolute" style={{ width: 240, height: 115 }}>
              <View
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, bottom: 0,
                  borderWidth: 1.5,
                  borderColor: colors.verde + "AA",
                  borderStyle: "dashed",
                  borderRadius: 4,
                  transform: [{ rotate: "-3deg" }],
                }}
              />
            </View>

            {(
              [
                { top: 18,  left: 52  },
                { top: 14,  right: 60 },
                { top: 56,  right: 30 },
                { bottom: 24, right: 50 },
                { bottom: 22, left: 40 },
                { top: 80,  left: 95  },
              ] as const
            ).map((pos, i) => (
              <View
                key={i}
                className="absolute rounded-full"
                style={{ width: 8, height: 8, backgroundColor: colors.verde, ...(pos as object) }}
              />
            ))}

            <View
              className="px-5 py-[9px] rounded-full"
              style={{ backgroundColor: colors.cardElevado + "E0" }}
            >
              <Text
                className="text-textoPrimario text-[13px] font-semibold"
                style={{ fontFamily: "SpaceMono" }}
              >
                Toque para desenhar o polígono
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* PROPRIEDADE */}
        <SectionTitle>PROPRIEDADE</SectionTitle>

        <FieldLabel>ÁREA EM HECTARES</FieldLabel>
        <View className="bg-card rounded-xl border border-bordaSutil flex-row items-center px-4 mb-4">
          <TextInput
            className="flex-1 text-textoPrimario py-[14px] text-[15px]"
            placeholder="Ex: 210"
            placeholderTextColor={colors.textoTerciario}
            keyboardType="numeric"
            value={area}
            onChangeText={setArea}
          />
          <Ionicons name="chevron-expand" size={18} color={colors.textoTerciario} />
        </View>

        <FieldLabel>TIPO DE SOLO</FieldLabel>
        <View className="flex-row flex-wrap gap-2 mb-2">
          {TIPOS_SOLO.map((s) => {
            const ativo = solo === s
            return (
              <TouchableOpacity
                key={s}
                onPress={() => setSolo(s)}
                className="rounded-full px-5 py-[9px] border"
                style={{
                  backgroundColor: ativo ? colors.verdeBackground : colors.card,
                  borderColor: ativo ? colors.verde + "80" : colors.bordaVisivel,
                }}
              >
                <Text
                  className="text-[14px] font-semibold"
                  style={{ color: ativo ? colors.verde : colors.textoSecundario }}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* CULTURA */}
        <SectionTitle>CULTURA</SectionTitle>
        <View className="flex-row flex-wrap" style={{ gap: 10 }}>
          {CULTURAS.map((item) => {
            const ativo = cultura === item.id
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setCultura(item.id)}
                className="items-center justify-center rounded-2xl border"
                style={{
                  width: "31%",
                  aspectRatio: 1,
                  backgroundColor: ativo ? colors.verdeBackground : colors.card,
                  borderColor: ativo ? colors.verde : colors.bordaSutil,
                  borderWidth: ativo ? 1.5 : 1,
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={26}
                  color={ativo ? colors.verde : colors.textoTerciario}
                />
                <Text
                  className="text-[13px] font-semibold mt-[8px]"
                  style={{ color: ativo ? colors.verde : colors.textoSecundario }}
                >
                  {item.id}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* PERÍODO DE PLANTIO */}
        <SectionTitle>PERÍODO DE PLANTIO</SectionTitle>

        <Text className="text-textoSecundario text-[11px] font-semibold tracking-wider mb-3">
          JANELA DE PLANTIO ESPERADA
        </Text>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-textoTerciario text-[11px] font-semibold tracking-wider mb-[6px]">
              INÍCIO
            </Text>
            <View className="bg-card rounded-xl border border-bordaSutil flex-row items-center px-4">
              <TextInput
                className="flex-1 text-textoPrimario py-[14px] text-[15px]"
                placeholder="MM/AAAA"
                placeholderTextColor={colors.textoTerciario}
                keyboardType="numeric"
                value={dataInicio}
                onChangeText={(v) => setDataInicio(maskMonthYear(v))}
              />
              <Ionicons name="calendar-outline" size={17} color={colors.textoTerciario} />
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-textoTerciario text-[11px] font-semibold tracking-wider mb-[6px]">
              FIM
            </Text>
            <View className="bg-card rounded-xl border border-bordaSutil flex-row items-center px-4">
              <TextInput
                className="flex-1 text-textoPrimario py-[14px] text-[15px]"
                placeholder="MM/AAAA"
                placeholderTextColor={colors.textoTerciario}
                keyboardType="numeric"
                value={dataFim}
                onChangeText={(v) => setDataFim(maskMonthYear(v))}
              />
            </View>
          </View>
        </View>

        <View className="bg-card rounded-xl border border-bordaSutil flex-row items-center justify-between px-4 py-[14px] mb-4">
          <Text className="text-textoPrimario text-[15px] font-medium">
            Alertar fora da janela de plantio
          </Text>
          <Switch
            value={alertaJanel}
            onValueChange={setAlertaJanel}
            trackColor={{ false: colors.bordaVisivel, true: colors.verde }}
            thumbColor={colors.textoPrimario}
          />
        </View>

        {/* PRODUTIVIDADE ESPERADA */}
        <FieldLabel>PRODUTIVIDADE ESPERADA</FieldLabel>
        <TextInput
          className="bg-card text-textoPrimario rounded-xl px-4 py-[14px] text-[15px] border border-bordaSutil"
          placeholder="Ex: 60 sacas/ha"
          placeholderTextColor={colors.textoTerciario}
          keyboardType="numeric"
          value={produtiv}
          onChangeText={setProdutiv}
        />
        <Text className="text-textoTerciario text-[12px] mt-2 mb-4">
          Usado para calcular o ROI dos alertas
        </Text>

        {/* ALERTAS DESTE TALHÃO */}
        <SectionTitle>ALERTAS DESTE TALHÃO</SectionTitle>

        <View className="bg-card rounded-2xl border border-bordaSutil overflow-hidden">
          {ALERTAS_TALHAO.map((alerta, idx) => (
            <View
              key={alerta.id}
              className="flex-row items-center justify-between px-4 py-[14px]"
              style={
                idx < ALERTAS_TALHAO.length - 1
                  ? { borderBottomWidth: 1, borderBottomColor: colors.bordaSutil }
                  : undefined
              }
            >
              <View className="flex-1 mr-3">
                <Text className="text-textoPrimario text-[15px] font-medium">
                  {alerta.titulo}
                </Text>
                <Text className="text-textoTerciario text-[12px] mt-[2px]">
                  {alerta.sub}
                </Text>
              </View>
              <Switch
                value={alertas[alerta.id]}
                onValueChange={() => toggleAlerta(alerta.id)}
                trackColor={{ false: colors.bordaVisivel, true: colors.verde }}
                thumbColor={colors.textoPrimario}
              />
            </View>
          ))}
        </View>

        {/* Erro de validação */}
        {erro && (
          <View className="mt-5 p-3 bg-[#2d0f0f] border border-[#ef4444] rounded-xl">
            <Text className="text-[#f87171] text-center" style={{ fontSize: 13 }}>
              {erro}
            </Text>
          </View>
        )}

        {/* Botão Salvar */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={salvar}
          disabled={loading}
          className="rounded-2xl py-[18px] items-center mt-6"
          style={{ backgroundColor: colors.verde }}
        >
          {loading ? (
            <ActivityIndicator color={colors.bg} size={20} />
          ) : (
            <Text className="text-bg text-[16px] font-bold">Salvar talhão</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}
