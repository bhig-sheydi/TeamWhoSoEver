import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Supabase parses the access token from URL automatically
      const { data, error } = await supabase.auth.getSessionFromUrl({
        storeSession: true, // saves session in local storage
      });

      if (error) {
        console.error("Error retrieving session:", error.message);
        navigate("/login"); // redirect to login if error
      } else if (data.session) {
        // Successful login, redirect to dashboard
        console.log("OAuth login success:", data.session);
        navigate("/dashboard");
      }
    };

    handleOAuthRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white">
      <p className="text-lg md:text-xl">Processing login, please wait...</p>
    </div>
  );
};

export default LoginCallback;
