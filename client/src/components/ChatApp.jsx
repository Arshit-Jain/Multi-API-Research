import Sidebar from './Sidebar'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import MobileHeader from './MobileHeader'

const ChatApp = ({ 
  chats, 
  activeChat, 
  messages, 
  newMessage,
  user,
  sidebarOpen,
  isMobile,
  onNewChat,
  onChatSelect,
  onSendMessage,
  onMessageChange,
  onKeyPress,
  onToggleSidebar,
  onCloseSidebar,
  onLogout
}) => {
  return (
    <div className="app">
      {/* Mobile Header */}
      <MobileHeader 
        onNewChat={onNewChat}
        onMenuToggle={onToggleSidebar}
      />

      {/* Sidebar */}
      <Sidebar 
        chats={chats}
        activeChat={activeChat}
        onChatSelect={onChatSelect}
        onNewChat={onNewChat}
        isOpen={sidebarOpen}
        onClose={onCloseSidebar}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Chat Area */}
      <div className="main-content">
        <div className="chat-container">
          <div className="messages">
            {messages.map(message => (
              <MessageBubble 
                key={message.id}
                message={message}
                isUser={message.isUser}
              />
            ))}
          </div>
          
          <ChatInput 
            message={newMessage}
            onMessageChange={onMessageChange}
            onSendMessage={onSendMessage}
            onKeyPress={onKeyPress}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatApp
