import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Path, Rect, Line } from 'react-native-svg';
import { colors } from '../../constants/tokens';

interface BristolVisualProps {
  type: number;
  color?: string;
  size?: number;
}

function BristolType1({ color, size }: { color: string; size: number }) {
  const r = size * 0.12;
  return (
    <Svg width={size} height={size} viewBox="0 0 60 60">
      <Circle cx="15" cy="30" r={r * 3} fill={color} />
      <Circle cx="30" cy="25" r={r * 2.5} fill={color} />
      <Circle cx="45" cy="32" r={r * 2.8} fill={color} />
    </Svg>
  );
}

function BristolType2({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 40">
      <Path
        d="M5,20 Q12,10 20,20 Q28,30 36,20 Q44,10 52,20 Q60,30 68,20 Q74,14 78,20 Q74,28 68,22 Q60,34 52,22 Q44,12 36,22 Q28,32 20,22 Q12,32 6,24 Z"
        fill={color}
      />
    </Svg>
  );
}

function BristolType3({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 35">
      <Rect x="5" y="5" width="70" height="25" rx="12" ry="12" fill={color} />
      <Line x1="28" y1="5" x2="25" y2="30" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
      <Line x1="50" y1="5" x2="47" y2="30" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
    </Svg>
  );
}

function BristolType4({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 35">
      <Rect x="5" y="5" width="70" height="25" rx="12" ry="12" fill={color} />
    </Svg>
  );
}

function BristolType5({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 40">
      <Ellipse cx="15" cy="22" rx="12" ry="9" fill={color} />
      <Ellipse cx="40" cy="18" rx="14" ry="11" fill={color} />
      <Ellipse cx="65" cy="23" rx="11" ry="8" fill={color} />
    </Svg>
  );
}

function BristolType6({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 50">
      <Path
        d="M10,25 Q15,10 25,15 Q30,5 40,12 Q50,5 55,15 Q65,10 70,25 Q72,35 65,38 Q55,45 40,42 Q25,45 15,38 Q8,35 10,25 Z"
        fill={color}
      />
    </Svg>
  );
}

function BristolType7({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 40">
      <Path d="M5,12 Q20,6 35,12 Q50,18 65,12 Q72,9 76,12" stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />
      <Path d="M5,22 Q20,16 35,22 Q50,28 65,22 Q72,19 76,22" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <Path d="M5,32 Q20,26 35,32 Q50,38 65,32 Q72,29 76,32" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
    </Svg>
  );
}

const BRISTOL_COLORS: Record<string, string> = {
  ok: colors.acc,
  watch: colors.wa,
  alert: colors.al,
};

const BRISTOL_STATUS: Record<number, string> = {
  1: 'alert',
  2: 'watch',
  3: 'ok',
  4: 'ok',
  5: 'watch',
  6: 'watch',
  7: 'alert',
};

export function BristolVisual({ type, color, size = 80 }: BristolVisualProps) {
  const fillColor = color ?? BRISTOL_COLORS[BRISTOL_STATUS[type] ?? 'ok'];

  const visuals: Record<number, React.ReactElement> = {
    1: <BristolType1 color={fillColor} size={size} />,
    2: <BristolType2 color={fillColor} size={size} />,
    3: <BristolType3 color={fillColor} size={size} />,
    4: <BristolType4 color={fillColor} size={size} />,
    5: <BristolType5 color={fillColor} size={size} />,
    6: <BristolType6 color={fillColor} size={size} />,
    7: <BristolType7 color={fillColor} size={size} />,
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {visuals[type] ?? null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
