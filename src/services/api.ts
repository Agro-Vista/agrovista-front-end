import axios from "axios"

// Instância base do Axios para todas as chamadas à API
const api = axios.create({
  baseURL: "http://10.0.2.2:8080/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
})

export default api
