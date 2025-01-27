import { useEffect, useState } from "preact/hooks";

interface Promotion {
  id: number;
  name: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  promotionId: number;
}

interface Mobility {
  id: number;
  studentId: string;
  startDate: string | null;
  endDate: string | null;
  weeksCount: number | null;
  destinationCountry: string | null;
  destinationName: string | null;
  mobilityStatus: string;
}

export default function ConsultMobility() {
  const [data, setData] = useState<
    | {
      promotions?: Promotion[];
      students?: Student[];
      mobilities?: Mobility[];
    }
    | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log("ConsultMobility: Fetching data from API...");
      try {
        const response = await fetch("/mobility/api/insert-mobility");
        console.log("ConsultMobility: API response status:", response.status);

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("ConsultMobility: Data fetched successfully:", result);
        setData(result);
      } catch (err) {
        console.error("ConsultMobility: Error fetching data:", err);
        setError("Failed to load mobility data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!data?.promotions) {
    return <p>No promotions found.</p>;
  }

  return (
    <section>
      <h2>Consult Mobility</h2>
      {data.promotions.map((promo) => (
        <div key={promo.id}>
          <h3>Promotion: {promo.name}</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Weeks Count</th>
                <th>Destination Country</th>
                <th>Destination Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.students
                ?.filter((student) => student.promotionId === promo.id)
                .map((student) => {
                  const mobility = data.mobilities?.find((mob) =>
                    mob.studentId === student.id
                  );
                  return (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>{mobility?.startDate || "N/A"}</td>
                      <td>{mobility?.endDate || "N/A"}</td>
                      <td>{mobility?.weeksCount ?? "0"}</td>
                      <td>{mobility?.destinationCountry || "N/A"}</td>
                      <td>{mobility?.destinationName || "N/A"}</td>
                      <td>{mobility?.mobilityStatus || "N/A"}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
