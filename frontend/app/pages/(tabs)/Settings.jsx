import { View, TouchableWithoutFeedback, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { rem } from "../../../components/stylings/responsiveSize";

import { Button, Divider } from "react-native-paper";
import ToggleButton from "../../../components/ToggleButton";
import SettingRow from "../../../components/SettingRow";
import ToggleText from "../../../components/ToggleText";
import { useDispatch, useSelector } from "react-redux";
import {
  setLanguage,
  toggleChatSpeech,
  toggleFxQuiz,
  toggleQuizSpeech,
} from "../../../redux/settingsSlice";
import AntDesign from "@expo/vector-icons/AntDesign";
import { default as Text } from "../../../components/CustomText";

const Settings = ({ navigation }) => {
  const settingsConfig = useSelector((state) => state.settings.settings);
  const dispatch = useDispatch();

  const handleToggleChatSpeech = () => {
    dispatch(toggleChatSpeech());
  };

  const handleToggleFxQuiz = () => {
    dispatch(toggleFxQuiz());
  };

  const handleToggleQuizSpeech = () => {
    dispatch(toggleQuizSpeech());
  };

  const handleChangeLanguage = (lang) => {
    dispatch(setLanguage(lang));
  };

  return (
    <View style={{ flex: 1, padding: rem(10) }}>
      <View style={{ marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={{ fontSize: rem(20), fontWeight: 500 }}>Settings</Text>
      <Text style={{ fontSize: rem(16), fontWeight: 500 }}>Quiz Settings</Text>
      <Divider style={{ marginVertical: rem(5) }} />
      <SettingRow>
        <Text>Sound Effects - Quiz</Text>
        <ToggleButton
          state={settingsConfig.fxQuiz}
          toggler={handleToggleFxQuiz}
        />
      </SettingRow>
      <Text style={{ fontSize: rem(16), fontWeight: 500 }}>
        Text-to-Speech Settings
      </Text>
      <Divider style={{ marginVertical: rem(5) }} />
      <SettingRow>
        <Text>Speech Synthesis - Quiz</Text>
        <ToggleButton
          state={settingsConfig.quizSpeech}
          toggler={handleToggleQuizSpeech}
        />
      </SettingRow>
      <SettingRow>
        <Text>Speech Synthesis - Chat</Text>
        <ToggleButton
          state={settingsConfig.chatSpeech}
          toggler={handleToggleChatSpeech}
        />
      </SettingRow>
      <SettingRow>
        <Text>Language</Text>
        <ToggleText
          state={settingsConfig.language}
          toggler={handleChangeLanguage}
        />
      </SettingRow>
    </View>
  );
};

export default Settings;
