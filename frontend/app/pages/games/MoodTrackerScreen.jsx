import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import { useAuth } from "../../../context/AuthContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";

const moods = [
  {
    animation: require("../../../assets/images/animations/happy.json"),
    mood: "Happy",
  },
  {
    animation: require("../../../assets/images/animations/sad.json"),
    mood: "Sad",
  },
  {
    animation: require("../../../assets/images/animations/angry.json"),
    mood: "Angry",
  },
  {
    animation: require("../../../assets/images/animations/anxious.json"),
    mood: "Anxious",
  },
  {
    animation: require("../../../assets/images/animations/tired.json"),
    mood: "Tired",
  },
  {
    animation: require("../../../assets/images/animations/relax.json"),
    mood: "Relaxed",
  },
  {
    animation: require("../../../assets/images/animations/content.json"),
    mood: "Calm",
  },
];

const MoodTrackerScreen = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [reason, setReason] = useState("");
  const [moodHistory, setMoodHistory] = useState([]);
  const { axiosInstanceWithBearer } = useAuth();

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    return new Date(date).toLocaleTimeString('en-US', options);
  };

  const saveMood = async () => {
    if (!selectedMood) return;

    const now = new Date();
    const newEntry = {
      mood: selectedMood.mood,
      reason: reason.trim(),
      timestamp: now.toISOString(),
    };

    try {
      await axiosInstanceWithBearer.post("/mood-tracker/", newEntry);
      const updatedHistory = [newEntry, ...moodHistory];

      setMoodHistory(updatedHistory);
      await AsyncStorage.setItem("moodHistory", JSON.stringify(updatedHistory));

      setSelectedMood(null);
      setReason("");
      
      Alert.alert("Success", "Mood saved successfully! 🎉");
    } catch (error) {
      console.error(
        "Error saving mood:",
        error.response ? error.response.data : error
      );
      // Still save locally even if API fails
      const updatedHistory = [newEntry, ...moodHistory];
      setMoodHistory(updatedHistory);
      await AsyncStorage.setItem("moodHistory", JSON.stringify(updatedHistory));
      
      setSelectedMood(null);
      setReason("");
      Alert.alert("Saved", "Mood saved locally!");
    }
  };

  const loadMoodHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem("moodHistory");
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        console.log("Loaded mood history:", parsed);
        setMoodHistory(parsed);
      }
    } catch (error) {
      console.error("Error loading mood history:", error);
    }
  };

  const confirmClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all your mood entries?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearHistory },
      ]
    );
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("moodHistory");
      setMoodHistory([]);
      Alert.alert("Done", "Mood history cleared!");
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const getMoodAnimation = (moodName) => {
    const moodObj = moods.find(m => m.mood === moodName);
    return moodObj ? moodObj.animation : null;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrow-left" size={24} color="#1B5E20" />
          
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <BoldText style={styles.title}>How are you feeling today?</BoldText>

        {/* Mood Selection */}
        {!selectedMood ? (
          <View style={styles.moodSelector}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.mood}
                onPress={() => setSelectedMood(mood)}
                style={styles.moodButton}
              >
                <LottieView
                  source={mood.animation}
                  autoPlay
                  loop
                  style={styles.moodAnimation}
                />
                <Text style={styles.moodLabel}>{mood.mood}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.reasonContainer}>
            <View style={styles.selectedMoodCard}>
              <LottieView
                source={selectedMood.animation}
                autoPlay
                loop
                style={styles.largeMoodAnimation}
              />
              <BoldText style={styles.selectedMoodName}>
                {selectedMood.mood}
              </BoldText>
            </View>

            <TextInput
              style={styles.input}
              placeholder="What made you feel this way? (optional)"
              placeholderTextColor="#81C784"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={3}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setSelectedMood(null);
                  setReason("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveMood}>
                <BoldText style={styles.saveButtonText}>Save Mood</BoldText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Mood History */}
        <View style={styles.historySection}>
          <BoldText style={styles.historyTitle}>Mood History</BoldText>

          {moodHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No mood entries yet.{"\n"}Start tracking your mood! 😊
              </Text>
            </View>
          ) : (
            <>
              {moodHistory.map((item, index) => {
                const moodAnimation = getMoodAnimation(item.mood);
                return (
                  <View key={index} style={styles.moodItem}>
                    <View style={styles.moodItemHeader}>
                      {moodAnimation && (
                        <LottieView
                          source={moodAnimation}
                          autoPlay
                          loop
                          style={styles.historyMoodAnimation}
                        />
                      )}
                      <BoldText style={styles.moodItemMood}>
                        {item.mood}
                      </BoldText>
                    </View>

                    <View style={styles.moodItemDetails}>
                      <Text style={styles.moodItemTime}>
                        🕒 {formatTime(item.timestamp)}
                      </Text>
                      <Text style={styles.moodItemDate}>
                        📅 {formatDate(item.timestamp)}
                      </Text>
                    </View>

                    {item.reason && item.reason.trim() !== "" && (
                      <Text style={styles.moodItemReason}>
                        📝 {item.reason}
                      </Text>
                    )}
                  </View>
                );
              })}

              <TouchableOpacity
                style={styles.clearButton}
                onPress={confirmClearHistory}
              >
                <Text style={styles.clearButtonText}>Clear History</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D4EDDA",
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    marginTop: 10,
    marginBottom: 25,
    textAlign: "center",
    color: "#2E7D32",
    paddingHorizontal: 20,
  },
  moodSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  moodButton: {
    alignItems: "center",
    margin: 8,
    padding: 15,
    backgroundColor: "#A5D6A7",
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 100,
  },
  moodAnimation: {
    width: 50,
    height: 50,
  },
  moodLabel: {
    fontSize: 13,
    marginTop: 8,
    color: "#1B5E20",
    fontWeight: "600",
  },
  reasonContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  selectedMoodCard: {
    alignItems: "center",
    backgroundColor: "#C8E6C9",
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    elevation: 2,
  },
  largeMoodAnimation: {
    width: 100,
    height: 100,
  },
  selectedMoodName: {
    fontSize: 26,
    color: "#1B5E20",
    marginTop: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: "#81C784",
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    color: "#2E7D32",
    minHeight: 80,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#9E9E9E",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  historySection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  historyTitle: {
    fontSize: 22,
    marginBottom: 15,
    color: "#1B5E20",
  },
  emptyState: {
    backgroundColor: "#C8E6C9",
    borderRadius: 15,
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#2E7D32",
    textAlign: "center",
    lineHeight: 22,
  },
  moodItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  moodItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  historyMoodAnimation: {
    width: 35,
    height: 35,
    marginRight: 12,
  },
  moodItemMood: {
    fontSize: 18,
    color: "#1B5E20",
  },
  moodItemDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  moodItemTime: {
    fontSize: 13,
    color: "#555",
    marginRight: 15,
  },
  moodItemDate: {
    fontSize: 13,
    color: "#555",
  },
  moodItemReason: {
    fontSize: 14,
    color: "#333",
    fontStyle: "italic",
    marginTop: 5,
    lineHeight: 20,
  },
  clearButton: {
    backgroundColor: "#E53935",
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
    alignItems: "center",
    elevation: 2,
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MoodTrackerScreen;