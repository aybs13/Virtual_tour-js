// pages/api/tradisi.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import type { RowDataPacket, FieldPacket } from "mysql2";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // penting untuk upload file
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
        "SELECT * FROM tb_tradisi ORDER BY id_tradisi DESC"
      );
      return res.status(200).json(rows);
    }

    // Tambah tradisi
    if (req.method === "POST") {
      const form = new IncomingForm({
        uploadDir: path.join(process.cwd(), "/public/images"),
        keepExtensions: true,
      });

      return form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ message: "Upload gagal", error: err.message });

        const {
          nama_tradisi,
          deskripsi,
          panorama,
          posisi_x,
          posisi_y,
          posisi_z,
        } = fields;

        const gambarFile = Array.isArray(files.gambar) ? files.gambar[0] : files.gambar;
        if (!gambarFile?.newFilename) return res.status(400).json({ message: "Gambar wajib diisi" });

        await db.query(
          "INSERT INTO tb_tradisi (nama_tradisi, deskripsi, gambar, panorama, posisi_x, posisi_y, posisi_z) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            nama_tradisi?.toString(),
            deskripsi?.toString(),
            gambarFile.newFilename,
            panorama?.toString(),
            parseFloat(posisi_x?.toString()),
            parseFloat(posisi_y?.toString()),
            parseFloat(posisi_z?.toString()),
          ]
        );

        return res.status(200).json({ message: "Tradisi berhasil ditambahkan" });
      });
    }

    // Edit tradisi
    if (req.method === "PUT") {
      const form = new IncomingForm({
        uploadDir: path.join(process.cwd(), "/public/images"),
        keepExtensions: true,
      });

      return form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ message: "Upload gagal", error: err.message });

        const {
          id_tradisi,
          nama_tradisi,
          deskripsi,
          panorama,
          posisi_x,
          posisi_y,
          posisi_z,
        } = fields;

        let gambar = fields.gambar?.toString();
        const gambarFile = Array.isArray(files.gambar) ? files.gambar[0] : files.gambar;
        if (gambarFile?.newFilename) {
          gambar = gambarFile.newFilename;
        }

        if (!id_tradisi || !gambar)
          return res.status(400).json({ message: "Field tidak lengkap" });

        await db.query(
          "UPDATE tb_tradisi SET nama_tradisi=?, deskripsi=?, gambar=?, panorama=?, posisi_x=?, posisi_y=?, posisi_z=? WHERE id_tradisi=?",
          [
            nama_tradisi?.toString(),
            deskripsi?.toString(),
            gambar,
            panorama?.toString(),
            parseFloat(posisi_x?.toString()),
            parseFloat(posisi_y?.toString()),
            parseFloat(posisi_z?.toString()),
            parseInt(id_tradisi?.toString()),
          ]
        );

        return res.status(200).json({ message: "Tradisi berhasil diperbarui" });
      });
    }

    // Hapus tradisi
    if (req.method === "DELETE") {
      const { id_tradisi } = req.body;
      await db.query("DELETE FROM tb_tradisi WHERE id_tradisi=?", [id_tradisi]);
      return res.status(200).json({ message: "Tradisi berhasil dihapus" });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (error: any) {
    return res.status(500).json({
      message: "Gagal memproses data tradisi",
      error: error.message || String(error),
    });
  }
}
