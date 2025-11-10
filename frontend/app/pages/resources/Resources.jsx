import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Linking,
  Alert,
  RefreshControl,
} from "react-native";
import { Chip, PaperProvider, Searchbar } from "react-native-paper";
import theme from "../../../components/CustomTheme";
import { useNavigation } from "@react-navigation/native";
import { default as Text } from "../../../components/CustomText";
import BoldText from "../../../components/BoldText";
import { LinearGradient } from "expo-linear-gradient";
import Octicons from "@expo/vector-icons/Octicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axiosInstance from "../../../context/axiosInstance";

const { width } = Dimensions.get("window");

const Resources = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Static resources (keep these as fallback or additional content)
  const staticResources = [
    {
      id: "static-1",
      category: "Family",
      title: "Take Care of Your Mind",
      description: "Essential mental health tips for families",
      image:
        "https://lafayettefamilyymca.org/wp-content/uploads/2022/01/155210504_m.jpg",
      navigateTo: "MentalHealth",
      color: "#10b981",
      type: "internal",
    },
    {
      id: "static-2",
      category: "Health",
      title: "Healthy mind, healthy life",
      description: "Build better mental wellness habits",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSC6PUWWn6900b4PQZjIhmWcOi8HpfhnxLBiw&s",
      navigateTo: "Slider2",
      color: "#3b82f6",
      type: "internal",
    },
    {
      id: "static-3",
      category: "Professional",
      title: "PATHFINDER",
      description: "Professional guidance and counseling",
      image:
        "https://media.istockphoto.com/id/1383880527/vector/psychologist-counseling-a-sad-african-young-woman.jpg?s=612x612&w=0&k=20&c=d4j_RyvvfxrB3B4L0rOgF747htnfTxBD-PDLF0agopI=",
      navigateTo: "Slider3",
      color: "#8b5cf6",
      type: "internal",
    },
    {
      id: "static-4",
      category: "Academic",
      title: "Education saves lives",
      description: "Breaking the silence, building hope",
      image:
        "https://img.freepik.com/premium-photo/globe-world-education-logo-children-save-school-taking-care-hands-books-kids-icon_1029469-88679.jpg",
      navigateTo: "Slider4",
      color: "#f59e0b",
      type: "internal",
    },
  ];

  const categories = [
    { name: "All", icon: "apps", color: "#6b7280" },
    { name: "mental-health", icon: "heart-pulse", color: "#3b82f6", display: "Mental Health" },
    { name: "wellness", icon: "light-bulb", color: "#10b981", display: "Wellness" },
    { name: "therapy", icon: "briefcase", color: "#8b5cf6", display: "Therapy" },
    { name: "self-care", icon: "person", color: "#f59e0b", display: "Self Care" },
  ];

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/articles', {
        params: {
          status: 'published'
        }
      });
      
      // Transform articles to match resource format
      const transformedArticles = response.data.map(article => ({
        id: article._id,
        category: article.category,
        title: article.title,
        description: article.excerpt,
        image: article.featured_image || getDefaultImage(article.category),
        color: getCategoryColor(article.category),
        type: article.article_type,
        url: article.external_url,
        source: article.external_source,
        author: article.original_author,
        readingTime: article.reading_time,
        isVerified: article.is_verified,
        views: article.views || 0,
        clicks: article.clicks || 0,
      }));

      setArticles(transformedArticles);
    } catch (error) {
      console.error('Failed to load articles:', error);
      Alert.alert('Error', 'Failed to load articles. Using cached content.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadArticles();
  };

  const getDefaultImage = (category) => {
    const defaults = {
      'mental-health': 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800',
      'wellness': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      'therapy': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800',
      'self-care': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
    };
    return defaults[category] || 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800';
  };

  const getCategoryColor = (category) => {
    const colors = {
      'mental-health': '#3b82f6',
      'wellness': '#10b981',
      'therapy': '#8b5cf6',
      'self-care': '#f59e0b',
    };
    return colors[category] || '#6b7280';
  };

  const handleArticlePress = async (article) => {
  // Increment views first
  try {
    await axiosInstance.patch(`/api/articles/${article.id}/increment-views`);
    console.log('✅ Response: 200 /api/articles/' + article.id + '/increment-views');
  } catch (error) {
    console.error('Failed to increment views:', error);
  }

  if (article.type === 'external') {
    // Increment clicks for external articles
    try {
      await axiosInstance.patch(`/api/articles/${article.id}/increment-clicks`);
      console.log('✅ Response: 200 /api/articles/' + article.id + '/increment-clicks');
    } catch (error) {
      console.error('Failed to increment clicks:', error);
    }

    // Validate and open external URL
    const url = article.url;
    
    if (!url || url.trim() === '') {
      Alert.alert('Error', 'This article does not have a valid URL');
      return;
    }

    // Ensure URL has a protocol
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    try {
      const canOpen = await Linking.canOpenURL(formattedUrl);
      if (canOpen) {
        await Linking.openURL(formattedUrl);
      } else {
        Alert.alert('Error', 'Cannot open this URL: ' + formattedUrl);
      }
    } catch (error) {
      console.error('Linking error:', error);
      Alert.alert('Error', 'Failed to open the link. Please check the URL format.');
    }
  } else if (article.navigateTo) {
    // Navigate to internal screen (for static resources like MentalHealth, Slider2, etc.)
    navigation.navigate(article.navigateTo);
  } else {
    // Navigate to article detail screen for internal articles
    navigation.navigate('ArticleDetail', { article });
  }
};

  // Combine static resources with dynamic articles
  const allResources = [...staticResources, ...articles];

  // Filter Resources based on selected category and search
  const filteredResources = allResources.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#8b5cf6']}
              tintColor="#8b5cf6"
            />
          }
        >
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
              <TouchableOpacity
                onPress={onRefresh}
                style={styles.backButton}
              >
                <MaterialIcons name="refresh" size={24} color="#1f2937" />
              </TouchableOpacity>
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
                    {category.display || category.name}
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

          {/* Loading State */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#8b5cf6" />
              <Text style={styles.loadingText}>Loading resources...</Text>
            </View>
          ) : (
            /* Resource Cards */
            <View style={styles.cardContainer}>
              {filteredResources.length > 0 ? (
                filteredResources.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.card}
                    onPress={() => handleArticlePress(item)}
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
                      
                      {/* Article Type Badge */}
                      {item.type && (
                        <View style={[styles.typeBadge, item.type === 'external' ? styles.externalBadge : styles.internalBadge]}>
                          <MaterialIcons 
                            name={item.type === 'external' ? 'link' : 'article'} 
                            size={12} 
                            color="white" 
                          />
                        </View>
                      )}

                      {/* Verified Badge for External Articles */}
                      {item.type === 'external' && item.isVerified && (
                        <View style={styles.verifiedBadge}>
                          <MaterialIcons name="verified" size={16} color="#10b981" />
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.cardContent}>
                      <BoldText style={styles.cardTitle} numberOfLines={2}>
                        {item.title}
                      </BoldText>
                      <Text style={styles.cardDescription} numberOfLines={2}>
                        {item.description}
                      </Text>

                      {/* Article Metadata */}
                      {item.type && (
                        <View style={styles.metadata}>
                          {item.readingTime && (
                            <View style={styles.metadataItem}>
                              <MaterialIcons name="schedule" size={14} color="#6b7280" />
                              <Text style={styles.metadataText}>{item.readingTime} min</Text>
                            </View>
                          )}
                          {item.views > 0 && (
                            <View style={styles.metadataItem}>
                              <MaterialIcons name="visibility" size={14} color="#6b7280" />
                              <Text style={styles.metadataText}>{item.views}</Text>
                            </View>
                          )}
                          {item.type === 'external' && item.source && (
                            <View style={styles.metadataItem}>
                              <Text style={styles.sourceText}>{item.source}</Text>
                            </View>
                          )}
                        </View>
                      )}

                      <View style={styles.cardFooter}>
                        <Text style={styles.readMore}>
                          {item.type === 'external' ? 'Visit source' : 'Read more'}
                        </Text>
                        <MaterialIcons 
                          name={item.type === 'external' ? 'open-in-new' : 'chevron-right'} 
                          size={16} 
                          color="#8b5cf6" 
                        />
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
          )}

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
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
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
  typeBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  externalBadge: {
    backgroundColor: '#9333EA',
  },
  internalBadge: {
    backgroundColor: '#3B82F6',
  },
  verifiedBadge: {
    position: "absolute",
    bottom: 12,
    left: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metadataText: {
    fontSize: 12,
    color: '#6b7280',
  },
  sourceText: {
    fontSize: 11,
    color: '#9333EA',
    fontWeight: '600',
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