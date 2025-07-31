import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ✅ Ambil semua data tradisi
    if (req.method === "GET") {
      const [rows]: any = await db.query("SELECT * FROM tb_tradisi ORDER BY id_tradisi DESC");
      return res.status(200).json(rows);
    }

    // ✅ Tambah tradisi
    if (req.method === "POST") {
      const {
        nama_tradisi,
        deskripsi,
        gambar,
        panorama,
        posisi_x,
        posisi_y,
        posisi_z,
      } = req.body;

      await db.query(
        "INSERT INTO tb_tradisi (nama_tradisi, deskripsi, gambar, panorama, posisi_x, posisi_y, posisi_z) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [nama_tradisi, deskripsi, gambar, panorama, posisi_x, posisi_y, posisi_z]
      );
      return res.status(200).json({ message: "Tradisi berhasil ditambahkan" });
    }

    // ✅ Update tradisi
    if (req.method === "PUT") {
      const {
        id_tradisi,
        nama_tradisi,
        deskripsi,
        gambar,
        panorama,
        posisi_x,
        posisi_y,
        posisi_z,
      } = req.body;

      await db.query(
        "UPDATE tb_tradisi SET nama_tradisi=?, deskripsi=?, gambar=?, panorama=?, posisi_x=?, posisi_y=?, posisi_z=? WHERE id_tradisi=?",
        [
          nama_tradisi,
          deskripsi,
          gambar,
          panorama,
          posisi_x,
          posisi_y,
          posisi_z,
          id_tradisi,
        ]
      );
      return res.status(200).json({ message: "Tradisi berhasil diperbarui" });
    }

    // ✅ Hapus tradisi
    if (req.method === "DELETE") {
      const { id_tradisi } = req.body;
      await db.query("DELETE FROM tb_tradisi WHERE id_tradisi=?", [id_tradisi]);
      return res.status(200).json({ message: "Tradisi berhasil dihapus" });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (error: any) {
    console.error("ERROR DB:", error);
    res.status(500).json({ message: "Gagal memproses data tradisi", error: error.message });
  }
}
