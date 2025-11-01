import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import bgImage from "../assets/cover.png";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);
    setMessage("");

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      // Optional: store user info in 'profiles' table
      if (signUpData?.user) {
        await supabase.from("profiles").insert([
          {
            id: signUpData.user.id,
            full_name: name,
            email,
          },
        ]);
      }

      setMessage("Check your email to confirm your account!");
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    const { error: googleError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/login-callback`,
      },
    });

    if (googleError) setError(googleError.message);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 p-8 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-sm">
        <h2 className="text-3xl font-extrabold text-center text-green-500 mb-4">
          Sign Up
        </h2>

        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        {message && <p className="text-green-500 text-sm text-center mb-2">{message}</p>}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full mt-4 py-3 bg-orange-500 text-black font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-105"
        >
          {loading ? "Connecting..." : "Sign Up with Google"}
        </button>

        <p className="text-sm text-center text-gray-100 dark:text-gray-300 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
