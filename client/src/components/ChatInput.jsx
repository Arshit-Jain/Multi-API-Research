import './ChatInput.css'

const ChatInput = ({ message, onMessageChange, onSendMessage, onKeyPress }) => {
  return (
    <div className="input-container">
      <div className="input-wrapper">
        <textarea
          value={message}
          onChange={onMessageChange}
          placeholder="Type your message here..."
          className="message-input"
          rows="1"
        />
        <button 
          onClick={onSendMessage}
          className="send-btn"
          disabled={!message.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatInput
