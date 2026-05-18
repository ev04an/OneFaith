import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { useTheme } from '../theme';
import { PRAYER_CATEGORIES, getPrayersByCategory } from '../data/prayers';
import { useFavoritesStore } from '../state/store';
import type { RootStackParamList } from '../navigation/types';

export function PrayerCategoryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'PrayerCategory'>>();
  const cat = PRAYER_CATEGORIES.find((c) => c.id === route.params.category);
  const prayers = cat ? getPrayersByCategory(cat.id) : [];
  const favs = useFavoritesStore((s) => s.prayers);

  if (!cat) {
    return (
      <View style={{ flex: 1 }}>
        <AnimatedBackground variant="serenity" intensity={0.7} />
        <ScreenHeader onBack={() => nav.goBack()} title="Prayers" large subtitle="PRAYERS" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={[theme.typography.body, { color: theme.colors.text, opacity: 0.9 }]}>
            No prayers available for this category.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="serenity" intensity={0.7} />
      <ScreenHeader onBack={() => nav.goBack()} title={cat.label} large subtitle="PRAYERS" />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: insets.bottom + 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        {prayers.length === 0 ? (
          <Text
            style={[
              theme.typography.body,
              { color: theme.colors.text, opacity: 0.85, textAlign: 'center', marginTop: 24 },
            ]}
          >
            No prayers in this category yet.
          </Text>
        ) : null}
        <View style={{ gap: 14 }}>
          {prayers.map((p) => {
            const saved = favs.includes(p.id);
            const stops = (theme.gradients[p.gradient] ?? theme.gradients.primary) as readonly string[];
            return (
              <Pressable
                key={p.id}
                onPress={() => nav.navigate('PrayerDetail', { prayerId: p.id })}
                style={theme.shadow.soft}
              >
                <LinearGradient
                  colors={stops as any}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.card,
                    { borderRadius: theme.radius.lg, borderColor: 'rgba(255,255,255,0.18)' },
                  ]}
                >
                  <Ionicons name={p.icon as any} size={24} color="#fff" />
                  <View style={{ flex: 1 }}>
                    <Text style={[theme.typography.h3, { color: '#fff' }]}>{p.title}</Text>
                    <Text
                      style={[theme.typography.body, { color: 'rgba(255,255,255,0.85)', marginTop: 6 }]}
                      numberOfLines={2}
                    >
                      {p.text.replace(/\n+/g, ' ').slice(0, 110)}…
                    </Text>
                  </View>
                  <Ionicons
                    name={saved ? 'bookmark' : 'chevron-forward'}
                    size={20}
                    color="#fff"
                  />
                </LinearGradient>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
