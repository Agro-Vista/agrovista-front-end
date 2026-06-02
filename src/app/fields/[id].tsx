import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
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
import { ALERTAS_TALHAO, CULTURAS, STATUS_CFG, TIPOS_SOLO } from "@/data/fields"
import { maskMonthYear } from "@/lib/masks"
import { fieldService } from "@/services/fieldService"
import type { Field } from "@/types/field"

export default function EditField() {
  const insets = useSafeAreaInsets()
  const { id } = useLocalSearchParams<{ id: string }>()
  const talhaoId = parseInt(id, 10)

  const [carregando, setCarregando] = useState(true)
  const [talhao, setTalhao] = useState<Field | null>(null)

  const [nome,        setNome]        = useState("")
  const [apelido,     setApelido]     = useState("")
  const [municipio,   setMunicipio]   = useState("")
  const [area,        setArea]        = useState("")
  const [solo,        setSolo]        = useState<string>("Latossolo")
  const [cultura,     setCultura]     = useState<string>("Soja")
  const [dataInicio,  setDataInicio]  = useState("")
  const [dataFim,     setDataFim]     = useState("")
  const [produtiv,    setProdutiv]    = useState("")
  const [alertaJanel, setAlertaJanel] = useState(true)
  const [alertas, setAlertas] = useState<Record<string, boolean>>(
    Object.fromEntries(ALERTAS_TALHAO.map((a) => [a.id, a.padrao]))
  )
  const [loading,    setLoading]    = useState(false)
  const [deletando,  setDeletando]  = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const [erro,       setErro]       = useState<string | null>(null)

  useEffect(() => {
    fieldService.buscar(talhaoId).then((t) => {
      if (t) {
        setTalhao(t)
        setNome(t.nome)
        setApelido(t.apelido ?? "")
        setMunicipio(t.municipio ?? "")
        setArea(String(t.areaHectares))
        setSolo(t.tipoSolo ?? "Latossolo")
        setCultura(t.cultura)
        setDataInicio(t.dataInicioPlantio ?? "")
        setDataFim(t.dataFimPlantio ?? "")
        setProdutiv(t.produtividadeEsperada ?? "")
        setAlertaJanel(t.alertaForaJanela ?? true)
        if (t.alertas) setAlertas(t.alertas)
      }
      setCarregando(false)
    })
  }, [talhaoId])

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

    setErro(null)
    setLoading(true)
    try {
      await fieldService.atualizar(talhaoId, {
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
      })
      router.back()
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao salvar talhão.")
    } finally {
      setLoading(false)
    }
  }

  async function executarExclusao() {
    setDeletando(true)
    try {
      await fieldService.deletar(talhaoId)
      router.back()
    } catch {
      setErro("Erro ao excluir talhão.")
      setDeletando(false)
      setConfirmando(false)
    }
  }

  const statusCfg = talhao ? STATUS_CFG[talhao.status] : null

  if (carregando) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator color={colors.verde} size={32} />
      </View>
    )
  }

  if (!talhao) {
    return (
      <View className="flex-1 bg-bg items-center justify-center" style={{ gap: 12 }}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.vermelho} />
        <Text className="text-textoSecundario text-[15px] font-semibold">
          Talhão não encontrado
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-roxo text-[14px]">Voltar</Text>
        </TouchableOpacity>
      </View>
    )
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
            Editar talhão
          </Text>
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={salvar} disabled={loading}>
              {loading ? (
                <ActivityIndicator size={16} color={colors.verde} />
              ) : (
                <Text className="text-verde text-[16px] font-semibold">Salvar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
      >
        {/* Badge de status atual */}
        {statusCfg && (
          <View
            className="flex-row items-center self-start rounded-full px-3 py-[6px] mb-2 gap-2"
            style={{ backgroundColor: statusCfg.bg, borderWidth: 1, borderColor: statusCfg.cor + "50" }}
          >
            <View className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: statusCfg.cor }} />
            <Text className="text-[12px] font-semibold" style={{ color: statusCfg.cor }}>
              {statusCfg.label}
            </Text>
          </View>
        )}

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

        {/* Erro */}
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
            <Text className="text-bg text-[16px] font-bold">Salvar alterações</Text>
          )}
        </TouchableOpacity>

        {/* Excluir talhão */}
        {!confirmando ? (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setConfirmando(true)}
            disabled={deletando}
            className="rounded-2xl py-[18px] items-center mt-3 border"
            style={{ borderColor: colors.vermelho + "60" }}
          >
            <Text className="text-[16px] font-semibold" style={{ color: colors.vermelho }}>
              Excluir talhão
            </Text>
          </TouchableOpacity>
        ) : (
          <View
            className="rounded-2xl mt-3 border p-4"
            style={{ borderColor: colors.vermelho + "60", backgroundColor: colors.vermelhoBackground }}
          >
            <Text className="text-[14px] font-semibold text-center mb-1" style={{ color: colors.vermelho }}>
              Excluir "{nome}"?
            </Text>
            <Text className="text-[12px] text-textoTerciario text-center mb-4">
              Esta ação não pode ser desfeita.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setConfirmando(false)}
                disabled={deletando}
                className="flex-1 rounded-xl py-[13px] items-center border border-bordaSutil bg-card"
              >
                <Text className="text-[14px] font-semibold text-textoPrimario">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => void executarExclusao()}
                disabled={deletando}
                className="flex-1 rounded-xl py-[13px] items-center"
                style={{ backgroundColor: colors.vermelho }}
              >
                {deletando ? (
                  <ActivityIndicator size={16} color="#fff" />
                ) : (
                  <Text className="text-[14px] font-bold text-white">Excluir</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  )
}
