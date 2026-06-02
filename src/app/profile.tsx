import { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  ActivityIndicator,
} from "react-native"
import { router } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

import { colors } from "@/constants/Colors"
import { PLAN_CFG } from "@/data/plans"
import { FieldLabel } from "@/components/FieldLabel"
import { SectionTitle } from "@/components/SectionTitle"
import { CropChipSelector } from "@/components/CropChipSelector"
import { useSession } from "@/context/SessionContext"
import { userService } from "@/services/userService"
import { maskPhone, stripMask } from "@/lib/masks"
import { usuario } from "@/data/mockData"
import { EDIT_FORM_INITIAL, PREFS_INITIAL, SENHA_FORM_INITIAL } from "@/data/profile"
import type { AntecedenciaOpcao } from "@/data/profile"
import type { User } from "@/types/user"

export default function PerfilScreen() {
  const { session, setSession, clearSession } = useSession()
  const insets = useSafeAreaInsets()

  const [user,    setUser]    = useState<User | null>(null)
  const [editando, setEditando] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erroEdit, setErroEdit] = useState<string | null>(null)

  const [editForm,  setEditForm]  = useState(EDIT_FORM_INITIAL)
  const [prefs,     setPrefs]     = useState(PREFS_INITIAL)
  const [senhaForm, setSenhaForm] = useState(SENHA_FORM_INITIAL)

  const [confirmandoSaida, setConfirmandoSaida] = useState(false)
  const [saindo,           setSaindo]           = useState(false)

  function setEdit<K extends keyof typeof EDIT_FORM_INITIAL>(k: K, v: typeof EDIT_FORM_INITIAL[K]) {
    setEditForm(p => ({ ...p, [k]: v }))
  }
  function setPref<K extends keyof typeof PREFS_INITIAL>(k: K, v: typeof PREFS_INITIAL[K]) {
    setPrefs(p => ({ ...p, [k]: v }))
  }
  function setSenha<K extends keyof typeof SENHA_FORM_INITIAL>(k: K, v: typeof SENHA_FORM_INITIAL[K]) {
    setSenhaForm(p => ({ ...p, [k]: v }))
  }

  useEffect(() => {
    if (!session.usuarioId) return
    void userService.buscar(session.usuarioId).then((u) => {
      if (!u) return
      setUser(u)
      populaEdicao(u)
    })
  }, [session.usuarioId])

  function populaEdicao(u: User) {
    setEditForm({
      nome:        u.nome,
      email:       u.email,
      telefone:    maskPhone(u.telefone),
      fazenda:     u.nomeFazenda ?? "",
      municipio:   u.municipio ?? "",
      estado:      u.estado ?? "",
      area:        u.areaHectares ? String(u.areaHectares) : "",
      cultura:     u.cultura ?? "Soja",
      cooperativa: u.cooperativa ?? "",
    })
  }

  function iniciarEdicao() {
    if (user) populaEdicao(user)
    setErroEdit(null)
    setEditando(true)
  }

  async function salvar() {
    if (!session.usuarioId) return
    if (!editForm.nome.trim()) { setErroEdit("Nome é obrigatório."); return }
    setSalvando(true)
    setErroEdit(null)
    try {
      const atualizado = await userService.atualizar(session.usuarioId, {
        nome:         editForm.nome.trim(),
        email:        editForm.email.trim(),
        telefone:     stripMask(editForm.telefone),
        nomeFazenda:  editForm.fazenda.trim() || undefined,
        municipio:    editForm.municipio.trim() || undefined,
        estado:       editForm.estado.trim() || undefined,
        areaHectares: editForm.area ? Number(editForm.area.replace(/\D/g, "")) || undefined : undefined,
        cultura:      editForm.cultura || undefined,
        cooperativa:  editForm.cooperativa.trim() || undefined,
      })
      setUser(atualizado)
      await setSession({ ...session, nome: atualizado.nome })
      setEditando(false)
    } catch (err) {
      setErroEdit(err instanceof Error ? err.message : "Erro ao salvar.")
    } finally {
      setSalvando(false)
    }
  }

  async function alterarSenha() {
    if (!session.usuarioId || !user) return
    const { atual, nova, confirma } = senhaForm
    if (!atual)             { setSenha("erro", "Informe a senha atual."); return }
    if (atual !== user.senha) { setSenha("erro", "Senha atual incorreta."); return }
    if (!nova)              { setSenha("erro", "Informe a nova senha."); return }
    if (nova.length < 6)    { setSenha("erro", "A nova senha deve ter ao menos 6 caracteres."); return }
    if (nova !== confirma)  { setSenha("erro", "As senhas não coincidem."); return }
    setSenha("salvando", true)
    setSenha("erro", null)
    try {
      const atualizado = await userService.atualizar(session.usuarioId, { senha: nova })
      setUser(atualizado)
      setSenha("sucesso", true)
      setTimeout(() => setSenhaForm(SENHA_FORM_INITIAL), 1500)
    } catch (err) {
      setSenha("erro", err instanceof Error ? err.message : "Erro ao salvar.")
    } finally {
      setSenha("salvando", false)
    }
  }

  async function executarSaida() {
    setSaindo(true)
    await clearSession()
    router.replace("/login")
  }

  const nomeSessao = user?.nome || session.nome || usuario.nome
  const iniciais = nomeSessao
    .split(" ").slice(0, 2)
    .map((p) => p[0]).join("").toUpperCase()

  const fazenda   = user?.nomeFazenda ?? usuario.fazenda
  const municipio = user?.municipio   ?? usuario.municipio
  const estado    = user?.estado      ?? usuario.estado
  const area      = user?.areaHectares ?? usuario.areaTotal
  const cultura   = user?.cultura     ?? usuario.culturas[0]

  const planCfg = PLAN_CFG[user?.plano ?? "free"]

  return (
    <View className="flex-1 bg-bg">
      {/* Header */}
      <View style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-bordaSutil">
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => editando ? setEditando(false) : router.back()}
          >
            <Ionicons name="arrow-back" size={18} color={colors.roxo} />
            <Text className="text-roxo text-[16px]">{editando ? "Cancelar" : "Voltar"}</Text>
          </TouchableOpacity>

          <Text className="text-textoPrimario text-[16px] font-bold">Perfil</Text>

          {editando ? (
            <TouchableOpacity onPress={salvar} disabled={salvando}>
              {salvando
                ? <ActivityIndicator size={16} color={colors.verde} />
                : <Text className="text-verde text-[16px] font-semibold">Salvar</Text>
              }
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={iniciarEdicao}>
              <Ionicons name="create-outline" size={22} color={colors.roxo} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      >
        {/* Avatar */}
        <View className="items-center pt-5 pb-4">
          <View
            className="w-[72px] h-[72px] rounded-full border-[2px] border-verde items-center justify-center"
            style={{ backgroundColor: colors.verde + "20" }}
          >
            <Text className="text-[26px] font-bold text-verde">{iniciais}</Text>
          </View>
          {!editando && (
            <>
              <Text className="text-[20px] font-bold text-textoPrimario mt-3">{nomeSessao}</Text>
              {user?.email ? (
                <Text className="text-[13px] text-textoSecundario mt-[3px]">{user.email}</Text>
              ) : null}
              {user?.telefone ? (
                <Text className="text-[12px] text-textoTerciario mt-[2px]">{maskPhone(user.telefone)}</Text>
              ) : null}
              <Text className="text-[12px] text-textoTerciario mt-[2px]">
                {municipio} · {estado}
              </Text>
              <View
                className="flex-row items-center gap-[6px] mt-3 px-4 py-[6px] rounded-full"
                style={{ backgroundColor: planCfg.bg }}
              >
                <View className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: planCfg.cor }} />
                <Text className="text-[13px] font-medium" style={{ color: planCfg.cor }}>
                  Plano {planCfg.nome} · Ativo
                </Text>
              </View>
            </>
          )}
        </View>

        {/* ── MODO EDIÇÃO ── */}
        {editando && (
          <>
            <SectionTitle>DADOS PESSOAIS</SectionTitle>

            <FieldLabel>NOME COMPLETO</FieldLabel>
            <TextInput
              className="bg-card text-textoPrimario rounded-xl px-4 py-[14px] text-[15px] border border-bordaSutil mb-4"
              placeholderTextColor={colors.textoTerciario}
              placeholder="João Batista Ferreira"
              value={editForm.nome}
              onChangeText={(v) => setEdit("nome", v)}
              autoCapitalize="words"
            />

            <FieldLabel>E-MAIL</FieldLabel>
            <TextInput
              className="bg-card text-textoPrimario rounded-xl px-4 py-[14px] text-[15px] border border-bordaSutil mb-4"
              placeholderTextColor={colors.textoTerciario}
              placeholder="joao@fazenda.com.br"
              value={editForm.email}
              onChangeText={(v) => setEdit("email", v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FieldLabel>TELEFONE (WHATSAPP)</FieldLabel>
            <TextInput
              className="bg-card text-textoPrimario rounded-xl px-4 py-[14px] text-[15px] border border-bordaSutil mb-1"
              placeholderTextColor={colors.textoTerciario}
              placeholder="(66) 99999-0000"
              value={editForm.telefone}
              onChangeText={(v) => setEdit("telefone", maskPhone(v))}
              keyboardType="phone-pad"
            />

            <SectionTitle>MINHA PROPRIEDADE</SectionTitle>

            <FieldLabel>NOME DA FAZENDA</FieldLabel>
            <TextInput
              className="bg-card text-textoPrimario rounded-xl px-4 py-[14px] text-[15px] border border-bordaSutil mb-4"
              placeholderTextColor={colors.textoTerciario}
              placeholder="Fazenda Santa Fé"
              value={editForm.fazenda}
              onChangeText={(v) => setEdit("fazenda", v)}
              autoCapitalize="words"
            />

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <FieldLabel>MUNICÍPIO</FieldLabel>
                <TextInput
                  className="bg-card text-textoPrimario rounded-xl px-4 py-[14px] text-[15px] border border-bordaSutil"
                  placeholderTextColor={colors.textoTerciario}
                  placeholder="Sorriso"
                  value={editForm.municipio}
                  onChangeText={(v) => setEdit("municipio", v)}
                  autoCapitalize="words"
                />
              </View>
              <View className="flex-1">
                <FieldLabel>ESTADO</FieldLabel>
                <TextInput
                  className="bg-card text-textoPrimario rounded-xl px-4 py-[14px] text-[15px] border border-bordaSutil"
                  placeholderTextColor={colors.textoTerciario}
                  placeholder="Mato Grosso"
                  value={editForm.estado}
                  onChangeText={(v) => setEdit("estado", v)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <FieldLabel>ÁREA TOTAL (HECTARES)</FieldLabel>
            <TextInput
              className="bg-card text-textoPrimario rounded-xl px-4 py-[14px] text-[15px] border border-bordaSutil mb-1"
              placeholderTextColor={colors.textoTerciario}
              placeholder="590"
              value={editForm.area}
              onChangeText={(v) => setEdit("area", v)}
              keyboardType="numeric"
            />

            {user?.plano === "cooperativa" && (
              <>
                <FieldLabel>COOPERATIVA</FieldLabel>
                <TextInput
                  className="bg-card text-textoPrimario rounded-xl px-4 py-[14px] text-[15px] border border-bordaSutil mb-4"
                  placeholderTextColor={colors.textoTerciario}
                  placeholder="Cooperativa Centro-Oeste"
                  value={editForm.cooperativa}
                  onChangeText={(v) => setEdit("cooperativa", v)}
                  autoCapitalize="words"
                />
              </>
            )}

            <SectionTitle>CULTURA PRINCIPAL</SectionTitle>
            <CropChipSelector value={editForm.cultura} onChange={(v) => setEdit("cultura", v)} />

            {erroEdit && (
              <View className="mt-4 p-3 bg-[#2d0f0f] border border-[#ef4444] rounded-xl">
                <Text className="text-[#f87171] text-center text-[13px]">{erroEdit}</Text>
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={salvar}
              disabled={salvando}
              className="rounded-2xl py-[17px] items-center mt-5"
              style={{ backgroundColor: colors.verde }}
            >
              {salvando
                ? <ActivityIndicator color={colors.bg} size={20} />
                : <Text className="text-bg text-[16px] font-bold">Salvar alterações</Text>
              }
            </TouchableOpacity>
          </>
        )}

        {/* ── MODO LEITURA ── */}
        {!editando && (
          <>
            {/* MINHA PROPRIEDADE */}
            <Text className="text-[11px] font-bold tracking-[1.2px] text-textoTerciario mb-2">
              MINHA PROPRIEDADE
            </Text>
            <View className="bg-card rounded-2xl border border-bordaSutil mb-5 overflow-hidden">
              {([
                { icon: "business-outline",  label: "Fazenda",          value: fazenda },
                { icon: "resize-outline",    label: "Área total",        value: `${area} hectares` },
                { icon: "leaf-outline",      label: "Cultura principal", value: cultura },
                { icon: "location-outline",  label: "Localização",       value: `${estado} · ${municipio}` },
                { icon: "flag-outline", label: "Cooperativa", value: user?.plano === "cooperativa" ? (user.cooperativa || `${fazenda} Cooperativa`) : "Sem plano cooperativa", muted: user?.plano !== "cooperativa" },
              ] as { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; muted?: boolean }[]).map((row, idx, arr) => (
                <View key={row.label}>
                  <View className="px-4 py-[14px] flex-row items-center">
                    <Ionicons name={row.icon} size={18} color={colors.textoTerciario} />
                    <Text className="text-[13px] text-textoTerciario ml-3 w-[120px]">{row.label}</Text>
                    <Text className="flex-1 text-[13px] font-medium text-right" style={{ color: row.muted ? colors.textoTerciario : colors.textoPrimario }} numberOfLines={1}>
                      {row.muted ? `× ${row.value}` : row.value}
                    </Text>
                  </View>
                  {idx < arr.length - 1 && <View className="h-[1px] mx-4 bg-bordaSutil" />}
                </View>
              ))}
            </View>

            {/* PREFERÊNCIAS */}
            <Text className="text-[11px] font-bold tracking-[1.2px] text-textoTerciario mb-2">
              PREFERÊNCIAS
            </Text>
            <View className="bg-card rounded-2xl border border-bordaSutil mb-3 overflow-hidden">
              {([
                { label: "Alertas via WhatsApp", sub: "Mensagens em tempo real",   key: "alertaWhatsApp" as const },
                { label: "Alertas via push",     sub: "Notificações no celular",   key: "alertaPush"     as const },
                { label: "Relatório semanal",    sub: "Resumo toda segunda-feira", key: "relatorioEmail" as const },
              ]).map((item, idx, arr) => (
                <View key={item.label}>
                  <View className="px-4 py-[14px] flex-row items-center justify-between">
                    <View className="flex-1 mr-3">
                      <Text className="text-[14px] font-medium text-textoPrimario">{item.label}</Text>
                      <Text className="text-[12px] text-textoTerciario mt-[2px]">{item.sub}</Text>
                    </View>
                    <Switch
                      value={prefs[item.key]}
                      onValueChange={(v) => setPref(item.key, v)}
                      trackColor={{ false: colors.bordaVisivel, true: colors.verde }}
                      thumbColor={colors.textoPrimario}
                    />
                  </View>
                  {idx < arr.length - 1 && <View className="h-[1px] mx-4 bg-bordaSutil" />}
                </View>
              ))}
            </View>

            {/* Antecedência */}
            <View className="bg-card rounded-2xl border border-bordaSutil mb-5 px-4 py-[14px]">
              <Text className="text-[14px] font-medium text-textoPrimario">
                Antecedência dos alertas
              </Text>
              <Text className="text-[12px] text-textoTerciario mt-[2px] mb-3">
                Quanto antes você quer ser avisado
              </Text>
              <View className="flex-row gap-2">
                {(["24h", "48h", "72h"] as AntecedenciaOpcao[]).map((op) => {
                  const ativa = prefs.antecedencia === op
                  return (
                    <TouchableOpacity
                      key={op}
                      onPress={() => setPref("antecedencia", op)}
                      className={`flex-1 py-[10px] rounded-xl items-center border ${
                        ativa ? "bg-verde border-verde" : "bg-cardElevado border-bordaVisivel"
                      }`}
                    >
                      <Text className={`text-[14px] font-semibold ${ativa ? "text-[#111111]" : "text-textoSecundario"}`}>
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
              className="rounded-2xl border mb-5 px-4 py-4"
              style={{ borderColor: planCfg.cor, backgroundColor: planCfg.bg }}
            >
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-[15px] font-semibold text-textoPrimario">
                  Plano {planCfg.nome}
                </Text>
                <Ionicons name="card-outline" size={20} color={planCfg.cor} />
              </View>
              <Text className="text-[28px] font-bold" style={{ color: planCfg.cor }}>
                {planCfg.preco}
              </Text>
              <Text className="text-[12px] text-textoTerciario mt-[3px] mb-4">
                {user?.plano === "free" ? "Sem cobrança" : "Próxima cobrança: 15 de junho de 2026"}
              </Text>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => router.push("/plan-selection" as never)}
                className="rounded-xl py-[13px] items-center border"
                style={{ borderColor: planCfg.cor, backgroundColor: planCfg.cor + "18" }}
              >
                <Text className="text-[14px] font-semibold" style={{ color: planCfg.cor }}>
                  Alterar plano
                </Text>
              </TouchableOpacity>
            </View>

            {/* CONTA */}
            <Text className="text-[11px] font-bold tracking-[1.2px] text-textoTerciario mb-2">
              CONTA
            </Text>
            <View className="bg-card rounded-2xl border border-bordaSutil mb-6 overflow-hidden">
              {!senhaForm.aberto ? (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setSenha("aberto", true)}
                  className="px-4 py-[14px] flex-row items-center gap-3"
                >
                  <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: colors.cardElevado }}>
                    <Ionicons name="key-outline" size={16} color={colors.textoSecundario} />
                  </View>
                  <Text className="flex-1 text-[14px] font-medium text-textoPrimario">Alterar senha</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.textoTerciario} />
                </TouchableOpacity>
              ) : (
                <View className="px-4 py-4">
                  {senhaForm.sucesso ? (
                    <View className="flex-row items-center gap-2 py-2">
                      <Ionicons name="checkmark-circle" size={20} color={colors.verde} />
                      <Text className="text-[14px] font-semibold text-verde">Senha alterada com sucesso!</Text>
                    </View>
                  ) : (
                    <>
                      <Text className="text-[13px] font-semibold text-textoPrimario mb-3">Alterar senha</Text>

                      <TextInput
                        className="bg-cardElevado text-textoPrimario rounded-xl px-4 py-[13px] text-[14px] border border-bordaSutil mb-2"
                        placeholderTextColor={colors.textoTerciario}
                        placeholder="Senha atual"
                        value={senhaForm.atual}
                        onChangeText={(v) => setSenha("atual", v)}
                        secureTextEntry
                        autoCapitalize="none"
                      />
                      <TextInput
                        className="bg-cardElevado text-textoPrimario rounded-xl px-4 py-[13px] text-[14px] border border-bordaSutil mb-2"
                        placeholderTextColor={colors.textoTerciario}
                        placeholder="Nova senha (mín. 6 caracteres)"
                        value={senhaForm.nova}
                        onChangeText={(v) => setSenha("nova", v)}
                        secureTextEntry
                        autoCapitalize="none"
                      />
                      <TextInput
                        className="bg-cardElevado text-textoPrimario rounded-xl px-4 py-[13px] text-[14px] border border-bordaSutil mb-3"
                        placeholderTextColor={colors.textoTerciario}
                        placeholder="Confirmar nova senha"
                        value={senhaForm.confirma}
                        onChangeText={(v) => setSenha("confirma", v)}
                        secureTextEntry
                        autoCapitalize="none"
                      />

                      {senhaForm.erro && (
                        <View className="p-3 rounded-xl mb-3" style={{ backgroundColor: colors.vermelhoBackground }}>
                          <Text className="text-[12px] text-vermelho">{senhaForm.erro}</Text>
                        </View>
                      )}

                      <View className="flex-row gap-3">
                        <TouchableOpacity
                          onPress={() => setSenhaForm(SENHA_FORM_INITIAL)}
                          disabled={senhaForm.salvando}
                          className="flex-1 py-[11px] rounded-xl items-center border border-bordaSutil bg-card"
                        >
                          <Text className="text-[14px] font-semibold text-textoPrimario">Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => void alterarSenha()}
                          disabled={senhaForm.salvando}
                          className="flex-1 py-[11px] rounded-xl items-center"
                          style={{ backgroundColor: colors.verde }}
                        >
                          {senhaForm.salvando
                            ? <ActivityIndicator size={16} color={colors.bg} />
                            : <Text className="text-[14px] font-bold" style={{ color: colors.bg }}>Salvar</Text>
                          }
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              )}

              <View className="h-[1px] mx-4 bg-bordaSutil" />

              <TouchableOpacity activeOpacity={0.75} className="px-4 py-[14px] flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: colors.cardElevado }}>
                  <Ionicons name="document-text-outline" size={16} color={colors.textoSecundario} />
                </View>
                <Text className="flex-1 text-[14px] font-medium text-textoPrimario">Documentos e laudos</Text>
                <View className="px-[8px] py-[3px] rounded-full mr-1" style={{ backgroundColor: colors.cardElevado }}>
                  <Text className="text-[12px] font-semibold text-textoSecundario">12</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.textoTerciario} />
              </TouchableOpacity>

              <View className="h-[1px] mx-4 bg-bordaSutil" />

              <TouchableOpacity activeOpacity={0.75} className="px-4 py-[14px] flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: colors.cardElevado }}>
                  <Ionicons name="headset-outline" size={16} color={colors.textoSecundario} />
                </View>
                <Text className="flex-1 text-[14px] font-medium text-textoPrimario">Suporte via WhatsApp</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textoTerciario} />
              </TouchableOpacity>

              <View className="h-[1px] mx-4 bg-bordaSutil" />

              {!confirmandoSaida ? (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setConfirmandoSaida(true)}
                  className="px-4 py-[14px] flex-row items-center gap-3"
                >
                  <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: colors.vermelhoBackground }}>
                    <Ionicons name="log-out-outline" size={16} color={colors.vermelho} />
                  </View>
                  <Text className="flex-1 text-[14px] font-medium text-vermelho">Sair da conta</Text>
                </TouchableOpacity>
              ) : (
                <View className="px-4 py-4" style={{ backgroundColor: colors.vermelhoBackground + "60" }}>
                  <Text className="text-[13px] font-semibold text-vermelho mb-1">
                    Tem certeza que deseja sair?
                  </Text>
                  <Text className="text-[12px] text-textoTerciario mb-3">
                    Você precisará fazer login novamente.
                  </Text>
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => setConfirmandoSaida(false)}
                      disabled={saindo}
                      className="flex-1 py-[11px] rounded-xl items-center border border-bordaSutil bg-card"
                    >
                      <Text className="text-[14px] font-semibold text-textoPrimario">Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => void executarSaida()}
                      disabled={saindo}
                      className="flex-1 py-[11px] rounded-xl items-center"
                      style={{ backgroundColor: colors.vermelho }}
                    >
                      {saindo
                        ? <ActivityIndicator size={16} color="#fff" />
                        : <Text className="text-[14px] font-bold text-white">Sair</Text>
                      }
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <Text className="text-[12px] text-textoTerciario text-center">
              v 2.6.0 · build 2026.05
            </Text>
          </>
        )}
      </ScrollView>
    </View>
  )
}
