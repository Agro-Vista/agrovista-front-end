import { View } from "react-native"
import { STATUS_CFG } from "@/data/fieldConstants"
import type { Field } from "@/types/field"

type Props = { status: Field["status"] }

export function Sparkline({ status }: Props) {
  const cor = STATUS_CFG[status].cor
  const rotate = status === "OK" ? "-10deg" : status === "RISCO" ? "10deg" : "5deg"

  return (
    <View className="w-[72px] h-[24px] justify-center overflow-hidden">
      <View
        className="h-[2px] w-[100px] -ml-[14px] rounded-[1px] opacity-75"
        style={{ backgroundColor: cor, transform: [{ rotate }] }}
      />
    </View>
  )
}
