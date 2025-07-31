import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";

const SECRET_KEY = "rahasia_super_aman"; // ganti di production

const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_wisata",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Isi username & password" });

  const [rows]: any = await db.query(
    "SELECT * FROM admin WHERE username=? AND password=?",
    [username, password]
  );

  if (rows.length === 0) return res.status(401).json({ message: "Username atau password salah" });

  const admin = rows[0];
  const token = jwt.sign({ id_admin: admin.id_admin, username: admin.username }, SECRET_KEY, {
    expiresIn: "1h",
  });

  res.status(200).json({ token });
}
