import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:9000/api/v1/auth/',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: ({ username, email, password }) => {
        return {
          method: 'POST',
          url: 'signup',
          body: { username, email, password },
        };
      },
    }),
    signInUser: builder.mutation({
      query: ({ email, password }) => {
        return {
          method: 'POST',
          url: 'signin',
          body: { email, password },
        };
      },
    }),
    signInWithGoogle: builder.mutation({
      query: ({ name, email, photo }) => {
        return {
          method: 'POST',
          url: 'google',
          body: { name, email, photo },
        };
      },
    }),
    getMyProfile: builder.query({
      query: () => 'me',
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useSignInUserMutation,
  useSignInWithGoogleMutation,
  useGetMyProfileQuery,
  useLazyGetMyProfileQuery,
} = authApi;
