import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM tb_dokumentasi WHERE id_dokumentasi = ?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Tradisi dengan id ${id} tidak ditemukan` });
    }

    res.status(200).json(rows[0]);
  } catch (error: any) {
    console.error("ERROR DB:", error);
    res
      .status(500)
      .json({ message: "Gagal mengambil detail tradisi", error: error.message });
  }
}
