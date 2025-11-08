import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";
import Svg, { Path, Defs, LinearGradient, Stop, Rect, Ellipse } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const Diary = () => {
  const navigation = useNavigation();
  const [entry, setEntry] = useState("");
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [droppingIcon, setDroppingIcon] = useState(null);
  
  // Animation values
  const dropAnimation = useRef(new Animated.Value(-100)).current;
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  const fillHeightAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    animateFillHeight();
  }, [entries.length]);

  const loadEntries = async () => {
    try {
      const savedEntries = await AsyncStorage.getItem("diaryEntries");
      if (savedEntries) {
        const parsedEntries = JSON.parse(savedEntries);
        setEntries(parsedEntries);
        const fillPercentage = Math.min((parsedEntries.length / 20) * 100, 100);
        fillHeightAnimation.setValue(fillPercentage);
      }
    } catch (error) {
      console.error("Failed to load entries", error);
    }
  };

  const saveEntries = async (updatedEntries) => {
    try {
      await AsyncStorage.setItem(
        "diaryEntries",
        JSON.stringify(updatedEntries)
      );
    } catch (error) {
      console.error("Failed to save entries", error);
    }
  };

  const animateFillHeight = () => {
    const fillPercentage = Math.min((entries.length / 20) * 100, 100);
    Animated.spring(fillHeightAnimation, {
      toValue: fillPercentage,
      tension: 50,
      friction: 7,
      useNativeDriver: false,
    }).start();
  };

  const animateDrop = (type) => {
    setDroppingIcon(type);
    
    dropAnimation.setValue(-100);
    fadeAnimation.setValue(1);
    scaleAnimation.setValue(1);
    rotateAnimation.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(dropAnimation, {
          toValue: 30,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnimation, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnimation, {
          toValue: 1.3,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 0.4,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 250,
        delay: 700,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setDroppingIcon(null);
      dropAnimation.setValue(-100);
      fadeAnimation.setValue(1);
      scaleAnimation.setValue(1);
      rotateAnimation.setValue(0);
    });
  };

  const handleSave = () => {
    if (entry.trim() !== "") {
      const type = getRandomEntryType();
      
      animateDrop(type);

      setTimeout(() => {
        const newEntries = [
          {
            text: entry,
            date: new Date().toLocaleString(),
            type: type,
            id: Date.now().toString(),
          },
          ...entries,
        ];
        setEntries(newEntries);
        saveEntries(newEntries);
        setEntry("");
        
        Alert.alert("Success", "Your thoughts have been added to the jar! 🫙");
      }, 1100);
    } else {
      Alert.alert("Oops", "Please write something before dropping it in the jar.");
    }
  };

  const getRandomEntryType = () => {
    const types = ["heart", "leaf", "fish"];
    return types[Math.floor(Math.random() * types.length)];
  };

  const getIconForType = (type) => {
    return type === "heart" ? "❤️" : type === "leaf" ? "🍃" : "🐟";
  };

  const handleEntryPress = (entry) => {
    setSelectedEntry(entry);
    setModalVisible(true);
  };

  const handleDeleteEntry = () => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to remove this from your jar?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedEntries = entries.filter(
              (e) => e.id !== selectedEntry.id
            );
            setEntries(updatedEntries);
            saveEntries(updatedEntries);
            setModalVisible(false);
            setSelectedEntry(null);
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Calculate fill height for the water (0 to 180 based on jar body height)
  const waterHeight = fillHeightAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 180]
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#fef3e6" }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#8B4513" />
          </TouchableOpacity>
          <BoldText style={styles.title}>🫙 Diary Jar</BoldText>
        </View>

        <Text style={styles.subtitle}>
          Take a moment to reflect on every day.
        </Text>

        <View style={styles.jarContainer}>
          {/* SVG Jar */}
          <Svg width="300" height="300" viewBox="0 0 200 250">
            <Defs>
              <LinearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#e8f4f8" stopOpacity="0.8" />
                <Stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
                <Stop offset="100%" stopColor="#e8f4f8" stopOpacity="0.8" />
              </LinearGradient>
              <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#87CEEB" stopOpacity="0.6" />
                <Stop offset="50%" stopColor="#ADD8E6" stopOpacity="0.5" />
                <Stop offset="100%" stopColor="#87CEEB" stopOpacity="0.6" />
              </LinearGradient>
              <LinearGradient id="lidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#D4A574" stopOpacity="1" />
                <Stop offset="100%" stopColor="#B8956A" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            {/* Jar body - filled water */}
            <AnimatedRect
              x="50"
              y={Animated.subtract(230, waterHeight)}
              width="100"
              height={waterHeight}
              fill="url(#waterGradient)"
              rx="8"
            />

            {/* Jar body outline */}
            <Path
              d="M 50 50 L 50 230 Q 50 240 60 240 L 140 240 Q 150 240 150 230 L 150 50 Z"
              fill="url(#glassGradient)"
              stroke="#B8956A"
              strokeWidth="3"
            />

            {/* Jar highlights for glass effect */}
            <Path
              d="M 55 60 L 55 225 Q 55 232 62 232"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              opacity="0.6"
            />
            <Path
              d="M 145 60 L 145 225 Q 145 232 138 232"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              opacity="0.4"
            />

            {/* Jar lid - wider at top */}
            <Path
              d="M 40 45 L 40 50 Q 40 55 45 55 L 155 55 Q 160 55 160 50 L 160 45 Q 160 35 150 35 L 50 35 Q 40 35 40 45 Z"
              fill="url(#lidGradient)"
              stroke="#A0826D"
              strokeWidth="2"
            />
            
            {/* Lid top oval */}
            <Ellipse
              cx="100"
              cy="35"
              rx="55"
              ry="8"
              fill="#C19A6B"
              stroke="#A0826D"
              strokeWidth="2"
            />

            {/* Lid highlight */}
            <Ellipse
              cx="100"
              cy="34"
              rx="50"
              ry="6"
              fill="#D4A574"
              opacity="0.5"
            />
          </Svg>
          
          {/* Dropping animation icon */}
          {droppingIcon && (
            <Animated.View
              style={[
                styles.droppingIcon,
                {
                  transform: [
                    { translateY: dropAnimation },
                    { scale: scaleAnimation },
                    { rotate: spin },
                  ],
                  opacity: fadeAnimation,
                },
              ]}
            >
              <Text style={styles.droppingIconText}>
                {getIconForType(droppingIcon)}
              </Text>
            </Animated.View>
          )}

          {/* Entries inside jar */}
          <View style={styles.entriesOverlay}>
            {entries.length === 0 ? (
              <Text style={styles.emptyJarText}>Your jar is empty ✨</Text>
            ) : (
              entries.slice(0, 20).map((entry, index) => {
                // Calculate position within jar boundaries
                const leftPosition = 25 + (index * 17) % 50; // 25% to 75% (inside jar)
                const bottomPosition = 15 + (index * 7) % 55; // 15% to 70% (inside jar body)
                
                return (
                  <TouchableOpacity
                    key={entry.id || index}
                    onPress={() => handleEntryPress(entry)}
                    style={[
                      styles.entryIconContainer,
                      {
                        left: `${leftPosition}%`,
                        bottom: `${bottomPosition}%`,
                      },
                    ]}
                  >
                    <Text style={styles.entryIcon}>
                      {getIconForType(entry.type)}
                    </Text>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>

        <View style={styles.entryCount}>
          <Text style={styles.entryCountText}>
            {entries.length} {entries.length === 1 ? "entry" : "entries"} in your jar
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write what you're feeling..."
            placeholderTextColor="#C19A6B"
            multiline
            value={entry}
            onChangeText={setEntry}
            maxLength={500}
          />
          <Text style={styles.charCount}>{entry.length}/500</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !entry.trim() && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!entry.trim()}
        >
          <BoldText style={styles.saveButtonText}>Drop in Jar 🫙</BoldText>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal to show entry details */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>
                {selectedEntry && getIconForType(selectedEntry.type)}
              </Text>
              <BoldText style={styles.modalTitle}>Your Entry</BoldText>
            </View>

            {selectedEntry && (
              <>
                <Text style={styles.modalDate}>
                  📅 {formatDate(selectedEntry.date)}
                </Text>
                <ScrollView style={styles.modalTextContainer}>
                  <Text style={styles.modalText}>{selectedEntry.text}</Text>
                </ScrollView>
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteEntry}
              >
                <Ionicons name="trash-outline" size={20} color="white" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: "#fef3e6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 26,
    marginLeft: 10,
    color: "#8B4513",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
    color: "#8B4513",
    opacity: 0.8,
  },
  jarContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 300,
    height: 300,
    marginBottom: 10,
  },
  droppingIcon: {
    position: "absolute",
    top: -50,
    zIndex: 100,
  },
  droppingIconText: {
    fontSize: 40,
  },
  entriesOverlay: {
    position: "absolute",
    width: "33%", // Match jar width
    height: "72%", // Match jar body height
    alignItems: "center",
    justifyContent: "center",
    bottom: "8%", // Align with jar bottom
  },
  emptyJarText: {
    fontSize: 14,
    color: "#C19A6B",
    fontStyle: "italic",
  },
  entryIconContainer: {
    position: "absolute",
  },
  entryIcon: {
    fontSize: 20,
  },
  entryCount: {
    backgroundColor: "#fff8f2",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ff914d",
  },
  entryCountText: {
    fontSize: 13,
    color: "#8B4513",
    fontWeight: "600",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
  },
  input: {
    minHeight: 100,
    width: "100%",
    borderColor: "#ff914d",
    borderWidth: 2,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "#fff",
    fontSize: 15,
    color: "#333",
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#ff914d",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "#CCCCCC",
    opacity: 0.6,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    width: "85%",
    maxHeight: "70%",
    backgroundColor: "#fff8f2",
    padding: 25,
    borderRadius: 20,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#ff914d",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  modalIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    color: "#8B4513",
  },
  modalDate: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    marginBottom: 15,
  },
  modalTextContainer: {
    maxHeight: 200,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 5,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  closeButton: {
    flex: 1,
    backgroundColor: "#ff914d",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});

export default Diary;