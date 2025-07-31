import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",      // Sesuaikan
  user: "root",           // Sesuaikan
  password: "",           // Sesuaikan
  database: "db_wisata",
});
