import React, { useState } from 'react'

const ChatHistory = ({ onNewChat, prompts }) => {
  const [selectedConversation, setSelectedConversation] = useState(null)

  // Build conversation list from server prompts when provided
  const conversations = Array.isArray(prompts) && prompts.length
    ? // group prompts into conversation buckets by pairs (simple linear history)
      prompts.reduce((acc, cur) => {
        // create a simple conversation per two messages for display purposes
        const idx = Math.floor(acc.length)
        acc.push({
          id: cur._id,
          title: cur.role === 'user' ? cur.content.slice(0, 30) : 'Assistant Reply',
          date: cur.createdAt,
          preview: cur.content.slice(0, 60),
        })
        return acc
      }, [])
    : [
        {
          id: 1,
          title: 'First Conversation',
          date: '2025-12-01',
          preview: 'Tell me about AI...',
        },
        {
          id: 2,
          title: 'Web Development Tips',
          date: '2025-11-30',
          preview: 'How to build responsive websites...',
        },
        {
          id: 3,
          title: 'React Best Practices',
          date: '2025-11-29',
          preview: 'What are the best practices in React...',
        },
        {
          id: 4,
          title: 'JavaScript Tricks',
          date: '2025-11-28',
          preview: 'Show me advanced JavaScript concepts...',
        },
      ]

  const handleNewChat = () => {
    if (typeof onNewChat === 'function') return onNewChat()
    setSelectedConversation(null)
  }

  const handleDeleteChat = (id) => {
    // For now just clear selection. If connected to API, this should call delete endpoint.
    setSelectedConversation(null)
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* New Chat Button */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={handleNewChat}
          className="w-full bg-linear-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Chat</span>
        </button>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Recent Conversations
        </h3>

        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 rounded-lg cursor-pointer transition group ${
                selectedConversation?.id === conversation.id
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'hover:bg-gray-100 border-2 border-transparent'
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {conversation.title}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {conversation.preview}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(conversation.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteChat(conversation.id)
                  }}
                  className="ml-2 p-1.5 opacity-0 group-hover:opacity-100 rounded hover:bg-red-100 transition"
                >
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>Settings</span>
        </button>
        <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Help</span>
        </button>
      </div>
    </div>
  )
}

export default ChatHistory
