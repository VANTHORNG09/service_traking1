import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import DashboardScreen from '../screens/DashboardScreen';
import ServicesScreen from '../screens/ServicesScreen';
import ReportsScreen from '../screens/ReportsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import CreateServiceScreen from '../screens/CreateServiceScreen';
import EditServiceScreen from '../screens/EditServiceScreen';
import AssignServiceScreen from '../screens/AssignServiceScreen';
import { useAuthStore } from '../store/authStore';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  ServiceDetail: { serviceId: string };
  CreateService: undefined;
  EditService: { serviceId: string };
  AssignService: { serviceId: string };
};

type MainTabsParamList = {
  Dashboard: undefined;
  Services: undefined;
  Reports: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

const MainTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          
          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Services') {
            iconName = 'list';
          } else if (route.name === 'Reports') {
            iconName = 'bar-chart';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }
          
          return <Icon name={iconName} type='font-awesome' size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#757575',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Reports" component={ReportsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    // You can add a loading screen here
    return null;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
            <Stack.Screen name="CreateService" component={CreateServiceScreen} />
            <Stack.Screen name="EditService" component={EditServiceScreen} />
            <Stack.Screen name="AssignService" component={AssignServiceScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};