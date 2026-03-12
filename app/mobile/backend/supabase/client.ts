// Supabase client for the Allowance Buddy app.
// Uses environment variables prefixed with EXPO_PUBLIC_ so Expo can
// inline them at build time (no secrets on the client — anon key only).
//
// To configure: copy .env.example to .env and fill in your Supabase
// project URL and anon key from https://supabase.com/dashboard.

import "react-native-url-polyfill/auto"; // required polyfill for Supabase on React Native
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "⚠️  Supabase URL or anon key is missing. " +
      "Copy .env.example to .env and add your credentials. " +
      "The app will run with mock data until Supabase is configured."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
