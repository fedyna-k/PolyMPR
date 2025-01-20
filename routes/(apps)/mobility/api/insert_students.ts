// @deno-types="https://cdn.sheetjs.com/xlsx-0.20.3/package/types/index.d.ts"
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";
import { Database } from "@db/sqlite";

export default function handleUpload(file: File | null): string {
  if (!file) {
    return "Please select a file before confirming upload.";
  }

  try {
    const reader = new FileReader();
    let statusMessage = "";

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const db = new Database("databases/data/mobility.db");

        db.execute(`
          CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            email TEXT NOT NULL,
            promotion TEXT NOT NULL
          );
        `);

        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet, {
            header: ["firstName", "lastName", "email"],
            range: 1, // Ignorer les en-têtes
          });

          const insertQuery =
            "INSERT INTO students (firstName, lastName, email, promotion) VALUES (?, ?, ?, ?)";
          for (const student of data) {
            db.query(insertQuery, [
              student.firstName,
              student.lastName,
              student.email,
              sheetName,
            ]);
          }
        }

        db.close();
        statusMessage = "Data uploaded and inserted successfully!";
      } catch (error) {
        console.error("Error reading or inserting file:", error);
        statusMessage = "Error processing the file. Please check its format.";
      }
    };

    reader.onerror = (e) => {
      console.error("FileReader error:", e);
      statusMessage = "Error reading the file.";
    };

    reader.readAsArrayBuffer(file);
    return statusMessage;
  } catch (error) {
    console.error("Error uploading file:", error);
    return "An unexpected error occurred during upload.";
  }
}
