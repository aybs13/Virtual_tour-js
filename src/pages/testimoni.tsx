"use client";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";

interface Testimoni {
  id_testimoni: number;
  nama: string;
  komentar: string;
  rating: number;
  feedback_admin: string | null;
  created_at: string;
}

export default function TestimoniPage() {
  const [testimoni, setTestimoni] = useState<Testimoni[]>([]);
  const [nama, setNama] = useState("");
  const [komentar, setKomentar] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/testimoni?page=${page}&limit=5`);
      const data = await res.json();
      setTestimoni(data.data);
      setTotal(data.total);
    } catch {
      toast.error("Gagal memuat testimoni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !komentar.trim()) {
      return toast.error("Nama dan komentar wajib diisi!");
    }

    await fetch("/api/testimoni", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, komentar, rating }),
    });

    toast.success("Terima kasih atas testimoni Anda!");
    setNama("");
    setKomentar("");
    setRating(5);
    setPage(1);
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-200 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-all">
      <Toaster />
      <Navbar />
      <div className="max-w-3xl mx-auto mt-12 mb-10 p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 mb-8">
          💬 Testimoni Pengunjung
        </h1>

        <form onSubmit={handleSubmit} className="mb-10 space-y-4">
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Anda"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          <textarea
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            placeholder="Tulis testimoni Anda..."
            rows={3}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          <div className="flex gap-1 items-center">
            {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-2xl transition ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              ({rating}/5)
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl shadow-md hover:opacity-90 transition"
          >
            Kirim Testimoni
          </button>
        </form>

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Memuat testimoni...
          </p>
        ) : !testimoni.length ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Belum ada testimoni
          </p>
        ) : (
          <div className="space-y-6">
            {testimoni.map((t) => (
              <div
                key={t.id_testimoni}
                className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 shadow border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 items-center">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${t.nama}`}
                      alt={t.nama}
                      className="w-10 h-10 rounded-full border shadow"
                    />
                    <div>
                      <h3 className="font-bold text-pink-600 dark:text-pink-300 text-base">
                        {t.nama}
                      </h3>
                      <div className="text-yellow-400 text-sm">
                        {"★".repeat(t.rating)}
                        <span className="text-gray-400">
                          {"★".repeat(5 - t.rating)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(t.created_at).toLocaleString("id-ID")}
                  </p>
                </div>
                <p className="mt-3 text-sm text-gray-800 dark:text-gray-100">
                  {t.komentar}
                </p>
                {t.feedback_admin && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                    💬 Balasan Admin: {t.feedback_admin}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
          >
            ⬅ Sebelumnya
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Halaman {page}
          </span>
          <button
            disabled={page * 5 >= total}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
          >
            Selanjutnya ➡
          </button>
        </div>
      </div>
    </div>
  );
}
