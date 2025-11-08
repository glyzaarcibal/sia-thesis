import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: "",
    name: "",
    email: "",
    firstName: "",
    lastName: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId: (state, action) => {
      state.user.id = action.payload;
    },
    setName: (state, action) => {
      state.user.name = action.payload;
    },
    setEmail: (state, action) => {
      state.user.email = action.payload;
    },
    setFirstName: (state, action) => {
      state.user.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.user.lastName = action.payload;
    },
  },
});

export const { setName, setEmail, setFirstName, setLastName, setId } =
  userSlice.actions;
export default userSlice.reducer;
