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
  const [stats, setStats] = useState<Stats | null>(null);
  const COLORS = ["#fbbf24", "#f59e0b", "#f97316", "#ef4444", "#e11d48"];

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

  const formatDate = (dateStr: string) =>
    new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateStr));

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300 bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <p>Memuat dashboard...</p>
      </div>
    );
  }

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
          {[
            { label: "Tradisi", value: stats.tradisi, from: "pink", to: "purple" },
            { label: "Panorama", value: stats.panorama, from: "indigo", to: "purple" },
            { label: "Testimoni", value: stats.testimoni, from: "yellow", to: "pink" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-r from-${item.from}-500 to-${item.to}-500 text-white rounded-xl p-4 text-center shadow hover:scale-105 transition duration-200`}
            >
              <h2 className="text-lg font-bold">{item.label}</h2>
              <p className="text-3xl font-extrabold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Diagram Rating */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 shadow mb-6">
          <h2 className="text-lg font-bold text-center text-gray-700 dark:text-white mb-4">
            ⭐ Statistik Rating Testimoni
          </h2>
          {stats.ratingCount.length > 0 ? (
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
                <Tooltip formatter={(value: number, name: string) => [`${value} pengguna`, `Rating ${name}⭐`]} />
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
          {stats.recentTestimoni.length > 0 ? (
            <div className="space-y-3">
              {stats.recentTestimoni.map((t) => (
                <div
                  key={t.id_testimoni}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-pink-600 dark:text-pink-400">
                      {t.nama}
                    </p>
                    <span className="text-sm text-yellow-500 font-medium">
                      {t.rating}⭐
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-200 mt-1">
                    {t.komentar}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(t.created_at)}
                  </p>
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
