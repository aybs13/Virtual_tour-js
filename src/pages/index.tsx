"use client";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Navbar />

      <section className="flex flex-col-reverse md:flex-row items-center justify-center px-6 md:px-20 py-16 gap-10 flex-grow">
        {/* ✅ Teks Hero */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="max-w-lg text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
            Virtual Tour Tradisi Budaya Baruppu’
          </h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Jelajahi kekayaan budaya Toraja di Baruppu’ secara interaktif.
            Lihat keindahan <span className="font-bold text-pink-500">Patane</span> 
            dan kemegahan <span className="font-bold text-purple-500">Tongkonan</span> 
            dalam tur 360° modern.  
          </p>
          <Link href="/tour">
            <button className="px-6 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:opacity-90 transition">
              🚀 Mulai Virtual Tour
            </button>
          </Link>
        </motion.div>

        {/* ✅ Gambar Hero */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <img
            src="/images/manene.jpg"
            alt="Virtual Tour Baruppu"
            className="rounded-2xl shadow-2xl border-4 border-white dark:border-gray-700 max-h-[350px] object-cover"
          />
        </motion.div>
      </section>

      {/* ✅ Footer selalu di bawah */}
      <footer className="text-center py-4 text-gray-600 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} Virtual Tour Baruppu’ | Tradisi Budaya Toraja
      </footer>
    </div>
  );
}
