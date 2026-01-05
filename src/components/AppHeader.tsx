import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

interface AppHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBackButton = false, 
  rightAction
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {showBackButton && (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="font-awesome" size={20} color="#6200ee" />
        </TouchableOpacity>
      )}

      <Text style={[styles.title, showBackButton && styles.titleWithBack]}>{title}</Text>

      {rightAction && (
        <TouchableOpacity style={styles.rightAction} onPress={rightAction.onPress}>
          <Icon name={rightAction.icon} type="font-awesome" size={20} color="#6200ee" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  titleWithBack: {
    marginLeft: 40,
  },
  rightAction: {
    position: 'absolute',
    right: 20,
    padding: 5,
  },
});