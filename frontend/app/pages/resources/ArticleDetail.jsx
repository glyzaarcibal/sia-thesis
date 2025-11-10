import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { default as Text } from '../../../components/CustomText';
import BoldText from '../../../components/BoldText';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';

const ArticleDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { article } = route.params;

  const handleOpenExternal = async () => {
    if (!article.url || article.url.trim() === '') {
      Alert.alert('Error', 'This article does not have a valid URL');
      return;
    }
    
    // Ensure URL has a protocol
    let formattedUrl = article.url.trim();
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
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Octicons name="arrow-left" size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          {article.type === 'external' && (
            <TouchableOpacity
              onPress={handleOpenExternal}
              style={styles.headerButton}
            >
              <MaterialIcons name="open-in-new" size={20} color="#8b5cf6" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: article.image }} style={styles.heroImage} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.heroGradient}
          />
          
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>

          {/* Type Badge */}
          {article.type && (
            <View style={[
              styles.typeBadge,
              article.type === 'external' ? styles.externalBadge : styles.internalBadge
            ]}>
              <MaterialIcons
                name={article.type === 'external' ? 'link' : 'article'}
                size={16}
                color="white"
              />
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <BoldText style={styles.title}>{article.title}</BoldText>

          {/* Metadata */}
          <View style={styles.metadata}>
            {article.readingTime && (
              <View style={styles.metadataItem}>
                <MaterialIcons name="schedule" size={16} color="#6b7280" />
                <Text style={styles.metadataText}>{article.readingTime} min read</Text>
              </View>
            )}
            {article.views > 0 && (
              <View style={styles.metadataItem}>
                <MaterialIcons name="visibility" size={16} color="#6b7280" />
                <Text style={styles.metadataText}>{article.views} views</Text>
              </View>
            )}
            {article.isVerified && (
              <View style={styles.metadataItem}>
                <MaterialIcons name="verified" size={16} color="#10b981" />
                <Text style={[styles.metadataText, styles.verifiedText]}>Verified</Text>
              </View>
            )}
          </View>

          {/* External Article Info */}
          {article.type === 'external' && (
            <View style={styles.externalInfo}>
              {article.source && (
                <View style={styles.sourceRow}>
                  <Text style={styles.sourceLabel}>Source:</Text>
                  <Text style={styles.sourceValue}>{article.source}</Text>
                </View>
              )}
              {article.author && (
                <View style={styles.sourceRow}>
                  <Text style={styles.sourceLabel}>Author:</Text>
                  <Text style={styles.sourceValue}>{article.author}</Text>
                </View>
              )}
              <TouchableOpacity
                onPress={handleOpenExternal}
                style={styles.openButton}
              >
                <Text style={styles.openButtonText}>Read Full Article</Text>
                <MaterialIcons name="open-in-new" size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Description/Content */}
          <Text style={styles.description}>{article.description}</Text>

          {/* Internal content would go here */}
          {article.type === 'internal' && article.content && (
            <View style={styles.articleContent}>
              <Text style={styles.contentText}>{article.content}</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '600',
  },
  typeBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  externalBadge: {
    backgroundColor: '#9333EA',
  },
  internalBadge: {
    backgroundColor: '#3B82F6',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    color: '#1f2937',
    lineHeight: 36,
    marginBottom: 16,
  },
  metadata: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
    color: '#6b7280',
  },
  verifiedText: {
    color: '#10b981',
    fontWeight: '600',
  },
  externalInfo: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sourceRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  sourceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 8,
    fontWeight: '600',
  },
  sourceValue: {
    fontSize: 14,
    color: '#1f2937',
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  openButtonText: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 26,
    marginBottom: 24,
  },
  articleContent: {
    marginTop: 20,
  },
  contentText: {
    fontSize: 16,
    color: '#1f2937',
    lineHeight: 28,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ArticleDetail;