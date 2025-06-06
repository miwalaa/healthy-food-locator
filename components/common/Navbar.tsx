"use client";

import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  homeSectionRef: React.RefObject<HTMLElement | null>;
  mapSectionRef: React.RefObject<HTMLElement | null>;
}

const Navbar: React.FC<NavbarProps> = ({ homeSectionRef, mapSectionRef }) => {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (mapSectionRef.current) {
        const mapTop = mapSectionRef.current.getBoundingClientRect().top;
        if (mapTop <= window.innerHeight / 2) {
          setActive("map");
        } else {
          setActive("home");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mapSectionRef]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const scrollToSection = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Nav */}
      <div className="relative flex items-center justify-between px-6 py-4 bg-white shadow-md">
        {/* Logo */}
        <h1
          style={{
            fontFamily: "var(--font-anton)",
            background: "linear-gradient(#B6E96F 20%, #2CA840)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1px",
          }}
          className="absolute left-1/2 transform -translate-x-1/2 text-3xl md:text-5xl font-anton font-bold tracking-wide"
        >
          SEHATFOOD
        </h1>

        {/* Mobile Burger */}
        <div className="md:hidden z-50">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-green-100 transition"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-3 z-10">
          <button
            onClick={() => scrollToSection(homeSectionRef)}
            className={`px-4 py-2 rounded-full font-medium transition ${
              active === "home"
                ? "green-button hover:brightness-110"
                : "text-black hover:text-green-600"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection(mapSectionRef)}
            className={`px-5 py-2 rounded-full font-medium transition ${
              active === "map"
                ? "green-button hover:brightness-110"
                : "text-black hover:text-green-600"
            }`}
          >
            Map
          </button>
        </nav>
      </div>

      {/* Mobile Fullscreen Menu with Modern Animation */}
      <div
        className={`fixed inset-0 z-40 bg-green-600 text-white transform transition-all duration-500 ease-in-out flex flex-col items-center justify-center ${
          menuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-10 flex-grow">
          <button
            onClick={() => scrollToSection(homeSectionRef)}
            className="text-3xl font-semibold hover:underline transition-all duration-300"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection(mapSectionRef)}
            className="text-3xl font-semibold hover:underline transition-all duration-300"
          >
            Map
          </button>
        </div>
        {/* Copyright */}
        <p className="pb-6 text-sm text-white/80">&copy; {new Date().getFullYear()} SEHATFOOD</p>
      </div>
    </header>
  );
};

export default Navbar;
