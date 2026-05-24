import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';

type Props = {
  value: number;
  /** Total animation duration in ms. Default 1100. */
  duration?: number;
  /** Suffix appended after the number (e.g. "+", " days"). */
  suffix?: string;
  /** Prefix prepended before the number. */
  prefix?: string;
  style?: TextStyle | TextStyle[];
};

// Smoothly counts up from 0 to `value` with an ease-out cubic. Re-animates on
// every value change. Pure JS — no Reanimated worklets — so it composes safely
// with parents that are themselves animated. Used for streak, stats, etc.
export function AnimatedCounter({
  value,
  duration = 1100,
  suffix = '',
  prefix = '',
  style,
}: Props) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) {
      setDisplay(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setDisplay(Math.round(from + (value - from) * eased));
      if (elapsed < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <Text style={style}>{`${prefix}${display}${suffix}`}</Text>;
}
