import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './reducers/userReducer';
import { userApi } from './reducers/usersReducer';
import { listingApi } from './reducers/listingReducer';
const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [listingApi.reducerPath]: listingApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      authApi.middleware,
      userApi.middleware,
      listingApi.middleware,
    ]),
});

export default store;
