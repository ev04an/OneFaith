import React, { useMemo } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { ParticleVariant } from '../data/holidays';

type Props = {
  variant: ParticleVariant;
  density?: number; // 0.5 .. 1.5
  color?: string;
};

export function HolidayParticles({ variant, density = 1, color }: Props) {
  const { width, height } = useWindowDimensions();

  if (variant === 'snow') {
    return <SnowField width={width} height={height} density={density} color={color ?? '#FFFFFF'} />;
  }
  if (variant === 'rays') {
    return <SunRays color={color ?? '#FFE4A8'} />;
  }
  if (variant === 'candle') {
    return <CandleGlow color={color ?? '#FFB14A'} />;
  }
  if (variant === 'stars') {
    return <StarField width={width} height={height} density={density} color={color ?? '#FFE4A8'} />;
  }
  if (variant === 'embers') {
    return <EmberField width={width} height={height} density={density} color={color ?? '#FF8B4A'} />;
  }
  return null;
}

/* ----------------------------- Snow ----------------------------- */

function SnowField({
  width,
  height,
  density,
  color,
}: {
  width: number;
  height: number;
  density: number;
  color: string;
}) {
  const flakes = useMemo(() => {
    const n = Math.round(36 * density);
    return new Array(n).fill(0).map((_, i) => ({
      key: `s-${i}`,
      x: Math.random() * width,
      size: 2 + Math.random() * 5,
      delay: Math.random() * 4000,
      duration: 6000 + Math.random() * 5000,
      drift: (Math.random() - 0.5) * 40,
      opacity: 0.55 + Math.random() * 0.4,
    }));
  }, [width, density]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {flakes.map(({ key, ...f }) => (
        <Snowflake key={key} {...f} height={height} color={color} />
      ))}
    </View>
  );
}

function Snowflake({
  x,
  size,
  delay,
  duration,
  drift,
  opacity,
  height,
  color,
}: {
  x: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  opacity: number;
  height: number;
  color: string;
}) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, [t, delay, duration]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x + drift * t.value },
      { translateY: -10 + (height + 20) * t.value },
    ],
    opacity: opacity * (1 - Math.max(0, t.value - 0.9) * 10),
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

/* ----------------------------- Rays ----------------------------- */

function SunRays({ color }: { color: string }) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [t]);

  const glow = useAnimatedStyle(() => ({
    opacity: 0.55 + t.value * 0.35,
    transform: [{ scale: 0.95 + t.value * 0.1 }],
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, glow]}>
        <LinearGradient
          colors={[color, 'rgba(255,228,168,0.0)']}
          start={{ x: 0.5, y: -0.1 }}
          end={{ x: 0.5, y: 0.7 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Ray key={i} index={i} color={color} />
      ))}
    </View>
  );
}

function Ray({ index, color }: { index: number; color: string }) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.value = withDelay(
      index * 240,
      withRepeat(
        withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      ),
    );
  }, [t, index]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.10 + t.value * 0.18,
    transform: [{ rotate: `${index * 22.5}deg` }, { scaleY: 0.6 + t.value * 0.4 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          top: -200,
          left: '50%',
          width: 4,
          height: 600,
          marginLeft: -2,
          backgroundColor: color,
          borderRadius: 2,
        },
        style,
      ]}
    />
  );
}

/* ----------------------------- Candle ----------------------------- */

function CandleGlow({ color }: { color: string }) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [t]);

  const a = useAnimatedStyle(() => ({
    opacity: 0.4 + t.value * 0.35,
    transform: [{ scale: 0.85 + t.value * 0.15 }],
  }));
  const b = useAnimatedStyle(() => ({
    opacity: 0.18 + (1 - t.value) * 0.18,
    transform: [{ scale: 0.95 + (1 - t.value) * 0.18 }],
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.glowCenter, a]}>
        <LinearGradient
          colors={[color, 'rgba(0,0,0,0)']}
          style={styles.glowCircle}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
      <Animated.View style={[styles.glowCenter, b]}>
        <LinearGradient
          colors={[color, 'rgba(0,0,0,0)']}
          style={[styles.glowCircle, { width: 480, height: 480, borderRadius: 240 }]}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>
    </View>
  );
}

/* ----------------------------- Stars ----------------------------- */

function StarField({
  width,
  height,
  density,
  color,
}: {
  width: number;
  height: number;
  density: number;
  color: string;
}) {
  const stars = useMemo(() => {
    const n = Math.round(28 * density);
    return new Array(n).fill(0).map((_, i) => ({
      key: `st-${i}`,
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 2200,
      duration: 1500 + Math.random() * 2200,
    }));
  }, [width, height, density]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {stars.map(({ key, ...s }) => (
        <Twinkle key={key} {...s} color={color} />
      ))}
    </View>
  );
}

function Twinkle({
  x,
  y,
  size,
  delay,
  duration,
  color,
}: {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.inOut(Easing.quad) }),
        -1,
        true,
      ),
    );
  }, [t, delay, duration]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.25 + t.value * 0.7,
    transform: [{ scale: 0.7 + t.value * 0.6 }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: 0.9,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    />
  );
}

/* ----------------------------- Embers ----------------------------- */

function EmberField({
  width,
  height,
  density,
  color,
}: {
  width: number;
  height: number;
  density: number;
  color: string;
}) {
  const sparks = useMemo(() => {
    const n = Math.round(22 * density);
    return new Array(n).fill(0).map((_, i) => ({
      key: `e-${i}`,
      x: Math.random() * width,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 3000,
      duration: 4000 + Math.random() * 3500,
      drift: (Math.random() - 0.5) * 60,
    }));
  }, [width, density]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {sparks.map(({ key, ...s }) => (
        <Ember key={key} {...s} height={height} color={color} />
      ))}
    </View>
  );
}

function Ember({
  x,
  size,
  delay,
  duration,
  drift,
  height,
  color,
}: {
  x: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  height: number;
  color: string;
}) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration, easing: Easing.out(Easing.quad) }),
        -1,
        false,
      ),
    );
  }, [t, delay, duration]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x + drift * t.value },
      { translateY: height - (height * 0.85) * t.value },
    ],
    opacity: (1 - t.value) * 0.85,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: 1,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  glowCenter: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    marginLeft: -200,
    marginTop: -200,
    width: 400,
    height: 400,
  },
  glowCircle: {
    width: 400,
    height: 400,
    borderRadius: 200,
  },
});
