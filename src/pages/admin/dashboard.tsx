"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import { Toaster } from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Stats {
  tradisi: number;
  panorama: number;
  testimoni: number;
  ratingCount: { rating: number; jumlah: number }[];
  recentTestimoni: {
    id_testimoni: number;
    nama: string;
    komentar: string;
    rating: number;
    created_at: string;
  }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    tradisi: 0,
    panorama: 0,
    testimoni: 0,
    ratingCount: [],
    recentTestimoni: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        const data = await res.json();
        setStats({
          tradisi: data.tradisi ?? 0,
          panorama: data.panorama ?? 0,
          testimoni: data.testimoni ?? 0,
          ratingCount: Array.isArray(data.ratingCount) ? data.ratingCount : [],
          recentTestimoni: Array.isArray(data.recentTestimoni)
            ? data.recentTestimoni
            : [],
        });
      } catch (err) {
        console.error("Gagal memuat dashboard:", err);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ["#fbbf24", "#f59e0b", "#f97316", "#ef4444", "#e11d48"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Toaster />
      <AdminNavbar />

      <div className="max-w-6xl mx-auto mt-10 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-pink-600 dark:text-pink-400 mb-6">
          📊 Dashboard Admin
        </h1>

        {/* Statistik Cepat */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl p-4 text-center shadow hover:scale-105 transition">
            <h2 className="text-lg font-bold">Tradisi</h2>
            <p className="text-3xl font-extrabold">{stats.tradisi}</p>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl p-4 text-center shadow hover:scale-105 transition">
            <h2 className="text-lg font-bold">Panorama</h2>
            <p className="text-3xl font-extrabold">{stats.panorama}</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-xl p-4 text-center shadow hover:scale-105 transition">
            <h2 className="text-lg font-bold">Testimoni</h2>
            <p className="text-3xl font-extrabold">{stats.testimoni}</p>
          </div>
        </div>

        {/* Diagram Rating */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 shadow mb-6">
          <h2 className="text-lg font-bold text-center text-gray-700 dark:text-white mb-4">
            ⭐ Statistik Rating Testimoni
          </h2>
          {Array.isArray(stats.ratingCount) && stats.ratingCount.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.ratingCount}
                  dataKey="jumlah"
                  nameKey="rating"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) => `${entry.rating}⭐`}
                >
                  {stats.ratingCount.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-300">
              Belum ada testimoni
            </p>
          )}
        </div>

        {/* Testimoni Terbaru */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 shadow">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-4">
            🆕 Testimoni Terbaru
          </h2>
          {Array.isArray(stats.recentTestimoni) &&
          stats.recentTestimoni.length > 0 ? (
            <div className="space-y-3">
              {stats.recentTestimoni.map((t) => (
                <div
                  key={t.id_testimoni}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-start"
                >
                  <div>
                    <p className="font-bold text-pink-600 dark:text-pink-400">
                      {t.nama} - {t.rating}⭐
                    </p>
                    <p className="text-gray-700 dark:text-gray-200">
                      {t.komentar}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(t.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-300">
              Belum ada testimoni baru
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
