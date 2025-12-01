import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.authSlice)

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Hero Section */}
      <div className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 mb-6">
            Welcome to Gemini
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 mb-8 leading-relaxed">
            Experience the power of AI conversations. Chat with our intelligent assistant anytime, anywhere.
          </p>

          {isAuthenticated ? (
            <Link
              to="/chat"
              className="inline-block bg-linear-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-900 transition transform hover:scale-105 shadow-lg"
            >
              Start Chatting Now
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-block bg-linear-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-900 transition transform hover:scale-105 shadow-lg"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-block bg-linear-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-900 transition transform hover:scale-105 shadow-lg"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Why Choose Gemini?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-lg bg-linear-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Lightning Fast</h3>
              <p className="text-gray-700">
                Get instant responses to your questions with our optimized AI engine.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-lg bg-linear-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Secure & Private</h3>
              <p className="text-gray-700">
                Your conversations are encrypted and stored securely on our servers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-lg bg-linear-to-br from-pink-50 to-pink-100 border-2 border-pink-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Smart Assistant</h3>
              <p className="text-gray-700">
                Our AI understands context and provides intelligent, helpful responses.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            Join thousands of users who are already enjoying intelligent conversations with Gemini.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-block bg-linear-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-900 transition transform hover:scale-105 shadow-lg"
            >
              Sign Up for Free
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
