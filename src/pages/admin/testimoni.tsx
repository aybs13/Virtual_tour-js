"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import toast, { Toaster } from "react-hot-toast";

interface Testimoni {
  id_testimoni: number;
  nama: string;
  komentar: string;
  rating: number;
  feedback_admin: string | null;
  created_at: string;
}

export default function AdminTestimoni() {
  const [testimoni, setTestimoni] = useState<Testimoni[]>([]);
  const [editFeedback, setEditFeedback] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Silakan login dulu!");
      setTimeout(() => {
        window.location.href = "/admin/login";
      }, 800);
    } else {
      fetchTestimoni();
    }
  }, []);

  const fetchTestimoni = async () => {
    try {
      const res = await fetch("/api/testimoni");
      const data = await res.json();
      setTestimoni(Array.isArray(data) ? data : data.data || []);
    } catch {
      toast.error("Gagal memuat data testimoni");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (id: number) => {
    const feedback_admin = editFeedback[id];
    if (!feedback_admin) return toast.error("Tulis feedback dulu!");

    try {
      await fetch("/api/testimoni", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_testimoni: id, feedback_admin }),
      });
      toast.success("Feedback berhasil dikirim!");
      fetchTestimoni();
    } catch {
      toast.error("Gagal mengirim feedback");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus testimoni ini?")) return;
    try {
      await fetch(`/api/testimoni?id_testimoni=${id}`, { method: "DELETE" });
      toast.success("Testimoni berhasil dihapus!");
      fetchTestimoni();
    } catch {
      toast.error("Gagal menghapus testimoni");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Toaster />
      <AdminNavbar />

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 mb-6">
          🛠 Kelola Testimoni Pengunjung
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Memuat data...</p>
        ) : testimoni.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada testimoni</p>
        ) : (
          <div className="space-y-5">
            {testimoni.map((t) => (
              <div
                key={t.id_testimoni}
                className="p-5 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-lg transform transition-all hover:scale-105"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${t.nama}`}
                      alt={t.nama}
                      className="w-12 h-12 rounded-full shadow"
                    />
                    <div>
                      <h3 className="font-bold text-pink-600 dark:text-pink-400 text-lg">
                        {t.nama}
                      </h3>
                      <div className="text-yellow-400 text-sm">
                        {"★".repeat(t.rating)}
                        <span className="text-gray-400">
                          {"★".repeat(5 - t.rating)}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700 dark:text-gray-200 text-sm">
                        {t.komentar}
                      </p>
                      {t.feedback_admin && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          💬 Admin: {t.feedback_admin}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(t.created_at).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(t.id_testimoni)}
                    className="text-red-600 dark:text-red-400 hover:underline text-sm"
                  >
                    🗑 Hapus
                  </button>
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Tulis balasan admin..."
                    value={editFeedback[t.id_testimoni] ?? t.feedback_admin ?? ""}
                    onChange={(e) =>
                      setEditFeedback((prev) => ({
                        ...prev,
                        [t.id_testimoni]: e.target.value,
                      }))
                    }
                    className="flex-1 p-2 border rounded-lg dark:bg-gray-600 dark:text-white focus:ring-2 focus:ring-pink-400"
                  />
                  <button
                    onClick={() => handleFeedback(t.id_testimoni)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:opacity-90"
                  >
                    💬 Kirim
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
