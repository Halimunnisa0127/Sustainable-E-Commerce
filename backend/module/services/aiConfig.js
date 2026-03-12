// aiConfig.js - Configuration and constants for AI service

// Available models (choose based on speed needs)
const MODELS = {
  FAST: "mistralai/mistral-7b-instruct",        
  BALANCED: "meta-llama/llama-3.1-8b-instruct", 
  SMALL: "google/gemma-2b-it"                   
}

// API configuration
const API_CONFIG = {
  BASE_URL: "https://openrouter.ai/api/v1/chat/completions",
  TIMEOUT_MS: 30000, // 30 seconds
  MAX_TOKENS: 500,
  TEMPERATURE: 0.1
}

// Cache configuration
const CACHE_CONFIG = {
  DURATION: 60 * 60 * 1000, // 1 hour
  ENABLED: true
}

// Headers for OpenRouter API
const getHeaders = () => ({
  "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
  "Content-Type": "application/json",
  "HTTP-Referer": "http://localhost:9000",
  "X-Title": "Rayeva AI Project"
})

module.exports = {
  MODELS,
  API_CONFIG,
  CACHE_CONFIG,
  getHeaders
}