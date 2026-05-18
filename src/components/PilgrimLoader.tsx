import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Line } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

// A small SVG of a pilgrim — black stickman carrying a wooden cross on the
// shoulder, legs swinging back-and-forth to suggest walking. Used as a brief
// loading state while Bible content is being parsed or pulled from storage.

const AnimatedG = Animated.createAnimatedComponent(G);

type Props = {
  /** Pixel size of the bounding square. */
  size?: number;
  /** Stroke color of the figure + cross. */
  color?: string;
};

export function PilgrimLoader({ size = 72, color = '#0F1F4B' }: Props) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [t]);

  // Legs rotate around the hip joint at (42, 60). Left and right phase-offset
  // so they swap which one is forward.
  const leftLegProps = useAnimatedProps(() => {
    const a = interpolate(t.value, [0, 1], [-22, 22]);
    return { transform: `rotate(${a} 42 60)` } as any;
  });
  const rightLegProps = useAnimatedProps(() => {
    const a = interpolate(t.value, [0, 1], [22, -22]);
    return { transform: `rotate(${a} 42 60)` } as any;
  });

  // Whole figure bobs slightly up/down to match the leg cadence (two bobs per
  // full walk cycle — uses sin shape via absolute distance from 0.5).
  const figureProps = useAnimatedProps(() => {
    const distFromMid = Math.abs(t.value - 0.5) * 2; // 0..1..0
    const dy = interpolate(distFromMid, [0, 1], [-1.5, 0]);
    return { transform: `translate(0 ${dy})` } as any;
  });

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <AnimatedG animatedProps={figureProps}>
          {/* Cross on the right shoulder, leaning back. Drawn first so the
              figure's arm appears in front. */}
          <Line
            x1="58"
            y1="14"
            x2="74"
            y2="62"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <Line
            x1="54"
            y1="26"
            x2="74"
            y2="22"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Head */}
          <Circle cx="42" cy="22" r="6" stroke={color} strokeWidth="3" fill="none" />

          {/* Body */}
          <Line
            x1="42"
            y1="28"
            x2="42"
            y2="60"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Arm reaching back to grip the cross (single line from shoulder
              area up to the cross beam). */}
          <Line
            x1="42"
            y1="34"
            x2="60"
            y2="26"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Forward arm swinging slightly. */}
          <Line
            x1="42"
            y1="36"
            x2="34"
            y2="50"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Legs — animated. */}
          <AnimatedG animatedProps={leftLegProps}>
            <Line
              x1="42"
              y1="60"
              x2="38"
              y2="84"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </AnimatedG>
          <AnimatedG animatedProps={rightLegProps}>
            <Line
              x1="42"
              y1="60"
              x2="46"
              y2="84"
              stroke={color}
              strokeWidth="3"
              strokeLinecap="round"
            />
          </AnimatedG>
        </AnimatedG>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
