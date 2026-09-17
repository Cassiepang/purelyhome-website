import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://rwlfjnygdhdbwcjlhprf.supabase.co"; // ✅ 到 .co 就结束
const supabaseKey = "sb_publishable_XjxwgUAH7t1udPhpxLqPcw_SFNxh9w0";

export const supabase = createClient(supabaseUrl, supabaseKey);

