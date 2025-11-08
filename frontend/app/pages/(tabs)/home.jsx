import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import React from "react";
import background from "../../../assets/images/bg/abstract2.png";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";

import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import logo from "../../../assets/images/vera.png";

//Sizing
import { rem } from "../../../components/stylings/responsiveSize";

//Customs
import PortraitTile from "../../../components/tiles/PortraitTile";
import CustomTheme from "../../../components/CustomTheme";

//Paper
import {
  ActivityIndicator,
  Button,
  PaperProvider,
  Dialog,
  Portal,
} from "react-native-paper";

//Icons
import Octicons from "@expo/vector-icons/Octicons";
import SoundButton from "../../../components/SoundButton";

import { useAuth } from "../../../context/AuthContext";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");
const TILE_WIDTH = width * 0.4; // 40% of screen width
const TILE_SPACING = 15;

const Home = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  console.log('User first_name:', user?.first_name);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const { user } = useAuth();
  const authState = useSelector((state) => state.auth.auth);

  // Resources data matching your Resources.jsx
  const resources = [
    {
      id: 1,
      category: "Family",
      title: "Take Care of Your Mind",
      image: "https://lafayettefamilyymca.org/wp-content/uploads/2022/01/155210504_m.jpg",
      navigateTo: "MentalHealth",
    },
    {
      id: 2,
      category: "Health",
      title: "Healthy mind, healthy life",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC6PUWWn6900b4PQZjIhmWcOi8HpfhnxLBiw&s",
      navigateTo: "Slider2",
    },
    {
      id: 3,
      category: "Professional",
      title: "PATHFINDER",
      image: "https://media.istockphoto.com/id/1383880527/vector/psychologist-counseling-a-sad-african-young-woman.jpg?s=612x612&w=0&k=20&c=d4j_RyvvfxrB3B4L0rOgF747htnfTxBD-PDLF0agopI=",
      navigateTo: "Slider3",
    },
    {
      id: 4,
      category: "Academic",
      title: "Education saves lives by breaking the silence and building hope.",
      image: "https://img.freepik.com/premium-photo/globe-world-education-logo-children-save-school-taking-care-hands-books-kids-icon_1029469-88679.jpg",
      navigateTo: "Slider4",
    },
  ];

  return (
    <PaperProvider theme={CustomTheme}>
      {!(user.username === "") ? (
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image source={logo} style={styles.logo} />
              </View>
              <View style={styles.headerActions}>
                
                <TouchableOpacity
                  onPress={() => navigation.navigate("Settings")}
                  style={styles.settingsButton}
                >
                  <Octicons name="gear" size={22} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.username}>
                {user?.first_name || user?.username || 'User'}! 👋
              </Text>
              <Text style={styles.subtitle}>
                Let's check in on your emotional wellness
              </Text>
            </View>

            {/* Main Feature Card */}
            <View style={styles.mainCard}>
              <Image source={background} style={styles.cardBackground} />
              <View style={styles.cardOverlay}>
                <View style={styles.cardContent}>
                  <View style={styles.iconContainer}>
                    <View style={styles.microphoneIcon}>
                      <View style={styles.micTop} />
                      <View style={styles.micBody} />
                      <View style={styles.micBase} />
                    </View>
                  </View>
                  <BoldText style={styles.cardTitle}>
                    Discover Your Path
                  </BoldText>
                  <Text style={styles.cardSubtitle}>
                    Voice Emotion Recognition Analysis with AI-powered insights
                  </Text>
                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => {
                      if (authState.isLoggedIn) {
                        navigation.navigate("Conditions");
                      } else {
                        navigation.navigate("Login");
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#8b5cf6", "#7c3aed"]}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>Start Analysis</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Mood Tracker Card */}
            <TouchableOpacity
              style={styles.moodCard}
              onPress={() => navigation.navigate("MoodTrackerScreen")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#a78bfa", "#8b5cf6"]}
                style={styles.moodGradient}
              >
                <View style={styles.moodContent}>
                  <View style={styles.moodIconContainer}>
                    <Text style={styles.moodEmoji}>😊</Text>
                  </View>
                  <View style={styles.moodTextContainer}>
                    <BoldText style={styles.moodTitle}>
                      Daily Mood Check
                    </BoldText>
                    <Text style={styles.moodSubtitle}>
                      How are you feeling today?
                    </Text>
                  </View>
                  <View style={styles.moodArrow}>
                    <Octicons name="chevron-right" size={24} color="#fff" />
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Quick Actions Section */}
            <View style={styles.sectionHeader}>
              <BoldText style={styles.sectionTitle}>Quick Actions</BoldText>
              <TouchableOpacity>
                <Text style={styles.seeMore}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.actionCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("ChatBot")}
              >
                <View style={[styles.actionIcon, { backgroundColor: "#ddd6fe" }]}>
                  <Text style={styles.actionEmoji}>💬</Text>
                </View>
                <Text style={styles.actionText}>AI Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("BreathingExercise")}
              >
                <View style={[styles.actionIcon, { backgroundColor: "#fce7f3" }]}>
                  <Text style={styles.actionEmoji}>🧘</Text>
                </View>
                <Text style={styles.actionText}>Breathe</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Diary")}
              >
                <View style={[styles.actionIcon, { backgroundColor: "#fed7aa" }]}>
                  <Text style={styles.actionEmoji}>📔</Text>
                </View>
                <Text style={styles.actionText}>Journal</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.actionCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("SleepTracker")}
              >
                <View style={[styles.actionIcon, { backgroundColor: "#bfdbfe" }]}>
                  <Text style={styles.actionEmoji}>🌙</Text>
                </View>
                <Text style={styles.actionText}>Sleep</Text>
              </TouchableOpacity> */}
            </View>

            {/* Resources Section */}
            <View style={styles.sectionHeader}>
              <BoldText style={styles.sectionTitle}>Resources</BoldText>
              <TouchableOpacity onPress={() => navigation.navigate("Resources")}>
                <Text style={styles.seeMore}>See more</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              style={styles.resourcesScroll}
              decelerationRate="fast"
              snapToInterval={TILE_WIDTH + TILE_SPACING}
              snapToAlignment="start"
            >
              {resources.map((resource) => (
                <TouchableOpacity
                  key={resource.id}
                  style={styles.resourceCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate(resource.navigateTo)}
                >
                  <Image
                    source={{ uri: resource.image }}
                    style={styles.resourceImage}
                  />
                  <View style={styles.resourceContent}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{resource.category}</Text>
                    </View>
                    <Text style={styles.resourceTitle} numberOfLines={2}>
                      {resource.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Info Cards */}
            <View style={styles.infoSection}>
              <View style={styles.infoCard}>
                <Text style={styles.infoEmoji}>🎯</Text>
                <BoldText style={styles.infoTitle}>Your Wellness</BoldText>
                <Text style={styles.infoText}>
                  Track emotions, sleep, and mood patterns
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoEmoji}>💜</Text>
                <BoldText style={styles.infoTitle}>Safe Space</BoldText>
                <Text style={styles.infoText}>
                  Private, secure, and judgment-free
                </Text>
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </ScrollView>
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      )}

      <Portal>
        <Dialog
          style={styles.dialog}
          visible={visible}
          onDismiss={hideDialog}
        >
          <Dialog.Title>Login Required</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Please log in to access the emotion analysis feature.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 50,
    resizeMode: "contain",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  greeting: {
    fontSize: 16,
    color: "#6b7280",
  },
  username: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
  },
  mainCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 24,
    height: 280,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardOverlay: {
    flex: 1,
    backgroundColor: "rgba(139, 92, 246, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  cardContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  microphoneIcon: {
    alignItems: "center",
  },
  micTop: {
    width: 20,
    height: 25,
    borderWidth: 3,
    borderColor: "white",
    borderRadius: 10,
    marginBottom: 3,
  },
  micBody: {
    width: 3,
    height: 10,
    backgroundColor: "white",
  },
  micBase: {
    width: 18,
    height: 3,
    backgroundColor: "white",
    borderRadius: 2,
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 20,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingHorizontal: 40,
    paddingVertical: 14,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  moodCard: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#8b5cf6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  moodGradient: {
    padding: 20,
  },
  moodContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  moodIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  moodEmoji: {
    fontSize: 28,
  },
  moodTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  moodTitle: {
    fontSize: 17,
    color: "white",
    marginBottom: 4,
  },
  moodSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
  },
  moodArrow: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 19,
    color: "#1f2937",
  },
  seeMore: {
    fontSize: 14,
    color: "#8b5cf6",
    fontWeight: "500",
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 30,
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionEmoji: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 12,
    color: "#4b5563",
    fontWeight: "500",
  },
  resourcesScroll: {
    marginBottom: 25,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  resourceCard: {
    width: TILE_WIDTH,
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resourceImage: {
    width: "100%",
    height: TILE_WIDTH * 1.2,
    resizeMode: "cover",
  },
  resourceContent: {
    padding: 12,
  },
  categoryBadge: {
    backgroundColor: "#ddd6fe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    color: "#7c3aed",
    fontWeight: "600",
  },
  resourceTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
    lineHeight: 18,
  },
  infoSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 15,
    color: "#1f2937",
    marginBottom: 6,
    textAlign: "center",
  },
  infoText: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 18,
  },
  bottomSpacing: {
    height: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  dialog: {
    backgroundColor: "white",
  },
});

export default Home;