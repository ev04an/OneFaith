import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Stop, Circle } from 'react-native-svg';
import { useTheme } from '../theme';

type Variant = 'top' | 'full';

type Props = {
  variant?: Variant;
};

/**
 * Soft, organic curved background — meditation-app aesthetic. White or pale
 * blue base with two overlapping wave shapes and a few floating dots. Static
 * (no animation) for a calm feel.
 */
export function SoftCurves({ variant = 'full' }: Props) {
  const { isDark, colors } = useTheme();
  const { width, height } = useWindowDimensions();

  if (isDark) {
    // Dark night-sky variant
    return (
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: colors.bg }]}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <SvgLinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#0E1E48" />
              <Stop offset="1" stopColor="#06122E" />
            </SvgLinearGradient>
            <SvgLinearGradient id="curve1" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#1B3578" stopOpacity="0.55" />
              <Stop offset="1" stopColor="#3A6EBF" stopOpacity="0.20" />
            </SvgLinearGradient>
          </Defs>
          <Path d={`M0,0 L${width},0 L${width},${height} L0,${height} Z`} fill="url(#bg)" />
          <Path
            d={`M -40 ${height * 0.18} C ${width * 0.3} ${height * 0.04}, ${width * 0.6} ${height * 0.32}, ${width + 40} ${height * 0.14} L ${width + 40} -40 L -40 -40 Z`}
            fill="url(#curve1)"
          />
          <Path
            d={`M -40 ${height * 0.78} C ${width * 0.25} ${height * 0.66}, ${width * 0.65} ${height * 0.92}, ${width + 40} ${height * 0.74} L ${width + 40} ${height + 40} L -40 ${height + 40} Z`}
            fill="url(#curve1)"
          />
          <Circle cx={width * 0.18} cy={height * 0.12} r={56} fill="#BCDFFF" opacity={0.10} />
          <Circle cx={width * 0.86} cy={height * 0.34} r={32} fill="#7FB3E8" opacity={0.18} />
          <Circle cx={width * 0.12} cy={height * 0.62} r={24} fill="#9DC8F0" opacity={0.15} />
        </Svg>
      </View>
    );
  }

  // Light meditation variant
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF' }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <SvgLinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" />
            <Stop offset="1" stopColor="#EAF3FF" />
          </SvgLinearGradient>
          <SvgLinearGradient id="curveTop" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#BCDFFF" stopOpacity="0.85" />
            <Stop offset="1" stopColor="#7FB3E8" stopOpacity="0.45" />
          </SvgLinearGradient>
          <SvgLinearGradient id="curveBot" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#CFE3FF" stopOpacity="0.85" />
            <Stop offset="1" stopColor="#BCDFFF" stopOpacity="0.55" />
          </SvgLinearGradient>
        </Defs>
        <Path d={`M0,0 L${width},0 L${width},${height} L0,${height} Z`} fill="url(#bg)" />
        {/* Top-right wave */}
        <Path
          d={`M ${width * 0.3} -40 C ${width * 0.5} ${height * 0.15}, ${width * 0.85} ${height * 0.08}, ${width + 40} ${height * 0.22} L ${width + 40} -40 L ${width * 0.3} -40 Z`}
          fill="url(#curveTop)"
        />
        {variant === 'full' ? (
          <Path
            d={`M -40 ${height * 0.7} C ${width * 0.25} ${height * 0.62}, ${width * 0.45} ${height * 0.88}, ${width + 40} ${height * 0.72} L ${width + 40} ${height + 40} L -40 ${height + 40} Z`}
            fill="url(#curveBot)"
          />
        ) : null}
        {/* Floating circles */}
        <Circle cx={width * 0.14} cy={height * 0.16} r={36} fill="#BCDFFF" opacity={0.6} />
        <Circle cx={width * 0.86} cy={height * 0.42} r={22} fill="#7FB3E8" opacity={0.45} />
        <Circle cx={width * 0.08} cy={height * 0.58} r={18} fill="#CFE3FF" opacity={0.8} />
        {variant === 'full' ? (
          <Circle cx={width * 0.78} cy={height * 0.85} r={28} fill="#BCDFFF" opacity={0.5} />
        ) : null}
      </Svg>
    </View>
  );
}
