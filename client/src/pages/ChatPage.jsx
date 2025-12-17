import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import ChatHistory from './ChatHistory'
import { useSendMessageMutation, useGetPromptsQuery } from '../Api/ChatApi'
import ChatArea from '../components/ChatArea'

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
      {/* Sidebar - Desktop */}
      <div className="hidden sm:block w-64 transition-all duration-300 bg-white border-r border-gray-200 overflow-hidden">
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

      {/* Mobile Drawer + Overlay */}
      {/* Overlay */}
      <div
        className={`${isSidebarOpen ? 'block' : 'hidden'} fixed inset-0 bg-black/40 z-30 sm:hidden transition-opacity duration-200`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden={true}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out sm:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="text-lg font-semibold">Conversations</div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="h-full overflow-y-auto">
          <ChatHistory
            onNewChat={() => {
              setMessages([
                {
                  id: 1,
                  text: 'Hello! I am Gemini AI. How can I help you today?',
                  sender: 'bot',
                  timestamp: new Date(),
                },
              ])
              setInputValue('')
              setIsSidebarOpen(false)
            }}
            prompts={promptsData?.prompts || []}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <ChatArea  
        messages={messages}
        isLoading={isLoading}
        setIsSidebarOpen={setIsSidebarOpen}
        user={user}
        isSidebarOpen={isSidebarOpen}
        inputValue={inputValue}
        setInputValue={setInputValue}
        messagesEndRef={messagesEndRef}
        handleSendMessage={handleSendMessage}
      />

    </div>
  )
}

export default ChatPage
