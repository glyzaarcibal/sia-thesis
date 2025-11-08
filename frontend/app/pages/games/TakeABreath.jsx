import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Animated,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Audio } from "expo-av";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { useAuth } from "../../../context/AuthContext";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";

// Import local audio files
import getReadyAudio from "../../../assets/audio/breath/get-ready-in.mp3";
import getReadyTagalogAudio from "../../../assets/audio/breath/humandakasabilang.mp3";
import countdown3 from "../../../assets/audio/breath/countdown3.mp3";
import countdown2 from "../../../assets/audio/breath/countdown2.mp3";
import countdown1 from "../../../assets/audio/breath/countdown1.mp3";
import countdown3tag from "../../../assets/audio/breath/countdown3tagalog.mp3";
import countdown2tag from "../../../assets/audio/breath/countdown2tagalog.mp3";
import countdown1tag from "../../../assets/audio/breath/countdown1tagalog.mp3";
import inhaleAudio from "../../../assets/audio/breath/inhale.mp3";
import exhaleAudio from "../../../assets/audio/breath/exhale.mp3";
import holdAudio from "../../../assets/audio/breath/hold.mp3";
import holdAudiotag from "../../../assets/audio/breath/Pigil.mp3";
import tagalogExhaleAudio from "../../../assets/audio/breath/huminganangpalabas.mp3";
import tagalogInhaleAudio from "../../../assets/audio/breath/huminga.mp3";

const TakeABreath = () => {
  const [breathingStage, setBreathingStage] = useState(0);
  const [breathAnimation] = useState(new Animated.Value(1));
  const [isBreathing, setIsBreathing] = useState(false);
  const [repeatCount, setRepeatCount] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [history, setHistory] = useState([]);
  const settingsConfig = useSelector((state) => state.settings.settings);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (!isBreathing || countdown > 0) return;

    let timing = 0;

    if (breathingStage === 0) {
      playAudio(inhaleAudio, tagalogInhaleAudio);
      Animated.timing(breathAnimation, {
        toValue: 1.5,
        duration: 6000,
        useNativeDriver: true,
      }).start();
      timing = 6000;
    } else if (breathingStage === 1) {
      playAudio(holdAudio, holdAudiotag);
      timing = 7000;
    } else if (breathingStage === 2) {
      playAudio(exhaleAudio, tagalogExhaleAudio);
      Animated.timing(breathAnimation, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      }).start();
      timing = 8000;
    }

    const timer = setTimeout(() => {
      if (breathingStage === 2) {
        if (repeatCount < 1) {
          setRepeatCount(repeatCount + 1);
          setBreathingStage(0);
        } else {
          setIsBreathing(false);
          setBreathingStage(0);
          setRepeatCount(0);
          addHistory();
        }
      } else {
        setBreathingStage((prevStage) => prevStage + 1);
      }
    }, timing);

    return () => clearTimeout(timer);
  }, [
    breathingStage,
    isBreathing,
    countdown,
    repeatCount,
    settingsConfig.language,
  ]);

  const playAudio = async (audioFile, tagalogAudioFile) => {
    try {
      const selectedAudio =
        settingsConfig.language === "Tagalog" ? tagalogAudioFile : audioFile;
      const { sound } = await Audio.Sound.createAsync(selectedAudio);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };

  const addHistory = async () => {
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString();
    const newHistory = [
      { session: history.length + 1, date, time },
      ...history,
    ];

    setHistory(newHistory);
    await AsyncStorage.setItem("breathingHistory", JSON.stringify(newHistory));
  };

  const loadHistory = async () => {
    const savedHistory = await AsyncStorage.getItem("breathingHistory");
    if (savedHistory) {
      setHistory(
        JSON.parse(savedHistory).sort((a, b) => b.session - a.session)
      );
    }
  };

  const startBreathing = async () => {
    setIsBreathing(true);
    setBreathingStage(0);
    setCountdown(3);

    await playAudio(getReadyAudio, getReadyTagalogAudio);
    setTimeout(async () => {
      setCountdown(3);
      await playAudio(countdown3, countdown3tag);
    }, 1000);

    setTimeout(async () => {
      setCountdown(2);
      await playAudio(countdown2, countdown2tag);
    }, 2000);

    setTimeout(async () => {
      setCountdown(1);
      await playAudio(countdown1, countdown1tag);
    }, 3000);

    setTimeout(() => {
      setCountdown(0);
    }, 4000);
  };

  const stageText = () => {
    if (!isBreathing) return "";
    if (countdown > 0) return `Get ready... ${countdown}`;
    return ["Inhale...", "Hold...", "Exhale..."][breathingStage] || "";
  };

  const router = useRouter();

  return (
    <LinearGradient colors={["#ffffff", "#d4edda"]} style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={30} color="#4CAF50" />
      </TouchableOpacity>
      <Animated.View
        style={[styles.circle, { transform: [{ scale: breathAnimation }] }]}
      />
      <Text style={styles.instruction}>{stageText()}</Text>
      {!isBreathing && (
        <TouchableOpacity style={styles.startButton} onPress={startBreathing}>
          <Text style={styles.startButtonText}>Start Breathing</Text>
        </TouchableOpacity>
      )}

      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Breathing History</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Date</Text>
            <Text style={styles.tableHeaderText}>Time</Text>
          </View>
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No history yet</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.date}</Text>
                <Text style={styles.tableCell}>{item.time}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 110,
    backgroundColor: "#90EE90",
  },
  instruction: {
    fontSize: 26,
    color: "#4CAF50",
    fontWeight: "bold",
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  historyContainer: {
    marginTop: 20,
    width: "90%",
    backgroundColor: "#f1f8e9",
    borderRadius: 10,
    padding: 10,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  tableContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 5,
    backgroundColor: "white",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
  },
  tableHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  tableBody: {
    height: 150,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#4CAF50",
  },
  tableCell: {
    fontSize: 16,
    color: "#4CAF50",
    flex: 1,
    textAlign: "center",
  },
  emptyRow: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
  },
});

export default TakeABreath;
