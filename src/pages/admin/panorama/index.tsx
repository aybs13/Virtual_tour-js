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
  const [selectedFile, setFile] = useState<File | null>(null);

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
    if (!form.nama_lokasi || !form.deskripsi || !form.urutan || (!form.id_panorama && !selectedFile)) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    const formData = new FormData();
    formData.append("nama_lokasi", form.nama_lokasi);
    formData.append("deskripsi", form.deskripsi);
    formData.append("urutan", String(form.urutan));
    if (selectedFile) {
      formData.append("gambar", selectedFile);
    } else if (form.id_panorama) {
      formData.append("gambar", form.gambar!);
    }
    if (form.id_panorama) {
      formData.append("id_panorama", String(form.id_panorama));
    }

    try {
      const res = await fetch("/api/panorama", {
        method: form.id_panorama ? "PUT" : "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();
      toast.success(form.id_panorama ? "Berhasil diperbarui!" : "Berhasil ditambahkan!");
      setForm({});
      setFile(null);
      (document.getElementById("gambar") as HTMLInputElement).value = "";
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
        <h1 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500 dark:from-pink-400 dark:to-purple-400 mb-10">
          🗺 Kelola Panorama
        </h1>

        {/* Form Tambah/Edit */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-12 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-6 text-gray-800 dark:text-white">
            {form.id_panorama ? "🔄 Edit Panorama" : "➕ Tambah Panorama"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              placeholder="Nama Lokasi"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.nama_lokasi || ""}
              onChange={(e) => setForm({ ...form, nama_lokasi: e.target.value })}
            />
            <input
              id="gambar"
              type="file"
              accept="image/*"
              className="border p-3 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <textarea
              placeholder="Deskripsi Lokasi"
              className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              rows={3}
              value={form.deskripsi || ""}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            />
            <input
              type="number"
              placeholder="Urutan"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.urutan || ""}
              onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) })}
            />
          </div>
          <button
            onClick={handleSave}
            className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-bold hover:opacity-90 transition"
          >
            {form.id_panorama ? "💾 Simpan Perubahan" : "➕ Tambah Panorama"}
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-600 mb-8" />

        {/* Daftar Panorama */}
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
          📋 Daftar Panorama
        </h2>

        {panoramas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {panoramas.map((p) => (
              <div
                key={p.id_panorama}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md p-4 flex flex-col hover:shadow-xl transition-transform hover:scale-[1.02]"
              >
                <img
                  src={`/images/${p.gambar}`}
                  alt={p.nama_lokasi}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">
                    {p.urutan}. {p.nama_lokasi}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {p.deskripsi}
                  </p>
                </div>
                <div className="flex justify-between gap-2 mt-4">
                  <button
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold transition"
                    onClick={() => {
                      setForm(p);
                      setFile(null);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition"
                    onClick={() => handleDelete(p.id_panorama)}
                  >
                    🗑 Hapus
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
