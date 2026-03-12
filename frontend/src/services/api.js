// services/api.js
import axios from "axios"

const API = axios.create({
  baseURL: "http://localhost:9000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
})

// Add response interceptor for debugging
API.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default API