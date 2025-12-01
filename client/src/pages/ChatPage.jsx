import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ChatHistory from './ChatHistory'
import { useSendMessageMutation, useGetPromptsQuery } from '../Api/ChatApi'

const ChatPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.authSlice)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I am Gemini AI. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [sendMessage] = useSendMessageMutation()
  const { data: promptsData, refetch: refetchPrompts } = useGetPromptsQuery()
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // When prompts are loaded from server, reconstruct messages (preserve ordering)
  useEffect(() => {
    if (promptsData && Array.isArray(promptsData.prompts) && promptsData.prompts.length) {
      const reconstructed = promptsData.prompts.map((p, idx) => ({
        id: idx + 1,
        text: p.content,
        sender: p.role === 'user' ? 'user' : 'bot',
        timestamp: new Date(p.createdAt),
      }))
      setMessages(reconstructed)
    }
  }, [promptsData])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Send to backend AI endpoint
    try {
      const resp = await sendMessage({ message: inputValue }).unwrap()
      if (resp && resp.assistantPrompt && resp.assistantPrompt.content) {
        const botMessage = {
          id: messages.length + 2,
          text: resp.assistantPrompt.content,
          sender: 'bot',
          timestamp: new Date(resp.assistantPrompt.createdAt || Date.now()),
        }
        setMessages((prev) => [...prev, botMessage])
      }
      // refresh history
      refetchPrompts()
    } catch (err) {
      console.error('sendMessage error', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Please login to access the chat
          </p>
          <a
            href="/login"
            className="bg-linear-to-r from-blue-600 to-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition"
          >
            Go to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden`}
      >
        <ChatHistory
          onNewChat={() => {
            // reset messages to starter message
            setMessages([
              {
                id: 1,
                text: 'Hello! I am Gemini AI. How can I help you today?',
                sender: 'bot',
                timestamp: new Date(),
              },
            ])
            setInputValue('')
          }}
          prompts={promptsData?.prompts || []}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-800">
              Gemini Chat
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {user?.name || 'User'}
            </span>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Start a Conversation
                </h2>
                <p className="text-gray-600">
                  Type your message below to get started
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition disabled:bg-gray-100"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-linear-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.488 5.951 1.488a1 1 0 001.169-1.409l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
