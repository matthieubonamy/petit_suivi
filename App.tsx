import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreenExpo from 'expo-splash-screen';
import {
  useFonts,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import {
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';

import { AuthProvider } from './src/stores/AuthContext';
import { ChildrenProvider } from './src/stores/ChildrenContext';
import { initDatabase } from './src/services/database';
import { colors } from './src/constants/tokens';
import { RootStackParamList, MainTabParamList } from './src/types';

// Screens
import { SplashScreen } from './src/screens/SplashScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { AddChildScreen } from './src/screens/AddChildScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { APIKeysScreen } from './src/screens/APIKeysScreen';
import { LegalScreen } from './src/screens/LegalScreen';
import { AdminLoginScreen } from './src/screens/AdminLoginScreen';
import { AdminDashboardScreen } from './src/screens/AdminDashboardScreen';
import { AdminContentScreen } from './src/screens/AdminContentScreen';
import { AdminUsersScreen } from './src/screens/AdminUsersScreen';

// Tab screens
import { ObserverScreen } from './src/screens/ObserverScreen';
import { ReferencesScreen } from './src/screens/ReferencesScreen';
import { AlertesScreen } from './src/screens/AlertesScreen';
import { HistoriqueScreen } from './src/screens/HistoriqueScreen';

// expo-splash-screen doesn't work on web — skip it
if (Platform.OS !== 'web') {
  SplashScreenExpo.preventAutoHideAsync().catch(() => {});
}

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ icon, focused }: { icon: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 24 : 20, opacity: focused ? 1 : 0.55 }}>{icon}</Text>
  );
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
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: 'Nunito_700Bold',
          fontSize: 11,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mu,
      }}
    >
      <Tab.Screen
        name="Observer"
        component={ObserverScreen}
        options={{
          tabBarLabel: 'Observer',
          tabBarIcon: ({ focused }) => <TabIcon icon="📝" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Reperes"
        component={ReferencesScreen}
        options={{
          tabBarLabel: 'Repères',
          tabBarIcon: ({ focused }) => <TabIcon icon="📚" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Alertes"
        component={AlertesScreen}
        options={{
          tabBarLabel: 'Alertes',
          tabBarIcon: ({ focused }) => <TabIcon icon="⚠️" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Historique"
        component={HistoriqueScreen}
        options={{
          tabBarLabel: 'Historique',
          tabBarIcon: ({ focused }) => <TabIcon icon="📊" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
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

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: string | null }
> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) {
    return { error: e.message };
  }
  render() {
    if (this.state.error) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={{ color: '#A52A2A', padding: 20, textAlign: 'center' }}>
            Erreur : {this.state.error}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [fontsLoaded, fontsError] = useFonts({
    Fraunces_600SemiBold,
    Nunito_400Regular,
    Nunito_700Bold,
  });
  // On web, fonts may not resolve — use a 3s timeout fallback
  const [fontTimeout, setFontTimeout] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFontTimeout(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try { initDatabase(); } catch (e) { console.error('DB init error:', e); }
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web' && (fontsLoaded || fontsError)) {
      SplashScreenExpo.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontsError]);

  const ready = fontsLoaded || !!fontsError || fontTimeout;

  if (!ready) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <ChildrenProvider>
            <NavigationContainer>
              <StatusBar style="dark" />
              <AppNavigator />
            </NavigationContainer>
          </ChildrenProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
