import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: {
    isLoggedIn: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    toggleLogin: (state, action) => {
      state.auth.isLoggedIn = !state.auth.isLoggedIn;
    },
  },
});

export const { toggleLogin } = authSlice.actions;
export default authSlice.reducer;
