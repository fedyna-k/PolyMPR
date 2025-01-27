import { Handlers } from "$fresh/server.ts";
import connect from "$root/databases/connect.ts";

export const handler: Handlers = {
  // deno-lint-ignore require-await
  async GET() {
    try {
      using connection = connect("mobility");

      const mobilities = connection.database.prepare(
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

      const students = connection.database.prepare(
        `SELECT 
          students.userId AS id, 
          students.firstName, 
          students.lastName, 
          students.promotionId AS promotionId, 
          promotions.name AS promotionName
        FROM students.students
        LEFT JOIN students.promotions ON students.promotionId = promotions.id`
      ).all();

      const promotions = connection.database.prepare(
        `SELECT id, name FROM students.promotions`
      ).all();

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
    try {
      const body = await request.json();
      const { data } = body;

      if (!Array.isArray(data)) {
        throw new Error("Invalid request body");
      }

      using connection = connect("mobility");
      const insertQuery = connection.database.prepare(
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
          mobilityStatus = excluded.mobilityStatus`
      );

      for (const mobility of data) {
        const {
          id = null,
          studentId,
          startDate,
          endDate,
          weeksCount,
          destinationCountry,
          destinationName,
          mobilityStatus = "N/A",
        } = mobility;

        let calculatedWeeksCount = weeksCount;
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          if (start <= end) {
            calculatedWeeksCount = Math.ceil((end.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
          } else {
            calculatedWeeksCount = null;
          }
        }

        insertQuery.run(
          id,
          studentId,
          startDate,
          endDate,
          calculatedWeeksCount,
          destinationCountry,
          destinationName,
          mobilityStatus
        );
      }

      console.log("Mobility data inserted/updated successfully.");
      return new Response("Data inserted/updated successfully", { status: 200 });
    } catch (error) {
      console.error("Error inserting mobility data:", error);
      return new Response("Failed to insert/update data", { status: 500 });
    }
  },
};
