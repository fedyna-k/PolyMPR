import { Handlers } from "$fresh/server.ts";
import { Database } from "@db/sqlite";

export const handler: Handlers = {
  async GET(_request, context) {
    try {
      const db = new Database("databases/data/mobility.db");

      db.prepare(
        `
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          email TEXT NOT NULL,
          promotionId INTEGER NOT NULL,
          FOREIGN KEY (promotionId) REFERENCES promotions (id)
        );
        `
      ).run();

      const rows = db
        .prepare(
          "SELECT students.id, firstName, lastName, email, promotionId FROM students"
        )
        .all();

      db.close();

      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      return new Response("Failed to fetch students", { status: 500 });
    }
  },

  async POST(request) {
    console.log("API /mobility/api/insert_students called");

    try {
      const body = await request.json();
      const { data, promoName } = body;

      console.log("Received data:", { promoName, data });

      if (!promoName || !Array.isArray(data)) {
        throw new Error("Invalid request body");
      }

      const db = new Database("databases/data/mobility.db");

      console.log("Database opened successfully");

      db.prepare(
        `
        CREATE TABLE IF NOT EXISTS promotions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL
        );
        `
      ).run();

      db.prepare(
        `
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          email TEXT NOT NULL,
          promotionId INTEGER NOT NULL,
          FOREIGN KEY (promotionId) REFERENCES promotions (id)
        );
        `
      ).run();

      console.log("Tables ensured successfully");

      // Insérer ou récupérer l'ID de la promotion
      db.prepare(
        "INSERT OR IGNORE INTO promotions (name) VALUES (?)"
      ).run(promoName);

      const promoIdRow = db
        .prepare("SELECT id FROM promotions WHERE name = ?")
        .get(promoName);
      const promoId = promoIdRow.id;

      console.log(`Promotion ID for "${promoName}":`, promoId);

      const insertQuery = db.prepare(
        "INSERT INTO students (firstName, lastName, email, promotionId) VALUES (?, ?, ?, ?)"
      );

      for (const student of data) {
        console.log("Inserting student:", student);
        insertQuery.run(student.Nom, student["Prénom"], student.Mail, promoId);
      }

      console.log("All students inserted successfully");
      db.close();

      return new Response("Students inserted successfully", { status: 201 });
    } catch (error) {
      console.error("Error inserting students:", error);
      return new Response("Failed to insert students", { status: 500 });
    }
  },
};
