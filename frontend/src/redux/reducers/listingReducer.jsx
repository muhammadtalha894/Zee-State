import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const listingApi = createApi({
  reducerPath: 'listingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:9000/api/v1/listing/',
    credentials: 'include',
    tagTypes: ['create'],
  }),
  endpoints: (builder) => ({
    listingItem: builder.mutation({
      query: (formData) => {
        return {
          method: 'POST',
          url: 'create',
          body: formData,
        };
      },
    }),
    updateListing: builder.mutation({
      query: ({ id, formData }) => {
        return {
          method: 'POST',
          url: `update/${id}`,
          body: formData,
        };
      },
    }),
    deleteListing: builder.mutation({
      query: (id) => {
        return {
          method: 'Delete',
          url: `delete/${id}`,
        };
      },
    }),
    userListing: builder.query({
      query: (id) => `listing/${id}`,
    }),
    detailsListing: builder.query({
      query: (id) => {
        return {
          url: `details/${id}`,
        };
      },
    }),
    getListing: builder.query({
      query: (searchQuery) => {
        return {
          url: `get?${searchQuery}`,
          method: 'Get',
        };
      },
    }),
  }),
});

export const {
  useListingItemMutation,
  useLazyUserListingQuery,
  useDeleteListingMutation,
  useLazyDetailsListingQuery,
  useDetailsListingQuery,
  useUpdateListingMutation,
  useLazyGetListingQuery,
} = listingApi;
