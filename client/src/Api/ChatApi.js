import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { DEVELOPMENT_CHAT } from '../utils/utils';

//const CHAT_API = 'http://localhost:4000/api/chat/'

const CHAT_API=DEVELOPMENT_CHAT
  // ? `${DEVELOPMENT_CHAT}/`
  // : "http://localhost:3000/api/chat/";


export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ baseUrl: CHAT_API, credentials: 'include' }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (payload) => ({ url: '/send', method: 'POST', body: payload }),
    }),
    getPrompts: builder.query({
      query: () => ({ url: '/', method: 'GET' }),
    }),
    clearPrompts: builder.mutation({
      query: () => ({ url: '/clear', method: 'DELETE' }),
    }),
  }),
})

export const { useSendMessageMutation, useGetPromptsQuery, useClearPromptsMutation } = chatApi
