import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useServiceStore } from '../store/serviceStore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Icon } from 'react-native-elements';
import { Service } from '../types';
import { CustomPicker } from '../components/CustomPicker';
import { Picker } from '@react-native-picker/picker';

type ServiceDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ServiceDetail'>;

type ServiceDetailRouteProp = {
  params: {
    serviceId: string;
  };
};

export default function ServiceDetailScreen() {
  const route = useRoute<ServiceDetailRouteProp>();
  const { serviceId } = route.params;
  const { currentService, fetchServiceById, updateService, isLoading, error } = useServiceStore();
  const [newComment, setNewComment] = useState('');
  const [status, setStatus] = useState<string>('');
  const navigation = useNavigation<ServiceDetailScreenNavigationProp>();

  useEffect(() => {
    fetchServiceById(serviceId);
  }, [serviceId]);

  useEffect(() => {
    if (currentService) {
      setStatus(currentService.status);
    }
  }, [currentService]);

  const handleStatusChange = async () => {
    if (!currentService || !status) return;
    
    try {
      await updateService(currentService.id, { status });
      Alert.alert('Success', 'Service status updated successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to update service status');
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    // This would be implemented to add a comment
    // For now, just show a success message
    Alert.alert('Success', 'Comment added successfully');
    setNewComment('');
  };

  const navigateToEdit = () => {
    navigation.navigate('EditService', { serviceId: currentService?.id || '' });
  };

  const navigateToAssign = () => {
    navigation.navigate('AssignService', { serviceId: currentService?.id || '' });
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

  if (isLoading && !currentService) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!currentService) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Service not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="font-awesome" size={20} color="#6200ee" />
        </TouchableOpacity>
        <Text style={styles.title}>{currentService.title}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <Text style={styles.description}>{currentService.description}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type:</Text>
          <Text style={styles.detailValue}>{currentService.type}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentService.status) }]}>
            <Text style={styles.statusText}>{currentService.status}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Priority:</Text>
          <View style={styles.priorityContainer}>
            <Icon name={getPriorityIcon(currentService.priority).name} 
                  type="font-awesome" 
                  size={16} 
                  color={getPriorityIcon(currentService.priority).color} />
            <Text style={[styles.priorityText, { color: getPriorityIcon(currentService.priority).color }]}>
              {currentService.priority}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Deadline:</Text>
          <Text style={styles.detailValue}>{new Date(currentService.deadline).toLocaleDateString()}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created by:</Text>
          <Text style={styles.detailValue}>{currentService.createdBy.name}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created at:</Text>
          <Text style={styles.detailValue}>{new Date(currentService.createdAt).toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assignees</Text>
        {currentService.assignees.length > 0 ? (
          currentService.assignees.map((assignee) => (
            <View key={assignee.id} style={styles.assigneeItem}>
              <Text style={styles.assigneeName}>{assignee.name}</Text>
              <Text style={styles.assigneeRole}>{assignee.role}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noAssignees}>No assignees</Text>
        )}

        <TouchableOpacity style={styles.assignButton} onPress={navigateToAssign}>
          <Icon name="user-plus" type="font-awesome" size={16} color="#6200ee" />
          <Text style={styles.assignButtonText}>Assign User</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
      <Text style={styles.sectionTitle}>Change Status</Text>
      <CustomPicker
        selectedValue={status}
        onValueChange={(itemValue) => setStatus(itemValue)}
        style={styles.statusPicker}
      >
        <Picker.Item label="Pending" value="pending" />
        <Picker.Item label="In Progress" value="in-progress" />
        <Picker.Item label="Completed" value="completed" />
        <Picker.Item label="Cancelled" value="cancelled" />
      </CustomPicker>

        <TouchableOpacity style={styles.updateButton} onPress={handleStatusChange} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.updateButtonText}>Update Status</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comments</Text>
        {currentService.comments.length > 0 ? (
          currentService.comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.createdBy.name}</Text>
                <Text style={styles.commentDate}>{new Date(comment.createdAt).toLocaleString()}</Text>
              </View>
              <Text style={styles.commentContent}>{comment.content}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noComments}>No comments yet</Text>
        )}

        <View style={styles.addCommentContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
            <Icon name="send" type="font-awesome" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={navigateToEdit}>
          <Icon name="edit" type="font-awesome" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Edit Service</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => Alert.alert('Delete', 'Are you sure you want to delete this service?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
              // Implement delete logic here
              Alert.alert('Success', 'Service deleted successfully');
              navigation.goBack();
            }}
          ])}
        >
          <Icon name="trash" type="font-awesome" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Delete Service</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
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
  section: {
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 12,
    marginLeft: 5,
  },
  assigneeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  assigneeName: {
    fontSize: 14,
    color: '#333',
  },
  assigneeRole: {
    fontSize: 12,
    color: '#666',
  },
  noAssignees: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 10,
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  assignButtonText: {
    color: '#6200ee',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  statusPicker: {
    height: 40,
    width: '100%',
    marginBottom: 15,
  },
  updateButton: {
    backgroundColor: '#6200ee',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  noComments: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 10,
  },
  addCommentContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  commentInput: {
    flex: 1,
    minHeight: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  commentButton: {
    backgroundColor: '#6200ee',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
  },
  editButton: {
    flex: 1,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    padding: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
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