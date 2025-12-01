import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { authApi } from '../Api/AuthApi'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.authSlice)

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat')
    }
  }, [isAuthenticated, navigate])

//   const validateForm = () => {
//     const newErrors = {}

//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required'
//     } else if (formData.name.length < 3) {
//       newErrors.name = 'Name must be at least 3 characters'
//     }

//     if (!formData.email) {
//       newErrors.email = 'Email is required'
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid'
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required'
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters'
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password =
//         'Password must contain uppercase, lowercase, and number'
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password'
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match'
//     }

//     return newErrors
//   }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // const newErrors = validateForm()

    // if (Object.keys(newErrors).length > 0) {
    //   setErrors(newErrors)
    //   return
    // }

    setIsLoading(true)
    try {
      const result = await dispatch(
        authApi.endpoints.register.initiate({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        })
      ).unwrap()

      if (result) {
        navigate('/login')
      }
    } catch (error) {
      setServerError(
        error?.data?.message || 'Registration failed. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-blue-800 mb-2">
              Gemini
            </h1>
            <p className="text-gray-600">Create your account</p>
          </div>

          {/* Error Message */}
          {serverError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{serverError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none ${
                  errors.name
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none ${
                  errors.email
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`w-full px-4 py-3 rounded-lg border-2 transition focus:outline-none ${
                  errors.password
                    ? 'border-red-500 focus:border-red-600'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

           

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-900 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <p className="px-3 text-gray-500 text-sm">OR</p>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-800 transition"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
