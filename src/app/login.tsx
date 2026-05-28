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
import { FormField } from "@/components/FormField"
import { loginSchema, LoginForm } from "@/schemas/login.schema"
import { useSession } from "@/context/SessionContext"
import { colors } from "@/constants/Colors"

export default function LoginScreen() {
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setSession } = useSession()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    defaultValues: { email: "", senha: "" },
    resolver: zodResolver(loginSchema),
  })

  // Autentica o usuário — integrar com API quando endpoint estiver disponível
  async function entrar(data: LoginForm) {
    setLoading(true)
    try {
      console.log("login:", data.email)
      setSession({ usuarioId: 1, propriedadeId: 1, nome: "João Batista Ferreira" })
      router.replace("/(tabs)/home")
    } catch {
      setError("root", { message: "E-mail ou senha incorretos." })
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
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-20 pb-10">

          <BrandHeader subtitle="Bem-vindo de volta" />

          {/* Campos do formulário */}
          <View style={{ gap: 16 }}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormField
                  label="E-mail"
                  placeholder="E-mail"
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
                  placeholder="Sua senha"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!senhaVisivel}
                  error={errors.senha?.message}
                  trailing={
                    <Pressable onPress={() => setSenhaVisivel(!senhaVisivel)} hitSlop={8}>
                      <Ionicons
                        name={senhaVisivel ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={colors.textoTerciario}
                      />
                    </Pressable>
                  }
                />
              )}
            />

            <TouchableOpacity className="items-end">
              <Text className="text-[#818cf8]" style={{ fontSize: 13 }}>
                Esqueci minha senha
              </Text>
            </TouchableOpacity>
          </View>

          {/* Erro global */}
          {errors.root && (
            <View className="mt-4 p-3 bg-[#2d0f0f] border border-[#ef4444] rounded-xl">
              <Text className="text-[#f87171] text-center" style={{ fontSize: 13 }}>
                {errors.root.message}
              </Text>
            </View>
          )}

          {/* Botão Entrar */}
          <TouchableOpacity
            onPress={handleSubmit(entrar)}
            disabled={loading}
            className="mt-8 bg-[#4ade80] rounded-xl items-center justify-center"
            style={{ paddingVertical: 16 }}
          >
            {loading ? (
              <ActivityIndicator color="#111111" size={20} />
            ) : (
              <Text className="text-[#111111]" style={{ fontSize: 16, fontWeight: "500" }}>
                Entrar
              </Text>
            )}
          </TouchableOpacity>

          {/* Divisor OU */}
          <View className="flex-row items-center my-6" style={{ gap: 12 }}>
            <View className="flex-1 bg-[#252525]" style={{ height: 1 }} />
            <Text className="text-[#555555]" style={{ fontSize: 13 }}>OU</Text>
            <View className="flex-1 bg-[#252525]" style={{ height: 1 }} />
          </View>

          {/* Botão WhatsApp */}
          <TouchableOpacity
            className="rounded-xl flex-row items-center justify-center"
            style={{ backgroundColor: colors.whatsapp, paddingVertical: 16, gap: 8 }}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#f5f5f5" />
            <Text className="text-[#f5f5f5]" style={{ fontSize: 16, fontWeight: "500" }}>
              Entrar com WhatsApp
            </Text>
          </TouchableOpacity>

          {/* Link criar conta */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-[#999999]" style={{ fontSize: 13 }}>
              Ainda não tem conta?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/cadastro/conta")}>
              <Text className="text-[#818cf8]" style={{ fontSize: 13 }}>
                Criar conta grátis
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
