import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "https://wltthetqeqixvwuvldaf.supabase.co";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsdHRoZXRxZXFpeHZ3dXZsZGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU2NjY2NTAsImV4cCI6MjAyMTI0MjY1MH0.p-Z8CdMsk88W_zq5WmokMXx10_zAxdDI-p7yLcISqPU";

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
