# Icon Import Guide

## ✅ Correct Import for This Project

```javascript
import { Icon } from 'react-native-elements';
```

## Project Configuration

This project uses **react-native-elements v3.4.3**, which is the older version of the library.

### Usage Example

```javascript
import { Icon } from 'react-native-elements';

// Basic usage
<Icon name="home" type="font-awesome" size={24} color="#6200ee" />

// Available icon types
<Icon name="home" type="font-awesome" />      // FontAwesome
<Icon name="home" type="material" />          // Material Icons
<Icon name="home" type="material-community" />  // Material Community Icons
<Icon name="home" type="ionicon" />           // Ionicons
<Icon name="home" type="entypo" />            // Entypo
<Icon name="home" type="feather" />           // Feather
```

## ❌ Common Mistakes

### DO NOT USE:
```javascript
// ❌ Wrong - @rneui packages are for v4+
import { Icon } from '@rneui/themed';
import { Icon } from '@rneui/base';

// ❌ Wrong - These don't exist
import Icon from 'react-native-elements/dist/Icon';
import { Icon } from '@react-native-elements/themed';
```

## Why @rneui/themed doesn't work?

The `@rneui/*` packages (like `@rneui/themed`, `@rneui/base`) are part of **React Native Elements v4+**. This project uses v3.4.3, which uses the `react-native-elements` package name.

## Migration Note

If you want to upgrade to v4+ in the future:
1. Uninstall: `npm uninstall react-native-elements`
2. Install: `npm install @rneui/themed @rneui/base`
3. Update all imports: `import { Icon } from '@rneui/themed';`

## Installed Icon Libraries

The project has access to icons through:
- **@expo/vector-icons** (v15.0.3) - Expo's icon library
- **react-native-vector-icons** (transitive dependency from react-native-elements)

## Alternative: Using Expo Icons

You can also use Expo's built-in icons:

```javascript
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

<FontAwesome name="home" size={24} color="#6200ee" />
<MaterialIcons name="home" size={24} color="#6200ee" />
```

## Files Using Icon Component

The Icon component from react-native-elements is currently used in:
- `/src/components/AppHeader.tsx`
- `/src/components/CustomPicker.tsx`
- `/src/components/ErrorScreen.tsx`
- `/src/components/ToastNotification.tsx`
- `/src/components/PriorityIndicator.tsx`
- `/src/navigation/AppNavigator.tsx`
- `/src/screens/DashboardScreen.tsx`
- `/src/screens/ServicesScreen.tsx`
- `/src/screens/ReportsScreen.tsx`
- `/src/screens/ProfileScreen.tsx`
- `/src/screens/ServiceDetailScreen.tsx`
- `/src/screens/CreateServiceScreen.tsx`
- `/src/screens/EditServiceScreen.tsx`
- `/src/screens/AssignServiceScreen.tsx`

All these files use the correct import pattern.
