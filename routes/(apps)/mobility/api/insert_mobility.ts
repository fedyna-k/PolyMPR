import { Handlers } from "$fresh/server.ts";
import { Database } from "@db/sqlite";

export const handler: Handlers = {
  // deno-lint-ignore require-await
  async GET() {
    try {
      console.log("Connecting to mobility database...");
      const connection = new Database("databases/data/mobility.db", {
        create: false,
      });
      connection.run(
        "ATTACH DATABASE 'databases/data/students.db' AS students",
      );
      console.log("Connected to databases.");

      const students = connection.prepare(
        `SELECT 
          students.userId AS id, 
          students.firstName, 
          students.lastName, 
          students.promotionId AS promotionId, 
          promotions.name AS promotionName
         FROM students.students
         LEFT JOIN students.promotions ON students.promotionId = promotions.id`,
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
        FROM mobility`,
      ).all();

      const promotions = connection.prepare(
        `SELECT id, name FROM students.promotions`,
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
      console.log("Connecting to mobility database...");
      const connection = new Database("databases/data/mobility.db", {
        create: false,
      });

      console.log("Attaching students database...");
      connection.run(
        "ATTACH DATABASE 'databases/data/students.db' AS students",
      );
      console.log("Students database attached successfully.");

      const insertQuery = connection.prepare(
        `INSERT INTO mobility (
          id, studentId, startDate, endDate, weeksCount, destinationCountry, destinationName, mobilityStatus
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          startDate = excluded.startDate,
          endDate = excluded.endDate,
          weeksCount = excluded.weeksCount,
          destinationCountry = excluded.destinationCountry,
          destinationName = excluded.destinationName,
          mobilityStatus = excluded.mobilityStatus`,
      );

      for (const mobility of data) {
        const {
          id,
          studentId,
          startDate,
          endDate,
          weeksCount,
          destinationCountry,
          destinationName,
          mobilityStatus = "N/A",
        } = mobility;

        console.log("Processing mobility data:", mobility);

        const studentExists = connection
          .prepare(
            `SELECT COUNT(*) AS count FROM students.students WHERE userId = ?`,
          )
          .get(studentId);

        console.log(`Student ${studentId} exists:`, studentExists.count > 0);

        if (studentExists.count === 0) {
          console.warn(`Skipping mobility for unknown studentId: ${studentId}`);
          continue;
        }

        let calculatedWeeksCount = weeksCount;
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          if (start <= end) {
            calculatedWeeksCount = Math.ceil(
              (end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000),
            );
          } else {
            calculatedWeeksCount = null;
          }
        }

        console.log("Executing SQL insert/update query for:", {
          id,
          studentId,
          startDate,
          endDate,
          calculatedWeeksCount,
          destinationCountry,
          destinationName,
          mobilityStatus,
        });

        insertQuery.run(
          id,
          studentId,
          startDate,
          endDate,
          calculatedWeeksCount,
          destinationCountry,
          destinationName,
          mobilityStatus,
        );
      }

      connection.close();
      console.log("Mobility data inserted/updated successfully.");
      return new Response("Data inserted/updated successfully", {
        status: 200,
      });
    } catch (error) {
      console.error("Error inserting mobility data:", error);
      return new Response("Failed to insert/update data", { status: 500 });
    }
  },
};
