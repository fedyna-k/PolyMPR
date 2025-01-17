import { Database } from "@db/sqlite";

export default async function insertIntoMobility(data: Array<{ firstName: string; lastName: string; email: string }>, promoName: string) {
  try {
    const databasePath = "databases/data/mobility.db";
    const db = new Database(databasePath);

    db.transaction(() => {
      for (const student of data) {
        db.query(
          "INSERT INTO students (firstName, lastName, email, promotion) VALUES (?, ?, ?, ?)",
          [student.firstName, student.lastName, student.email, promoName]
        );
      }
    })();

    db.close();
    console.log(`Data for promotion ${promoName} inserted successfully.`);
  } catch (error) {
    console.error("Error inserting data into mobility database:", error);
  }
}
