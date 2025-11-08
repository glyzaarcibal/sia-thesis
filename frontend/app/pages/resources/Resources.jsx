import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Chip, PaperProvider, Searchbar } from "react-native-paper";
import theme from "../../../components/CustomTheme";
import { useNavigation } from "@react-navigation/native";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";
import { LinearGradient } from "expo-linear-gradient";
import Octicons from "@expo/vector-icons/Octicons";

const { width } = Dimensions.get("window");

const Resources = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const resources = [
    {
      id: 1,
      category: "Family",
      title: "Take Care of Your Mind",
      description: "Essential mental health tips for families",
      image:
        "https://lafayettefamilyymca.org/wp-content/uploads/2022/01/155210504_m.jpg",
      navigateTo: "MentalHealth",
      color: "#10b981",
    },
    {
      id: 2,
      category: "Health",
      title: "Healthy mind, healthy life",
      description: "Build better mental wellness habits",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC6PUWWn6900b4PQZjIhmWcOi8HpfhnxLBiw&s",
      navigateTo: "Slider2",
      color: "#3b82f6",
    },
    {
      id: 3,
      category: "Professional",
      title: "PATHFINDER",
      description: "Professional guidance and counseling",
      image:
        "https://media.istockphoto.com/id/1383880527/vector/psychologist-counseling-a-sad-african-young-woman.jpg?s=612x612&w=0&k=20&c=d4j_RyvvfxrB3B4L0rOgF747htnfTxBD-PDLF0agopI=",
      navigateTo: "Slider3",
      color: "#8b5cf6",
    },
    {
      id: 4,
      category: "Academic",
      title: "Education saves lives",
      description: "Breaking the silence, building hope",
      image:
        "https://img.freepik.com/premium-photo/globe-world-education-logo-children-save-school-taking-care-hands-books-kids-icon_1029469-88679.jpg",
      navigateTo: "Slider4",
      color: "#f59e0b",
    },
  ];

  const categories = [
    { name: "All", icon: "apps", color: "#6b7280" },
    { name: "Health", icon: "heart-pulse", color: "#3b82f6" },
    { name: "Academic", icon: "mortar-board", color: "#f59e0b" },
    { name: "Family", icon: "people", color: "#10b981" },
    { name: "Professional", icon: "briefcase", color: "#8b5cf6" },
  ];

  // Filter Resources based on selected category and search
  const filteredResources = resources.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerSection}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Octicons name="arrow-left" size={24} color="#1f2937" />
              </TouchableOpacity>
              <BoldText style={styles.header}>Resources</BoldText>
              <View style={{ width: 40 }} />
            </View>
            <Text style={styles.subtitle}>
              Explore mental health resources and guides
            </Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search resources..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
              iconColor="#8b5cf6"
              inputStyle={{ fontFamily: "Primary" }}
              elevation={0}
            />
          </View>

          {/* Category Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chipContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                onPress={() => setSelectedCategory(category.name)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.categoryChip,
                    selectedCategory === category.name && styles.categoryChipSelected,
                    selectedCategory === category.name && {
                      backgroundColor: category.color,
                    },
                  ]}
                >
                  <Octicons
                    name={category.icon}
                    size={18}
                    color={selectedCategory === category.name ? "white" : "#6b7280"}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category.name && styles.categoryTextSelected,
                    ]}
                  >
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Results Count */}
          <View style={styles.resultsCount}>
            <Text style={styles.resultsText}>
              {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} found
            </Text>
          </View>

          {/* Resource Cards */}
          <View style={styles.cardContainer}>
            {filteredResources.length > 0 ? (
              filteredResources.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.card}
                  onPress={() => navigation.navigate(item.navigateTo)}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.cardImage} />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.7)"]}
                      style={styles.cardGradient}
                    />
                    <View style={styles.cardBadge}>
                      <Text style={styles.cardBadgeText}>{item.category}</Text>
                    </View>
                  </View>
                  <View style={styles.cardContent}>
                    <BoldText style={styles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </BoldText>
                    <Text style={styles.cardDescription} numberOfLines={2}>
                      {item.description}
                    </Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.readMore}>Read more</Text>
                      <Octicons name="chevron-right" size={16} color="#8b5cf6" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <BoldText style={styles.emptyTitle}>No resources found</BoldText>
                <Text style={styles.emptyText}>
                  Try adjusting your search or category filter
                </Text>
              </View>
            )}
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </View>
    </PaperProvider>
  );
};

export default Resources;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 28,
    color: "#1f2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  searchBar: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
  },
  chipScroll: {
    maxHeight: 60,
    backgroundColor: "#fff",
  },
  chipContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 15,
    gap: 10,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    gap: 6,
  },
  categoryChipSelected: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "600",
  },
  categoryTextSelected: {
    color: "white",
  },
  resultsCount: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  resultsText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  cardContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImageContainer: {
    position: "relative",
    width: "100%",
    height: 180,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  cardBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cardBadgeText: {
    fontSize: 12,
    color: "#1f2937",
    fontWeight: "600",
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 17,
    color: "#1f2937",
    marginBottom: 6,
    lineHeight: 24,
  },
  cardDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  readMore: {
    fontSize: 14,
    color: "#8b5cf6",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    color: "#1f2937",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  bottomSpacing: {
    height: 40,
  },
});