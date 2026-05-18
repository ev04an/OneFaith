import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '../state/store';

export function tap() {
  if (!useSettingsStore.getState().hapticsEnabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function select() {
  if (!useSettingsStore.getState().hapticsEnabled) return;
  Haptics.selectionAsync().catch(() => {});
}

export function success() {
  if (!useSettingsStore.getState().hapticsEnabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function warning() {
  if (!useSettingsStore.getState().hapticsEnabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
}

export function heavy() {
  if (!useSettingsStore.getState().hapticsEnabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
}
