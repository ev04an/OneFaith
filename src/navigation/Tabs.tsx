import React, { useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../theme';
import * as haptics from '../utils/haptics';
import { HomeScreen } from '../screens/HomeScreen';
import { RecoveryScreen } from '../screens/RecoveryScreen';
import { PrayersScreen } from '../screens/PrayersScreen';
import { JournalScreen } from '../screens/JournalScreen';
import { BibleScreen } from '../screens/BibleScreen';
import type { TabsParamList } from './types';

const Tab = createBottomTabNavigator<TabsParamList>();

const ICONS: Record<keyof TabsParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Recovery: 'flame',
  Prayers: 'leaf',
  Journal: 'book',
  Bible: 'library',
};

const LABELS: Record<keyof TabsParamList, string> = {
  Home: 'Home',
  Recovery: 'Recovery',
  Prayers: 'Prayers',
  Journal: 'Journal',
  Bible: 'Bible',
};

export function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Recovery" component={RecoveryScreen} />
      <Tab.Screen name="Prayers" component={PrayersScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Bible" component={BibleScreen} />
    </Tab.Navigator>
  );
}

function CustomTabBar({ state, navigation }: any) {
  const theme = useTheme();
  const [tabWidth, setTabWidth] = useState(0);
  const indicatorX = useSharedValue(0);

  // Slide the gradient indicator under the active tab. Position is measured
  // once we know the layout width, then sprung between tab slots.
  React.useEffect(() => {
    if (tabWidth > 0) {
      indicatorX.value = withSpring(state.index * tabWidth, {
        damping: 18,
        stiffness: 220,
        mass: 0.6,
      });
    }
  }, [state.index, tabWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const onRowLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width / Math.max(1, state.routes.length);
    if (Math.abs(w - tabWidth) > 0.5) setTabWidth(w);
  };

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.bar,
        {
          bottom: Platform.OS === 'ios' ? 24 : 18,
          borderColor: theme.colors.borderStrong,
        },
      ]}
    >
      <View style={[StyleSheet.absoluteFill, { borderRadius: 30, overflow: 'hidden' }]}>
        <BlurView
          intensity={70}
          tint={theme.isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: theme.isDark
                ? 'rgba(10,7,32,0.88)'
                : 'rgba(255,255,255,0.94)',
            },
          ]}
        />
      </View>

      {/* Sliding gradient indicator — a soft glow that follows the active tab */}
      {tabWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            { width: tabWidth },
            indicatorStyle,
          ]}
        >
          <LinearGradient
            colors={['rgba(91,155,227,0)', 'rgba(91,155,227,0.55)', 'rgba(91,155,227,0)'] as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.indicatorBar}
          />
        </Animated.View>
      ) : null}

      <View style={styles.row} onLayout={onRowLayout}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;
          const name = route.name as keyof TabsParamList;
          return (
            <TabButton
              key={route.key}
              name={name}
              focused={focused}
              onPress={() => {
                if (!focused) {
                  haptics.select();
                  navigation.navigate(route.name);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

function TabButton({
  name,
  focused,
  onPress,
}: {
  name: keyof TabsParamList;
  focused: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  const t = useSharedValue(focused ? 1 : 0);
  React.useEffect(() => {
    t.value = withSpring(focused ? 1 : 0, { damping: 16, stiffness: 220 });
  }, [focused, t]);

  const lift = useAnimatedStyle(() => ({
    transform: [{ translateY: -t.value * 2 }],
  }));
  const pill = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ scale: 0.85 + t.value * 0.15 }],
  }));

  const activeColor = theme.colors.primary;
  const inactiveColor = theme.isDark ? theme.colors.textMuted : theme.colors.textFaint;

  return (
    <Pressable onPress={onPress} style={styles.tab} hitSlop={8}>
      <Animated.View style={[styles.tabInner, lift]}>
        <View style={styles.iconWrap}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activePill,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(201,182,255,0.22)'
                  : 'rgba(90,63,224,0.14)',
              },
              pill,
            ]}
          />
          <Ionicons
            name={(focused ? ICONS[name] : `${ICONS[name]}-outline`) as any}
            size={22}
            color={focused ? activeColor : inactiveColor}
          />
        </View>
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            { color: focused ? activeColor : inactiveColor },
          ]}
        >
          {LABELS[name]}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 78,
    borderRadius: 30,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 14,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 44,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    left: 6,
    right: 6,
    bottom: 0,
    borderRadius: 14,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginTop: 4,
  },
  indicator: {
    position: 'absolute',
    top: 6,
    height: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorBar: {
    width: '60%',
    height: 3,
    borderRadius: 2,
  },
});
