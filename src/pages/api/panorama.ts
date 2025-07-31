import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const [rows]: any = await db.query("SELECT * FROM tb_panorama ORDER BY urutan ASC");
      return res.status(200).json(rows);
    }

    if (req.method === "POST") {
      const { nama_lokasi, deskripsi, gambar, urutan } = req.body;
      await db.query(
        "INSERT INTO tb_panorama (nama_lokasi, deskripsi, gambar, urutan) VALUES (?, ?, ?, ?)",
        [nama_lokasi, deskripsi, gambar, urutan]
      );
      return res.status(200).json({ message: "Panorama berhasil ditambahkan" });
    }

    if (req.method === "PUT") {
      const { id_panorama, nama_lokasi, deskripsi, gambar, urutan } = req.body;
      await db.query(
        "UPDATE tb_panorama SET nama_lokasi=?, deskripsi=?, gambar=?, urutan=? WHERE id_panorama=?",
        [nama_lokasi, deskripsi, gambar, urutan, id_panorama]
      );
      return res.status(200).json({ message: "Panorama berhasil diperbarui" });
    }

    if (req.method === "DELETE") {
      const { id_panorama } = req.body;
      await db.query("DELETE FROM tb_panorama WHERE id_panorama=?", [id_panorama]);
      return res.status(200).json({ message: "Panorama berhasil dihapus" });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (error: any) {
    console.error("ERROR DB:", error);
    res.status(500).json({ message: "Gagal memproses data panorama", error: error.message });
  }
}
