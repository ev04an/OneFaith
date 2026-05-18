import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';
import { useSettingsStore } from '../state/store';
import { Tabs } from './Tabs';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { EmotionDetailScreen } from '../screens/EmotionDetailScreen';
import { VerseDetailScreen } from '../screens/VerseDetailScreen';
import { PrayerDetailScreen } from '../screens/PrayerDetailScreen';
import { PrayerCategoryScreen } from '../screens/PrayerCategoryScreen';
import { JournalEntryScreen } from '../screens/JournalEntryScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { AIScreen } from '../screens/AIScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { LevelsScreen } from '../screens/LevelsScreen';
import { HolidayScreen } from '../screens/HolidayScreen';
import { AboutDeveloperScreen } from '../screens/AboutDeveloperScreen';
import { BibleBookScreen } from '../screens/BibleBookScreen';
import { VersePickerScreen } from '../screens/VersePickerScreen';
import { BibleReaderScreen } from '../screens/BibleReaderScreen';
import { VerseCategoriesScreen } from '../screens/VerseCategoriesScreen';
import { VerseTopicScreen } from '../screens/VerseTopicScreen';
import { PrayerGeneratorScreen } from '../screens/PrayerGeneratorScreen';
import { DailyScreen } from '../screens/DailyScreen';
import { SavedPrayersScreen } from '../screens/SavedPrayersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { FeedbackScreen } from '../screens/FeedbackScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { PrayerIntentionsScreen } from '../screens/PrayerIntentionsScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const theme = useTheme();
  const hasOnboarded = useSettingsStore((s) => s.hasOnboarded);

  const navTheme = theme.isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: 'transparent',
          card: 'transparent',
          text: theme.colors.text,
          primary: theme.colors.primary,
          border: theme.colors.border,
          notification: theme.colors.accent,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: 'transparent',
          card: 'transparent',
          text: theme.colors.text,
          primary: theme.colors.primary,
          border: theme.colors.border,
          notification: theme.colors.accent,
        },
      };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'slide_from_right',
          animationDuration: 320,
          // Gentler iOS sheet feel on modals + smoother gesture handling.
          gestureEnabled: true,
        }}
        initialRouteName={hasOnboarded ? 'MainTabs' : 'Onboarding'}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="MainTabs" component={Tabs} options={{ animation: 'fade' }} />
        <Stack.Screen name="EmotionDetail" component={EmotionDetailScreen} />
        <Stack.Screen name="VerseDetail" component={VerseDetailScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="PrayerCategory" component={PrayerCategoryScreen} />
        <Stack.Screen name="PrayerDetail" component={PrayerDetailScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="JournalEntry" component={JournalEntryScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="AI" component={AIScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Levels" component={LevelsScreen} />
        <Stack.Screen
          name="Holiday"
          component={HolidayScreen}
          options={{ animation: 'fade', presentation: 'modal' }}
        />
        <Stack.Screen name="BibleBook" component={BibleBookScreen} />
        <Stack.Screen name="VersePicker" component={VersePickerScreen} />
        <Stack.Screen name="BibleReader" component={BibleReaderScreen} />
        <Stack.Screen name="VerseCategories" component={VerseCategoriesScreen} />
        <Stack.Screen name="VerseTopic" component={VerseTopicScreen} />
        <Stack.Screen name="PrayerGenerator" component={PrayerGeneratorScreen} />
        <Stack.Screen name="Daily" component={DailyScreen} />
        <Stack.Screen name="SavedPrayers" component={SavedPrayersScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="AboutDeveloper" component={AboutDeveloperScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="PrayerIntentions" component={PrayerIntentionsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
