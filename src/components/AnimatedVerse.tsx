import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  text: string;
  style?: TextStyle | TextStyle[];
  /** Delay before the first word appears (ms). Default 0. */
  startDelay?: number;
  /** Gap between word reveals (ms). Default 38. */
  perWordDelay?: number;
  /** Duration of each word's fade (ms). Default 360. */
  duration?: number;
  /** Whether to show quotation marks around the verse text. Default false. */
  withQuotes?: boolean;
  /** Cap how many words animate individually — extra words fade in as a tail
   *  group. Keeps cost flat on long passages. Default 24. */
  maxAnimatedWords?: number;
};

/**
 * Cascading per-word reveal for verse / prayer text. One-shot on mount,
 * runs entirely on the UI thread via shared values. No continuous animation,
 * so it has zero ongoing scroll cost.
 *
 * The trick: each word is its own <Animated.View> with an opacity / translateY
 * shared value that triggers via withDelay(index * perWordDelay). Words break
 * naturally because each is an inline flex item. We render the verse text in
 * a flex-wrap row so line breaks happen organically.
 */
export function AnimatedVerse({
  text,
  style,
  startDelay = 0,
  perWordDelay = 38,
  duration = 360,
  withQuotes = false,
  maxAnimatedWords = 24,
}: Props) {
  const words = useMemo(() => {
    const wrapped = withQuotes ? `“${text.trim()}”` : text.trim();
    return wrapped.split(/\s+/).filter(Boolean);
  }, [text, withQuotes]);

  const head = words.slice(0, maxAnimatedWords);
  const tail = words.slice(maxAnimatedWords);

  return (
    <View style={styles.row}>
      {head.map((w, i) => (
        <Word
          key={`h-${i}-${w}`}
          word={w}
          isLast={i === head.length - 1 && tail.length === 0}
          delay={startDelay + i * perWordDelay}
          duration={duration}
          style={style}
        />
      ))}
      {tail.length ? (
        <TailGroup
          words={tail}
          delay={startDelay + head.length * perWordDelay}
          duration={duration + 200}
          style={style}
        />
      ) : null}
    </View>
  );
}

function Word({
  word,
  isLast,
  delay,
  duration,
  style,
}: {
  word: string;
  isLast: boolean;
  delay: number;
  duration: number;
  style?: TextStyle | TextStyle[];
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }, [t, delay, duration]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ translateY: (1 - t.value) * 6 }],
  }));

  return (
    <Animated.View style={[styles.wordWrap, animStyle]}>
      <Text style={style}>
        {word}
        {isLast ? '' : ' '}
      </Text>
    </Animated.View>
  );
}

function TailGroup({
  words,
  delay,
  duration,
  style,
}: {
  words: string[];
  delay: number;
  duration: number;
  style?: TextStyle | TextStyle[];
}) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delay,
      withTiming(1, { duration, easing: Easing.out(Easing.cubic) }),
    );
  }, [t, delay, duration]);
  const animStyle = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ translateY: (1 - t.value) * 4 }],
  }));
  return (
    <Animated.View style={[styles.wordWrap, animStyle]}>
      <Text style={style}>{words.join(' ')}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  wordWrap: { flexDirection: 'row' },
});
