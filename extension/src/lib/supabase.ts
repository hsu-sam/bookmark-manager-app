import { createClient } from "@supabase/supabase-js";
import { chromeStorageAdapter } from "./chromeStorageAdapter";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: chromeStorageAdapter,
      storageKey: "bookmark-manager-extension-auth",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  },
);
