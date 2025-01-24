import { Handlers } from "$fresh/server.ts";
import { Database } from "@db/sqlite";

export const handler: Handlers = {
  async GET() {
    try {
      console.log("Connecting to mobility database...");
      const connection = new Database("databases/data/mobility.db", { create: false });
      connection.run("ATTACH DATABASE 'databases/data/students.db' AS students");
      console.log("Connected to databases.");

      const students = connection.prepare(
        `SELECT 
          students.userId AS id, 
          students.firstName, 
          students.lastName, 
          students.promotionId AS promotionId, 
          promotions.name AS promotionName
         FROM students.students
         LEFT JOIN students.promotions ON students.promotionId = promotions.id`
      ).all();

      const mobilities = connection.prepare(
        `SELECT 
          mobility.id, 
          mobility.studentId, 
          mobility.startDate, 
          mobility.endDate, 
          mobility.weeksCount, 
          mobility.destinationCountry, 
          mobility.destinationName, 
          mobility.mobilityStatus 
        FROM mobility`
      ).all();

      const promotions = connection.prepare(
        `SELECT id, name FROM students.promotions`
      ).all();

      connection.close();

      return new Response(
        JSON.stringify({ mobilities, students, promotions }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      console.error("Error fetching mobility data:", error);
      return new Response("Failed to fetch data", { status: 500 });
    }
  },

  async POST(request) {
    console.log("API /mobility/api/insert_mobility POST called");

    try {
      const body = await request.json();
      const { data } = body;

      if (!Array.isArray(data)) {
        throw new Error("Invalid request body");
      }

      const connection = new Database("databases/data/mobility.db", { create: false });

      const insertQuery = connection.prepare(
        `INSERT INTO mobility (
          studentId, startDate, endDate, weeksCount, destinationCountry, destinationName, mobilityStatus
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`
      );

      for (const mobility of data) {
        const {
          studentId,
          startDate,
          endDate,
          weeksCount,
          destinationCountry,
          destinationName,
          mobilityStatus = "N/A",
        } = mobility;

        insertQuery.run(
          studentId,
          startDate,
          endDate,
          weeksCount,
          destinationCountry,
          destinationName,
          mobilityStatus
        );
      }

      connection.close();

      console.log("Mobility data inserted successfully");
      return new Response("Data inserted successfully", { status: 201 });
    } catch (error) {
      console.error("Error inserting mobility data:", error);
      return new Response("Failed to insert data", { status: 500 });
    }
  },
};
