import React from "react";
import logo from "../assets/logo2.png";
import cover from "../assets/cover.png";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";


function Banner() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image with subtle scale animation */}
      <img
        src={cover}
        alt="Team Whosoever Banner"
        className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[2000ms] ease-in-out hover:scale-100"
      />

      {/* Multi-layered gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70"></div>
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>

  

      {/* Centered Hero Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10 space-y-4">
        {/* Logo with floating animation */}
        <img
          src={logo}
          alt="Logo"
          className="w-32 md:w-40 mb-4 animate-bounce-slow"
        />

        {/* Headline with premium typography & subtle letter spacing */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl tracking-wide">
          Team Whosoever
        </h1>

        {/* Subtext with layered shadow and dynamic fade-in */}
        <p className="text-lg md:text-2xl text-white mt-2 mb-6 drop-shadow-lg opacity-90 animate-fadeIn">
          Every design is a declaration.
        </p>

        {/* CTA Button with 3D gradient and hover glow */}
        <Button className="bg-gradient-to-r from-green-500 to-lime-400 hover:from-lime-400 hover:to-green-500 text-black font-bold rounded-2xl px-8 py-4 flex items-center gap-3 text-xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <ShoppingCart className="w-6 h-6" />
          Shop Now
        </Button>
      </div>

      {/* Decorative subtle floating elements for premium feel */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-green-500/20 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-16 w-24 h-24 bg-lime-400/20 rounded-full animate-pulse-slow"></div>
    </div>
  );
}

export default Banner;
