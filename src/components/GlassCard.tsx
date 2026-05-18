import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { useTheme } from '../theme';

// Single-surface card. Previously layered a BlurView, backing tint, and a
// top highlight gradient — on Android the layers would render as visibly
// distinct rectangles inside the card. This is now one clean opaque surface
// with a subtle border and a refined shadow.
//
// Props are kept for backward compatibility with every call site that passed
// `intensity`, `tint`, `highlight`, etc. — they're now no-ops.

type Props = ViewProps & {
  /** Deprecated — kept for backward compatibility. */
  intensity?: number;
  padded?: boolean | number;
  /** Deprecated — kept for backward compatibility. */
  tint?: 'auto' | 'light' | 'dark';
  /** Slightly elevated card (used for hero / "continue reading" surfaces). */
  strong?: boolean;
  /** Wrap in the primary-tinted glow shadow. */
  glow?: boolean;
  radius?: number;
  /** Deprecated — kept for backward compatibility. */
  highlight?: boolean;
};

export function GlassCard({
  padded = true,
  strong = false,
  glow = false,
  radius,
  style,
  children,
  ...rest
}: Props) {
  const theme = useTheme();
  const r = radius ?? theme.radius.lg;

  // Fully opaque surfaces in both themes so background orbs / gradients can
  // never bleed through and create the appearance of an inner rectangle. In
  // dark mode we use the elevated bg color (a slightly lifted navy) so cards
  // read as distinct surfaces from the screen bg without being translucent.
  const bg = theme.isDark
    ? strong
      ? '#162E66'
      : '#0E1E48'
    : '#FFFFFF';

  const borderColor = theme.isDark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(15,31,75,0.08)';

  const containerStyle: ViewStyle = {
    borderRadius: r,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor,
    backgroundColor: bg,
    overflow: 'hidden',
    ...(glow
      ? theme.shadow.glow
      : theme.isDark
      ? theme.shadow.soft
      : theme.shadow.softLight),
  };

  const padStyle: ViewStyle | null =
    padded === true
      ? styles.padded
      : typeof padded === 'number'
      ? { padding: padded }
      : null;

  return (
    <View style={[containerStyle, style]} {...rest}>
      <View style={padStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  padded: { padding: 20 },
});
