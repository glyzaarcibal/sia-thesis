import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  StatusBar,
  RefreshControl
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import axiosInstance from "../../../context/axiosInstance";// Update path as needed

const ArticleManager = ({ onBack }) => {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    article_type: 'external',
    content: '',
    external_url: '',
    external_source: '',
    original_author: '',
    excerpt: '',
    category: 'mental-health',
    tags: '',
    featured_image: '',
    reading_time: 5,
    status: 'published'
  });

  useEffect(() => {
    loadArticles();
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const loadArticles = async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params = {};
      if (filterType !== 'all') params.type = filterType;
      if (filterStatus !== 'all') params.status = filterStatus;
      if (searchQuery) params.search = searchQuery;

      const response = await axiosInstance.get('/api/articles', { params });
      setArticles(response.data);
    } catch (error) {
      console.error('Failed to load articles:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to load articles. Check if server is running.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadArticles();
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    if (!formData.excerpt.trim()) {
      Alert.alert('Error', 'Please enter an excerpt');
      return;
    }

    if (formData.article_type === 'external' && !formData.external_url.trim()) {
      Alert.alert('Error', 'Please enter an external URL');
      return;
    }

    if (formData.article_type === 'internal' && !formData.content.trim()) {
      Alert.alert('Error', 'Please enter article content');
      return;
    }

    setLoading(true);

    try {
      const articleData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      // Remove unnecessary fields based on article type
      if (formData.article_type === 'external') {
        delete articleData.content;
      } else {
        delete articleData.external_url;
        delete articleData.external_source;
        delete articleData.original_author;
      }

      let response;
      if (editingArticle) {
        response = await axiosInstance.put(`/api/articles/${editingArticle._id}`, articleData);
      } else {
        response = await axiosInstance.post('/api/articles', articleData);
      }

      Alert.alert('Success', `Article ${editingArticle ? 'updated' : 'created'} successfully!`);
      setShowModal(false);
      resetForm();
      loadArticles();
    } catch (error) {
      console.error('Failed to save article:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to save article'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      article_type: article.article_type,
      content: article.content || '',
      external_url: article.external_url || '',
      external_source: article.external_source || '',
      original_author: article.original_author || '',
      excerpt: article.excerpt,
      category: article.category,
      tags: article.tags?.join(', ') || '',
      featured_image: article.featured_image || '',
      reading_time: article.reading_time || 5,
      status: article.status
    });
    setShowModal(true);
  };

  const handleDelete = async (articleId) => {
    Alert.alert(
      'Delete Article',
      'Are you sure you want to delete this article?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axiosInstance.delete(`/api/articles/${articleId}`);
              Alert.alert('Success', 'Article deleted successfully');
              loadArticles();
            } catch (error) {
              console.error('Failed to delete article:', error);
              Alert.alert(
                'Error', 
                error.response?.data?.message || 'Failed to delete article'
              );
            }
          }
        }
      ]
    );
  };

  const handleVerify = async (articleId) => {
    try {
      await axiosInstance.patch(`/api/articles/${articleId}/verify`);
      Alert.alert('Success', 'Article verified successfully');
      loadArticles();
    } catch (error) {
      console.error('Failed to verify article:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to verify article'
      );
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      article_type: 'external',
      content: '',
      external_url: '',
      external_source: '',
      original_author: '',
      excerpt: '',
      category: 'mental-health',
      tags: '',
      featured_image: '',
      reading_time: 5,
      status: 'published'
    });
    setEditingArticle(null);
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchQuery 
      ? article.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesSearch;
  });

  const openURL = async (url) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open URL');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open URL');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerBarTitle}>Article Management</Text>
          </View>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadArticles}
          >
            <MaterialIcons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Info Section */}
          <View style={styles.header}>
            <Text style={styles.headerSubtitle}>
              Manage internal content and external resource links
            </Text>
            <TouchableOpacity
              onPress={() => setShowModal(true)}
              style={styles.addButton}
            >
              <MaterialIcons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Article</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <MaterialIcons name="article" size={20} color="#3B82F6" />
                <Text style={styles.statLabel}>Internal</Text>
              </View>
              <Text style={styles.statValue}>
                {articles.filter(a => a.article_type === 'internal').length}
              </Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <MaterialIcons name="link" size={20} color="#9333EA" />
                <Text style={styles.statLabel}>External</Text>
              </View>
              <Text style={styles.statValue}>
                {articles.filter(a => a.article_type === 'external').length}
              </Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <MaterialIcons name="visibility" size={20} color="#10B981" />
                <Text style={styles.statLabel}>Views</Text>
              </View>
              <Text style={styles.statValue}>
                {articles.reduce((sum, a) => sum + (a.views || 0), 0).toLocaleString()}
              </Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <MaterialIcons name="open-in-new" size={20} color="#F97316" />
                <Text style={styles.statLabel}>Clicks</Text>
              </View>
              <Text style={styles.statValue}>
                {articles.reduce((sum, a) => sum + (a.clicks || 0), 0).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filterContainer}>
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search articles..."
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                }}
              />
            </View>
            
            <View style={styles.filterRow}>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => {
                  const types = ['all', 'internal', 'external'];
                  const currentIndex = types.indexOf(filterType);
                  const nextIndex = (currentIndex + 1) % types.length;
                  setFilterType(types[nextIndex]);
                  loadArticles();
                }}
              >
                <MaterialIcons name="filter-list" size={16} color="#374151" />
                <Text style={styles.filterButtonText}>Type: {filterType}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => {
                  const statuses = ['all', 'published', 'draft'];
                  const currentIndex = statuses.indexOf(filterStatus);
                  const nextIndex = (currentIndex + 1) % statuses.length;
                  setFilterStatus(statuses[nextIndex]);
                  loadArticles();
                }}
              >
                <MaterialIcons name="list" size={16} color="#374151" />
                <Text style={styles.filterButtonText}>Status: {filterStatus}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Articles List */}
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366F1" />
              <Text style={styles.loadingText}>Loading articles...</Text>
            </View>
          ) : (
            <View style={styles.articlesList}>
              {filteredArticles.map(article => (
                <View key={article._id} style={styles.articleCard}>
                  <View style={styles.articleHeader}>
                    <View style={styles.articleTitleRow}>
                      <MaterialIcons 
                        name={article.article_type === 'external' ? 'link' : 'article'} 
                        size={20} 
                        color={article.article_type === 'external' ? '#9333EA' : '#3B82F6'} 
                      />
                      <Text style={styles.articleTitle} numberOfLines={2}>
                        {article.title}
                      </Text>
                    </View>
                    
                    <View style={styles.badgeRow}>
                      <View style={[
                        styles.badge,
                        article.status === 'published' ? styles.badgeGreen :
                        article.status === 'draft' ? styles.badgeYellow :
                        styles.badgeGray
                      ]}>
                        <Text style={styles.badgeText}>{article.status}</Text>
                      </View>
                      
                      {article.article_type === 'external' && article.is_verified && (
                        <View style={[styles.badge, styles.badgeBlue]}>
                          <MaterialIcons name="verified" size={12} color="#2563EB" />
                          <Text style={styles.badgeText}>Verified</Text>
                        </View>
                      )}
                      
                      {article.article_type === 'external' && !article.is_verified && (
                        <View style={[styles.badge, styles.badgeOrange]}>
                          <Text style={styles.badgeText}>Needs Verification</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <Text style={styles.articleExcerpt} numberOfLines={2}>
                    {article.excerpt}
                  </Text>

                  {article.article_type === 'external' && (
                    <View style={styles.externalInfo}>
                      <Text style={styles.externalLabel}>External Source:</Text>
                      <TouchableOpacity onPress={() => openURL(article.external_url)}>
                        <View style={styles.externalLinkRow}>
                          <Text style={styles.externalLink}>
                            {article.external_source || article.external_url}
                          </Text>
                          <MaterialIcons name="open-in-new" size={14} color="#9333EA" />
                        </View>
                      </TouchableOpacity>
                      {article.original_author && (
                        <Text style={styles.externalAuthor}>By: {article.original_author}</Text>
                      )}
                    </View>
                  )}

                  <View style={styles.articleStats}>
                    <View style={styles.statItem}>
                      <MaterialIcons name="visibility" size={16} color="#6B7280" />
                      <Text style={styles.statItemText}>{article.views || 0} views</Text>
                    </View>
                    {article.article_type === 'external' && (
                      <View style={styles.statItem}>
                        <MaterialIcons name="open-in-new" size={16} color="#6B7280" />
                        <Text style={styles.statItemText}>{article.clicks || 0} clicks</Text>
                      </View>
                    )}
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{article.category}</Text>
                    </View>
                  </View>

                  <View style={styles.articleActions}>
                    {article.article_type === 'external' && !article.is_verified && (
                      <TouchableOpacity
                        onPress={() => handleVerify(article._id)}
                        style={styles.actionButton}
                      >
                        <MaterialIcons name="check-circle" size={20} color="#2563EB" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => handleEdit(article)}
                      style={styles.actionButton}
                    >
                      <MaterialIcons name="edit" size={20} color="#6366F1" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(article._id)}
                      style={styles.actionButton}
                    >
                      <MaterialIcons name="delete" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              {filteredArticles.length === 0 && (
                <View style={styles.emptyState}>
                  <MaterialIcons name="article" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyText}>No articles found</Text>
                  <Text style={styles.emptySubtext}>
                    {searchQuery ? 'Try adjusting your search or filters' : 'Create your first article to get started'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Modal */}
        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            setShowModal(false);
            resetForm();
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingArticle ? 'Edit Article' : 'Add New Article'}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  <MaterialIcons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Article Type */}
                <Text style={styles.label}>Article Type</Text>
                <View style={styles.typeButtons}>
                  <TouchableOpacity
                    onPress={() => handleInputChange('article_type', 'internal')}
                    style={[
                      styles.typeButton,
                      formData.article_type === 'internal' && styles.typeButtonActive
                    ]}
                  >
                    <MaterialIcons
                      name="article"
                      size={24}
                      color={formData.article_type === 'internal' ? '#3B82F6' : '#9CA3AF'}
                    />
                    <Text style={styles.typeButtonTitle}>Internal Content</Text>
                    <Text style={styles.typeButtonSubtitle}>Written in platform</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleInputChange('article_type', 'external')}
                    style={[
                      styles.typeButton,
                      formData.article_type === 'external' && styles.typeButtonActive
                    ]}
                  >
                    <MaterialIcons
                      name="link"
                      size={24}
                      color={formData.article_type === 'external' ? '#9333EA' : '#9CA3AF'}
                    />
                    <Text style={styles.typeButtonTitle}>External Link</Text>
                    <Text style={styles.typeButtonSubtitle}>Link to website</Text>
                  </TouchableOpacity>
                </View>

                {/* Title */}
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(value) => handleInputChange('title', value)}
                  placeholder="Enter article title"
                />

                {/* External URL */}
                {formData.article_type === 'external' && (
                  <View>
                    <Text style={styles.label}>External URL *</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.external_url}
                      onChangeText={(value) => handleInputChange('external_url', value)}
                      placeholder="https://example.com/article"
                      keyboardType="url"
                      autoCapitalize="none"
                    />

                    <Text style={styles.label}>Source</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.external_source}
                      onChangeText={(value) => handleInputChange('external_source', value)}
                      placeholder="e.g., Psychology Today"
                    />

                    <Text style={styles.label}>Original Author</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.original_author}
                      onChangeText={(value) => handleInputChange('original_author', value)}
                      placeholder="Author name"
                    />
                  </View>
                )}

                {/* Content */}
                {formData.article_type === 'internal' && (
                  <View>
                    <Text style={styles.label}>Content *</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={formData.content}
                      onChangeText={(value) => handleInputChange('content', value)}
                      placeholder="Write your article content here..."
                      multiline
                      numberOfLines={8}
                    />
                  </View>
                )}

                {/* Excerpt */}
                <Text style={styles.label}>Excerpt *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.excerpt}
                  onChangeText={(value) => handleInputChange('excerpt', value)}
                  placeholder="Brief description..."
                  multiline
                  numberOfLines={3}
                  maxLength={300}
                />
                <Text style={styles.characterCount}>{formData.excerpt.length}/300 characters</Text>

                {/* Category */}
                <Text style={styles.label}>Category *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.category}
                  onChangeText={(value) => handleInputChange('category', value)}
                  placeholder="mental-health"
                />

                {/* Reading Time */}
                <Text style={styles.label}>Reading Time (minutes)</Text>
                <TextInput
                  style={styles.input}
                  value={String(formData.reading_time)}
                  onChangeText={(value) => handleInputChange('reading_time', parseInt(value) || 5)}
                  keyboardType="number-pad"
                />

                {/* Tags */}
                <Text style={styles.label}>Tags (comma-separated)</Text>
                <TextInput
                  style={styles.input}
                  value={formData.tags}
                  onChangeText={(value) => handleInputChange('tags', value)}
                  placeholder="anxiety, mental-health, coping"
                />

                {/* Status */}
                <Text style={styles.label}>Status</Text>
                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    onPress={() => handleInputChange('status', 'published')}
                    style={[
                      styles.statusButton,
                      formData.status === 'published' && styles.statusButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData.status === 'published' && styles.statusButtonTextActive
                    ]}>Published</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleInputChange('status', 'draft')}
                    style={[
                      styles.statusButton,
                      formData.status === 'draft' && styles.statusButtonActive
                    ]}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData.status === 'draft' && styles.statusButtonTextActive
                    ]}>Draft</Text>
                  </TouchableOpacity>
                </View>

                {/* Actions */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={loading}
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                        {editingArticle ? 'Update Article' : 'Create Article'}
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#6366F1',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerBar: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  refreshButton: {
    marginLeft: 12,
    padding: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerBarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  filterContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  searchInput: {
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  loadingContainer: {
    padding: 48,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  articlesList: {
    padding: 16,
  },
  articleCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  articleHeader: {
    marginBottom: 12,
  },
  articleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  articleTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeGreen: {
    backgroundColor: '#D1FAE5',
  },
  badgeYellow: {
    backgroundColor: '#FEF3C7',
  },
  badgeGray: {
    backgroundColor: '#F3F4F6',
  },
  badgeBlue: {
    backgroundColor: '#DBEAFE',
  },
  badgeOrange: {
    backgroundColor: '#FFEDD5',
  },
  badgeText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '600',
  },
  articleExcerpt: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  externalInfo: {
    backgroundColor: '#F5F3FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  externalLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  externalLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  externalLink: {
    fontSize: 13,
    color: '#9333EA',
    fontWeight: '500',
  },
  externalAuthor: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  articleStats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statItemText: {
    fontSize: 13,
    color: '#6B7280',
  },
  categoryBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 11,
    color: '#374151',
  },
  articleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 4,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    borderColor: '#6366F1',
    backgroundColor: '#EEF2FF',
  },
  typeButtonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
  },
  typeButtonSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 8,
    textAlign: 'right',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statusButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  modalActions: {
    marginTop: 24,
    gap: 12,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#6366F1',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ArticleManager;