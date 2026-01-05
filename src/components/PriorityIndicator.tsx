import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';

interface PriorityIndicatorProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
  style?: any;
}

export const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({ priority, style }) => {
  const getPriorityData = () => {
    switch (priority) {
      case 'critical': return { icon: 'exclamation-circle', color: '#F44336', text: 'Critical' };
      case 'high': return { icon: 'arrow-up', color: '#FF9800', text: 'High' };
      case 'medium': return { icon: 'minus', color: '#2196F3', text: 'Medium' };
      case 'low': return { icon: 'arrow-down', color: '#4CAF50', text: 'Low' };
      default: return { icon: 'question', color: '#9E9E9E', text: 'Unknown' };
    }
  };

  const { icon, color, text } = getPriorityData();

  return (
    <View style={[styles.container, style]}>
      <Icon name={icon} type="font-awesome" size={16} color={color} />
      <Text style={[styles.text, { color }]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    marginLeft: 5,
  },
});