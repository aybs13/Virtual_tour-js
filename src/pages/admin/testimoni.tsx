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
      setEditFeedback((prev) => ({ ...prev, [id]: "" }));
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

      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-400 mb-10">
          🛠 Kelola Testimoni Pengunjung
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">⏳ Memuat data...</p>
        ) : testimoni.length === 0 ? (
          <p className="text-center text-gray-400 italic">Belum ada testimoni.</p>
        ) : (
          <div className="space-y-6">
            {testimoni.map((t) => (
              <div
                key={t.id_testimoni}
                className="p-6 bg-gradient-to-br from-white to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl shadow-md hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${t.nama}`}
                      alt={t.nama}
                      className="w-14 h-14 rounded-full border border-white shadow"
                    />
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-pink-600 dark:text-pink-400">
                        {t.nama}
                      </h3>
                      <div className="text-yellow-400 text-base leading-none">
                        {"★".repeat(t.rating)}
                        <span className="text-gray-300 dark:text-gray-500">
                          {"★".repeat(5 - t.rating)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-200">{t.komentar}</p>
                      {t.feedback_admin && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          💬 Admin: {t.feedback_admin}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(t.created_at).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(t.id_testimoni)}
                    className="text-red-600 dark:text-red-400 hover:underline text-sm mt-1"
                    title="Hapus testimoni"
                  >
                    🗑 Hapus
                  </button>
                </div>

                <div className="mt-4 flex gap-2">
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
                    className="flex-1 p-2 text-sm rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-pink-400"
                  />
                  <button
                    onClick={() => handleFeedback(t.id_testimoni)}
                    className="px-4 py-2 text-sm font-semibold bg-green-500 hover:bg-green-600 text-white rounded-xl transition"
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
