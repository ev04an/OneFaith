import { Share } from 'react-native';
import * as Clipboard from 'expo-clipboard';

export async function shareText(text: string, title?: string): Promise<void> {
  try {
    await Share.share({ message: text, title });
  } catch {
    try {
      await Clipboard.setStringAsync(text);
    } catch {
      // swallow
    }
  }
}

export async function copyText(text: string): Promise<void> {
  await Clipboard.setStringAsync(text);
}
