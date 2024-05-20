import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userslice.js";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
const rootReducer = combineReducers({ user: userReducer });

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

//redux - persist is use store the global data that we've managed to get using redux toolkit to local storage
