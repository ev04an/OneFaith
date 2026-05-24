import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { GlassCard } from '../components/GlassCard';
import { GradientButton } from '../components/GradientButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { useTheme } from '../theme';
import { usePrayerIntentionsStore, type PrayerIntention } from '../state/store';
import * as haptics from '../utils/haptics';
import type { RootStackParamList } from '../navigation/types';

export function PrayerIntentionsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const intentions = usePrayerIntentionsStore((s) => s.intentions);
  const add = usePrayerIntentionsStore((s) => s.add);

  const [composing, setComposing] = useState(intentions.length === 0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [name, setName] = useState('');
  const [anonymous, setAnonymous] = useState(false);

  const canSave = title.trim().length > 0 && body.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    haptics.success();
    add({
      title: title.trim(),
      body: body.trim(),
      name: anonymous || !name.trim() ? undefined : name.trim(),
      anonymous,
    });
    setTitle('');
    setBody('');
    setName('');
    setAnonymous(false);
    setComposing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground variant="primary" intensity={0.55} />
      <ScreenHeader
        onBack={() => nav.goBack()}
        title="Prayer Intentions"
        large
        subtitle="LIFT EACH OTHER UP"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.screen,
            paddingTop: theme.spacing.lg,
            paddingBottom: insets.bottom + 60,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {composing ? (
            <Composer
              title={title}
              setTitle={setTitle}
              body={body}
              setBody={setBody}
              name={name}
              setName={setName}
              anonymous={anonymous}
              setAnonymous={setAnonymous}
              canSave={canSave}
              onSave={save}
              onCancel={
                intentions.length > 0
                  ? () => {
                      haptics.select();
                      setComposing(false);
                    }
                  : undefined
              }
            />
          ) : (
            <Pressable
              onPress={() => {
                haptics.select();
                setComposing(true);
              }}
            >
              <GlassCard padded={18}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
                  <Text
                    style={[
                      theme.typography.bodyBold,
                      { color: theme.colors.text, marginLeft: 12, flex: 1 },
                    ]}
                  >
                    Submit a prayer intention
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color={theme.colors.textFaint} />
                </View>
              </GlassCard>
            </Pressable>
          )}

          {intentions.length > 0 ? (
            <Text
              style={[
                theme.typography.overline,
                {
                  color: theme.colors.textMuted,
                  marginTop: 26,
                  marginBottom: 12,
                },
              ]}
            >
              YOUR INTENTIONS · {intentions.length}
            </Text>
          ) : null}

          <View style={{ gap: 12 }}>
            {intentions.map((item) => (
              <IntentionCard key={item.id} item={item} />
            ))}
          </View>

          {intentions.length === 0 && !composing ? (
            <Text
              style={[
                theme.typography.body,
                {
                  color: theme.colors.textMuted,
                  marginTop: 24,
                  textAlign: 'center',
                  lineHeight: 22,
                },
              ]}
            >
              Submit a request for someone you’re carrying — a need, a struggle, a
              hope. Each tap of “Pray for this” keeps the count.
            </Text>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Composer({
  title,
  setTitle,
  body,
  setBody,
  name,
  setName,
  anonymous,
  setAnonymous,
  canSave,
  onSave,
  onCancel,
}: {
  title: string;
  setTitle: (v: string) => void;
  body: string;
  setBody: (v: string) => void;
  name: string;
  setName: (v: string) => void;
  anonymous: boolean;
  setAnonymous: (v: boolean) => void;
  canSave: boolean;
  onSave: () => void;
  onCancel?: () => void;
}) {
  const theme = useTheme();
  return (
    <View>
      <Text style={[theme.typography.overline, { color: theme.colors.textMuted }]}>
        NEW INTENTION
      </Text>

      <FieldLabel style={{ marginTop: 16 }}>Title</FieldLabel>
      <View
        style={[
          styles.field,
          { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.inputBorder },
        ]}
      >
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="A short title for this prayer"
          placeholderTextColor={theme.colors.inputPlaceholder}
          selectionColor={theme.colors.primary}
          cursorColor={theme.colors.inputCaret}
          underlineColorAndroid="transparent"
          style={[styles.input, { color: theme.colors.inputText }]}
        />
      </View>

      <FieldLabel style={{ marginTop: 14 }}>Prayer request</FieldLabel>
      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.inputBg,
            borderColor: theme.colors.inputBorder,
            minHeight: 140,
            alignItems: 'flex-start',
          },
        ]}
      >
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="What would you like prayer for?"
          placeholderTextColor={theme.colors.inputPlaceholder}
          selectionColor={theme.colors.primary}
          cursorColor={theme.colors.inputCaret}
          underlineColorAndroid="transparent"
          multiline
          textAlignVertical="top"
          style={[
            styles.input,
            { color: theme.colors.inputText, minHeight: 120, lineHeight: 22 },
          ]}
        />
      </View>

      <FieldLabel style={{ marginTop: 14 }}>Your name (optional)</FieldLabel>
      <View
        style={[
          styles.field,
          {
            backgroundColor: theme.colors.inputBg,
            borderColor: theme.colors.inputBorder,
            opacity: anonymous ? 0.5 : 1,
          },
        ]}
      >
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Leave blank to stay anonymous"
          placeholderTextColor={theme.colors.inputPlaceholder}
          selectionColor={theme.colors.primary}
          cursorColor={theme.colors.inputCaret}
          underlineColorAndroid="transparent"
          editable={!anonymous}
          style={[styles.input, { color: theme.colors.inputText }]}
        />
      </View>

      <View style={[styles.switchRow, { marginTop: 14 }]}>
        <Ionicons
          name={anonymous ? 'eye-off-outline' : 'eye-outline'}
          size={20}
          color={theme.colors.primary}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[theme.typography.bodyBold, { color: theme.colors.text }]}>
            Submit anonymously
          </Text>
          <Text
            style={[
              theme.typography.caption,
              { color: theme.colors.textMuted, marginTop: 2 },
            ]}
          >
            Hide your name from the intention card.
          </Text>
        </View>
        <Switch
          value={anonymous}
          onValueChange={(v) => {
            haptics.select();
            setAnonymous(v);
          }}
          trackColor={{ true: theme.colors.primary, false: 'rgba(120,120,150,0.4)' }}
          thumbColor="#fff"
        />
      </View>

      <View style={{ marginTop: 22 }}>
        <GradientButton
          label="Save intention"
          icon="checkmark"
          full
          size="lg"
          glow
          gradient="primary"
          disabled={!canSave}
          onPress={onSave}
        />
      </View>

      {onCancel ? (
        <Pressable onPress={onCancel} hitSlop={8} style={{ marginTop: 14, alignSelf: 'center' }}>
          <Text
            style={[
              theme.typography.caption,
              { color: theme.colors.textMuted, fontWeight: '600' },
            ]}
          >
            Cancel
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const IntentionCard = React.memo(function IntentionCard({
  item,
}: {
  item: PrayerIntention;
}) {
  const theme = useTheme();
  const prayFor = usePrayerIntentionsStore((s) => s.prayFor);
  const remove = usePrayerIntentionsStore((s) => s.remove);
  const alreadyPrayed = usePrayerIntentionsStore((s) => s.prayedFor.includes(item.id));

  const onPray = () => {
    if (alreadyPrayed) {
      haptics.select();
      Alert.alert(
        'Already prayed',
        'You have already prayed for this intention. Thank you for lifting it up.',
        [{ text: 'OK' }],
      );
      return;
    }
    const ok = prayFor(item.id);
    if (ok) {
      haptics.success();
    } else {
      // race / edge case — refresh state
      Alert.alert('Already prayed', 'You have already prayed for this intention.', [
        { text: 'OK' },
      ]);
    }
  };

  const onLongPress = () => {
    Alert.alert(
      'Delete intention?',
      'This will permanently remove this prayer intention.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => remove(item.id),
        },
      ],
    );
  };

  const author = item.anonymous ? 'Anonymous' : item.name?.trim() || 'You';
  const date = new Date(item.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Pressable onLongPress={onLongPress} delayLongPress={450}>
      <GlassCard padded={18}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Ionicons name="hand-left" size={20} color={theme.colors.primary} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[theme.typography.h3, { color: theme.colors.text }]}>
              {item.title}
            </Text>
            <Text
              style={[
                theme.typography.caption,
                { color: theme.colors.textMuted, marginTop: 4 },
              ]}
            >
              {author} · {date}
            </Text>
            <Text
              style={[
                theme.typography.body,
                { color: theme.colors.textMuted, marginTop: 10, lineHeight: 22, fontSize: 15 },
              ]}
            >
              {item.body}
            </Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="flame" size={16} color={theme.colors.primary} />
            <Text
              style={[
                theme.typography.caption,
                {
                  color: theme.colors.textMuted,
                  marginLeft: 6,
                  fontWeight: '700',
                },
              ]}
            >
              {item.prayCount} {item.prayCount === 1 ? 'prayer' : 'prayers'}
            </Text>
          </View>
          <Pressable onPress={onPray} hitSlop={8}>
            <View
              style={[
                styles.prayBtn,
                {
                  borderColor: alreadyPrayed ? theme.colors.success : theme.colors.primary,
                  backgroundColor: alreadyPrayed ? 'rgba(21,119,82,0.10)' : 'transparent',
                },
              ]}
            >
              <Ionicons
                name={alreadyPrayed ? 'checkmark' : 'add'}
                size={16}
                color={alreadyPrayed ? theme.colors.success : theme.colors.primary}
              />
              <Text
                style={[
                  theme.typography.bodyBold,
                  {
                    color: alreadyPrayed ? theme.colors.success : theme.colors.primary,
                    marginLeft: 6,
                    fontSize: 13,
                  },
                ]}
              >
                {alreadyPrayed ? 'Prayed' : 'Pray for this'}
              </Text>
            </View>
          </Pressable>
        </View>
      </GlassCard>
    </Pressable>
  );
});

function FieldLabel({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  const theme = useTheme();
  return (
    <Text
      style={[
        theme.typography.caption,
        {
          color: theme.colors.textMuted,
          letterSpacing: 0.6,
          marginBottom: 8,
          textTransform: 'uppercase',
          fontWeight: '700',
          fontSize: 11,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Platform.OS === 'ios' ? 0 : 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  prayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
});
