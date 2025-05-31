import { Stack } from 'expo-router';
import { ThemeProvider } from './ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
      {/* This will load the Tabs navigator inside the stack */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      {/* You can add other screens here outside of tabs */}
      {/* <Stack.Screen name="other" /> */}
    </Stack>
    </ThemeProvider>
  );
    
}
