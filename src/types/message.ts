export type MsgTexto = { id: number; tipo: "recv" | "send"; texto: string; hora: string }
export type MsgArquivo = { id: number; tipo: "arquivo"; nome: string; subtexto: string; hora: string }
export type Mensagem = MsgTexto | MsgArquivo
