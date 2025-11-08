import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  quizResult: [], // Initial state
};

const quizResultSlice = createSlice({
  name: "quizResult",
  initialState,
  reducers: {
    setQuizResult: (state, action) => {
      state.quizResult = action.payload;
    },
  },
});

export const { setQuizResult } = quizResultSlice.actions;
export default quizResultSlice.reducer;
