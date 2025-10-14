import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Authentication API
export const authAPI = {
  async checkAuthStatus() {
    try {
      const response = await apiClient.get('/api/auth/status')
      return response.data
    } catch (error) {
      throw error
    }
  },

  async login(username, password) {
    try {
      const response = await apiClient.post('/api/login', { username, password })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async register(username, email, password) {
    try {
      const response = await apiClient.post('/api/register', { username, email, password })
      return response.data
    } catch (error) {
      throw error
    }
  },

  async logout() {
    try {
      const response = await apiClient.post('/api/logout')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

// Chat API
export const chatAPI = {
  async getChats() {
    try {
      const response = await apiClient.get('/api/chats')
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required')
      }
      throw error
    }
  },

  async createChat(title = "New Chat") {
    try {
      const response = await apiClient.post('/api/chats', { title })
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required')
      }
      if (error.response?.status === 403) {
        throw new Error(error.response.data.error || 'Daily chat limit reached')
      }
      throw error
    }
  },

  async getChatMessages(chatId) {
    try {
      const response = await apiClient.get(`/api/chats/${chatId}/messages`)
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required')
      }
      throw error
    }
  },

  async sendMessage(chatId, message) {
    try {
      const response = await apiClient.post(`/api/chats/${chatId}/messages`, { message })
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required')
      }
      throw error
    }
  },

  async getChatCount() {
    try {
      const response = await apiClient.get('/api/user/chat-count')
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required')
      }
      throw error
    }
  }
}
