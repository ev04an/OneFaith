import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import * as haptics from '../utils/haptics';

export type ToastVariant = 'success' | 'info' | 'error';

export type ShowToastOpts = {
  /** Body text shown in the snackbar. */
  message: string;
  /** Visual tone (default 'info'). */
  variant?: ToastVariant;
  /** Optional Ionicon override. Defaults are picked per-variant. */
  icon?: keyof typeof Ionicons.glyphMap;
  /** How long the toast remains fully visible before fading out (ms). */
  duration?: number;
};

type ToastContextValue = {
  show: (opts: ShowToastOpts) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fall back to a no-op rather than throw — keeps the rest of the app
    // resilient if the provider is ever missing in a render path.
    return { show: () => {} };
  }
  return ctx;
}

type ActiveToast = {
  id: number;
  message: string;
  variant: ToastVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  duration: number;
};

/**
 * Place once near the root of the app (inside SafeAreaProvider). Renders a
 * floating premium snackbar with frosted backdrop, gradient hairline, and a
 * tonal accent for the icon chip. UI-thread animations only.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ActiveToast | null>(null);
  const nextId = useRef(1);

  const show = useCallback((opts: ShowToastOpts) => {
    const variant = opts.variant ?? 'info';
    const duration = Math.max(800, opts.duration ?? 2200);
    if (variant === 'success') haptics.success();
    else if (variant === 'error') haptics.warning();
    else haptics.tap();
    setActive({
      id: nextId.current++,
      message: opts.message,
      variant,
      icon: opts.icon,
      duration,
    });
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {active ? (
        <ToastView
          key={active.id}
          toast={active}
          onDismiss={() => setActive((cur) => (cur && cur.id === active.id ? null : cur))}
        />
      ) : null}
    </ToastContext.Provider>
  );
}

function ToastView({
  toast,
  onDismiss,
}: {
  toast: ActiveToast;
  onDismiss: () => void;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const t = useSharedValue(0);

  useEffect(() => {
    // Fade in -> hold -> fade out. Must be sequenced into one animation:
    // assigning to t.value twice in a row cancels the first animation, so the
    // toast would otherwise render at opacity 0 the entire time.
    t.value = withSequence(
      withTiming(1, { duration: 280, easing: Easing.out(Easing.cubic) }),
      withDelay(
        toast.duration,
        withTiming(0, { duration: 260, easing: Easing.in(Easing.cubic) }, (finished) => {
          if (finished) runOnJS(onDismiss)();
        }),
      ),
    );
  }, [t, toast.duration, onDismiss]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ translateY: (1 - t.value) * 24 }],
  }));

  const { iconName, accent, accentSoft } = (() => {
    switch (toast.variant) {
      case 'success':
        return {
          iconName: toast.icon ?? ('checkmark-circle' as const),
          accent: '#3FB47C',
          accentSoft: 'rgba(63,180,124,0.18)',
        };
      case 'error':
        return {
          iconName: toast.icon ?? ('alert-circle' as const),
          accent: '#E07B6C',
          accentSoft: 'rgba(224,123,108,0.18)',
        };
      default:
        return {
          iconName: toast.icon ?? ('information-circle' as const),
          accent: '#5B9BE3',
          accentSoft: 'rgba(91,155,227,0.18)',
        };
    }
  })();

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        { bottom: insets.bottom + 108 }, // sits above the floating tab bar
        animStyle,
      ]}
    >
      <View
        style={[
          styles.card,
          {
            borderColor: theme.isDark
              ? 'rgba(155,200,240,0.22)'
              : 'rgba(15,31,75,0.14)',
          },
        ]}
      >
        {/* Frosted backdrop — iOS gets the real blur, Android a tinted scrim */}
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={40}
            tint={theme.isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFillObject}
          />
        ) : null}
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: theme.isDark
                ? 'rgba(10,18,42,0.92)'
                : 'rgba(255,255,255,0.96)',
            },
          ]}
        />
        <View style={[styles.iconChip, { backgroundColor: accentSoft }]}>
          <Ionicons name={iconName as any} size={18} color={accent} />
        </View>
        <Text
          numberOfLines={2}
          style={[
            theme.typography.bodyBold,
            styles.message,
            { color: theme.colors.text },
          ]}
        >
          {toast.message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 18,
    right: 18,
    alignItems: 'center',
    zIndex: 9999,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    maxWidth: 520,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.20,
    shadowRadius: 22,
    elevation: 8,
  },
  iconChip: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14.5,
    lineHeight: 19,
  },
});
