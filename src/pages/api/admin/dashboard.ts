import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

// ✅ Koneksi database
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "db_wisata", // sesuaikan
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db = await mysql.createConnection(dbConfig);

    // ✅ Sesuaikan nama tabel dengan database Anda
    const [tradisi] = await db.query("SELECT COUNT(*) AS total FROM tb_tradisi");
    const [panorama] = await db.query("SELECT COUNT(*) AS total FROM tb_panorama");
    const [testimoni] = await db.query("SELECT COUNT(*) AS total FROM testimoni");

    const [ratingCount] = await db.query(
      "SELECT rating, COUNT(*) AS jumlah FROM testimoni GROUP BY rating ORDER BY rating DESC"
    );

    const [recentTestimoni] = await db.query(
      "SELECT id_testimoni, nama, komentar, rating, created_at FROM testimoni ORDER BY created_at DESC LIMIT 5"
    );

    await db.end();

    res.status(200).json({
      tradisi: (tradisi as any)[0].total,
      panorama: (panorama as any)[0].total,
      testimoni: (testimoni as any)[0].total,
      ratingCount: ratingCount as any,
      recentTestimoni: recentTestimoni as any,
    });
  } catch (err: any) {
    console.error("❌ Error Dashboard:", err);
    res.status(500).json({
      message: "Gagal mengambil data dashboard",
      error: err.message,
    });
  }
}
