import { DB } from "https://deno.land/x/sqlite/mod.ts";

export default function insertIntoMobility(
  data: Array<{ firstName: string; lastName: string; email: string }>,
  promoName: string
) {
  try {
    const db = new DB("databases/data/mobility.db");

    db.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL,
        promotion TEXT NOT NULL
      );
    `);

    const insertQuery = "INSERT INTO students (firstName, lastName, email, promotion) VALUES (?, ?, ?, ?)";
    for (const student of data) {
      db.query(insertQuery, [student.firstName, student.lastName, student.email, promoName]);
    }

    console.log(`Data for promotion ${promoName} inserted successfully.`);

    db.close();
  } catch (error) {
    console.error("Error inserting data into mobility database:", error);
  }
}
