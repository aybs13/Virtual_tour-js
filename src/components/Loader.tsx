"use client";
import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col gap-4 items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black z-[9999]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-14 h-14 border-4 border-pink-500 border-t-transparent rounded-full shadow-lg"
      ></motion.div>
      <p className="text-pink-500 font-semibold animate-pulse dark:text-pink-400">
        ✨ Memuat Virtual Tour...
      </p>
    </div>
  );
}
