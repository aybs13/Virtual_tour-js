"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import toast, { Toaster } from "react-hot-toast";

interface Tradisi {
  id_tradisi: number;
  nama_tradisi: string;
  deskripsi: string;
  gambar: string;
  panorama: string;
  posisi_x: number;
  posisi_y: number;
  posisi_z: number;
}

export default function TradisiAdmin() {
  const [tradisi, setTradisi] = useState<Tradisi[]>([]);
  const [form, setForm] = useState<Partial<Tradisi>>({});

  const loadData = async () => {
    try {
      const res = await fetch("/api/tradisi");
      const data = await res.json();
      setTradisi(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Gagal memuat data tradisi");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (
      !form.nama_tradisi ||
      !form.deskripsi ||
      !form.gambar ||
      !form.panorama ||
      !form.posisi_x ||
      !form.posisi_y ||
      !form.posisi_z
    ) {
      toast.error("Semua field wajib diisi!");
      return;
    }
    try {
      const res = await fetch("/api/tradisi", {
        method: form.id_tradisi ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(
        form.id_tradisi ? "Tradisi berhasil diperbarui!" : "Tradisi berhasil ditambahkan!"
      );
      setForm({});
      loadData();
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan tradisi");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus tradisi ini?")) return;
    try {
      const res = await fetch("/api/tradisi", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_tradisi: id }),
      });
      if (!res.ok) throw new Error();
      toast.success("Tradisi berhasil dihapus");
      loadData();
    } catch {
      toast.error("Terjadi kesalahan saat menghapus tradisi");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Toaster />
      <AdminNavbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 text-center mb-8">
          ✨ Kelola Tradisi Budaya
        </h1>

        {/* Form Tambah/Edit */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-4">
            {form.id_tradisi ? "🔄 Edit Tradisi" : "➕ Tambah Tradisi"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nama Tradisi"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.nama_tradisi || ""}
              onChange={(e) =>
                setForm({ ...form, nama_tradisi: e.target.value })
              }
            />
            <input
              placeholder="Nama Gambar (contoh: manene.jpg)"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.gambar || ""}
              onChange={(e) => setForm({ ...form, gambar: e.target.value })}
            />
            <textarea
              placeholder="Deskripsi Tradisi"
              className="border p-3 rounded-lg col-span-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              rows={3}
              value={form.deskripsi || ""}
              onChange={(e) =>
                setForm({ ...form, deskripsi: e.target.value })
              }
            />
            <input
              placeholder="Panorama (contoh: panorama1.jpg)"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.panorama || ""}
              onChange={(e) => setForm({ ...form, panorama: e.target.value })}
            />
            <input
              type="number"
              placeholder="Posisi X"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.posisi_x || ""}
              onChange={(e) =>
                setForm({ ...form, posisi_x: parseInt(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Posisi Y"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.posisi_y || ""}
              onChange={(e) =>
                setForm({ ...form, posisi_y: parseInt(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Posisi Z"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.posisi_z || ""}
              onChange={(e) =>
                setForm({ ...form, posisi_z: parseInt(e.target.value) })
              }
            />
          </div>
          <button
            onClick={handleSave}
            className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg hover:opacity-90 transition font-bold"
          >
            {form.id_tradisi ? "Simpan Perubahan" : "Tambah Tradisi"}
          </button>
        </div>

        {/* List Tradisi */}
        <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-4">
          📋 Daftar Tradisi Budaya
        </h2>
        {tradisi.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tradisi.map((t) => (
              <div
                key={t.id_tradisi}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col justify-between hover:scale-105 transition transform duration-300"
              >
                <img
                  src={`/images/${t.gambar}`}
                  alt={t.nama_tradisi}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    {t.nama_tradisi}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {t.deskripsi}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Panorama: {t.panorama} | Posisi: {t.posisi_x},{" "}
                    {t.posisi_y}, {t.posisi_z}
                  </p>
                </div>
                <div className="flex justify-between gap-2 mt-4">
                  <button
                    className="flex-1 bg-yellow-400 px-3 py-2 rounded text-white font-semibold hover:opacity-90"
                    onClick={() => setForm(t)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 bg-red-500 px-3 py-2 rounded text-white font-semibold hover:opacity-90"
                    onClick={() => handleDelete(t.id_tradisi)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Belum ada tradisi.
          </p>
        )}
      </div>
    </div>
  );
}
