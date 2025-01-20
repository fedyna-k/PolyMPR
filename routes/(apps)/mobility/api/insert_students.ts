import { Handlers } from "$fresh/server.ts";
import { Database } from "@db/sqlite";

export const handler: Handlers = {
  async GET(_request, context) {
    try {
      // Ouvre ou crée la base de données SQLite
      const db = new Database("databases/data/mobility.db");

      // Crée la table si elle n'existe pas
      db.execute(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          email TEXT NOT NULL,
          promotion TEXT NOT NULL
        );
      `);

      // Récupère toutes les données
      const students = [];
      for (const [id, firstName, lastName, email, promotion] of db.query(
        "SELECT id, firstName, lastName, email, promotion FROM students"
      )) {
        students.push({ id, firstName, lastName, email, promotion });
      }

      db.close();

      return new Response(JSON.stringify(students), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      return new Response("Failed to fetch students", { status: 500 });
    }
  },

  async POST(request) {
    try {
      const body = await request.json();
      const { data, promoName } = body;

      // Ouvre ou crée la base de données SQLite
      const db = new Database("databases/data/mobility.db");

      // Crée la table si elle n'existe pas
      db.execute(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          firstName TEXT NOT NULL,
          lastName TEXT NOT NULL,
          email TEXT NOT NULL,
          promotion TEXT NOT NULL
        );
      `);

      // Prépare et insère les données
      const insertQuery =
        "INSERT INTO students (firstName, lastName, email, promotion) VALUES (?, ?, ?, ?)";
      for (const student of data) {
        db.query(insertQuery, [
          student.firstName,
          student.lastName,
          student.email,
          promoName,
        ]);
      }

      db.close();

      return new Response("Students inserted successfully", { status: 201 });
    } catch (error) {
      console.error("Error inserting students:", error);
      return new Response("Failed to insert students", { status: 500 });
    }
  },
};
