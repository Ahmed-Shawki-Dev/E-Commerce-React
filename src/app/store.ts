import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./features/LoginSlice";
import { userSlice } from "./features/UserSlice";
import { cartSlice } from "./features/cartSlice";
import { globalSlice } from "./features/globalSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { apiSlice } from "./services/apiSlice";

const persistConfig = {
  key: `root`,
  storage,
  whitelist: ["cart"],
  blackList: [`${apiSlice.reducerPath}`],
};

const reducers = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  login: loginSlice.reducer,
  user: userSlice.reducer,
  cart: cartSlice.reducer,
  global: globalSlice.reducer,
});

export const persistedReducers = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
