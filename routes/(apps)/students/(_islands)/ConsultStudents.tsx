import { useEffect, useState } from "preact/hooks";
import Promotion from "$root/routes/(apps)/students/(_components)/Promotion.tsx";

type SingleUserResponse = { promo: Promotion; student: Student };
type ManyUsersResponse = { promos: Promotion[]; students: Student[] };

type APIResponse = SingleUserResponse | ManyUsersResponse;

export default function ConsultStudents() {
  const [data, setData] = useState<APIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/students/api/students");
      if (!response.ok) {
        setError("Failed to load data. Please try again later.");
      }

      const result: APIResponse = await response.json();
      setData(result);
    };

    fetchData();
  }, []);

  return (
    <>
      {error && <p className="error">{error}</p>}
      {data && ((Object.hasOwn(data, "student"))
        ? (
          <Promotion
            students={[(data as SingleUserResponse).student]}
            promo={(data as SingleUserResponse).promo}
          />
        )
        : (data as ManyUsersResponse).promos.map((promo) => (
          <Promotion
            students={(data as ManyUsersResponse).students}
            promo={promo}
          />
        )))}
    </>
  );
}
