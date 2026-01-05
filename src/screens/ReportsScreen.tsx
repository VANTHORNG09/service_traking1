import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useServiceStore } from '../store/serviceStore';
import { Icon } from 'react-native-elements';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { CustomPicker } from '../components/CustomPicker';
import { Picker } from '@react-native-picker/picker';

export default function ReportsScreen() {
  const { serviceStats, fetchServiceStats, isLoading, error } = useServiceStore();
  const [dateRange, setDateRange] = useState('this-month');

  useEffect(() => {
    fetchServiceStats();
  }, []);

  const screenWidth = Dimensions.get('window').width - 40;

  // Mock data for charts - in a real app, this would come from the API
  const statusData = [
    { name: 'Pending', population: serviceStats?.pending || 0, color: '#FFC107', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'In Progress', population: serviceStats?.inProgress || 0, color: '#2196F3', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Completed', population: serviceStats?.completed || 0, color: '#4CAF50', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Cancelled', population: serviceStats?.cancelled || 0, color: '#F44336', legendFontColor: '#7F7F7F', legendFontSize: 12 },
  ];

  const priorityData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        data: [10, 15, 8, 5], // Mock data - replace with real data
      }
    ]
  };

  const assigneeData = [
    { id: '1', name: 'John Doe', count: 8 },
    { id: '2', name: 'Jane Smith', count: 12 },
    { id: '3', name: 'Mike Johnson', count: 5 },
  ];

  const handleRefresh = () => {
    fetchServiceStats();
  };

  const handleShareReport = () => {
    Alert.alert('Share Report', 'Report sharing functionality would be implemented here');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reports</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
            <Icon name="refresh" type="font-awesome" size={20} color="#6200ee" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShareReport}>
            <Icon name="share" type="font-awesome" size={20} color="#6200ee" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.dateRangeContainer}>
        <Text style={styles.dateRangeLabel}>Date Range:</Text>
        <CustomPicker
          selectedValue={dateRange}
          onValueChange={(itemValue) => setDateRange(itemValue)}
          style={styles.dateRangePicker}
        >
          <Picker.Item label="This Week" value="this-week" />
          <Picker.Item label="This Month" value="this-month" />
          <Picker.Item label="Last Month" value="last-month" />
          <Picker.Item label="This Year" value="this-year" />
          <Picker.Item label="Custom" value="custom" />
        </CustomPicker>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services by Status</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <PieChart
            data={statusData}
            width={screenWidth}
            height={220}
            chartConfig={
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services by Priority</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6200ee" />
        ) : (
          <BarChart
            data={priorityData}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }
            style={
              marginVertical: 8,
              borderRadius: 16
            }
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services by Assignee</Text>
        {assigneeData.map((assignee) => (
          <View key={assignee.id} style={styles.assigneeItem}>
            <Text style={styles.assigneeName}>{assignee.name}</Text>
            <Text style={styles.assigneeCount}>{assignee.count} services</Text>
          </View>
        ))}
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Summary Statistics</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total Services</Text>
            <Text style={styles.summaryValue}>{serviceStats?.total || 0}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Completion Rate</Text>
            <Text style={styles.summaryValue}>{serviceStats?.total ? Math.round((serviceStats.completed / serviceStats.total) * 100) : 0}%</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Avg Completion Time</Text>
            <Text style={styles.summaryValue}>3.2 days</Text>
          </View>
        </View>
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
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  refreshButton: {
    padding: 5,
  },
  shareButton: {
    padding: 5,
  },
  dateRangeContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateRangeLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  dateRangePicker: {
    height: 40,
    width: '100%',
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
  assigneeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  assigneeName: {
    fontSize: 16,
    color: '#333',
  },
  assigneeCount: {
    fontSize: 14,
    color: '#666',
  },
  summarySection: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    padding: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});