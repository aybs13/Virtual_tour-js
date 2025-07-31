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

interface Panorama {
  id_panorama: number;
  nama_lokasi: string;
  gambar: string;
}

export default function TradisiAdmin() {
  const [tradisi, setTradisi] = useState<Tradisi[]>([]);
  const [panoramaList, setPanoramaList] = useState<Panorama[]>([]);
  const [form, setForm] = useState<Partial<Tradisi>>({});
  const [file, setFile] = useState<File | null>(null);
  const [previewPanoramaUrl, setPreviewPanoramaUrl] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [resTradisi, resPanorama] = await Promise.all([
        fetch("/api/tradisi"),
        fetch("/api/panorama"),
      ]);
      const tradisiData = await resTradisi.json();
      const panoramaData = await resPanorama.json();
      setTradisi(Array.isArray(tradisiData) ? tradisiData : []);
      setPanoramaList(Array.isArray(panoramaData) ? panoramaData : []);
    } catch {
      toast.error("Gagal memuat data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (
      !form.nama_tradisi ||
      !form.deskripsi ||
      (!form.id_tradisi && !file) ||
      !form.panorama ||
      form.posisi_x === undefined ||
      form.posisi_y === undefined ||
      form.posisi_z === undefined
    ) {
      toast.error("Semua field wajib diisi!");
      return;
    }

    const formData = new FormData();
    formData.append("nama_tradisi", form.nama_tradisi);
    formData.append("deskripsi", form.deskripsi);
    formData.append("panorama", form.panorama);
    formData.append("posisi_x", String(form.posisi_x));
    formData.append("posisi_y", String(form.posisi_y));
    formData.append("posisi_z", String(form.posisi_z));
    if (file) {
      formData.append("gambar", file);
    } else if (form.gambar) {
      formData.append("gambar", form.gambar);
    }
    if (form.id_tradisi) {
      formData.append("id_tradisi", String(form.id_tradisi));
    }

    try {
      const res = await fetch("/api/tradisi", {
        method: form.id_tradisi ? "PUT" : "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      toast.success(form.id_tradisi ? "Berhasil diperbarui!" : "Berhasil ditambahkan!");
      setForm({});
      setFile(null);
      setPreviewPanoramaUrl(null);
      (document.getElementById("gambar") as HTMLInputElement).value = "";
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

        {/* Form Input */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-10">
          <h2 className="text-lg font-bold text-gray-700 dark:text-white mb-4">
            {form.id_tradisi ? "🔄 Edit Tradisi" : "➕ Tambah Tradisi"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nama Tradisi"
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.nama_tradisi || ""}
              onChange={(e) => setForm({ ...form, nama_tradisi: e.target.value })}
            />
            <input
              id="gambar"
              type="file"
              accept="image/*"
              className="border p-3 rounded-lg bg-white dark:bg-gray-700 dark:text-white"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <textarea
              placeholder="Deskripsi Tradisi"
              className="border p-3 rounded-lg col-span-2 focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              rows={3}
              value={form.deskripsi || ""}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
            />
            <select
              className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
              value={form.panorama || ""}
              onChange={(e) => {
                const selected = e.target.value;
                setForm({ ...form, panorama: selected });
                setPreviewPanoramaUrl(`/images/${selected}`);
              }}
            >
              <option value="">Pilih panorama</option>
              {panoramaList.map((pano) => (
                <option key={pano.id_panorama} value={pano.gambar}>
                  {pano.nama_lokasi} ({pano.gambar})
                </option>
              ))}
            </select>

            {previewPanoramaUrl && (
              <div className="col-span-2">
                <img
                  src={previewPanoramaUrl}
                  alt="Preview Panorama"
                  className="rounded-lg w-full h-40 object-cover border"
                />
              </div>
            )}

            {["x", "y", "z"].map((axis) => (
              <input
                key={axis}
                type="number"
                placeholder={`Posisi ${axis.toUpperCase()}`}
                className="border p-3 rounded-lg focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:text-white"
                value={form[`posisi_${axis}` as keyof Tradisi] || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [`posisi_${axis}`]: parseFloat(e.target.value),
                  })
                }
              />
            ))}
          </div>
          <button
            onClick={handleSave}
            className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg hover:opacity-90 transition font-bold"
          >
            {form.id_tradisi ? "💾 Simpan Perubahan" : "➕ Tambah Tradisi"}
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
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
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
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    🌄 Panorama: {t.panorama} <br />
                    🎯 Posisi: ({t.posisi_x}, {t.posisi_y}, {t.posisi_z})
                  </p>
                </div>
                <div className="flex justify-between gap-2 mt-4">
                  <button
                    className="flex-1 bg-yellow-400 px-3 py-2 rounded text-white font-semibold hover:opacity-90"
                    onClick={() => {
                      setForm(t);
                      setFile(null);
                      setPreviewPanoramaUrl(`/images/${t.panorama}`);
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="flex-1 bg-red-500 px-3 py-2 rounded text-white font-semibold hover:opacity-90"
                    onClick={() => handleDelete(t.id_tradisi)}
                  >
                    🗑 Hapus
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
