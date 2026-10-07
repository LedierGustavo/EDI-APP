import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ynunxrvepaokkafxhzda.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InludW54cnZlcGFva2thZnhoemRhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjE0NjMyMSwiZXhwIjoyMDk3NzIyMzIxfQ.EGbbgfwNL3Ghh3K3lMj91Qej3TxGLa1qK3yJL4Ffjns";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface CredencialRow {
  id: number;
  usuario: string;
}
