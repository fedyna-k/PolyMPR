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
    console.log("API /mobility/api/insert-mobility POST called");

    try {
      const formData = await request.formData();
      const dataEntries = formData.getAll("data").map((item) => JSON.parse(item as string));
      console.log("Parsed data entries:", dataEntries);

      const fileMap: Record<string, Uint8Array> = {};
      for (const [key, value] of formData.entries()) {
        if (key.startsWith("file_") && value instanceof File) {
          const studentId = key.split("_")[1]; 
          const file = value as File;
          fileMap[studentId] = new Uint8Array(await file.arrayBuffer());
          console.log(`File processed for studentId ${studentId}`);
        }
      }

      using connection = connect("mobility");
      const insertQuery = connection.database.prepare(
        `INSERT INTO mobility (
          id, studentId, startDate, endDate, weeksCount, destinationCountry, destinationName, mobilityStatus, attestationFile
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          startDate = excluded.startDate,
          endDate = excluded.endDate,
          weeksCount = excluded.weeksCount,
          destinationCountry = excluded.destinationCountry,
          destinationName = excluded.destinationName,
          mobilityStatus = excluded.mobilityStatus,
          attestationFile = excluded.attestationFile`
      );

      for (const mobility of dataEntries) {
        const {
          id = null,
          studentId,
          startDate,
          endDate,
          destinationCountry,
          destinationName,
          mobilityStatus = "N/A",
        } = mobility;

        let calculatedWeeksCount = null;
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          if (start <= end) {
            const differenceInDays = Math.ceil(
              (end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
            );
            calculatedWeeksCount = Math.floor(differenceInDays / 7);
          }
        }
        const attestationFile = fileMap[studentId] || null;

        console.log(`Inserting/Updating mobility for studentId: ${studentId}`);
        insertQuery.run(
          id,
          studentId,
          startDate,
          endDate,
          calculatedWeeksCount,
          destinationCountry,
          destinationName,
          mobilityStatus,
          attestationFile
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
