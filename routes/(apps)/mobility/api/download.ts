import { Handlers } from "$fresh/server.ts";
import connect from "$root/databases/connect.ts";

export const handler: Handlers = {
  async GET(request) {
    try {
      console.log("API /mobility/api/download/:id GET called");

      const url = new URL(request.url);
      const id = url.pathname.split("/").pop();

      if (!id) {
        return new Response("Invalid request: Missing ID", { status: 400 });
      }

      console.log("Connecting to mobility database...");
      using connection = connect("mobility");
      console.log("Connected to databases.");

      const query = connection.database.prepare(
        `SELECT attestationFile FROM mobility WHERE id = ?`
      );
      const result = query.get(id);

      if (!result || !result.attestationFile) {
        return new Response("No file found for the given ID", { status: 404 });
      }

      const fileBuffer = result.attestationFile;

      return new Response(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="attestation_${id}.pdf"`,
        },
      });
    } catch (error) {
      console.error("Error fetching file:", error);
      return new Response("Failed to fetch file", { status: 500 });
    }
  },
};
