import { useState, useEffect } from 'react'
import { chatAPI } from '../services/api'

export const useChat = (isAuthenticated) => {
  const [chats, setChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatCount, setChatCount] = useState({ todayCount: 0, maxChats: 5, isPremium: false })

  // Load user's chats when authenticated, clear when not
  useEffect(() => {
    if (isAuthenticated) {
      loadChats()
      loadChatCount()
    } else {
      clearChatData()
    }
  }, [isAuthenticated])

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat)
    }
  }, [activeChat])

  const loadChats = async () => {
    try {
      const data = await chatAPI.getChats()
      if (data.success) {
        setChats(data.chats)
        // Set first chat as active if no active chat
        if (!activeChat && data.chats.length > 0) {
          setActiveChat(data.chats[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to load chats:', error)
      // Re-throw authentication errors to be handled by parent
      if (error.message === 'Authentication required') {
        throw error
      }
    }
  }

  const loadMessages = async (chatId) => {
    try {
      const data = await chatAPI.getChatMessages(chatId)
      if (data.success) {
        const transformedMessages = data.messages.map(msg => ({
          id: msg.id,
          text: msg.content,
          isUser: msg.is_user
        }))
        setMessages(transformedMessages)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
      // Re-throw authentication errors to be handled by parent
      if (error.message === 'Authentication required') {
        throw error
      }
    }
  }

  const loadChatCount = async () => {
    try {
      const data = await chatAPI.getChatCount()
      if (data.success) {
        setChatCount({
          todayCount: data.todayCount,
          maxChats: data.maxChats,
          isPremium: data.isPremium
        })
      }
    } catch (error) {
      console.error('Failed to load chat count:', error)
      // Re-throw authentication errors to be handled by parent
      if (error.message === 'Authentication required') {
        throw error
      }
    }
  }

  const clearChatData = () => {
    setChats([])
    setActiveChat(null)
    setMessages([])
    setNewMessage('')
    setChatCount({ todayCount: 0, maxChats: 5, isPremium: false })
  }

  // Clear active chat without creating a new one
  const clearActiveChat = () => {
    setActiveChat(null)
    setMessages([])
    setNewMessage('')
  }

  const loadChatsOnDemand = async () => {
    try {
      await loadChats()
      await loadChatCount()
    } catch (error) {
      console.error('Failed to load chats on demand:', error)
      // Re-throw authentication errors to be handled by parent
      if (error.message === 'Authentication required') {
        throw error
      }
    }
  }

  const handleNewChat = () => {
    // Just clear the UI - don't create a chat in the database
    clearActiveChat()
  }

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId)
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() && activeChat) {
      const userMessage = {
        id: Date.now(),
        text: newMessage,
        isUser: true
      }
      setMessages([...messages, userMessage])
      const currentMessage = newMessage
      setNewMessage('')
      
      try {
        const data = await chatAPI.sendMessage(activeChat, currentMessage)
        
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

  const handleSendMessageToNewChat = async () => {
    if (newMessage.trim()) {
      try {
        setLoading(true)
        // Create new chat first
        const chatData = await chatAPI.createChat()
        
        if (chatData.success) {
          // Set the new chat as active
          setActiveChat(chatData.chat.id)
          setMessages([])
          
          // Reload chats to get the new chat in the list
          await loadChats()
          await loadChatCount()
          
          // Now send the message to the new chat
          const userMessage = {
            id: Date.now(),
            text: newMessage,
            isUser: true
          }
          setMessages([userMessage])
          const currentMessage = newMessage
          setNewMessage('')
          
          const data = await chatAPI.sendMessage(chatData.chat.id, currentMessage)
          
          if (data.success) {
            const aiMessage = {
              id: Date.now() + 1,
              text: data.response,
              isUser: false
            }
            setMessages(prev => [...prev, aiMessage])
          }
        }
      } catch (error) {
        console.error('Failed to create chat and send message:', error)
        
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
      } finally {
        setLoading(false)
      }
    }
  }

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      // Check if there's an active chat or not
      if (activeChat) {
        handleSendMessage()
      } else {
        // No active chat, need to create one
        handleSendMessageToNewChat()
      }
    }
  }

  return {
    chats,
    activeChat,
    messages,
    newMessage,
    loading,
    chatCount,
    handleNewChat,
    handleChatSelect,
    handleSendMessage,
    handleSendMessageToNewChat,
    handleMessageChange,
    handleKeyPress,
    clearChatData,
    clearActiveChat,
    loadChatsOnDemand
  }
}