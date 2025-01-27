import { useEffect, useState } from "preact/hooks";

export default function EditMobility() {
  const [mobilityData, setMobilityData] = useState<MobilityData[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<number | "all">("all");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchMobilityData() {
      console.log("EditMobility: Fetching data from API...");
      const response = await fetch("/mobility/api/insert-mobility");
      const data = await response.json();
      console.log("EditMobility: Data fetched successfully:", data);

      setPromotions(data.promotions);

      const initializedData = data.students.map((student: any) => {
        const existingMobility = data.mobilities.find(
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
      setMobilityData(initializedData);
    }

    fetchMobilityData();
  }, []);

  const handleChange = (
    studentId: string,
    field: keyof MobilityData,
    value: string | number | null
  ) => {
    setMobilityData((prev) =>
      prev.map((entry) =>
        entry.studentId === studentId ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      console.log("EditMobility: Sending data to API...");
      const response = await fetch("/mobility/api/insert-mobility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: mobilityData }),
      });

      if (response.ok) {
        alert("Data saved successfully!");
        console.log("EditMobility: Save response status:", response.status);
      } else {
        alert("Failed to save data.");
        console.error("EditMobility: Save response status:", response.status);
      }
    } catch (error) {
      console.error("EditMobility: Error saving data:", error);
      alert("An error occurred while saving data.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredData =
    selectedPromotion === "all"
      ? mobilityData
      : mobilityData.filter((entry) => entry.promotionId === selectedPromotion);

  const groupedData = promotions.map((promo) => ({
    promotion: promo.name,
    students: filteredData.filter((entry) => entry.promotionId === promo.id),
  }));

  return (
    <div>
      <h2>Edit Mobility</h2>

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

      {groupedData.map((group) => (
        <div key={group.promotion}>
          {group.students.length > 0 && (
            <>
              <h3>Promotion: {group.promotion}</h3>
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
                  {group.students.map((entry) => (
                    <tr key={entry.studentId}>
                      <td>{entry.studentId}</td>
                      <td>{entry.firstName}</td>
                      <td>{entry.lastName}</td>
                      <td>
                        <input
                          type="date"
                          value={entry.startDate || ""}
                          onChange={(e) =>
                            handleChange(entry.studentId, "startDate", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={entry.endDate || ""}
                          onChange={(e) =>
                            handleChange(entry.studentId, "endDate", e.target.value)
                          }
                        />
                      </td>
                      <td>{entry.weeksCount || "N/A"}</td>
                      <td>
                        <input
                          type="text"
                          value={entry.destinationCountry || ""}
                          onChange={(e) =>
                            handleChange(
                              entry.studentId,
                              "destinationCountry",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={entry.destinationName || ""}
                          onChange={(e) =>
                            handleChange(entry.studentId, "destinationName", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <select
                          value={entry.mobilityStatus}
                          onChange={(e) =>
                            handleChange(entry.studentId, "mobilityStatus", e.target.value)
                          }
                        >
                          <option value="N/A">N/A</option>
                          <option value="Planned">Planned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Validated">Validated</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      ))}

      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Confirm"}
      </button>
    </div>
  );
}
