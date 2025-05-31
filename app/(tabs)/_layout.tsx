import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

export default function TabsLayout() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'index') {
            return <Ionicons name="home-outline" size={size} color={color} />;
          } else if (route.name === 'settings') {
            return <Ionicons name="settings-outline" size={size} color={color} />;
          }
          return <Ionicons name="alert-circle" size={size} color={color} />;
        },
        headerStyle: {
          backgroundColor: isDark ? '#222' : '#fff',
        },
        headerTintColor: isDark ? '#fff' : '#000',
        tabBarStyle: {
          backgroundColor: isDark ? '#222' : '#fff',
        },
        tabBarActiveTintColor: isDark ? '#fff' : '#000',
        tabBarInactiveTintColor: isDark ? '#aaa' : '#888',
      })}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarLabel: 'Home' }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarLabel: 'Settings' }}
      />
    </Tabs>
  );
}
