# Allowance Buddy — Mobile App

The Expo React Native app for **Allowance Buddy**, a playful tool that helps
children earn allowance by completing chores, building good habits, and learning
about saving, spending, and investing.

> **Status:** starter scaffold with mock data — no live backend yet.

---

## Folder Structure

```
app/mobile/
├── App.tsx                        # Entry point — renders navigation
├── frontend/                      # Everything the user sees
│   ├── screens/                   # Full-page screens
│   │   ├── ChildHomeScreen.tsx
│   │   ├── ParentDashboardScreen.tsx
│   │   └── RewardsScreen.tsx
│   ├── components/                # Reusable UI pieces
│   │   ├── BalanceCard.tsx
│   │   └── RewardCard.tsx
│   ├── navigation/                # React Navigation setup
│   │   └── index.tsx
│   └── theme/                     # Colors, fonts, spacing
│       └── colors.ts
├── backend/                       # Data layer (Supabase + helpers)
│   ├── supabase/
│   │   └── client.ts              # Supabase client initialisation
│   ├── services/
│   │   └── rewards.ts             # Mock service functions
│   └── types/
│       └── index.ts               # Shared TypeScript types
├── app.json                       # Expo project config
├── babel.config.js
├── tsconfig.json
├── package.json
├── .env.example                   # Required env vars template
└── .gitignore
```

## Getting Started

### 1. Install Dependencies

```bash
cd app/mobile
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Then fill in your Supabase project credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> You can skip this step for now — the app runs fine with mock data.

### 3. Start Expo

```bash
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or press `w` for web.

## Available Scripts

| Script          | Command               | Description              |
| --------------- | --------------------- | ------------------------ |
| `npm start`     | `expo start`          | Start Expo dev server    |
| `npm run ios`   | `expo start --ios`    | Start on iOS simulator   |
| `npm run android` | `expo start --android` | Start on Android emulator |
| `npm run web`   | `expo start --web`    | Start in the browser     |

## Environment Variables

| Variable                          | Required | Description                    |
| --------------------------------- | -------- | ------------------------------ |
| `EXPO_PUBLIC_SUPABASE_URL`        | Later    | Your Supabase project URL      |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY`   | Later    | Supabase anon (public) API key |

## Current State

- **Mock data only** — all screens use hardcoded sample data
- **No authentication** — auth screens will be added later
- **No database queries** — service functions return mock arrays
- **Expo Go compatible** — no native modules required

## Tech Stack

- [Expo](https://expo.dev/) (SDK 52)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Navigation](https://reactnavigation.org/) (bottom tabs)
- [Supabase JS](https://supabase.com/docs/reference/javascript/) (client ready, not wired up yet)
