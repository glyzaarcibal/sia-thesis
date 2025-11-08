import { configureStore } from "@reduxjs/toolkit";
import quizResultReducer from "./counterSlice";
import settingsReducer from "./settingsSlice";
import authReducer from "./authSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    quizResult: quizResultReducer,
    settings: settingsReducer,
    auth: authReducer,
    user: userReducer,
  },
});
