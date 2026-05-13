import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import DashboardScreen from './src/screens/DashboardScreen';
import SchedulerScreen from './src/screens/SchedulerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync('tesla_token').then(t => {
      setToken(t);
      setLoading(false);
    });
  }, []);

  const handleTeslaLogin = async () => {
    const clientId = "82e41bfb-ea47-48e4-ab70-2ad898e5a1b3";
    const redirectUri = AuthSession.makeRedirectUri({ scheme: 'optiflux' });

    const authUrl = `https://auth.tesla.com/oauth2/v3/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20vehicle_data%20vehicle_charging_cmds%20offline_access&state=optiflux`;

    const result = await AuthSession.startAsync({ authUrl, showInRecents: true });

    if (result.type === 'success') {
      const demoToken = 'demo-tesla-token-' + Date.now();
      await SecureStore.setItemAsync('tesla_token', demoToken);
      setToken(demoToken);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00f0ff" />
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>OptiFlux</Text>
        <Text style={styles.subtitle}>Tesla Energy Intelligence</Text>
        <Button title="Login with Tesla" onPress={handleTeslaLogin} color="#00f0ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#000' }, headerTintColor: '#00f0ff' }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Scheduler" component={SchedulerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  title: { fontSize: 42, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 18, color: '#00f0ff', marginBottom: 60 },
});
