import { combineReducers } from '@reduxjs/toolkit'
import { authApi } from '../Api/AuthApi'
import authReducer from './AuthSlice'


const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  authSlice: authReducer,
})

export default rootReducer