import { combineReducers } from '@reduxjs/toolkit'
import { authApi } from '../Api/AuthApi'
import { chatApi } from '../Api/ChatApi'
import authReducer from './AuthSlice'


const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  authSlice: authReducer,
})

export default rootReducer