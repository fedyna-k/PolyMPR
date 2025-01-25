import { Handlers } from "$fresh/server.ts";
// import { Database } from "@db/sqlite";
import connect from "$root/databases/connect.ts";

export const handler: Handlers = {
  // deno-lint-ignore require-await
  async GET() {
    try {
      using connection = connect("students");

      const promotions = connection.database.prepare(
        "select id, name from promotions",
      ).all();

      const students = connection.database
        .prepare(
          `select userId, firstName, lastName, mail, promotionId from students`,
        )
        .all();

      return new Response(
        JSON.stringify({ promotions, students }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      return new Response("Failed to fetch data", { status: 500 });
    }
  },

  async POST(request) {
    console.log("API /students/api/insert_students called");

    try {
      const body = await request.json();
      const { data, promoName } = body;

      console.log("Received data:", { promoName, data });

      if (!promoName || !Array.isArray(data)) {
        throw new Error("Invalid request body");
      }

      using connection = connect("students");

      connection.database.prepare(
        "INSERT OR IGNORE INTO promotions (name) VALUES (?)",
      ).run(promoName);

      const promoIdRow: { id: number } = connection.database
        .prepare("SELECT id FROM promotions WHERE name = ?")
        .get(promoName)!;
      const promoId = promoIdRow.id;

      console.log(`Promotion ID for "${promoName}":`, promoId);

      const insertQuery = connection.database.prepare(
        `INSERT INTO students 
        (userId, firstName, lastName, mail, promotionId) 
        VALUES (?, ?, ?, ?, ?)`,
      );

      for (const student of data) {
        console.log("Inserting student:", student);
        insertQuery.run(
          student.Identifiant,
          student.Nom,
          student["Prénom"],
          student.Mail,
          promoId,
        );
      }

      console.log("All data inserted successfully");
      return new Response("Data inserted successfully", { status: 201 });
    } catch (error) {
      console.error("Error inserting data:", error);
      return new Response("Failed to insert data", { status: 500 });
    }
  },
};
