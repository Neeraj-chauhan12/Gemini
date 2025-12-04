import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Userlogin, Userlogout } from '../redux/AuthSlice'
import {DEVELOPMENT_USER} from '../utils/utils.js'

const USER_API =DEVELOPMENT_USER
   ? DEVELOPMENT_USER
   : "http://localhost:3000/api/user";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (inputData) => ({
        url: "/login",
        method: "POST",
        body: inputData,
      }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(Userlogin({ user: result.data.user }));
        } catch (error) {
          console.log(error.message);
        }
      },
    }),

    register: builder.mutation({
      query: (inputData) => ({
        url: "/register",
        method: "POST",
        body: inputData,
      }),
     
    }),

    loadUser: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),

       async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(Userlogin({ user: result.data.user }));
        } catch (error) {
          console.log(error.message);
        }
      },
    }),


    LogoutUser:builder.mutation({
        query:()=>({
            url:"/logout",
            method:"GET",
        }),

         async onQueryStarted(arg, { dispatch }) {
        try {
        //   const result = await queryFulfilled;
          dispatch(Userlogout());
        } catch (error) {
          console.log(error.message);
        }
      },
    }),

})
})


export const {
  useLoginMutation,
  useLoadUserQuery,
  useRegisterMutation,
  useLogoutUserMutation
} = authApi;