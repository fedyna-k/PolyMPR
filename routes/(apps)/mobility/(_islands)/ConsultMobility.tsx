import { useEffect, useState } from "preact/hooks";

export default function ConsultMobility() {
  const [mobilityData, setMobilityData] = useState<MobilityData[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<number | "all">("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("ConsultMobility: Fetching data from API...");
        const response = await fetch("/mobility/api/insert-mobility");
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("ConsultMobility: Data fetched successfully:", result);

        setPromotions(result.promotions);

        const mergedData = result.students.map((student: any) => {
          const existingMobility = result.mobilities.find(
            (mobility: any) => mobility.studentId === student.id
          );
          return {
            id: existingMobility ? existingMobility.id : null, 
            studentId: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            startDate: existingMobility?.startDate || null,
            endDate: existingMobility?.endDate || null,
            weeksCount: existingMobility?.weeksCount || null,
            destinationCountry: existingMobility?.destinationCountry || null,
            destinationName: existingMobility?.destinationName || null,
            mobilityStatus: existingMobility?.mobilityStatus || "N/A",
            promotionId: student.promotionId,
            promotionName: student.promotionName,
          };
        });

        setMobilityData(mergedData);
      } catch (err) {
        console.error("ConsultMobility: Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const filteredData =
    selectedPromotion === "all"
      ? mobilityData
      : mobilityData.filter((entry) => entry.promotionId === selectedPromotion);

  return (
    <section>
      <h2>Consult Mobility</h2>
      {error && <p className="error">{error}</p>}

      <div>
        <label htmlFor="promotionSelect">Select Promotion: </label>
        <select
          id="promotionSelect"
          value={selectedPromotion}
          onChange={(e) =>
            setSelectedPromotion(
              e.target.value === "all" ? "all" : Number(e.target.value)
            )
          }
        >
          <option value="all">All Promotions</option>
          {promotions.map((promo) => (
            <option key={promo.id} value={promo.id}>
              {promo.name}
            </option>
          ))}
        </select>
      </div>

      {promotions.map((promo) => (
        <div key={promo.id}>
          {selectedPromotion === "all" || selectedPromotion === promo.id ? (
            <>
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
                  {filteredData
                    .filter((entry) => entry.promotionId === promo.id)
                    .map((entry) => (
                      <tr key={entry.studentId}>
                        <td>{entry.studentId}</td>
                        <td>{entry.firstName}</td>
                        <td>{entry.lastName}</td>
                        <td>{entry.startDate || "N/A"}</td>
                        <td>{entry.endDate || "N/A"}</td>
                        <td>{entry.weeksCount || "N/A"}</td>
                        <td>{entry.destinationCountry || "N/A"}</td>
                        <td>{entry.destinationName || "N/A"}</td>
                        <td>{entry.mobilityStatus}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </>
          ) : null}
        </div>
      ))}
    </section>
  );
}
