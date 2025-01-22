import { Handlers } from "$fresh/server.ts";
import connect from "$root/databases/connect.ts";

export const handler: Handlers = {
  async GET() {
    try {
      using connection = connect("students");

      const promotions = connection.database.prepare(
        "select id from promotions",
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
};
