"use client";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      {/* Background Orbs */}
      <div className="absolute w-[600px] h-[600px] bg-purple-300 dark:bg-purple-900 rounded-full top-[-100px] left-[-100px] opacity-20 animate-pulse blur-3xl"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-300 dark:bg-pink-900 rounded-full bottom-[-150px] right-[-100px] opacity-20 animate-pulse blur-2xl"></div>

      <Navbar />

      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-center px-6 md:px-20 py-24 gap-12 flex-grow relative z-10">
        <motion.div
          initial={{ x: -60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-lg text-center md:text-left"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-6 leading-tight">
            Virtual Tour Tradisi Budaya Baruppu’
          </h1>
          <p className="text-gray-800 dark:text-gray-300 mb-6 text-lg leading-relaxed">
            Jelajahi kekayaan budaya Toraja secara interaktif. Rasakan
            keindahan <span className="font-semibold text-pink-500">Patane</span> dan kemegahan <span className="font-semibold text-purple-500">Tongkonan</span> melalui tur 360° yang memukau dan edukatif.
          </p>
          <Link href="/tour">
            <button className="px-6 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-200">
              Mulai Virtual Tour
            </button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ x: 60, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <Image
            src="/images/manene.jpg"
            alt="Ilustrasi tradisi Manene dari Baruppu Toraja"
            width={500}
            height={350}
            className="rounded-3xl shadow-2xl border-4 border-white dark:border-gray-700 max-h-[350px] object-cover"
            priority
          />
        </motion.div>
      </section>

      {/* Fitur Section */}
      <section
        id="fitur"
        className="relative z-10 py-20 px-6 md:px-20 bg-white dark:bg-gray-900"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-14">
          Fitur Unggulan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            {
              title: "Tur 360° Interaktif",
              desc: "Navigasi bebas dalam panorama budaya khas Baruppu’.",
            },
            {
              title: "Info Tradisi Interaktif",
              desc: "Penjelasan budaya dan makna tradisi langsung pada panorama yang ditampilkan.",
            },
            {
              title: "Akses Multi-Perangkat",
              desc: "Dapat diakses dari HP, tablet, dan desktop dengan performa optimal.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl shadow-md border border-gray-200 dark:border-gray-600 transition-transform hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 dark:text-gray-400 text-sm relative z-10">
        © {new Date().getFullYear()} Virtual Tour Baruppu’ | Tradisi Budaya Toraja
      </footer>
    </div>
  );
}
