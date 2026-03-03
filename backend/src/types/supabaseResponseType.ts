import type { PostgrestError } from "@supabase/supabase-js";

export interface SupabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
}
