import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useServiceStore } from '../store/serviceStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Icon } from 'react-native-elements';
import { User } from '../types';

type AssignServiceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AssignService'>;
type AssignServiceRouteProp = RouteProp<RootStackParamList, 'AssignService'>;

export default function AssignServiceScreen() {
  const route = useRoute<AssignServiceRouteProp>();
  const { serviceId } = route.params;
  const { currentService, fetchServiceById, updateService, isLoading, error } = useServiceStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const navigation = useNavigation<AssignServiceScreenNavigationProp>();

  // Mock data for users - in a real app, this would come from an API
  const mockUsers: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'technician', createdAt: '', updatedAt: '' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'technician', createdAt: '', updatedAt: '' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'manager', createdAt: '', updatedAt: '' },
    { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'technician', createdAt: '', updatedAt: '' },
  ];

  useEffect(() => {
    fetchServiceById(serviceId);
    // In a real app, you would fetch users from an API
    setAvailableUsers(mockUsers);
  }, [serviceId]);

  useEffect(() => {
    if (currentService) {
      setSelectedUsers(currentService.assignees);
    }
  }, [currentService]);

  const toggleUserSelection = (user: User) => {
    setSelectedUsers(prev => {
      if (prev.some(u => u.id === user.id)) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const handleAssignUsers = async () => {
    try {
      await updateService(serviceId, { assignees: selectedUsers });
      Alert.alert('Success', 'Users assigned successfully');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to assign users');
    }
  };

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserItem = ({ item }: { item: User }) => {
    const isSelected = selectedUsers.some(u => u.id === item.id);
    
    return (
      <TouchableOpacity 
        style={[styles.userItem, isSelected && styles.userItemSelected]} 
        onPress={() => toggleUserSelection(item)}
      >
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userRole}>{item.role}</Text>
        </View>
        {isSelected && <Icon name="check" type="font-awesome" size={20} color="#4CAF50" />}
      </TouchableOpacity>
    );
  };

  if (isLoading && !currentService) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="font-awesome" size={20} color="#6200ee" />
        </TouchableOpacity>
        <Text style={styles.title}>Assign Users</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Text style={styles.sectionTitle}>Currently Assigned</Text>
      {selectedUsers.length > 0 ? (
        <View style={styles.assignedUsersContainer}>
          {selectedUsers.map(user => (
            <View key={user.id} style={styles.assignedUserItem}>
              <Text style={styles.assignedUserName}>{user.name}</Text>
              <TouchableOpacity onPress={() => toggleUserSelection(user)}>
                <Icon name="times" type="font-awesome" size={16} color="#F44336" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noAssignedUsers}>No users assigned yet</Text>
      )}

      <Text style={styles.sectionTitle}>Available Users</Text>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={(
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.assignButton} onPress={handleAssignUsers} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.assignButtonText}>Assign Selected Users</Text>
        )}
      </TouchableOpacity>

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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 15,
    color: '#333',
  },
  assignedUsersContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  assignedUserItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  assignedUserName: {
    fontSize: 16,
    color: '#333',
  },
  noAssignedUsers: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 10,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userItemSelected: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  userRole: {
    fontSize: 12,
    color: '#999',
  },
  listContent: {
    padding: 15,
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
  assignButton: {
    backgroundColor: '#6200ee',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  assignButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});