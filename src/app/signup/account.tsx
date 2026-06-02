import { zodResolver } from "@hookform/resolvers/zod"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import { BrandHeader } from "@/components/BrandHeader"
import { CropChipSelector } from "@/components/CropChipSelector"
import { FormField } from "@/components/FormField"
import { signupSchema, SignupForm } from "@/schemas/signup.schema"
import { userService } from "@/services/userService"
import { useSession } from "@/context/SessionContext"
import { colors } from "@/constants/Colors"
import { maskCpf, maskPhone, stripMask } from "@/lib/masks"

export default function ContaScreen() {
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmar, setShowConfirmar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erroGeral, setErroGeral] = useState<string | null>(null)
  const { setSession } = useSession()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    defaultValues: {
      nome: "",
      cpfCnpj: "",
      telefone: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      nomeFazenda: "",
      estado: "",
      municipio: "",
      areaHectares: 0,
      cultura: "Soja",
    },
    resolver: zodResolver(signupSchema),
  })

  async function criarConta(data: SignupForm) {
    setLoading(true)
    setErroGeral(null)
    try {
      const novoUsuario = await userService.criar({
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        telefone: stripMask(data.telefone),
        cpfCnpj: stripMask(data.cpfCnpj),
        nomeFazenda: data.nomeFazenda,
        estado: data.estado,
        municipio: data.municipio,
        areaHectares: data.areaHectares,
        cultura: data.cultura,
      })
      await setSession({ usuarioId: novoUsuario.id, propriedadeId: novoUsuario.id, nome: data.nome })
      router.replace("/(tabs)/home")
    } catch (err) {
      setErroGeral(err instanceof Error ? err.message : "Erro ao criar conta. Verifique os dados e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#111111]"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <BrandHeader subtitle="Inteligência climática para o campo" />

        {/* Dados pessoais */}
        <View style={{ gap: 12 }}>
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Nome completo"
                placeholder="João Batista Ferreira"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.nome?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="cpfCnpj"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="CPF ou CNPJ"
                placeholder="000.000.000-00"
                value={value}
                onChangeText={(text) => onChange(maskCpf(text))}
                onBlur={onBlur}
                keyboardType="numeric"
                error={errors.cpfCnpj?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="telefone"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Telefone (WhatsApp)"
                placeholder="(66) 99999-0000"
                value={value}
                onChangeText={(text) => onChange(maskPhone(text))}
                onBlur={onBlur}
                keyboardType="phone-pad"
                hint="Usado para receber alertas pelo mensageiro"
                error={errors.telefone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="E-mail"
                placeholder="joao@fazenda.com.br"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="senha"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Senha"
                placeholder="Mínimo 8 caracteres"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showSenha}
                error={errors.senha?.message}
                trailing={
                  <Pressable onPress={() => setShowSenha(!showSenha)} hitSlop={8}>
                    <Ionicons
                      name={showSenha ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={colors.textoTerciario}
                    />
                  </Pressable>
                }
              />
            )}
          />

          <Controller
            control={control}
            name="confirmarSenha"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Confirmar senha"
                placeholder="Repita a senha"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showConfirmar}
                error={errors.confirmarSenha?.message}
                trailing={
                  <Pressable onPress={() => setShowConfirmar(!showConfirmar)} hitSlop={8}>
                    <Ionicons
                      name={showConfirmar ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color={colors.textoTerciario}
                    />
                  </Pressable>
                }
              />
            )}
          />
        </View>

        {/* Divisor seção propriedade */}
        <Text
          className="text-[#555555] uppercase mt-7 mb-4 tracking-widest"
          style={{ fontSize: 11, fontWeight: "500" }}
        >
          Sua propriedade
        </Text>

        {/* Dados da propriedade */}
        <View style={{ gap: 12 }}>
          <Controller
            control={control}
            name="nomeFazenda"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Nome da fazenda"
                placeholder="Fazenda Santa Fé"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nomeFazenda?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="estado"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Estado"
                placeholder="Mato Grosso"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.estado?.message}
                trailing={
                  <Ionicons name="chevron-forward" size={16} color={colors.textoSecundario} />
                }
              />
            )}
          />

          <Controller
            control={control}
            name="municipio"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Município"
                placeholder="Sorriso"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="words"
                error={errors.municipio?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="areaHectares"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField
                label="Área total em hectares"
                placeholder="590 ha"
                value={value === 0 ? "" : String(value)}
                onChangeText={(v) => onChange(Number(v.replace(/[^0-9]/g, "")))}
                onBlur={onBlur}
                keyboardType="numeric"
                error={errors.areaHectares?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="cultura"
            render={({ field: { onChange, value } }) => (
              <CropChipSelector value={value} onChange={onChange} />
            )}
          />
        </View>

        {/* Erro geral da API */}
        {erroGeral && (
          <View className="mt-5 p-3 bg-[#2d0f0f] border border-[#ef4444] rounded-xl">
            <Text className="text-[#f87171] text-center" style={{ fontSize: 13 }}>
              {erroGeral}
            </Text>
          </View>
        )}

        {/* Botão CTA */}
        <TouchableOpacity
          onPress={handleSubmit(criarConta)}
          disabled={loading}
          className="mt-7 bg-[#4ade80] rounded-xl items-center justify-center"
          style={{ paddingVertical: 16 }}
        >
          {loading ? (
            <ActivityIndicator color="#111111" size={20} />
          ) : (
            <Text className="text-[#111111]" style={{ fontSize: 16, fontWeight: "500" }}>
              Criar minha conta
            </Text>
          )}
        </TouchableOpacity>

        {/* Link para login */}
        <TouchableOpacity
          onPress={() => router.push("/login")}
          className="items-center mt-4"
        >
          <Text className="text-[#999999]" style={{ fontSize: 13 }}>
            Já tem conta?{" "}
            <Text className="text-[#818cf8]" style={{ fontWeight: "500" }}>
              Entrar
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Termos */}
        <Text
          className="text-[#555555] text-center mt-6"
          style={{ fontSize: 10, lineHeight: 16 }}
        >
          Ao criar a conta você concorda com os{" "}
          <Text className="text-[#818cf8]">Termos de Uso</Text>
          {" "}e a{" "}
          <Text className="text-[#818cf8]">Política de Privacidade</Text>.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
