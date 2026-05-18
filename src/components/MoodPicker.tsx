import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';
import type { JournalMood } from '../state/store';
import * as haptics from '../utils/haptics';

const MOODS: { id: JournalMood; emoji: string; label: string; stops: readonly [string, string] }[] = [
  { id: 'rough', emoji: '😔', label: 'Rough', stops: ['#4A6FA5', '#3C2C5C'] },
  { id: 'low', emoji: '🙁', label: 'Low', stops: ['#5A6E9A', '#7A4A6A'] },
  { id: 'okay', emoji: '😐', label: 'Okay', stops: ['#7A86B5', '#A09BC0'] },
  { id: 'good', emoji: '🙂', label: 'Good', stops: ['#5AB8A0', '#A8E8D2'] },
  { id: 'great', emoji: '😊', label: 'Great', stops: ['#E8A65A', '#FFD68A'] },
];

type Props = {
  value: JournalMood;
  onChange: (m: JournalMood) => void;
};

export function MoodPicker({ value, onChange }: Props) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      {MOODS.map((m) => {
        const active = value === m.id;
        return (
          <Pressable
            key={m.id}
            onPress={() => {
              haptics.select();
              onChange(m.id);
            }}
            style={{ flex: 1 }}
          >
            <LinearGradient
              colors={active ? (m.stops as any) : (['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.02)'] as any)}
              style={[
                styles.bubble,
                {
                  borderColor: active ? 'rgba(255,255,255,0.35)' : theme.colors.border,
                },
              ]}
            >
              <Text style={styles.emoji}>{m.emoji}</Text>
              <Text
                style={[
                  theme.typography.caption,
                  { color: active ? '#fff' : theme.colors.textMuted },
                ]}
              >
                {m.label}
              </Text>
            </LinearGradient>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  bubble: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  emoji: { fontSize: 24, marginBottom: 4 },
});
