export type Talhao = {
  id: number
  propriedadeId: number
  nome: string
  cultura: string
  areaHectares: number
  status: "OK" | "ATENCAO" | "RISCO"
}
