import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Switch,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const AdminDashboard = ({ navigation }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPsychologists: 0,
    pendingPsychologists: 0,
    activeUsers: 0
  });

  useEffect(() => {
    setStats({
      totalUsers: 1247,
      totalPsychologists: 32,
      pendingPsychologists: 5,
      activeUsers: 834
    });
  }, []);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'users', label: 'Users', icon: 'people' },
    { id: 'psychologists', label: 'Verify', icon: 'verified-user' },
    { id: 'content', label: 'Content', icon: 'article' },
    { id: 'crisis', label: 'Crisis', icon: 'warning' },
    { id: 'analytics', label: 'Analytics', icon: 'trending-up' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView stats={stats} />;
      case 'users':
        return <UserManagement />;
      case 'psychologists':
        return <PsychologistVerification />;
      case 'content':
        return <ContentManagement />;
      case 'crisis':
        return <CrisisMonitoring />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <DashboardView stats={stats} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <MaterialIcons name="admin-panel-settings" size={28} color="white" />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Admin Panel</Text>
              <Text style={styles.headerSubtitle}>Mental Health Platform</Text>
            </View>
          </View>
        </View>

        {/* Navigation Tabs */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {navigationItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => setActiveTab(item.id)}
              style={[
                styles.tab,
                activeTab === item.id && styles.tabActive
              ]}
            >
              <MaterialIcons 
                name={item.icon}
                color={activeTab === item.id ? '#6366F1' : '#6B7280'} 
                size={20} 
              />
              <Text style={[
                styles.tabText,
                activeTab === item.id && styles.tabTextActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content */}
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {renderContent()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const DashboardView = ({ stats }) => {
  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: 'people', color: '#3B82F6', trend: '+12%' },
    { label: 'Active Users', value: stats.activeUsers, icon: 'trending-up', color: '#10B981', trend: '+8%' },
    { label: 'Psychologists', value: stats.totalPsychologists, icon: 'verified-user', color: '#8B5CF6', trend: '+3' },
    { label: 'Pending', value: stats.pendingPsychologists, icon: 'schedule', color: '#F59E0B', trend: '5 new' }
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Dashboard Overview</Text>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {statCards.map((stat, idx) => (
          <View key={idx} style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <MaterialIcons name={stat.icon} color={stat.color} size={24} />
              </View>
              <View style={styles.trendBadge}>
                <MaterialIcons name="trending-up" color="#10B981" size={14} />
                <Text style={styles.trendText}>{stat.trend}</Text>
              </View>
            </View>
            <Text style={styles.statValue}>{stat.value.toLocaleString()}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionSubtitle}>Recent Registrations</Text>
        <View style={styles.card}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.listItem}>
              <View style={styles.listItemLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>U{i}</Text>
                </View>
                <View style={styles.listItemInfo}>
                  <Text style={styles.listItemTitle}>User {i}</Text>
                  <Text style={styles.listItemSubtitle}>{i} hours ago</Text>
                </View>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>Active</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Crisis Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionSubtitle}>Crisis Alerts</Text>
        <View style={styles.alertCard}>
          <View style={styles.alertHeader}>
            <MaterialIcons name="warning" color="#DC2626" size={20} />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>High-risk keyword detected</Text>
              <Text style={styles.alertSubtitle}>User diary - 15 mins ago</Text>
              <TouchableOpacity>
                <Text style={styles.alertAction}>Review Now →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View>
      <Text style={styles.sectionTitle}>User Management</Text>

      {/* Search */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" color="#9CA3AF" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Users List */}
      <View style={styles.card}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} style={styles.userItem}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>JD</Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>John Doe {i}</Text>
                <Text style={styles.userEmail}>john{i}@email.com</Text>
                <View style={styles.userMeta}>
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>User</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.userActions}>
              <TouchableOpacity style={styles.actionBtn}>
                <MaterialIcons name="visibility" size={18} color="#6366F1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <MaterialIcons name="edit" size={18} color="#6366F1" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const PsychologistVerification = () => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Psychologist Verification</Text>

      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.card}>
          <View style={styles.psychHeader}>
            <View style={styles.psychAvatar}>
              <Text style={styles.psychAvatarText}>DR</Text>
            </View>
            <View style={styles.psychInfo}>
              <Text style={styles.psychName}>Dr. Sarah Johnson {i}</Text>
              <Text style={styles.psychEmail}>sarah{i}@psych.com</Text>
            </View>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>Pending</Text>
            </View>
          </View>

          <View style={styles.credentialsBox}>
            <Text style={styles.credentialsLabel}>License: </Text>
            <Text style={styles.credentialsText}>PSY-{12345 + i}</Text>
          </View>

          <View style={styles.verifyActions}>
            <TouchableOpacity style={styles.approveBtn}>
              <MaterialIcons name="check-circle" color="#fff" size={18} />
              <Text style={styles.approveBtnText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn}>
              <MaterialIcons name="cancel" color="#fff" size={18} />
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

const ContentManagement = () => {
  const contentTypes = [
    { id: 'articles', label: 'Articles', icon: 'article', count: 45 },
    { id: 'games', label: 'Games', icon: 'games', count: 12 },
    { id: 'quiz', label: 'Quiz', icon: 'quiz', count: 78 },
    { id: 'resources', label: 'Resources', icon: 'library-books', count: 24 }
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Content Management</Text>

      <View style={styles.contentGrid}>
        {contentTypes.map((type) => (
          <TouchableOpacity key={type.id} style={styles.contentCard}>
            <MaterialIcons name={type.icon} color="#6366F1" size={32} />
            <Text style={styles.contentCount}>{type.count}</Text>
            <Text style={styles.contentLabel}>{type.label}</Text>
            <Text style={styles.contentAction}>Manage →</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const CrisisMonitoring = () => {
  return (
    <View>
      <Text style={styles.sectionTitle}>Crisis Monitoring</Text>

      <View style={styles.statsRow}>
        <View style={styles.miniStatCard}>
          <MaterialIcons name="warning" color="#DC2626" size={24} />
          <Text style={styles.miniStatValue}>3</Text>
          <Text style={styles.miniStatLabel}>Active</Text>
        </View>
        <View style={styles.miniStatCard}>
          <MaterialIcons name="schedule" color="#F59E0B" size={24} />
          <Text style={styles.miniStatValue}>7</Text>
          <Text style={styles.miniStatLabel}>Review</Text>
        </View>
        <View style={styles.miniStatCard}>
          <MaterialIcons name="check-circle" color="#10B981" size={24} />
          <Text style={styles.miniStatValue}>24</Text>
          <Text style={styles.miniStatLabel}>Resolved</Text>
        </View>
      </View>

      <Text style={styles.sectionSubtitle}>Flagged Content</Text>
      {[
        { severity: 'HIGH', keyword: 'self-harm', user: 'User #4234', time: '5m ago' },
        { severity: 'HIGH', keyword: 'suicide', user: 'User #8891', time: '12m ago' }
      ].map((alert, idx) => (
        <View key={idx} style={styles.alertCard}>
          <View style={styles.alertBadge}>
            <Text style={styles.alertBadgeText}>{alert.severity}</Text>
          </View>
          <Text style={styles.alertKeyword}>"{alert.keyword}"</Text>
          <Text style={styles.alertDetails}>{alert.user} • {alert.time}</Text>
          <TouchableOpacity style={styles.alertActionBtn}>
            <Text style={styles.alertActionBtnText}>Take Action</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const AnalyticsView = () => {
  const features = [
    { name: 'Counseling Quiz', usage: 78, color: '#3B82F6' },
    { name: 'Breathing', usage: 92, color: '#10B981' },
    { name: 'Diary', usage: 65, color: '#8B5CF6' },
    { name: 'Games', usage: 54, color: '#F59E0B' }
  ];

  return (
    <View>
      <Text style={styles.sectionTitle}>Analytics</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Feature Engagement</Text>
        {features.map((feature, idx) => (
          <View key={idx} style={styles.featureItem}>
            <View style={styles.featureHeader}>
              <Text style={styles.featureName}>{feature.name}</Text>
              <Text style={styles.featureUsage}>{feature.usage}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${feature.usage}%`, backgroundColor: feature.color }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const SystemSettings = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <View>
      <Text style={styles.sectionTitle}>System Settings</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Platform Settings</Text>

        <View style={styles.toggleItem}>
          <View style={styles.toggleInfo}>
            <Text style={styles.toggleLabel}>Maintenance Mode</Text>
            <Text style={styles.toggleDescription}>Disable user access</Text>
          </View>
          <Switch 
            value={maintenanceMode} 
            onValueChange={setMaintenanceMode}
            trackColor={{ false: '#D1D5DB', true: '#DC2626' }}
            thumbColor="#fff"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Session Timeout (min)</Text>
          <TextInput
            style={styles.input}
            defaultValue="30"
            keyboardType="number-pad"
          />
        </View>

        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  header: {
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    maxHeight: 56,
  },
  tabsContent: {
    paddingHorizontal: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6366F1',
  },
  tabText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#6366F1',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginTop: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: isMobile ? '45%' : 150,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  listItemInfo: {
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#818CF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  listItemSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    color: '#047857',
    fontWeight: '600',
  },
  alertCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    padding: 12,
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C2D12',
    marginBottom: 4,
  },
  alertSubtitle: {
    fontSize: 12,
    color: '#991B1B',
    marginBottom: 8,
  },
  alertAction: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 16,
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
    backgroundColor: '#fff',
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  roleBadgeText: {
    fontSize: 10,
    color: '#1E40AF',
    fontWeight: '600',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  psychHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  psychAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#C084FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  psychAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  psychInfo: {
    flex: 1,
  },
  psychName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  psychEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadgeText: {
    fontSize: 10,
    color: '#92400E',
    fontWeight: '600',
  },
  credentialsBox: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  credentialsLabel: {
    fontWeight: '600',
    fontSize: 12,
    color: '#374151',
  },
  credentialsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  verifyActions: {
    flexDirection: 'row',
    gap: 8,
  },
  approveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 8,
  },
  approveBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  rejectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    borderRadius: 8,
  },
  rejectBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  contentCard: {
    flex: 1,
    minWidth: isMobile ? '45%' : 150,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  contentCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  contentLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 8,
  },
  contentAction: {
    fontSize: 11,
    color: '#6366F1',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  miniStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 8,
  },
  miniStatLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  alertBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  alertBadgeText: {
    fontSize: 9,
    color: '#fff',
    fontWeight: 'bold',
  },
  alertKeyword: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C2D12',
    marginBottom: 4,
  },
  alertDetails: {
    fontSize: 12,
    color: '#991B1B',
    marginBottom: 8,
  },
  alertActionBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  alertActionBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  featureItem: {
    marginBottom: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  featureUsage: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  toggleDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  inputGroup: {
    marginTop: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  saveBtn: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AdminDashboard;