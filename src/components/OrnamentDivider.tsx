import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '../theme';

type Variant = 'fleur' | 'cross' | 'wing';

type Props = {
  /** Ornament shape in the middle. Default 'fleur'. */
  variant?: Variant;
  /** Pixel width of the center ornament. Lines auto-fill the rest. Default 28. */
  size?: number;
  /** Override the divider color. Defaults to a faint gold tone for premium feel. */
  color?: string;
  /** Margin above & below. Default 18. */
  spacing?: number;
};

// Print-aesthetic horizontal divider: a thin hairline broken in the middle by
// a small SVG ornament. Used between sections to add the feel of an old
// devotional or psalter. The center glyph is intentionally tiny — the goal is
// "the page breathes here", not "here is decoration."
export function OrnamentDivider({
  variant = 'fleur',
  size = 28,
  color,
  spacing = 18,
}: Props) {
  const theme = useTheme();
  // Default to gold so it reads as decorative, not as a structural separator.
  const tint = color ?? theme.colors.gold;

  return (
    <View style={[styles.row, { marginTop: spacing, marginBottom: spacing }]}>
      <View style={[styles.line, { backgroundColor: tint, opacity: 0.45 }]} />
      <View style={{ marginHorizontal: 12, opacity: 0.85 }}>
        <Ornament variant={variant} size={size} color={tint} />
      </View>
      <View style={[styles.line, { backgroundColor: tint, opacity: 0.45 }]} />
    </View>
  );
}

function Ornament({ variant, size, color }: { variant: Variant; size: number; color: string }) {
  const stroke = 1.4;
  switch (variant) {
    case 'cross':
      // Simple Latin cross with thin terminals — small, refined, devotional.
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M12 3v18M5.5 9.5h13"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <Circle cx={12} cy={3} r={0.9} fill={color} />
          <Circle cx={12} cy={21} r={0.9} fill={color} />
          <Circle cx={5.5} cy={9.5} r={0.9} fill={color} />
          <Circle cx={18.5} cy={9.5} r={0.9} fill={color} />
        </Svg>
      );
    case 'wing':
      // A stylized pair of dove wings — outward-curving strokes meeting at a
      // central dot. Evokes the Spirit / peace without being literal.
      return (
        <Svg width={size} height={size} viewBox="0 0 32 24">
          <Path
            d="M16 12 C 10 6, 4 8, 2 14 M16 12 C 22 6, 28 8, 30 14"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
          />
          <Circle cx={16} cy={12} r={1.3} fill={color} />
        </Svg>
      );
    case 'fleur':
    default:
      // A condensed fleur-de-lis flanked by small drop dots. Reads as "this is
      // a passage break in an old hand-set book."
      return (
        <Svg width={size + 12} height={size} viewBox="0 0 40 24">
          <Circle cx={4} cy={12} r={1.1} fill={color} />
          <Path
            d="M20 4 C 17 9, 17 13, 20 16 C 23 13, 23 9, 20 4 Z"
            fill={color}
          />
          <Path
            d="M20 12 C 14 12, 12 14, 12 17 C 16 17, 19 16, 20 14 Z"
            fill={color}
            opacity={0.85}
          />
          <Path
            d="M20 12 C 26 12, 28 14, 28 17 C 24 17, 21 16, 20 14 Z"
            fill={color}
            opacity={0.85}
          />
          <Path
            d="M17 8 L 23 8"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <Circle cx={36} cy={12} r={1.1} fill={color} />
        </Svg>
      );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
});
