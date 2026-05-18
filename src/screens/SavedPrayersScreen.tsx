import React from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { ScreenHeader } from '../components/ScreenHeader';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { useTheme } from '../theme';
import { useSavedPrayersStore } from '../state/store';
import type { RootStackParamList } from '../navigation/types';

export function SavedPrayersScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const prayers = useSavedPrayersStore((s) => s.prayers);
  const remove = useSavedPrayersStore((s) => s.remove);

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.55} />
      <ScreenHeader
        onBack={() => nav.goBack()}
        title="Saved Prayers"
        large
        subtitle="GENERATED"
        right={
          <Pressable onPress={() => nav.navigate('PrayerGenerator')} hitSlop={12}>
            <Ionicons name="add-circle-outline" size={22} color={theme.colors.text} />
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: theme.spacing.screen,
          paddingTop: 14,
          paddingBottom: insets.bottom + 60,
        }}
        showsVerticalScrollIndicator={false}
      >
        {prayers.length === 0 ? (
          <GlassCard padded={22}>
            <Text
              style={[
                theme.typography.body,
                {
                  color: theme.colors.text,
                  opacity: 0.92,
                  fontSize: 15,
                  lineHeight: 22,
                },
              ]}
            >
              You haven’t saved any prayers yet. Generate one and tap Save — it will live here for whenever you need it.
            </Text>
            <View style={{ marginTop: 16 }}>
              <GradientButton
                label="Generate a prayer"
                icon="sparkles"
                gradient="primary"
                full
                onPress={() => nav.navigate('PrayerGenerator')}
                glow
              />
            </View>
          </GlassCard>
        ) : (
          <View style={{ gap: 12 }}>
            {prayers.map((p) => (
              <GlassCard key={p.id} padded={18}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        theme.typography.caption,
                        { color: theme.colors.text, opacity: 0.78 },
                      ]}
                    >
                      {new Date(p.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      · {p.verseRef}
                    </Text>
                    <Text
                      style={[
                        theme.typography.bodyBold,
                        { color: theme.colors.text, marginTop: 4 },
                      ]}
                      numberOfLines={1}
                    >
                      {p.prompt}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => remove(p.id)}
                    hitSlop={10}
                    style={{ padding: 4 }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color={theme.colors.text}
                      style={{ opacity: 0.72 }}
                    />
                  </Pressable>
                </View>
                <Text
                  style={[
                    styles.prayerText,
                    { color: theme.colors.text },
                  ]}
                  selectable
                >
                  {p.text}
                </Text>
                <Pressable
                  onPress={() => Share.share({ message: p.text }).catch(() => {})}
                  style={[
                    styles.shareBtn,
                    {
                      backgroundColor: theme.colors.bgGlass,
                      borderColor: theme.colors.borderStrong,
                    },
                  ]}
                >
                  <Ionicons name="share-outline" size={16} color={theme.colors.text} />
                  <Text style={[theme.typography.caption, { color: theme.colors.text }]}>
                    Share
                  </Text>
                </Pressable>
              </GlassCard>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  prayerText: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 14,
  },
});
