import { alertas, talhoes } from "@/data/mockData"

export function horaAgora(): string {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, "0")}h${String(d.getMinutes()).padStart(2, "0")}`
}

export function gerarResposta(texto: string, primeiroNome: string): string {
  const t = texto.toLowerCase()

  if (t.includes("talhão central") || t.includes("talhao central")) {
    const talhao = talhoes.find((x) => x.nome === "Talhão Central")
    return `Talhão Central (${talhao?.cultura}, ${talhao?.areaHectares} ha) está em atenção. Frente fria prevista nos próximos 3 dias. Recomendo ajustar o calendário de fertilizantes.`
  }
  if (t.includes("talhão sul") || t.includes("talhao sul")) {
    return `Talhão Sul está em risco hídrico. Déficit de umidade 38% abaixo do normal. Recomendo adiar o plantio ou acionar irrigação suplementar antes de amanhã.`
  }
  if (t.includes("talhão norte") || t.includes("talhao norte")) {
    return `Talhão Norte está OK. Janela de plantio aberta de quinta a sábado — condições ideais de umidade e temperatura para soja.`
  }
  if (t.includes("talhão leste") || t.includes("talhao leste")) {
    return `Talhão Leste está OK. Sem alertas ativos no momento. Monitoramento satelital atualizado há 2h.`
  }
  if (t.includes("soja")) {
    return `Janela ideal para soja: próximos 3 dias com umidade entre 55–70% e temperatura média de 24°C — condições favoráveis para germinação. Talhão Norte é o mais indicado agora.`
  }
  if (t.includes("milho")) {
    return `Milho safrinha no Talhão Sul em risco hídrico. Aguarde normalização da umidade antes de avançar no ciclo. Talhão Central em atenção — frente fria chegando.`
  }
  if (t.includes("laudo") || t.includes("seguro") || t.includes("proagro")) {
    return `Gerando laudo climático com dados Sentinel-2, timestamp e coordenadas GPS. O documento ficará disponível para download em instantes — válido para Proagro.`
  }
  if (t.includes("irrigação") || t.includes("irrigacao")) {
    return `Irrigação recomendada no Talhão Sul: déficit hídrico de 43%, prioridade alta nas próximas 72h. Nos demais talhões a umidade está dentro do esperado.`
  }
  if (t.includes("chuva") || t.includes("clima") || t.includes("tempo") || t.includes("previsão") || t.includes("previsao")) {
    return `Previsão: frente fria chega em 48h na sua região. Probabilidade de chuva de 65% para quinta-feira. Janela seca disponível hoje e amanhã — bom momento para aplicações.`
  }
  if (t.includes("alerta") || t.includes("alertas")) {
    return `Você tem ${alertas.length} alertas ativos: risco hídrico no Talhão Sul (alto), frente fria no Talhão Central (médio), janela de plantio no Talhão Norte (baixo).`
  }
  if (t.includes("olá") || t.includes("ola") || t.includes("oi") || t.includes("bom dia") || t.includes("boa tarde") || t.includes("boa noite")) {
    return `Olá, ${primeiroNome}! Você tem ${alertas.length} alertas ativos. Posso ajudar com informações sobre seus talhões, previsão do tempo ou geração de laudos.`
  }

  return `Entendido, ${primeiroNome}. Estou analisando os dados satelitais da sua fazenda. Você pode perguntar sobre um talhão específico, previsão do tempo ou geração de laudos.`
}
