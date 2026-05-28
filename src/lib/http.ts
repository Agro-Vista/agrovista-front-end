type Params = Record<string, string | number | boolean>

export const http = {
  get: async <T>(url: string, params: Params = {}): Promise<T> => {
    try {
      const entries = Object.entries(params).map(
        ([k, v]) => [k, String(v)] as [string, string]
      )
      const qs = new URLSearchParams(entries).toString()
      const fullUrl = qs ? `${url}?${qs}` : url
      const response = await fetch(fullUrl, {
        headers: { Accept: "application/json" },
      })
      if (response.status > 399) throw new Error(`HTTP ${response.status}`)
      return response.json() as Promise<T>
    } catch (error) {
      throw error instanceof Error ? error : new Error("Erro desconhecido na requisição")
    }
  },

  post: async <T>(url: string, body: unknown): Promise<T> => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      })
      if (response.status > 399) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`)
      }
      return response.json() as Promise<T>
    } catch (error) {
      throw error instanceof Error ? error : new Error("Erro desconhecido na requisição")
    }
  },
}
