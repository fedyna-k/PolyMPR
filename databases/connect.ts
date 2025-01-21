import { Database } from "@db/sqlite";

interface DatabaseConnection extends Disposable {
  database: Database;
}

export default function connect(database: string): DatabaseConnection {
  const connection = new Database(`databases/data/${database}.db`, {
    create: false,
  });

  connection.run("attach database 'databases/data/students.db' as students");

  return {
    database: connection,
    [Symbol.dispose]: () => {
      connection.close();
    },
  };
}
