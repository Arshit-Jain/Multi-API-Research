import './Sidebar.css'

const Sidebar = ({ chats, activeChat, onChatSelect, onNewChat, isOpen, onClose, user, onLogout }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={onNewChat}>
            <span>+</span> New Chat
          </button>
        </div>
        
        <div className="chat-history">
          <h3>Recent Chats</h3>
          {chats.map(chat => (
            <div 
              key={chat.id} 
              className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
              onClick={() => onChatSelect(chat.id)}
            >
              <span className="chat-title">{chat.title}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="account-section">
            <div className="account-info">
              <div className="avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
              <span>{user?.username || 'User Account'}</span>
            </div>
            <div className="account-options">
              <button className="account-btn">Settings</button>
              <button className="account-btn" onClick={onLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
