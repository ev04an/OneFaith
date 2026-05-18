# Supabase setup for OneFaith

The auth screens are wired up. To make sign-in actually work you need a
Supabase project and two environment variables. ~5 minutes.

## 1. Create a Supabase project

1. Go to <https://supabase.com> and sign in (free tier is plenty).
2. **New project** → pick a name (e.g. `onefaith`), a strong DB password, and
   the region closest to your users. Wait ~1 minute for provisioning.

## 2. Copy the API keys

In the new project: **Project Settings → API**. You need two values:

- `Project URL` — looks like `https://abcdefghijklmn.supabase.co`
- `anon` `public` key — a long `eyJ...` string. (Do *not* use the
  `service_role` key in the app — that bypasses RLS and would leak admin
  access from the client bundle.)

## 3. Add them to `.env`

Create a file named **`.env`** at the project root (same folder as `app.json`)
with:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

`.env` is already gitignored, so your keys won't be committed.

Expo inlines any var prefixed with `EXPO_PUBLIC_` into the app bundle at
build time, which is why the keys must use that prefix.

## 4. Enable email auth in Supabase

In the dashboard: **Authentication → Providers → Email**.

- It is on by default.
- **Confirm email** is on by default — meaning new sign-ups must click a
  confirmation link before they can log in. You can turn it off if you want
  one-step signup, but leaving it on is the secure default.

## 5. Configure the password-reset deep link

In the dashboard: **Authentication → URL Configuration**.

- Under **Redirect URLs**, add: `onefaith://auth/reset`
- Save.

This is the URL OneFaith asks Supabase to put in password-reset emails. The
`onefaith://` scheme is already declared in `app.json`, so tapping the link
on a phone with the app installed will jump straight back into OneFaith.

> Note: this build doesn't yet *handle* the deep link to drop the user on a
> "set new password" screen — that's a follow-up. For now the reset email
> arrives and Supabase's hosted page lets them set a new password in a
> browser, which is enough to recover the account.

## 6. Restart Expo with a clean cache

Environment variables are baked at bundle time, so after editing `.env`:

```bash
npx expo start -c
```

The `-c` clears Metro's cache. After that, open Settings → Account → Sign in.

## What works after setup

- Sign up with email + password (sends a confirmation email)
- Log in
- Log out
- Forgot password (emails a reset link to the user)

## What's *not* yet wired

- Cloud sync of journal / favorites / streak. The app still keeps everything
  in `AsyncStorage` on each device. Account exists, data stays local — that
  separation was intentional so we can ship auth first.
- OAuth providers (Google / Apple). Email + password only.
- Avatar upload, display name editing.

Tell me when you're ready for any of those.
