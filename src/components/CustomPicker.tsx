import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { Icon } from 'react-native-elements';

interface CustomPickerProps {
  selectedValue: any;
  onValueChange: (itemValue: any, itemIndex: number) => void;
  style?: any;
  children: React.ReactNode;
  iconName?: string;
  iconColor?: string;
}

export const CustomPicker: React.FC<CustomPickerProps> = ({ 
  selectedValue, 
  onValueChange, 
  style, 
  children, 
  iconName = 'chevron-down', 
  iconColor = '#6200ee'
}) => {
  return (
    <View style={[styles.container, style]}>
      {Platform.OS === 'ios' ? (
        <RNPicker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
        >
          {children}
        </RNPicker>
      ) : (
        <View style={styles.androidPickerContainer}>
          <RNPicker
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            style={styles.androidPicker}
          >
            {children}
          </RNPicker>
          <Icon name={iconName} type="font-awesome" size={16} color={iconColor} style={styles.icon} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  androidPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  androidPicker: {
    flex: 1,
    height: 50,
  },
  icon: {
    paddingRight: 15,
  },
});