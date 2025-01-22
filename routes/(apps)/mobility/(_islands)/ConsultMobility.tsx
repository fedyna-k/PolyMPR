import { useEffect, useState } from "preact/hooks";

interface Promotion {
  id: number;
  name: string;
}

interface Mobility {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  startDate: string | null;
  endDate: string | null;
  weeksCount: number | null;
  destinationCountry: string | null;
  destinationName: string | null;
  mobilityStatus: string;
}

export default function ConsultMobility() {
  const [data, setData] = useState<{ promotions: Promotion[]; mobilities: Mobility[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/mobility/api/insert_mobility");
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching mobility data:", err);
        setError("Failed to load mobility data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  return (
    <section>
      <h2>Consult Mobility</h2>
      {error && <p className="error">{error}</p>}
      {data?.promotions.map((promo) => (
        <div key={promo.id}>
          <h3>Promotion: {promo.id}</h3>
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
              {data.mobilities
                .filter((mobility) => mobility.studentId.startsWith(String(promo.id)))
                .map((mobility) => (
                  <tr key={mobility.id}>
                    <td>{mobility.id}</td>
                    <td>{mobility.firstName}</td>
                    <td>{mobility.lastName}</td>
                    <td>{mobility.startDate || "N/A"}</td>
                    <td>{mobility.endDate || "N/A"}</td>
                    <td>{mobility.weeksCount ?? "N/A"}</td>
                    <td>{mobility.destinationCountry || "N/A"}</td>
                    <td>{mobility.destinationName || "N/A"}</td>
                    <td>{mobility.mobilityStatus}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
