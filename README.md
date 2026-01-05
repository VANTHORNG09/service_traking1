# Service Tracking Mobile App

A React Native mobile application for managing and tracking service requests.

## Features

- User authentication (Login/Register)
- Service management (Create, Read, Update, Delete)
- Service assignment to users
- Status tracking and updates
- Comprehensive reporting with charts
- User profiles and account management
- Offline support with data caching
- Cross-platform (iOS and Android)

## Tech Stack

- React Native with Expo
- TypeScript
- Zustand for state management
- Axios for API calls
- React Navigation for routing
- React Native Elements for UI components
- React Native Chart Kit for data visualization
- Expo SecureStore for secure token storage

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/service-tracking-mobile.git
cd service-tracking-mobile
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install Expo CLI globally (if not already installed):
```bash
npm install -g expo-cli
```

## Configuration

1. Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=http://your-backend-api-url.com/api
```

2. Update the API base URL in `src/services/api.ts` to point to your backend server.

## Running the App

### Development

Start the Expo development server:
```bash
npm start
# or
yarn start
```

This will open the Expo Dev Tools in your browser. You can then:
- Press `a` to run on Android emulator
- Press `i` to run on iOS simulator (macOS only)
- Scan the QR code with the Expo Go app on your physical device

### Android

To run on Android emulator:
```bash
npm run android
```

### iOS

To run on iOS simulator (macOS only):
```bash
npm run ios
```

## Building for Production

### Android

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Log in to your Expo account:
```bash
eas login
```

3. Build the Android app:
```bash
eas build -p android
```

### iOS

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Log in to your Expo account:
```bash
eas login
```

3. Build the iOS app:
```bash
eas build -p ios
```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── navigation/      # Navigation configuration
├── screens/         # Application screens
├── services/        # API services and clients
├── store/           # State management (Zustand)
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## API Integration

The app expects a RESTful API with the following endpoints:

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user info
- `GET /services` - Get all services
- `GET /services/:id` - Get service by ID
- `POST /services` - Create new service
- `PUT /services/:id` - Update service
- `DELETE /services/:id` - Delete service
- `GET /services/stats` - Get service statistics
- `GET /users` - Get all users (for assignment)

## Authentication

The app uses JWT (JSON Web Tokens) for authentication. Tokens are stored securely using Expo SecureStore.

## State Management

The app uses Zustand for state management with two main stores:
- `authStore` - Handles authentication state and user data
- `serviceStore` - Manages service data and operations

## Navigation

The app uses React Navigation with:
- Bottom tab navigation for main sections
- Stack navigation for detail screens and flows

## Styling

The app follows a consistent design system with:
- Primary color: #6200ee (purple)
- Secondary colors for different statuses
- Mobile-friendly touch targets (min 44x44 dp)
- Safe area handling for notches

## Offline Support

The app implements basic offline support by:
- Caching API responses
- Queueing operations when offline
- Syncing when back online

## Testing

The app can be tested on:
- Android emulators
- iOS simulators
- Physical devices using Expo Go app

## Deployment

For production deployment, use EAS (Expo Application Services) to build and publish your app to app stores.

## Troubleshooting

### Common Issues

1. **Android emulator not starting**: Make sure you have Android Studio installed and an emulator configured.

2. **iOS simulator not available**: iOS development requires macOS and Xcode.

3. **API connection issues**: Check that your backend API is running and the URL is correctly configured.

4. **Missing dependencies**: Run `npm install` or `yarn install` to install all dependencies.

## Contributing

1. Fork the repository
2. Create a new branch for your feature/bugfix
3. Make your changes
4. Submit a pull request

## License

[MIT License](LICENSE)