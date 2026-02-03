import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import logo from "../assets/logo2.png";
import { useAuth } from "@/contexts/Auth";
import {
  Menu,
  X,
  LogOut,
  ShoppingCart,
  Palette,
  Home,
  Package,
  LayoutDashboard,
  Store,
  LogIn,
  UserPlus
} from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  const adminEmails = ["headjada@gmail.com", "anotheradmin@example.com"];
  const isAdmin = adminEmails.includes(session?.user?.email);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const linkClass =
    "flex items-center gap-3 hover:text-yellow-300 transition";

  return (
    <nav className="absolute top-0 left-0 w-full z-30 bg-transparent p-4 text-white pl-56">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} className="w-12 rounded-full" alt="Logo" />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          <DarkModeToggle />
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
        <div className="flex flex-col items-start justify-center h-full space-y-7 text-lg font-semibold pl-10">

          <Link to="/" onClick={() => setMenuOpen(false)} className={linkClass}>
            <Home className="w-5 h-5" />
            Home
          </Link>

          {!isAdmin && (
            <Link to="/orders" onClick={() => setMenuOpen(false)} className={linkClass}>
              <Package className="w-5 h-5" />
              Orders
            </Link>
          )}

          {/* 🛒 Cart — USERS ONLY */}
          {!isAdmin && session && (
            <Link to="/cart" onClick={() => setMenuOpen(false)} className={linkClass}>
              <ShoppingCart className="w-5 h-5" />
              Cart
            </Link>
          )}

          {/* 🎨 Customize — USERS ONLY */}
          {!isAdmin && session && (
            <Link to="/custom" onClick={() => setMenuOpen(false)} className={linkClass}>
              <Palette className="w-5 h-5" />
              Customize
            </Link>
          )}

          {/* Admin → Dashboard | User → Shop */}
          <Link to="/dashboard" onClick={() => setMenuOpen(false)} className={linkClass}>
            {isAdmin ? (
              <>
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </>
            ) : (
              <>
                <Store className="w-5 h-5" />
                Shop
              </>
            )}
          </Link>

          {!session ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className={linkClass}>
                <LogIn className="w-5 h-5" />
                Login
              </Link>

              <Link to="/signup" onClick={() => setMenuOpen(false)} className={linkClass}>
                <UserPlus className="w-5 h-5" />
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 text-yellow-300 hover:text-red-400 transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
