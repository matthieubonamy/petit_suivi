import React, { useEffect } from 'react';
import { Text, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts,
  Fraunces_400Regular,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';

import { colors } from './src/constants/tokens';
import { AuthProvider } from './src/stores/AuthContext';
import { ChildrenProvider } from './src/stores/ChildrenContext';
import { initDatabase } from './src/services/database';

import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { ChildrenListScreen } from './src/screens/ChildrenListScreen';
import { AddChildScreen } from './src/screens/AddChildScreen';
import { ObserverScreen } from './src/screens/ObserverScreen';
import { HistoriqueScreen } from './src/screens/HistoriqueScreen';
import { ReferencesScreen } from './src/screens/ReferencesScreen';
import { AlertesScreen } from './src/screens/AlertesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { APIKeysScreen } from './src/screens/APIKeysScreen';
import { LegalScreen } from './src/screens/LegalScreen';
import { AdminLoginScreen } from './src/screens/AdminLoginScreen';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { AdminContentScreen } from './src/screens/AdminContentScreen';
import { AdminUsersScreen } from './src/screens/AdminUsersScreen';

import { RootStackParamList, MainTabParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.sur,
          borderTopColor: colors.bdr,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mu,
        tabBarLabelStyle: {
          fontFamily: 'Nunito_600SemiBold',
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen
        name="Observer"
        component={ObserverScreen}
        options={{ tabBarLabel: 'Observer', tabBarIcon: () => <TabIcon emoji="🌿" /> }}
      />
      <Tab.Screen
        name="Historique"
        component={HistoriqueScreen}
        options={{ tabBarLabel: 'Historique', tabBarIcon: () => <TabIcon emoji="📋" /> }}
      />
      <Tab.Screen
        name="Reperes"
        component={ReferencesScreen}
        options={{ tabBarLabel: 'Repères', tabBarIcon: () => <TabIcon emoji="🩺" /> }}
      />
      <Tab.Screen
        name="Alertes"
        component={AlertesScreen}
        options={{ tabBarLabel: 'Alertes', tabBarIcon: () => <TabIcon emoji="⚠️" /> }}
      />
    </Tab.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, cardStyle: { backgroundColor: colors.bg } }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Children" component={ChildrenListScreen} />
      <Stack.Screen name="AddChild" component={AddChildScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="APIKeys" component={APIKeysScreen} />
      <Stack.Screen name="Legal" component={LegalScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminContent" component={AdminContentScreen} />
      <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    try {
      initDatabase();
    } catch {
      // SQLite not available on web — database.web.ts localStorage stub handles it
    }
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ChildrenProvider>
            <NavigationContainer>
              <RootStack />
            </NavigationContainer>
          </ChildrenProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
