import { useEffect, useState } from "preact/hooks";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  promotion: string;
}

export default function ConsultStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/mobility/api/insert_students");

        if (!response.ok) {
          throw new Error(`Error fetching students: ${response.statusText}`);
        }

        const data: Student[] = await response.json();
        setStudents(data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students. Please try again later.");
      }
    };

    fetchStudents();
  }, []);

  return (
    <section>
      <h2>Consult Students</h2>
      {error && <p className="error">{error}</p>}
      {students.length === 0 ? <p>No students found.</p> : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Promotion</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.firstName}</td>
                <td>{student.lastName}</td>
                <td>{student.email}</td>
                <td>{student.promotion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
