import './App.css'
import { useAuth } from './hooks/useAuth'
import { useChat } from './hooks/useChat'
import { useUI } from './hooks/useUI'
import ChatApp from './components/ChatApp'
import AuthWrapper from './components/AuthWrapper'
import LoadingScreen from './components/LoadingScreen'

function App() {
  // Custom hooks for different concerns
  const { user, isAuthenticated, checkingAuth, login, logout } = useAuth()
  const chat = useChat()
  const ui = useUI()

  // Handle authentication errors from chat
  const handleSendMessage = async () => {
    try {
      await chat.handleSendMessage()
    } catch (error) {
      if (error.message === 'Authentication required') {
        logout()
      }
    }
  }

  // Handle new chat with mobile sidebar close
  const handleNewChat = () => {
    chat.handleNewChat()
    if (ui.isMobile) {
      ui.closeSidebar()
    }
  }

  // Handle chat select with mobile sidebar close
  const handleChatSelect = (chatId) => {
    chat.handleChatSelect(chatId)
    if (ui.isMobile) {
      ui.closeSidebar()
    }
  }

  // Handle login with UI state reset
  const handleLogin = (userData) => {
    login(userData)
    ui.switchToLogin()
  }

  // Handle register with UI state reset
  const handleRegister = (userData) => {
    login(userData)
    ui.switchToLogin()
  }

  // Show loading screen while checking authentication
  if (checkingAuth) {
    return <LoadingScreen />
  }

  // Show login/registration screen if not authenticated
  if (!isAuthenticated) {
    return (
      <AuthWrapper
        showRegistration={ui.showRegistration}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onSwitchToRegistration={ui.switchToRegistration}
        onSwitchToLogin={ui.switchToLogin}
      />
    )
  }

  // Main chat application
  return (
    <ChatApp
      chats={chat.chats}
      activeChat={chat.activeChat}
      messages={chat.messages}
      newMessage={chat.newMessage}
      user={user}
      sidebarOpen={ui.sidebarOpen}
      isMobile={ui.isMobile}
      onNewChat={handleNewChat}
      onChatSelect={handleChatSelect}
      onSendMessage={handleSendMessage}
      onMessageChange={chat.handleMessageChange}
      onKeyPress={chat.handleKeyPress}
      onToggleSidebar={ui.toggleSidebar}
      onCloseSidebar={ui.closeSidebar}
      onLogout={logout}
    />
  )
}

export default App
