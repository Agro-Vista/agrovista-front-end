import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/Colors";
import { useSession } from "@/context/SessionContext";
import { talhaoService } from "@/services/talhaoService";
import { talhoes as mockTalhoes, usuario, dashboard } from "@/data/mockData";
import type { Talhao } from "@/types/talhao";

const STATUS_CFG: Record<
  Talhao["status"],
  {
    cor: string;
    bg: string;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }
> = {
  OK: {
    cor: colors.verde,
    bg: colors.verdeBackground,
    label: "OK",
    icon: "leaf-outline",
  },
  ATENCAO: {
    cor: colors.ambar,
    bg: colors.ambarBackground,
    label: "Atenção",
    icon: "warning-outline",
  },
  RISCO: {
    cor: colors.vermelho,
    bg: colors.vermelhoBackground,
    label: "Risco",
    icon: "alert-circle-outline",
  },
};

const STATUS_DESCRICAO: Record<Talhao["status"], string> = {
  OK: "Umidade do solo · 30d",
  ATENCAO: "Estresse hídrico subindo",
  RISCO: "Déficit hídrico 43% < média",
};

function Sparkline({ status }: { status: Talhao["status"] }) {
  const cor = STATUS_CFG[status].cor;
  const rotate =
    status === "OK" ? "-10deg" : status === "RISCO" ? "10deg" : "5deg";

  return (
    <View className="w-[72px] h-[24px] justify-center overflow-hidden">
      <View
        className="h-[2px] w-[100px] -ml-[14px] rounded-[1px] opacity-75"
        style={{ backgroundColor: cor, transform: [{ rotate }] }}
      />
    </View>
  );
}

export default function TalhoesScreen() {
  const { session } = useSession();
  const insets = useSafeAreaInsets();
  const [talhoes, setTalhoes] = useState<Talhao[]>([]);

  useEffect(() => {
    const mock = Array.from(mockTalhoes).map((t) => ({
      ...t,
      propriedadeId: session.propriedadeId ?? 1,
    }));
    setTalhoes(mock);

    void (async () => {
      try {
        if (!session.propriedadeId) return;
        const res = await talhaoService.listar(session.propriedadeId);
        if (res.data.length > 0) setTalhoes(res.data);
      } catch {
        // mantém mock
      }
    })();
  }, []);

  const totalHa = talhoes.reduce((acc, t) => acc + t.areaHectares, 0);
  const countOk = talhoes.filter((t) => t.status === "OK").length;
  const countAtencao = talhoes.filter((t) => t.status === "ATENCAO").length;
  const countRisco = talhoes.filter((t) => t.status === "RISCO").length;

  const nomeSessao = session.nome || usuario.nome;
  const iniciais = nomeSessao
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <View className="flex-1 bg-bg">
      {/* ─── Header ─── */}
      <View style={{ paddingTop: insets.top }}>
        <View className="px-4 pb-3 pt-2 flex-row items-center justify-between">
          <Image
            source={require("../../../assets/images/light-logo.png")}
            style={{ width: 220, height: 65, marginBottom: 12 }}
            resizeMode="contain"
          />
          <View className="flex-row items-center gap-[10px]">
            <TouchableOpacity
              className="flex-row items-center gap-[5px] bg-ambarBackground rounded-full px-[10px] py-[5px] border"
              style={{ borderColor: colors.ambar + "40" }}
            >
              <Ionicons
                name="notifications-outline"
                size={13}
                color={colors.ambar}
              />
              <Text className="text-[12px] text-ambar font-semibold">
                {dashboard.alertasAtivos} alertas ativos
              </Text>
            </TouchableOpacity>
            <View
              className="w-[34px] h-[34px] rounded-full border-[1.5px] border-verde items-center justify-center"
              style={{ backgroundColor: colors.verde + "20" }}
            >
              <Text className="text-[12px] font-bold text-verde">
                {iniciais}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* ─── Conteúdo ─── */}
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
        <View className="flex-row gap-2 mb-5">
          {countOk > 0 && (
            <View
              className="flex-row items-center px-3 py-[6px] rounded-full bg-verdeBackground border"
              style={{ borderColor: colors.verde + "60" }}
            >
              <Text className="text-[13px] font-semibold text-verde">
                {countOk} OK
              </Text>
            </View>
          )}
          {countAtencao > 0 && (
            <View
              className="flex-row items-center px-3 py-[6px] rounded-full bg-ambarBackground border"
              style={{ borderColor: colors.ambar + "60" }}
            >
              <Text className="text-[13px] font-semibold text-ambar">
                {countAtencao} Atenção
              </Text>
            </View>
          )}
          {countRisco > 0 && (
            <View
              className="flex-row items-center px-3 py-[6px] rounded-full bg-vermelhoBackground border"
              style={{ borderColor: colors.vermelho + "60" }}
            >
              <Text className="text-[13px] font-semibold text-vermelho">
                {countRisco} Risco
              </Text>
            </View>
          )}
        </View>

        {/* Cards de talhão */}
        <View className="gap-[10px]">
          {talhoes.map((talhao) => {
            const cfg = STATUS_CFG[talhao.status];
            return (
              <TouchableOpacity
                key={talhao.id}
                activeOpacity={0.75}
                className="bg-card rounded-2xl border border-bordaSutil p-4"
              >
                {/* Linha superior */}
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

                  {/* Badge de status */}
                  <View
                    className="flex-row items-center rounded-full border px-[10px] py-[5px] gap-[5px]"
                    style={{
                      backgroundColor: cfg.bg,
                      borderColor: cfg.cor + "50",
                    }}
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

                {/* Linha inferior */}
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
            );
          })}
        </View>

        {/* Card adicionar talhão */}
        <TouchableOpacity
          activeOpacity={0.75}
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
              <Text className="text-[14px] font-semibold text-roxo">
                Adicionar talhão
              </Text>
              <Text className="text-[12px] text-textoTerciario mt-[2px]">
                Desenhe ou importe o polígono
              </Text>
            </View>
            <Ionicons name="open-outline" size={16} color={colors.roxo} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
