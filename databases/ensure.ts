import { Database } from "@db/sqlite";

export default async function ensureDatabases() {
  await Deno.mkdir("databases/data", { recursive: true });

  for await (const file of Deno.readDir("databases/init")) {
    if (!file.isFile) {
      console.warn(`[WARN] Path ${file.name} is not a file.`);
      continue;
    }

    const databaseName = file.name.substring(0, file.name.length - 4);
    const databasePath = `databases/data/${databaseName}.db`;

    try {
      await Deno.stat(databasePath);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }

      const sqlInitCode = await Deno.readTextFile(
        `databases/init/${file.name}`,
      );
      const database = new Database(databasePath);
      database.run(sqlInitCode);
      database.close();
    }
  }
}
