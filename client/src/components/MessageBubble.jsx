import './MessageBubble.css'

const MessageBubble = ({ message, isUser }) => {
  return (
    <div className={`message-bubble ${isUser ? 'user' : 'ai'}`}>
      <div className="message-content">
        {message.text}
      </div>
    </div>
  )
}

export default MessageBubble
