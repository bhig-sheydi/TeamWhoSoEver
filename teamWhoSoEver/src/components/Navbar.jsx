import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import logo from "../assets/logo2.png";
import { useAuth } from "@/contexts/Auth";
import { Menu, X, LogOut } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, logout } = useAuth(); // ✅ make sure logout() exists in your AuthContext
  const navigate = useNavigate();

  const adminEmails = ["headjada@gmail.com", "anotheradmin@example.com"];
  const isAdmin = adminEmails.includes(session?.user?.email);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    try {
      await logout(); // ✅ Log user out
      setMenuOpen(false);
      navigate("/"); // ✅ Redirect home after successful logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="absolute top-0 left-0 w-full z-30 bg-transparent p-4 text-white">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} className="w-12 rounded-full" alt="Logo" />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />

          {/* Hamburger button */}
          <button
            onClick={toggleMenu}
            className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Slide-out menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-gradient-to-b from-purple-700 to-indigo-800 text-white rounded-l-full shadow-lg transform transition-all duration-500 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 text-lg font-semibold">
          <Link
            to="/"
            className="hover:text-yellow-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

                    <Link
            to="/orders"
            className="hover:text-yellow-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </Link>

          <Link
            to={isAdmin ? "/dashboard" : "/dashboard"}
            className="hover:text-yellow-300 transition"
            onClick={() => setMenuOpen(false)}
          >
            {isAdmin ? "Dashboard" : "Shop"}
          </Link>

          {!session ? (
            <>
              <Link
                to="/login"
                className="hover:text-yellow-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="hover:text-yellow-300 transition"
                onClick={() => setMenuOpen(false)}
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-yellow-300 hover:text-red-400 transition"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
