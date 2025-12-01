import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { authApi } from '../Api/AuthApi'
import { chatApi } from '../Api/ChatApi'


export const appStore=configureStore({
      reducer: rootReducer,
     middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(authApi.middleware,chatApi.middleware),
})