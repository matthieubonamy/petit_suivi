export type ObservationType = 'stool' | 'urine';
export type StatusLevel = 'ok' | 'watch' | 'alert';

export interface Child {
  id: string;
  name: string;
  birthDate: string; // ISO date string YYYY-MM-DD
  avatarColor: string; // hex color
  createdAt: string;
  updatedAt: string;
}

export interface Observation {
  id: string;
  childId: string;
  type: ObservationType;
  colorId: string;
  bristolType?: number; // 1-7, stools only
  photoUri?: string;
  notes?: string;
  status: StatusLevel;
  createdAt: string;
}

export interface APIKeyEntry {
  id: string;
  label: string;
  keyValue: string;
  provider: string;
  createdAt: string;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  reminderHour?: number;
  theme: 'light' | 'dark' | 'system';
}

// Navigation types
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  MainTabs: undefined;
  AddChild: { childId?: string };
  Settings: undefined;
  APIKeys: undefined;
  Legal: { tab?: 'cgv' | 'rgpd' | 'mentions' };
  AdminLogin: undefined;
  AdminDashboard: undefined;
  AdminContent: undefined;
  AdminUsers: undefined;
};

export type MainTabParamList = {
  Observer: undefined;
  Reperes: undefined;
  Alertes: undefined;
  Historique: undefined;
};

export interface AuthUser {
  id: string;
  email: string;
}
