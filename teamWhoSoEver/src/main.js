import { supabase } from "./lib/supabaseClient";

supabase.auth.getSession().then(({ data }) => {
  console.log("✅ Supabase connected:", data);
});
