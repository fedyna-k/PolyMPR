import { FreshContext, Handlers } from "$fresh/server.ts";
import connect from "$root/databases/connect.ts";
import { AuthenticatedState } from "$root/defaults/interfaces.ts";
import { Database } from "@db/sqlite";

/**
 * Gets itself from the database.
 * @param database The database connection
 * @param userId The user ID.
 * @returns Itself from the database.
 */
function getItself(
  database: Database,
  userId: string,
): { student: Student | null; promo: Promotion | null } {
  const studentQuery = "select * from students where userId = ?";
  const student: Student | undefined = database.prepare(studentQuery).get(
    userId,
  );

  if (!student) {
    return { student: null, promo: null };
  }

  const promoQuery = "select * from promotions where id = ?";
  const promo: Promotion | undefined = database.prepare(promoQuery).get(
    student.promotionId,
  );

  return { student, promo: promo ?? null };
}

/**
 * Gets itself from the database.
 * @param database The database connection
 * @param userId The user ID.
 * @returns Itself from the database.
 */
function getAll(
  database: Database,
  userId: string,
): { student: Student | null; promo: Promotion | null } {
  const studentQuery = "select * from students where userId = ?";
  const student: Student | undefined = database.prepare(studentQuery).get(
    userId,
  );

  if (!student) {
    return { student: null, promo: null };
  }

  const promoQuery = "select * from promotions where id = ?";
  const promo: Promotion | undefined = database.prepare(promoQuery).get(
    student.promotionId,
  );

  return { student, promo: promo ?? null };
}


export const handler: Handlers<null, AuthenticatedState> = {
  /**
   * The students the user can see.
   * @param _request The HTTP request.
   * @param _context The context with authenticated state.
   * @returns All students our user can see.
   */
  // deno-lint-ignore require-await
  async GET(
    _request: Request,
    context: FreshContext<AuthenticatedState>,
  ): Promise<Response> {
    using connection = connect("students");
    const database = connection.database;

    if (context.state.session.eduPersonPrimaryAffiliation == "student") {
      return new Response(
        JSON.stringify({
          student: getItself(database, context.state.session.uid),
        }),
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );
    }

    const promotions = database.prepare("select id, name from promotions")
      .all();

    const students = database.prepare(
      "select userId, firstName, lastName, mail, promotionId from students",
    ).all();

    return new Response(
      JSON.stringify({ promotions, students }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  },

  async POST(request) {
    console.log("API /students/api/insert_students called");

    try {
      const body = await request.json();
      const { data, promoName } = body;

      console.log("Received data:", { promoName, data });

      if (!promoName || !Array.isArray(data)) {
        throw new Error("Invalid request body");
      }

      using connection = connect("students");

      connection.database.prepare(
        "INSERT OR IGNORE INTO promotions (name) VALUES (?)",
      ).run(promoName);

      const promoIdRow: { id: number } = connection.database
        .prepare("SELECT id FROM promotions WHERE name = ?")
        .get(promoName)!;
      const promoId = promoIdRow.id;

      console.log(`Promotion ID for "${promoName}":`, promoId);

      const insertQuery = connection.database.prepare(
        `INSERT INTO students 
        (userId, firstName, lastName, mail, promotionId) 
        VALUES (?, ?, ?, ?, ?)`,
      );

      for (const student of data) {
        console.log("Inserting student:", student);
        insertQuery.run(
          student.Identifiant,
          student.Nom,
          student["Prénom"],
          student.Mail,
          promoId,
        );
      }

      console.log("All data inserted successfully");
      return new Response("Data inserted successfully", { status: 201 });
    } catch (error) {
      console.error("Error inserting data:", error);
      return new Response("Failed to insert data", { status: 500 });
    }
  },
};
