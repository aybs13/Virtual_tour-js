"use client";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import toast, { Toaster } from "react-hot-toast";

interface Panorama {
  id_panorama: number;
  nama_lokasi: string;
  deskripsi: string;
  gambar: string;
  urutan: number;
}

export default function PanoramaAdmin() {
  const [panoramas, setPanoramas] = useState<Panorama[]>([]);
  const [form, setForm] = useState<Partial<Panorama>>({});

  const loadData = async () => {
    try {
      const res = await fetch("/api/panorama");
      const data = await res.json();
      setPanoramas(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Gagal memuat data panorama");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!form.nama_lokasi || !form.gambar || !form.deskripsi || !form.urutan) {
      toast.error("Semua field wajib diisi!");
      return;
    }
    try {
      const res = await fetch("/api/panorama", {
        method: form.id_panorama ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(form.id_panorama ? "Berhasil diperbarui!" : "Berhasil ditambahkan!");
      setForm({});
      loadData();
    } catch {
      toast.error("Gagal menyimpan panorama");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus panorama ini?")) return;
    try {
      const res = await fetch("/api/panorama", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_panorama: id }),
      });
      if (!res.ok) throw new Error();
      toast.success("Panorama berhasil dihapus");
      loadData();
    } catch {
      toast.error("Gagal menghapus panorama");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      <Toaster />
      <AdminNavbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 text-center mb-8">
          🗺 Kelola Panorama
        </h1>

        {/* Form Tambah/Edit */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-4">
            {form.id_panorama ? "🔄 Edit Panorama" : "➕ Tambah Panorama"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nama Lokasi"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.nama_lokasi || ""}
              onChange={(e) => setForm({ ...form, nama_lokasi: e.target.value })}
            />
            <input
              placeholder="Nama Gambar (contoh: panorama1.jpg)"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.gambar || ""}
              onChange={(e) => setForm({ ...form, gambar: e.target.value })}
            />
            <textarea
              placeholder="Deskripsi Lokasi"
              className="border p-3 rounded-lg col-span-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              rows={3}
              value={form.deskripsi || ""}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            />
            <input
              type="number"
              placeholder="Urutan"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.urutan || ""}
              onChange={(e) =>
                setForm({ ...form, urutan: parseInt(e.target.value) })
              }
            />
          </div>
          <button
            onClick={handleSave}
            className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg hover:opacity-90 transition font-bold"
          >
            {form.id_panorama ? "Simpan Perubahan" : "Tambah Panorama"}
          </button>
        </div>

        {/* List Panorama */}
        <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-4">
          📋 Daftar Panorama
        </h2>
        {panoramas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {panoramas.map((p) => (
              <div
                key={p.id_panorama}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col justify-between hover:scale-105 transition transform duration-300"
              >
                <img
                  src={`/images/${p.gambar}`}
                  alt={p.nama_lokasi}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                    {p.urutan}. {p.nama_lokasi}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {p.deskripsi}
                  </p>
                </div>
                <div className="flex justify-between gap-2 mt-4">
                  <button
                    className="flex-1 bg-yellow-400 px-3 py-2 rounded text-white font-semibold hover:opacity-90"
                    onClick={() => setForm(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="flex-1 bg-red-500 px-3 py-2 rounded text-white font-semibold hover:opacity-90"
                    onClick={() => handleDelete(p.id_panorama)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Belum ada panorama.
          </p>
        )}
      </div>
    </div>
  );
}
