import { defineConfig } from "$fresh/server.ts";
import ensureDatabases from "$root/databases/ensure.ts";
import { load } from "@std/dotenv";

await load({ envPath: "./.env.development.local", export: true });
await ensureDatabases();
export default defineConfig({
  server: {
    cert: await Deno.readTextFile("certs/cert.pem"),
    key: await Deno.readTextFile("certs/key.pem"),
    port: 443,
  },
});
