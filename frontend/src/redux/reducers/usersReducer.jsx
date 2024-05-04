import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:9000/api/v1/user/',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: ({ id, formData }) => {
        console.log(id);
        return {
          method: 'POST',
          url: `update/${id}`,
          body: formData,
        };
      },
    }),
    deleteUser: builder.mutation({
      query: (id) => {
        console.log(id);
        return {
          method: 'Delete',
          url: `delete/${id}`,
        };
      },
    }),
    signoutUser: builder.query({
      query: () => {
        return {
          method: 'Get',
          url: `signout`,
        };
      },
    }),
    getUser: builder.query({
      query: (id) => {
        return {
          method: 'Get',
          url: `${id}`,
        };
      },
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLazySignoutUserQuery,
  useGetUserQuery,
} = userApi;
