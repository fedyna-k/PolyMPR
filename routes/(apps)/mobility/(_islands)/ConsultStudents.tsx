import { useEffect, useState } from "preact/hooks";

interface Promotion {
  id: number;
  name: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  promotionId: number;
}

export default function ConsultStudents() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [studentsByPromotion, setStudentsByPromotion] = useState<Record<number, Student[]>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotionsAndStudents = async () => {
      try {
        // Récupérer toutes les promotions
        const promoResponse = await fetch("/mobility/api/promotions");
        if (!promoResponse.ok) {
          throw new Error(`Error fetching promotions: ${promoResponse.statusText}`);
        }
        const promos: Promotion[] = await promoResponse.json();
        setPromotions(promos);

        // Récupérer les étudiants
        const studentsResponse = await fetch("/mobility/api/insert_students");
        if (!studentsResponse.ok) {
          throw new Error(`Error fetching students: ${studentsResponse.statusText}`);
        }
        const students: Student[] = await studentsResponse.json();

        // Grouper les étudiants par promotionId
        const grouped: Record<number, Student[]> = {};
        for (const student of students) {
          if (!grouped[student.promotionId]) {
            grouped[student.promotionId] = [];
          }
          grouped[student.promotionId].push(student);
        }
        setStudentsByPromotion(grouped);
      } catch (err) {
        console.error("Error fetching promotions or students:", err);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchPromotionsAndStudents();
  }, []);

  return (
    <section>
      <h2>Consult Students</h2>
      {error && <p className="error">{error}</p>}
      {promotions.length === 0 ? (
        <p>No promotions found.</p>
      ) : (
        promotions.map((promo) => (
          <div key={promo.id}>
            <h3>Promotion: {promo.name}</h3>
            {studentsByPromotion[promo.id]?.length ? (
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
                  {studentsByPromotion[promo.id].map((student) => (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No students in this promotion.</p>
            )}
          </div>
        ))
      )}
    </section>
  );
}
