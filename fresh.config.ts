import { defineConfig } from "$fresh/server.ts";

export default defineConfig({
  server: {
    cert: await Deno.readTextFile("certs/cert.pem"),
    key: await Deno.readTextFile("certs/key.pem"),
    port: 443,
  },
});
