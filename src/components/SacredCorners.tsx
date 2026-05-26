import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme';

type Props = ViewProps & {
  /** L-shape leg length in px. Default 20. */
  size?: number;
  /** Override the corner color. Defaults to theme gold. */
  color?: string;
  /** Stroke thickness. Default 1.6. */
  thickness?: number;
  /** Inset from the parent edges. Default 8 — corners sit just inside the
   *  card border so they read as a decorative frame, not a duplicate edge. */
  inset?: number;
  /** Opacity for subtle vs. prominent reading. Default 0.8. */
  opacity?: number;
};

// Four gold L-corners overlaid on a card to evoke an old triptych frame or
// illuminated manuscript border. Rendered as absolute-positioned overlays so
// the wrapper doesn't disturb layout.
//
// Usage: stick a <SacredCorners /> inside any positioned/relative container
// (e.g. a GlassCard or LinearGradient hero) and it paints four brackets.
export function SacredCorners({
  size = 20,
  color,
  thickness = 1.6,
  inset = 8,
  opacity = 0.8,
  style,
  ...rest
}: Props) {
  const theme = useTheme();
  const tint = color ?? theme.colors.gold;

  // Build a small L-shape SVG; rotated for the other three corners.
  const corner = (rotation: 0 | 90 | 180 | 270, position: object, key: string) => (
    <View
      key={key}
      pointerEvents="none"
      style={[
        styles.corner,
        position,
        { transform: [{ rotate: `${rotation}deg` }], opacity },
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Path
          d={`M0 ${size - 0.5} L0 0 L${size - 0.5} 0`}
          stroke={tint}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
        />
        {/* Tiny corner stud — adds the "metallic" feel */}
        <Path
          d={`M1.5 1.5 L1.5 1.5`}
          stroke={tint}
          strokeWidth={thickness + 1.6}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, style]}
      {...rest}
    >
      {corner(0, { top: inset, left: inset }, 'tl')}
      {corner(90, { top: inset, right: inset }, 'tr')}
      {corner(270, { bottom: inset, left: inset }, 'bl')}
      {corner(180, { bottom: inset, right: inset }, 'br')}
    </View>
  );
}

const styles = StyleSheet.create({
  corner: {
    position: 'absolute',
  },
});
