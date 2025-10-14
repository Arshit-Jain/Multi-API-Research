const API_BASE_URL = 'http://localhost:3000'

// Authentication API
export const authAPI = {
  async checkAuthStatus() {
    const response = await fetch(`${API_BASE_URL}/api/auth/status`, {
      credentials: 'include'
    })
    return response.json()
  },

  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })
    return response.json()
  },

  async register(username, email, password) {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, email, password })
    })
    return response.json()
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    return response.json()
  }
}

// Chat API
export const chatAPI = {
  async sendMessage(message) {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ message })
    })

    if (response.status === 401) {
      throw new Error('Authentication required')
    }

    return response.json()
  }
}
