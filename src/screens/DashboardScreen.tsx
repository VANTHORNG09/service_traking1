import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { useServiceStore } from '../store/serviceStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Icon } from 'react-native-elements';

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { serviceStats, fetchServiceStats, isLoading, error } = useServiceStore();
  const navigation = useNavigation<DashboardScreenNavigationProp>();

  useEffect(() => {
    fetchServiceStats();
  }, []);

  const navigateToCreateService = () => {
    navigation.navigate('CreateService');
  };

  const navigateToReports = () => {
    navigation.navigate('MainTabs', { screen: 'Reports' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#2196F3';
      case 'pending': return '#FFC107';
      case 'cancelled': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchServiceStats} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
        <Text style={styles.role}>{user?.role || 'User'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Summary</Text>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: getStatusColor('total') }]}>
          <Text style={styles.statLabel}>Total Services</Text>
          <Text style={styles.statValue}>{serviceStats?.total || 0}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: getStatusColor('pending') }]}>
          <Text style={styles.statLabel}>Pending</Text>
          <Text style={styles.statValue}>{serviceStats?.pending || 0}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: getStatusColor('in-progress') }]}>
          <Text style={styles.statLabel}>In Progress</Text>
          <Text style={styles.statValue}>{serviceStats?.inProgress || 0}</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: getStatusColor('completed') }]}>
          <Text style={styles.statLabel}>Completed</Text>
          <Text style={styles.statValue}>{serviceStats?.completed || 0}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={navigateToCreateService}>
          <Icon name="plus" type="font-awesome" size={24} color="#6200ee" />
          <Text style={styles.actionButtonText}>Create Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={navigateToReports}>
          <Icon name="bar-chart" type="font-awesome" size={24} color="#6200ee" />
          <Text style={styles.actionButtonText}>View Reports</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    marginRight: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    marginTop: 10,
    fontSize: 14,
    color: '#6200ee',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});