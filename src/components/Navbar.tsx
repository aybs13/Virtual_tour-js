"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // Load dark mode setting from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", String(newMode));
    document.documentElement.classList.toggle("dark", newMode);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
  }, []);

  const goTo = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg sticky top-0 z-50 rounded-b-2xl"
    >
      <h1
        onClick={() => goTo("/")}
        className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 cursor-pointer hover:scale-105 transition"
      >
        VirtualTour Toraja
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4 items-center">
        <button onClick={() => goTo("/tour")} className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-100 dark:hover:bg-gray-700 transition">🏞 Virtual Tour</button>
        <button onClick={() => goTo("/testimoni")} className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-100 dark:hover:bg-gray-700 transition">⭐ Testimoni</button>
        {isAdmin && (
          <button onClick={() => goTo("/admin/dashboard")} className="px-4 py-2 rounded-full text-sm font-semibold hover:bg-pink-100 dark:hover:bg-gray-700 transition">🛠 Admin</button>
        )}
        <button onClick={toggleDarkMode} className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition">
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl text-pink-600 dark:text-pink-400 transition-transform">
          {menuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Dropdown Mobile */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 flex flex-col gap-3 md:hidden w-48">
          <button onClick={() => goTo("/tour")} className="text-left hover:text-pink-600 dark:hover:text-pink-400 transition">🏞 Virtual Tour</button>
          <button onClick={() => goTo("/testimoni")} className="text-left hover:text-pink-600 dark:hover:text-pink-400 transition">⭐ Testimoni</button>
          {isAdmin && (
            <button onClick={() => goTo("/admin/dashboard")} className="text-left hover:text-pink-600 dark:hover:text-pink-400 transition">🛠 Admin</button>
          )}
          <button onClick={() => { toggleDarkMode(); setMenuOpen(false); }} className="mt-2 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition">
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      )}
    </motion.nav>
  );
}
