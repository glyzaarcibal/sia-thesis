import React, { useState, useEffect } from "react";
import {
  View,
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

const moods = {
  positive_low: [
    { animation: require("../../../assets/images/animations/content.json"), mood: "Calm" },
    { animation: require("../../../assets/images/animations/content.json"), mood: "Relaxed" },
    { animation: require("../../../assets/images/animations/content.json"), mood: "Content" },
    { animation: require("../../../assets/images/animations/content.json"), mood: "Peaceful" },
    { animation: require("../../../assets/images/animations/content.json"), mood: "Grateful" },
  ],
  positive_high: [
    { animation: require("../../../assets/images/animations/happy.json"), mood: "Excited" },
    { animation: require("../../../assets/images/animations/happy.json"), mood: "Joyful" },
    { animation: require("../../../assets/images/animations/happy.json"), mood: "Thrilled" },
    { animation: require("../../../assets/images/animations/happy.json"), mood: "Inspired" },
    { animation: require("../../../assets/images/animations/happy.json"), mood: "Playful" },
  ],
  negative_low: [
    { animation: require("../../../assets/images/animations/anxious.json"), mood: "Depressed" },
    { animation: require("../../../assets/images/animations/tired.json"), mood: "Tired" },
    { animation: require("../../../assets/images/animations/sad.json"), mood: "Disappointed" },
    { animation: require("../../../assets/images/animations/angry.json"), mood: "Annoyed" },
    { animation: require("../../../assets/images/animations/tired.json"), mood: "Bored" },
  ],
  negative_high: [
    { animation: require("../../../assets/images/animations/anxious.json"), mood: "Anxious" },
    { animation: require("../../../assets/images/animations/anxious.json"), mood: "Overwhelmed" },
    { animation: require("../../../assets/images/animations/anxious.json"), mood: "Panicked" },
    { animation: require("../../../assets/images/animations/angry.json"), mood: "Irritated" },
    { animation: require("../../../assets/images/animations/anxious.json"), mood: "Frustrated" },
  ],
};

const MoodTrackerScreen = ({ navigation }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [cause, setCause] = useState("");
  const [moodHistory, setMoodHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const { axiosInstanceWithBearer } = useAuth();

  useEffect(() => {
    loadMoodHistory();
  }, []);

  const formatDate = (date) => {
    const options = { month: "short", day: "numeric", year: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const formatTime = (date) => {
    const options = { hour: "2-digit", minute: "2-digit", hour12: true };
    return new Date(date).toLocaleTimeString("en-US", options);
  };

  const saveMood = async () => {
    if (!selectedMood) return;

    setLoading(true);
    const now = new Date();
    const newEntry = {
      mood: selectedMood.mood,
      reason: cause.trim(),
      timestamp: now.toISOString(),
    };

    try {
      const response = await axiosInstanceWithBearer.post("/api/mood-tracker", newEntry);
      
      // Load fresh data from server
      await loadMoodHistory();
      
      setSelectedMood(null);
      setCause("");
      
      Alert.alert("Success", "Mood saved successfully! 🎉");
    } catch (error) {
      console.error("Error saving mood:", error.response ? error.response.data : error);
      
      // Fallback to local storage
      const updatedHistory = [newEntry, ...moodHistory];
      setMoodHistory(updatedHistory);
      await AsyncStorage.setItem("moodHistory", JSON.stringify(updatedHistory));
      
      setSelectedMood(null);
      setCause("");
      Alert.alert("Saved Locally", "Mood saved locally. Will sync when online.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoodHistory = async () => {
    try {
      // Try to load from API first
      const response = await axiosInstanceWithBearer.get("/api/mood-tracker");
      if (response.data && response.data.entries) {
        setMoodHistory(response.data.entries);
        // Save to AsyncStorage as backup
        await AsyncStorage.setItem("moodHistory", JSON.stringify(response.data.entries));
      }
    } catch (error) {
      console.error("Error loading from API, using local storage:", error);
      // Fallback to local storage
      const savedHistory = await AsyncStorage.getItem("moodHistory");
      if (savedHistory) {
        setMoodHistory(JSON.parse(savedHistory));
      }
    }
  };

  const confirmClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all your mood entries? This will delete them from the server.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearHistory },
      ]
    );
  };

  const clearHistory = async () => {
    try {
      // Clear from server
      await axiosInstanceWithBearer.delete("/api/mood-tracker");
      // Clear from local storage
      await AsyncStorage.removeItem("moodHistory");
      setMoodHistory([]);
      Alert.alert("Done", "Mood history cleared!");
    } catch (error) {
      console.error("Error clearing history:", error);
      Alert.alert("Error", "Failed to clear history from server. Try again later.");
    }
  };

  const getMoodAnimation = (moodName) => {
    for (const category in moods) {
      const found = moods[category].find((m) => m.mood === moodName);
      if (found) return found.animation;
    }
    return null;
  };

  const renderMoodSection = (title, category, color) => (
    <View style={styles.moodSection}>
      <BoldText style={[styles.sectionTitle, { color }]}>{title}</BoldText>
      <View style={styles.moodGrid}>
        {moods[category].map((mood) => (
          <TouchableOpacity
            key={mood.mood}
            onPress={() => setSelectedMood(mood)}
            style={[styles.moodButton, { backgroundColor: color + "20" }]}
            activeOpacity={0.7}
          >
            <LottieView
              source={mood.animation}
              autoPlay
              loop
              style={styles.moodAnimation}
            />
            <Text style={[styles.moodLabel, { color }]}>{mood.mood}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const getMoodColor = (moodName) => {
    if (moods.positive_low.find(m => m.mood === moodName)) return "#4CAF50";
    if (moods.positive_high.find(m => m.mood === moodName)) return "#66BB6A";
    if (moods.negative_low.find(m => m.mood === moodName)) return "#FF9800";
    if (moods.negative_high.find(m => m.mood === moodName)) return "#F44336";
    return "#9E9E9E";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={24} color="#1B5E20" />
        </TouchableOpacity>
        <BoldText style={styles.headerTitle}>Mood Tracker</BoldText>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <BoldText style={styles.title}>How are you feeling today?</BoldText>
        <Text style={styles.subtitle}>
          Track your emotional state to understand your patterns
        </Text>

        {/* Mood Selection */}
        {!selectedMood ? (
          <View style={styles.moodSelector}>
            {renderMoodSection("😊 Positive (Calm & Content)", "positive_low", "#4CAF50")}
            {renderMoodSection("🎉 Positive (Energetic & Happy)", "positive_high", "#66BB6A")}
            {renderMoodSection("😔 Negative (Low Energy)", "negative_low", "#FF9800")}
            {renderMoodSection("😤 Negative (High Energy)", "negative_high", "#F44336")}
          </View>
        ) : (
          <View style={styles.reasonContainer}>
            <View style={[styles.selectedMoodCard, { borderColor: getMoodColor(selectedMood.mood) }]}>
              <LottieView
                source={selectedMood.animation}
                autoPlay
                loop
                style={styles.largeMoodAnimation}
              />
              <BoldText style={[styles.selectedMoodName, { color: getMoodColor(selectedMood.mood) }]}>
                {selectedMood.mood}
              </BoldText>
            </View>

            <Text style={styles.inputLabel}>What caused this mood?</Text>
            <TextInput
              style={styles.input}
              placeholder="Describe what happened or how you're feeling..."
              placeholderTextColor="#999"
              value={cause}
              onChangeText={setCause}
              multiline
              numberOfLines={4}
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setSelectedMood(null);
                  setCause("");
                }}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.saveButton, loading && styles.saveButtonDisabled]} 
                onPress={saveMood}
                disabled={loading}
              >
                <BoldText style={styles.saveButtonText}>
                  {loading ? "Saving..." : "Save Mood"}
                </BoldText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Mood History */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <BoldText style={styles.historyTitle}>Mood History</BoldText>
            <Text style={styles.historyCount}>{moodHistory.length} entries</Text>
          </View>

          {moodHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📊</Text>
              <BoldText style={styles.emptyTitle}>No entries yet</BoldText>
              <Text style={styles.emptyText}>
                Start tracking your mood to see patterns and insights
              </Text>
            </View>
          ) : (
            <>
              {moodHistory.map((item, index) => {
                const moodAnimation = getMoodAnimation(item.mood);
                const moodColor = getMoodColor(item.mood);
                return (
                  <View key={index} style={[styles.moodItem, { borderLeftColor: moodColor }]}>
                    <View style={styles.moodItemHeader}>
                      {moodAnimation && (
                        <LottieView
                          source={moodAnimation}
                          autoPlay
                          loop
                          style={styles.historyMoodAnimation}
                        />
                      )}
                      <View style={styles.moodItemHeaderText}>
                        <BoldText style={[styles.moodItemMood, { color: moodColor }]}>
                          {item.mood}
                        </BoldText>
                        <View style={styles.moodItemMeta}>
                          <Text style={styles.moodItemTime}>
                            {formatTime(item.timestamp)}
                          </Text>
                          <Text style={styles.moodItemDivider}>•</Text>
                          <Text style={styles.moodItemDate}>
                            {formatDate(item.timestamp)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {item.cause && item.cause.trim() !== "" && (
                      <View style={styles.causeContainer}>
                        <Text style={styles.causeLabel}>Cause:</Text>
                        <Text style={styles.moodItemCause}>{item.cause}</Text>
                      </View>
                    )}
                  </View>
                );
              })}

              <TouchableOpacity
                style={styles.clearButton}
                onPress={confirmClearHistory}
              >
                <AntDesign name="delete" size={18} color="white" />
                <Text style={styles.clearButtonText}>Clear All History</Text>
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
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    color: "#1B5E20",
  },
  title: {
    fontSize: 26,
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
    color: "#2E7D32",
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    marginBottom: 25,
    paddingHorizontal: 30,
  },
  moodSelector: {
    paddingHorizontal: 15,
  },
  moodSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    marginLeft: 5,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  moodButton: {
    alignItems: "center",
    margin: 5,
    padding: 12,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width: 90,
  },
  moodAnimation: {
    width: 45,
    height: 45,
  },
  moodLabel: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
  },
  reasonContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  selectedMoodCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    elevation: 3,
    borderWidth: 3,
  },
  largeMoodAnimation: {
    width: 100,
    height: 100,
  },
  selectedMoodName: {
    fontSize: 28,
    marginTop: 15,
  },
  inputLabel: {
    fontSize: 15,
    color: "#333",
    marginBottom: 10,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#DDD",
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 15,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#A5D6A7",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  historySection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 22,
    color: "#1B5E20",
  },
  historyCount: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  moodItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4,
  },
  moodItemHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyMoodAnimation: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  moodItemHeaderText: {
    flex: 1,
  },
  moodItemMood: {
    fontSize: 18,
    marginBottom: 4,
  },
  moodItemMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  moodItemTime: {
    fontSize: 13,
    color: "#666",
  },
  moodItemDivider: {
    fontSize: 13,
    color: "#999",
    marginHorizontal: 8,
  },
  moodItemDate: {
    fontSize: 13,
    color: "#666",
  },
  causeContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  causeLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
    fontWeight: "600",
  },
  moodItemCause: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  clearButton: {
    flexDirection: "row",
    backgroundColor: "#F44336",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    gap: 8,
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MoodTrackerScreen;