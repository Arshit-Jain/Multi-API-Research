import { useState } from 'react'
import { chatAPI } from '../services/api'

export const useChat = () => {
  const [chats, setChats] = useState([
    { id: 1, title: "New Chat", messages: [] },
    { id: 2, title: "React Help", messages: [] },
    { id: 3, title: "JavaScript Questions", messages: [] }
  ])
  const [activeChat, setActiveChat] = useState(1)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", isUser: false },
    { id: 2, text: "Hi there! I need help with React", isUser: true }
  ])
  const [newMessage, setNewMessage] = useState('')

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: "New Chat",
      messages: []
    }
    setChats([newChat, ...chats])
    setActiveChat(newChat.id)
    setMessages([])
  }

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId)
  }

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        text: newMessage,
        isUser: true
      }
      setMessages([...messages, userMessage])
      const currentMessage = newMessage
      setNewMessage('')
      
      try {
        const data = await chatAPI.sendMessage(currentMessage)
        
        if (data.success) {
          const aiMessage = {
            id: Date.now() + 1,
            text: data.response,
            isUser: false
          }
          setMessages(prev => [...prev, aiMessage])
        }
      } catch (error) {
        console.error('Chat error:', error)
        
        // Re-throw authentication errors to be handled by parent
        if (error.message === 'Authentication required') {
          throw error
        }
        
        const errorMessage = {
          id: Date.now() + 1,
          text: "Sorry, there was an error processing your message. Please try again.",
          isUser: false
        }
        setMessages(prev => [...prev, errorMessage])
      }
    }
  }

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return {
    chats,
    activeChat,
    messages,
    newMessage,
    handleNewChat,
    handleChatSelect,
    handleSendMessage,
    handleMessageChange,
    handleKeyPress
  }
}
