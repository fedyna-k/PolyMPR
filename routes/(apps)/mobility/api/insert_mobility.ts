import { Handlers } from "$fresh/server.ts";
import connect from "$root/databases/connect.ts";

export const handler: Handlers = {
  async GET() {
    try {
      using connection = connect("mobility");

      const mobilities = connection.database.prepare(
        `SELECT 
          mobility.id, 
          mobility.studentId, 
          students.firstName, 
          students.lastName, 
          mobility.startDate, 
          mobility.endDate, 
          mobility.weeksCount, 
          mobility.destinationCountry, 
          mobility.destinationName, 
          mobility.mobilityStatus 
        FROM mobility
        LEFT JOIN students ON mobility.studentId = students.userId`,
      ).all();

      return new Response(
        JSON.stringify({ mobilities }),
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
    console.log("API /mobility/api/update_mobility called");

    try {
      const body = await request.json();
      const { data } = body;

      if (!Array.isArray(data)) {
        throw new Error("Invalid request body");
      }

      using connection = connect("mobility");

      const updateQuery = connection.database.prepare(
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
          id,
          studentId,
          startDate,
          endDate,
          weeksCount,
          destinationCountry,
          destinationName,
          mobilityStatus = "N/A",
        } = mobility;

        updateQuery.run(
          id,
          studentId,
          startDate,
          endDate,
          weeksCount,
          destinationCountry,
          destinationName,
          mobilityStatus
        );
      }

      console.log("Mobility data updated successfully");
      return new Response("Data updated successfully", { status: 200 });
    } catch (error) {
      console.error("Error updating mobility data:", error);
      return new Response("Failed to update data", { status: 500 });
    }
  },
};
