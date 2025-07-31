import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import type { RowDataPacket, FieldPacket } from "mysql2";
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // GET: Ambil semua panorama
    if (req.method === "GET") {
      const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
        "SELECT * FROM tb_panorama ORDER BY urutan ASC"
      );
      return res.status(200).json(rows);
    }

    // POST: Tambah panorama + upload gambar
    if (req.method === "POST") {
      const form = new IncomingForm({ keepExtensions: true });

      return form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("UPLOAD ERROR:", err);
          return res.status(500).json({ message: "Upload gagal", error: err.message });
        }

        const nama_lokasi = fields.nama_lokasi?.toString();
        const deskripsi = fields.deskripsi?.toString();
        const urutan = Number(fields.urutan);
        const gambarFile = Array.isArray(files.gambar) ? files.gambar[0] : files.gambar;

        if (!nama_lokasi || !deskripsi || !gambarFile || !gambarFile.originalFilename || !gambarFile.filepath) {
          return res.status(400).json({ message: "Field tidak lengkap" });
        }

        // Format nama file upload
        const ext = path.extname(gambarFile.originalFilename);
        const base = path.basename(gambarFile.originalFilename, ext);
        const safeBase = base.replace(/\s+/g, "-").replace(/[^\w\-]/g, "");
        const safeName = `${nama_lokasi?.toLowerCase().replace(/\s+/g, "-")}-${safeBase}${ext}`;
        const savePath = path.join(process.cwd(), "public/images", safeName);

        fs.renameSync(gambarFile.filepath, savePath);

        await db.query(
          "INSERT INTO tb_panorama (nama_lokasi, deskripsi, gambar, urutan) VALUES (?, ?, ?, ?)",
          [nama_lokasi, deskripsi, safeName, urutan]
        );

        return res.status(200).json({ message: "Panorama berhasil ditambahkan" });
      });
    }

    // PUT: Update panorama
    if (req.method === "PUT") {
      const form = new IncomingForm({ keepExtensions: true });

      return form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ message: "Gagal parsing", error: err.message });

        const id = fields.id_panorama?.toString();
        const nama_lokasi = fields.nama_lokasi?.toString();
        const deskripsi = fields.deskripsi?.toString();
        const urutan = Number(fields.urutan);
        let gambar = fields.gambar?.toString();

        const gambarFile = Array.isArray(files.gambar) ? files.gambar[0] : files.gambar;
        if (gambarFile && gambarFile.originalFilename && gambarFile.filepath) {
          const ext = path.extname(gambarFile.originalFilename);
          const base = path.basename(gambarFile.originalFilename, ext);
          const safeBase = base.replace(/\s+/g, "-").replace(/[^\w\-]/g, "");
          const safeName = `${nama_lokasi?.toLowerCase().replace(/\s+/g, "-")}-${safeBase}${ext}`;
          const savePath = path.join(process.cwd(), "public/images", safeName);
          fs.renameSync(gambarFile.filepath, savePath);
          gambar = safeName;
        }

        if (!id || !nama_lokasi || !deskripsi || !gambar || !urutan) {
          return res.status(400).json({ message: "Field tidak lengkap" });
        }

        await db.query(
          "UPDATE tb_panorama SET nama_lokasi=?, deskripsi=?, gambar=?, urutan=? WHERE id_panorama=?",
          [nama_lokasi, deskripsi, gambar, urutan, id]
        );

        return res.status(200).json({ message: "Panorama berhasil diperbarui" });
      });
    }

    // DELETE: Hapus panorama
    if (req.method === "DELETE") {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }

      const rawBody = Buffer.concat(buffers).toString();
      const { id_panorama } = JSON.parse(rawBody);

      if (!id_panorama) {
        return res.status(400).json({ message: "ID panorama tidak ditemukan" });
      }

      await db.query("DELETE FROM tb_panorama WHERE id_panorama=?", [id_panorama]);
      return res.status(200).json({ message: "Panorama berhasil dihapus" });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (error: any) {
    console.error("ERROR DB:", error);
    return res.status(500).json({
      message: "Gagal memproses data panorama",
      error: error.message || String(error),
    });
  }
}
