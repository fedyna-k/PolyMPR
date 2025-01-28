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
 * @param database The database connexion
 * @param userId The user ID.
 * @returns Itself from the database.
 */
function getAll(
  database: Database,
): { students: Student[]; promos: Promotion[] } {
  const studentsQuery = `
    select userId, firstName, lastName, mail, promotionId
    from students inner join promotions
    on students.promotionId = promotions.id
    where promotions.current < 6`;
  const students: Student[] = database.prepare(studentsQuery).all();

  const promosQuery = "select * from promotions where promotions.current < 6";
  const promos: Promotion[] | undefined = database.prepare(promosQuery).all();

  return { students, promos };
}

/**
 * Add users to the database.
 * @param database The database connexion
 * @param students The students to add
 * @param promoId The promotion id.
 */
function addStudents(database: Database, students: Student[], promoId: string) {
  const query = `
    INSERT INTO students 
    (userId, firstName, lastName, mail, promotionId) 
    VALUES (?, ?, ?, ?, ?)`;

  const statement = database.prepare(query);

  for (const student of students) {
    statement.run(
      student.userId,
      student.firstName,
      student.lastName,
      student.mail,
      promoId,
    );
  }
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
        JSON.stringify(getItself(database, context.state.session.uid)),
        {
          headers: {
            "content-type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify(getAll(database)),
      {
        headers: {
          "content-type": "application/json",
        },
      },
    );
  },
  /**
   * Add students in the database.
   * @param request The HTTP request.
   * @param _context The Fresh context.
   * @returns HTTP 201 on successful insert.
   */
  async POST(
    request: Request,
    _context: FreshContext<AuthenticatedState>,
  ): Promise<Response> {
    const { students, promo }: { students: Student[]; promo: string } =
      await request.json();

    if (!promo || !promo.match(/^\d{4}-\dA$/) || !Array.isArray(students)) {
      return new Response(null, { status: 400 });
    }

    using connection = connect("students");
    const database = connection.database;

    const { endyear, current } = promo.match(
      /^(?<endyear>\d{4})-(?<current>\d)A$/,
    )?.groups!;

    database.prepare(
      "insert or ignore into promotions (endyear, current) values (?, ?)",
    ).run(endyear, current);

    const { id: promoId }: { id: string } = database
      .prepare("select id from promotions where endyear = ? and current = ?")
      .get(endyear, current)!;

    addStudents(database, students, promoId);

    return new Response(null, { status: 201 });
  },
};
