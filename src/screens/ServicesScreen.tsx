import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useServiceStore } from '../store/serviceStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Icon } from 'react-native-elements';
import { Service } from '../types';
import { CustomPicker } from '../components/CustomPicker';
import { Picker } from '@react-native-picker/picker';

type ServicesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function ServicesScreen() {
  const { services, fetchServices, isLoading, error } = useServiceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const navigation = useNavigation<ServicesScreenNavigationProp>();

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // Filter services based on search query and filters
    let result = services;
    
    if (searchQuery) {
      result = result.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter) {
      result = result.filter(service => service.status === statusFilter);
    }
    
    if (priorityFilter) {
      result = result.filter(service => service.priority === priorityFilter);
    }
    
    setFilteredServices(result);
  }, [services, searchQuery, statusFilter, priorityFilter]);

  const navigateToServiceDetail = (serviceId: string) => {
    navigation.navigate('ServiceDetail', { serviceId });
  };

  const navigateToCreateService = () => {
    navigation.navigate('CreateService');
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

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return { name: 'exclamation-circle', color: '#F44336' };
      case 'high': return { name: 'arrow-up', color: '#FF9800' };
      case 'medium': return { name: 'minus', color: '#2196F3' };
      case 'low': return { name: 'arrow-down', color: '#4CAF50' };
      default: return { name: 'question', color: '#9E9E9E' };
    }
  };

  const renderServiceItem = ({ item }: { item: Service }) => (
    <TouchableOpacity 
      style={styles.serviceCard} 
      onPress={() => navigateToServiceDetail(item.id)}
      onLongPress={() => {
        Alert.alert(
          'Service Actions',
          'What would you like to do?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'View', onPress: () => navigateToServiceDetail(item.id) },
            { text: 'Edit', onPress: () => navigation.navigate('EditService', { serviceId: item.id }) },
            { text: 'Delete', onPress: () => handleDeleteService(item.id), style: 'destructive' },
          ]
        );
      }}
    >
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.serviceDescription} numberOfLines={2}>{item.description}</Text>

      <View style={styles.serviceFooter}>
        <View style={styles.priorityContainer}>
          <Icon name={getPriorityIcon(item.priority).name} 
                type="font-awesome" 
                size={16} 
                color={getPriorityIcon(item.priority).color} />
          <Text style={[styles.priorityText, { color: getPriorityIcon(item.priority).color }]}>
            {item.priority}
          </Text>
        </View>

        <Text style={styles.deadlineText}>Due: {new Date(item.deadline).toLocaleDateString()}</Text>
      </View>

      {item.assignees.length > 0 && (
        <View style={styles.assigneesContainer}>
          <Text style={styles.assigneesLabel}>Assigned to:</Text>
          <Text style={styles.assigneesText}>{item.assignees.map(a => a.name).join(', ')}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const handleDeleteService = async (serviceId: string) => {
    try {
      // This would be implemented in the service store
      // await useServiceStore.getState().deleteService(serviceId);
      Alert.alert('Success', 'Service deleted successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to delete service');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <TouchableOpacity style={styles.addButton} onPress={navigateToCreateService}>
          <Icon name="plus" type="font-awesome" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(!showFilters)}>
          <Icon name="filter" type="font-awesome" size={20} color="#6200ee" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Status:</Text>
            <CustomPicker
              selectedValue={statusFilter}
              onValueChange={(itemValue) => setStatusFilter(itemValue)}
              style={styles.filterPicker}
            >
              <Picker.Item label="All" value={null} />
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="In Progress" value="in-progress" />
              <Picker.Item label="Completed" value="completed" />
              <Picker.Item label="Cancelled" value="cancelled" />
            </CustomPicker>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Priority:</Text>
            <CustomPicker
              selectedValue={priorityFilter}
              onValueChange={(itemValue) => setPriorityFilter(itemValue)}
              style={styles.filterPicker}
            >
              <Picker.Item label="All" value={null} />
              <Picker.Item label="Critical" value="critical" />
              <Picker.Item label="High" value="high" />
              <Picker.Item label="Medium" value="medium" />
              <Picker.Item label="Low" value="low" />
            </CustomPicker>
          </View>
        </View>
      )}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      ) : (
        <FlatList
          data={filteredServices}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchServices} />}
          ListEmptyComponent={(
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No services found</Text>
            </View>
          )}
        />
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#6200ee',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  filterButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  filtersContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterRow: {
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  filterPicker: {
    height: 40,
    width: '100%',
  },
  serviceCard: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginLeft: 10,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    marginLeft: 5,
  },
  deadlineText: {
    fontSize: 12,
    color: '#999',
  },
  assigneesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  assigneesLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  assigneesText: {
    fontSize: 12,
    color: '#666',
  },
  listContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});