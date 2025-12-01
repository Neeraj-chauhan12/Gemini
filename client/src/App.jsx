import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import ChatPage from './pages/ChatPage'
import HomePage from './pages/HomePage'
import { authApi } from './Api/AuthApi'
import {Toaster} from 'react-hot-toast'

const App = () => {
  const dispatch = useDispatch()

  // Load user on app mount
  useEffect(() => {
    dispatch(authApi.endpoints.loadUser.initiate())
  }, [dispatch])

  return (
    <BrowserRouter>
    
      <Navbar />
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Chat Routes */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

     
     
   
     <Toaster position="top-right" />
    </BrowserRouter>
   
   
  )
}

export default App
