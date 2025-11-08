import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";

const Notifications = () => {
  const navigation = useNavigation();
  const [message, setMessage] = useState("No new notifications");

  useEffect(() => {
    const fetchNotification = async () => {
      const notification = await AsyncStorage.getItem("notification");
      setMessage(notification || "No new notifications");
    };

    fetchNotification();
    const interval = setInterval(fetchNotification, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationPress = async () => {
    if (message === "Sleep duration is finished! Click to stop the alarm.") {
      Alert.alert("Sleep Tracker", "Do you want to go to the Sleep Tracker?", [
        { text: "Cancel", style: "cancel" },
        { text: "Go", onPress: () => navigation.navigate("SleepTracker") },
      ]);
    }

    await AsyncStorage.setItem("notification", "No new notifications");
    setMessage("No new notifications");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <TouchableOpacity
        style={[
          styles.notificationCard,
          message !== "No new notifications" && styles.activeCard,
        ]}
        onPress={handleNotificationPress}
        disabled={message === "No new notifications"}
      >
        <MaterialIcons
          name="notifications"
          size={24}
          color={message !== "No new notifications" ? "#007bff" : "#6c757d"}
        />
        <Text
          style={[
            styles.text,
            message !== "No new notifications" && styles.activeText,
          ]}
        >
          {message}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: "90%",
    justifyContent: "center",
  },
  activeCard: {
    backgroundColor: "#e3f2fd",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6c757d",
    marginLeft: 10,
  },
  activeText: {
    color: "#007bff",
  },
});

export default Notifications;
