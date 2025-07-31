"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AdminNavbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const goTo = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const active = (path: string) =>
    router.pathname === path
      ? "text-pink-500 font-bold"
      : "hover:text-pink-500";

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-between items-center px-6 py-4 
        bg-white/80 dark:bg-gray-900/90 
        text-gray-800 dark:text-white 
        shadow-lg sticky top-0 z-50 rounded-b-2xl"
    >
      {/* Logo Admin */}
      <h1
        onClick={() => goTo("/admin/dashboard")}
        className="text-2xl font-bold text-pink-500 cursor-pointer"
      >
        🛠 Admin Panel
      </h1>

      {/* Menu Desktop */}
      <div className="hidden md:flex gap-4 items-center">
        <button onClick={() => goTo("/admin/dashboard")} className={active("/admin/dashboard")}>
          📊 Dashboard
        </button>
        <button onClick={() => goTo("/admin/panorama")} className={active("/admin/panorama")}>
          🏞 Panorama
        </button>
        <button onClick={() => goTo("/admin/tradisi")} className={active("/admin/tradisi")}>
          🏺 Tradisi
        </button>
        <button onClick={() => goTo("/admin/testimoni")} className={active("/admin/testimoni")}>
          ⭐ Testimoni
        </button>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
        <button
          onClick={logout}
          className="px-3 py-1 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-semibold shadow-md hover:opacity-90 transition"
        >
          🚪 Logout
        </button>
      </div>

      {/* Menu Mobile (Hamburger) */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-pink-500"
        >
          ☰
        </button>
      </div>

      {/* Dropdown Mobile */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 flex flex-col gap-2 md:hidden text-gray-800 dark:text-white">
          <button onClick={() => goTo("/admin/dashboard")}>📊 Dashboard</button>
          <button onClick={() => goTo("/admin/panorama")}>🏞 Panorama</button>
          <button onClick={() => goTo("/admin/tradisi")}>🏺 Tradisi</button>
          <button onClick={() => goTo("/admin/testimoni")}>⭐ Testimoni</button>
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              setMenuOpen(false);
            }}
            className="px-3 py-1 rounded bg-gradient-to-r from-pink-500 to-purple-500 text-white"
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
          <button
            onClick={logout}
            className="mt-2 px-3 py-1 rounded bg-gradient-to-r from-red-500 to-pink-600 text-white"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </motion.nav>
  );
}
