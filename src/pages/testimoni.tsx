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
    } catch (err) {
      console.error("Gagal memuat testimoni", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !komentar) return toast.error("Nama dan komentar wajib diisi!");

    await fetch("/api/testimoni", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, komentar, rating }),
    });

    toast.success("Terima kasih atas testimoni Anda!");
    setNama("");
    setKomentar("");
    setRating(5);
    setPage(1);  // ✅ langsung ke halaman pertama
    fetchData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Toaster />
      <Navbar />
      <div className="max-w-2xl mx-auto mt-10 p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-pink-600 dark:text-pink-400 mb-4">
          📝 Testimoni Pengunjung
        </h1>

        {/* Form Testimoni */}
        <form onSubmit={handleSubmit} className="mb-6">
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Anda"
            className="w-full p-2 mb-3 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <textarea
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            placeholder="Tulis testimoni Anda..."
            className="w-full p-2 mb-3 border rounded-lg dark:bg-gray-700 dark:text-white"
            rows={3}
          ></textarea>

          {/* Rating Bintang */}
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-2xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg hover:opacity-90 transition"
          >
            Kirim Testimoni
          </button>
        </form>

        {/* Daftar Testimoni */}
        {loading ? (
          <p className="text-center text-gray-500">Memuat testimoni...</p>
        ) : !testimoni?.length ? (
          <p className="text-center text-gray-500">Belum ada testimoni</p>
        ) : (
          <div className="space-y-3">
            {testimoni.map((t) => (
              <div
                key={t.id_testimoni}
                className="p-3 bg-pink-50 dark:bg-gray-700 rounded-lg shadow"
              >
                <h3 className="font-bold text-pink-600 dark:text-pink-400">
                  {t.nama}
                </h3>
                <div className="text-yellow-400">
                  {"★".repeat(t.rating)}
                  <span className="text-gray-400">
                    {"★".repeat(5 - t.rating)}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-200">{t.komentar}</p>
                {t.feedback_admin && (
                  <p className="mt-1 text-sm text-green-600">
                    💬 Balasan Admin: {t.feedback_admin}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(t.created_at).toLocaleString("id-ID")}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            ⬅ Prev
          </button>
          <button
            disabled={page * 5 >= total}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
}
