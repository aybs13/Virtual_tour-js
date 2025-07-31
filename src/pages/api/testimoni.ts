import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_wisata",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const { page = 1, limit = 5 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      // ✅ Ambil semua kolom, termasuk feedback_admin
      const [rows] = await db.query(
        "SELECT * FROM testimoni ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [Number(limit), offset]
      );

      const [[{ total }]]: any = await db.query(
        "SELECT COUNT(*) AS total FROM testimoni"
      );

      return res.status(200).json({ data: rows, total });
    }

    if (req.method === "POST") {
      const { nama, komentar, rating } = req.body;
      if (!nama || !komentar) {
        return res.status(400).json({ message: "Nama & komentar wajib diisi" });
      }
      await db.query(
        "INSERT INTO testimoni (nama, komentar, rating) VALUES (?, ?, ?)",
        [nama, komentar, rating || 5]
      );
      return res.status(201).json({ message: "Testimoni ditambahkan" });
    }

    if (req.method === "PUT") {
      const { id_testimoni, feedback_admin } = req.body;
      await db.query(
        "UPDATE testimoni SET feedback_admin=? WHERE id_testimoni=?",
        [feedback_admin, id_testimoni]
      );
      return res.status(200).json({ message: "Feedback admin berhasil dikirim" });
    }

    if (req.method === "DELETE") {
      const { id_testimoni } = req.query;
      await db.query("DELETE FROM testimoni WHERE id_testimoni=?", [id_testimoni]);
      return res.status(200).json({ message: "Testimoni berhasil dihapus" });
    }

    return res.status(405).json({ message: "Method tidak diizinkan" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}
