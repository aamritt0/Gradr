import Constants from 'expo-constants';
import React, { useContext } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { ThemeContext } from '../ThemeContext';

export default function SettingsScreen() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const appVersion = Constants.expoConfig?.version || 'Versione non disponibile';

  return (
    <View style={[styles.container, isDark ? styles.dark : styles.light]}>
      <View style={styles.row}>
        <Text style={[styles.text, isDark ? styles.textLight : styles.textDark]}>
          Dark Mode
        </Text>
        <Switch value={isDark} onValueChange={toggleTheme} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark ? styles.textLight : styles.textDark]}>
          Credits
        </Text>
        <Text style={isDark ? styles.textLight : styles.textDark}>
          Made with ❤️
        </Text>
        <Text style={isDark ? styles.textLight : styles.textDark}>
          Thanks for using the app!
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark ? styles.textLight : styles.textDark]}>
          Versione App
        </Text>
        <Text style={isDark ? styles.textLight : styles.textDark}>
          {appVersion}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  light: {
    backgroundColor: '#fff',
  },
  dark: {
    backgroundColor: '#222',
  },
  text: {
    fontSize: 18,
  },
  textLight: {
    color: '#fff',
  },
  textDark: {
    color: '#000',
  },
});
