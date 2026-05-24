import React, { useMemo } from 'react';
import { StyleSheet, View, ViewProps, ViewStyle, Pressable, GestureResponderEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../theme';

// Single-surface card. Optional `tilt3D` mode adds a subtle two-axis tilt + lift
// on press, driven by where the finger lands on the card — gives a premium
// "tilt toward the touch" feel without adding any inner boxes. Surface itself
// remains one clean opaque rectangle.

type Props = ViewProps & {
  /** Deprecated — kept for backward compatibility. */
  intensity?: number;
  padded?: boolean | number;
  /** Deprecated — kept for backward compatibility. */
  tint?: 'auto' | 'light' | 'dark';
  /** Slightly elevated hero card with deeper depth shadow. */
  strong?: boolean;
  /** Wrap in the primary-tinted glow shadow. */
  glow?: boolean;
  /** Soft accent glow (less intense than `glow`). */
  glowSoft?: boolean;
  /** Even deeper shadow stack for hero / focal cards. */
  depth?: boolean;
  /** Enables touch-driven 3D tilt + lift. Only applies when `onPress` provided. */
  tilt3D?: boolean;
  radius?: number;
  /** Deprecated — kept for backward compatibility. */
  highlight?: boolean;
  onPress?: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function GlassCard({
  padded = true,
  strong = false,
  glow = false,
  glowSoft = false,
  depth = false,
  tilt3D = false,
  radius,
  style,
  children,
  onPress,
  ...rest
}: Props) {
  const theme = useTheme();
  const r = radius ?? theme.radius.lg;

  const bg = theme.isDark
    ? strong
      ? '#162E66'
      : '#0E1E48'
    : '#FFFFFF';

  const borderColor = theme.isDark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(15,31,75,0.08)';

  // Pick the right shadow flavor. Priority: depth > glow > glowSoft > strong soft.
  const shadowStyle = useMemo(() => {
    if (depth) return theme.isDark ? theme.shadow.depth : theme.shadow.depthLight;
    if (glow) return theme.shadow.glow;
    if (glowSoft) return theme.shadow.glowSoft;
    return theme.isDark ? theme.shadow.soft : theme.shadow.softLight;
  }, [depth, glow, glowSoft, theme]);

  const containerStyle: ViewStyle = {
    borderRadius: r,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor,
    backgroundColor: bg,
    overflow: 'hidden',
    ...shadowStyle,
  };

  const padStyle: ViewStyle | null =
    padded === true
      ? styles.padded
      : typeof padded === 'number'
      ? { padding: padded }
      : null;

  // ============ Press-driven 3D tilt ============
  const rx = useSharedValue(0);
  const ry = useSharedValue(0);
  const lift = useSharedValue(0);
  const tiltActive = !!onPress && tilt3D;

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 900 },
      { rotateX: `${rx.value}deg` },
      { rotateY: `${ry.value}deg` },
      { translateY: lift.value },
      { scale: 1 - Math.abs(lift.value) * 0.005 },
    ],
  }));

  const onPressIn = (e: GestureResponderEvent) => {
    if (!tiltActive) return;
    const { locationX, locationY } = e.nativeEvent;
    // measure card size via the target if available
    // @ts-ignore — RN provides target measure
    const t: any = e.currentTarget;
    if (t && t.measure) {
      t.measure((_x: number, _y: number, w: number, h: number) => {
        const px = locationX / w; // 0..1
        const py = locationY / h;
        // Up to ±5deg tilt — subtle, not gimmicky
        ry.value = withSpring((px - 0.5) * 2 * 5, { damping: 14, stiffness: 220 });
        rx.value = withSpring(-(py - 0.5) * 2 * 5, { damping: 14, stiffness: 220 });
        lift.value = withSpring(-3, { damping: 14, stiffness: 220 });
      });
    } else {
      lift.value = withSpring(-3, { damping: 14, stiffness: 220 });
    }
  };
  const onPressOut = () => {
    if (!tiltActive) return;
    rx.value = withSpring(0, { damping: 14, stiffness: 220 });
    ry.value = withSpring(0, { damping: 14, stiffness: 220 });
    lift.value = withSpring(0, { damping: 14, stiffness: 220 });
  };

  if (onPress) {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[containerStyle, animStyle, style as any]}
        {...(rest as any)}
      >
        <View style={padStyle}>{children}</View>
      </AnimatedPressable>
    );
  }

  return (
    <View style={[containerStyle, style]} {...rest}>
      <View style={padStyle}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  padded: { padding: 20 },
});
