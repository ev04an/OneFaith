import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { useTheme } from '../theme';

type Props = {
  /** The full body of text. The first character is rendered large; the rest
   *  wraps around it. */
  children: string;
  /** Override the cap color. Defaults to the theme's gold so it reads as an
   *  illuminated capital. */
  capColor?: string;
  /** Body text style. */
  bodyStyle?: TextStyle | TextStyle[];
  /** Cap font size. Default 56. */
  capSize?: number;
  /** Body line height (used for vertical alignment). Default 24. */
  bodyLineHeight?: number;
};

// Illuminated drop-cap for verse / prayer passages. The first letter is
// rendered in giant Cormorant italic in the theme's gold, the rest of the
// passage wraps around it.
//
// React Native doesn't support real CSS float, so we fake it with a
// flexDirection: row + a top-aligned cap and a flex-1 body. Works in any
// width container.
export function DropCap({
  children,
  capColor,
  bodyStyle,
  capSize = 56,
  bodyLineHeight = 24,
}: Props) {
  const theme = useTheme();
  const text = (children ?? '').trim();
  if (!text) return null;
  const first = text.charAt(0);
  const rest = text.slice(1);

  return (
    <View style={styles.row}>
      <Text
        style={{
          fontFamily: 'CormorantGaramond_700Bold',
          color: capColor ?? theme.colors.gold,
          fontSize: capSize,
          lineHeight: capSize,
          // Pull the cap up slightly so its ascender aligns with the body x-height
          marginTop: -capSize * 0.16,
          marginRight: 8,
          // The drop-cap visually reads as a flourish, so a faint glow helps it
          // feel illuminated rather than just oversized.
          textShadowColor: theme.isDark
            ? 'rgba(247,221,156,0.35)'
            : 'rgba(140,94,15,0.10)',
          textShadowOffset: { width: 0, height: 1 },
          textShadowRadius: 8,
        }}
      >
        {first}
      </Text>
      <Text
        style={[
          {
            flex: 1,
            lineHeight: bodyLineHeight,
          },
          bodyStyle,
        ]}
      >
        {rest}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
