// src/Pages/LoginCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          console.log("Session detected:", session);
          navigate("/dashboard"); // redirect to dashboard
        }
      });

      // Also try to get session from URL in case of first load
      const { data, error } = await supabase.auth.getSessionFromUrl({
        storeSession: true,
      });

      if (error) {
        console.error("Error getting session from URL:", error.message);
        navigate("/login");
      } else if (data.session) {
        navigate("/dashboard");
      }

      return () => {
        subscription.unsubscribe();
      };
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">
      <p className="text-lg md:text-xl">Processing login, please wait...</p>
    </div>
  );
};

export default LoginCallback;
