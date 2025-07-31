import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import type { RowDataPacket, FieldPacket } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    const [rows]: [RowDataPacket[], FieldPacket[]] = await db.query(
      "SELECT * FROM tb_dokumentasi WHERE id_dokumentasi = ?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `Dokumentasi dengan id ${id} tidak ditemukan` });
    }

    res.status(200).json(rows[0]);
  } catch (error: unknown) {
    console.error("ERROR DB:", error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Gagal mengambil detail tradisi", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Gagal mengambil detail tradisi", error: String(error) });
    }
  }
}
