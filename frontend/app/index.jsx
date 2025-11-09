import { View, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import { PaperProvider, DefaultTheme } from "react-native-paper";
import { useFonts } from "expo-font";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Welcome from "./pages/auth/welcome";
import Home from "./pages/(tabs)/home";
import Settings from "./pages/(tabs)/Settings";
import _layout from "./pages/(tabs)/_layout";
import Chat from "./pages/messages/chat";
import Games from "./pages/games/layoutgame";
import TakeABreath from "./pages/games/TakeABreath";
import Quiz from "./pages/quiz/quiz";
import Result from "./pages/quiz/result";
import Conditions from "./pages/quiz/conditions";
import MoodTrackerScreen from "./pages/games/MoodTrackerScreen";
import WeeklyWellnessReport from "./pages/games/WeeklyWellnessReport";
import ClipCardGame from "./pages/games/ClipCardGame";
import Diary from "./pages/games/Diary";
import NotificationsScreen from "./pages/notification/Notifications";
import AdminDashboard from "./pages/admin/AdminDashboard";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider } from "../context/AuthContext";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import MentalHealthSlider from "./pages/resources/MentalHealthSlider";
import Slider2 from "./pages/resources/slider2";
import Slider3 from "./pages/resources/slider3";
import Slider4 from "./pages/resources/slider4";
import Resources from "./pages/resources/Resources";
import Fallinggame from "./pages/games/Fallinggame";
import Profile from "./pages/auth/Profile";

import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Register" component={Register} />

        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="Main" component={_layout} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Game" component={Games} />
        <Stack.Screen name="TakeABreath" component={TakeABreath} />
        <Stack.Screen name="Result" component={Result} />
        <Stack.Screen name="Conditions" component={Conditions} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="MoodTrackerScreen" component={MoodTrackerScreen} />
        <Stack.Screen
          name="WeeklyWellnessReport"
          component={WeeklyWellnessReport}
        />
        <Stack.Screen name="ClipCardGame" component={ClipCardGame} />
        <Stack.Screen name="Diary" component={Diary} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="MentalHealth" component={MentalHealthSlider} />
        <Stack.Screen name="Slider2" component={Slider2} />
        <Stack.Screen name="Slider3" component={Slider3} />
        <Stack.Screen name="Slider4" component={Slider4} />
        <Stack.Screen name="Resources" component={Resources} />
        <Stack.Screen name="Fallinggame" component={Fallinggame} />

        <Stack.Screen
          name="Quiz"
          component={Quiz}
          options={{ animation: "none" }}
        />
      </Stack.Navigator>
      <Toast />
    </>
  );
};

const Index = () => {
  const [fontsLoaded] = useFonts({
    Primary: require("../assets/fonts/GlacialIndifference-Regular.otf"),
    Seco: require("../assets/fonts/GlacialIndifference-Bold.otf"),
    SecoBold: require("../assets/fonts/OpenSans-Bold.ttf"),
    SecoXBold: require("../assets/fonts/OpenSans-ExtraBold.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const theme = {
    ...DefaultTheme,
    fonts: {
      regular: { fontFamily: "Primary", fontWeight: "normal" },
      medium: { fontFamily: "Primary", fontWeight: "500" },
      light: { fontFamily: "Primary", fontWeight: "300" },
      thin: { fontFamily: "Primary", fontWeight: "100" },
    },
    components: {
      Button: {
        contentStyle: { fontFamily: "Primary" }, // Ensures buttons use "Primary"
        labelStyle: { fontFamily: "Primary" }, // Ensures button text uses "Primary"
      },
      TextInput: {
        style: { fontFamily: "Primary" }, // Ensures TextInput uses "Primary"
        contentStyle: { fontFamily: "Primary" }, // Ensures buttons use "Primary"
        labelStyle: { fontFamily: "Primary" }, // Ensures button text uses "Primary"
      },
      Text: {
        style: { fontFamily: "Primary" }, // Ensures all text uses "Primary"
      },
    },
  };

  return (
    <Provider store={store}>
      <AuthProvider>
        {/* <PaperProvider theme={theme}> */}
        <AuthStack />
        {/* </PaperProvider> */}
      </AuthProvider>
    </Provider>
  );
};

export default Index;
