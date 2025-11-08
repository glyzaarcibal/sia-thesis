import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: {
    quizSpeech: true,
    chatSpeech: true,
    language: "English",
    fxQuiz: true,
  },
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.settings.language = action.payload;
    },
    toggleQuizSpeech: (state, action) => {
      state.settings.quizSpeech = !state.settings.quizSpeech;
    },
    toggleChatSpeech: (state, action) => {
      state.settings.chatSpeech = !state.settings.chatSpeech;
    },
    toggleFxQuiz: (state, action) => {
      state.settings.fxQuiz = !state.settings.fxQuiz;
    },
  },
});

export const { setLanguage, toggleChatSpeech, toggleFxQuiz, toggleQuizSpeech } =
  settingsSlice.actions;
export default settingsSlice.reducer;
