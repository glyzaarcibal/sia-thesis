import { View, Text, StyleSheet, Platform } from "react-native";
import React from "react";
import Toast from "react-native-toast-message";
import Home from "../(tabs)/home";
import Messages from "./messages";
import Profile from "./profile";
import Resources from "../resources/Resources";
import Games from "../games/layoutgame";
import Settings from "./Settings";

import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Octicons from "@expo/vector-icons/Octicons";

const Tabs = createBottomTabNavigator();

const _layout = () => {
  return (
    <>
      <Tabs.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#0cdfc6",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            height: 60,
            paddingBottom: 5,
            ...(Platform.OS === 'web' && {
              position: 'fixed',
              bottom: 0,
              width: '100%',
              zIndex: 1000
            })
          },
        }}
      >
        <Tabs.Screen
          name="Home"
          component={Home}
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <AntDesign name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Messages"
          component={Messages}
          options={{
            title: "Chat",
            tabBarIcon: ({ color }) => (
              <AntDesign name="message" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="Activities"
          component={Games}
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <View style={styles.largeIconContainer}>
                <Ionicons
                  name="game-controller-outline"
                  size={40}
                  color="white"
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="Resources"
          component={Resources}
          options={{
            title: "Resources",
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="file-tray-stacked-outline"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Profile"
          component={Profile}
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <AntDesign name="user" size={24} color={color} />
            ),
          }}
        />
      </Tabs.Navigator>
      <Toast />
    </>
  );
};

const styles = StyleSheet.create({
  largeIconContainer: {
    width: 70,
    height: 70,
    backgroundColor: "#0cdfc6",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'transform 0.2s',
      ':hover': {
        transform: 'scale(1.1)'
      }
    })
  },
});



export default _layout;