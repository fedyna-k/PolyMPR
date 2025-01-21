import { Handlers } from "$fresh/server.ts";
import { Database } from "@db/sqlite";

export const handler: Handlers = {
  async GET() {
    try {
      const db = new Database("databases/data/mobility.db");

      db.prepare(
        `
        CREATE TABLE IF NOT EXISTS promotions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL
        );
        `
      ).run();

      const promotions = db.prepare("SELECT id, name FROM promotions").all();

      db.close();

      return new Response(JSON.stringify(promotions), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching promotions:", error);
      return new Response("Failed to fetch promotions", { status: 500 });
    }
  },
};
