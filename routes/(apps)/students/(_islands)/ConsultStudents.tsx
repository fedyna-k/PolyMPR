import { useEffect, useState } from "preact/hooks";

interface Promotion {
  id: number;
  name: string;
}

interface Student {
  userId: string;
  firstName: string;
  lastName: string;
  mail: string;
  promotionId: number;
}

export default function ConsultStudents() {
  const [data, setData] = useState<
    { promotions: Promotion[]; students: Student[] } | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/students/api/insert_students");
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Fetched data:", result);
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  return (
    <section>
      <h2>Consult Students</h2>
      {error && <p className="error">{error}</p>}
      {data?.promotions.map((promo) => (
        <div key={promo.id}>
          <h3>Promotion: {promo.name}</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {data.students
                .filter((student) => student.promotionId === promo.id)
                .map((student) => (
                  <tr key={student.userId}>
                    <td>{student.userId}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.mail}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
