import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './rootReducer'
import { authApi } from '../Api/AuthApi'


export const appStore=configureStore({
      reducer: rootReducer,
     middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(authApi.middleware),
})