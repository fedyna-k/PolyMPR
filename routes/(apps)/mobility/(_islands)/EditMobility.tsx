import { useEffect, useState } from "preact/hooks";

interface MobilityData {
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

export default function EditMobility() {
  const [mobilityData, setMobilityData] = useState<MobilityData[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchMobilityData() {
      const response = await fetch("/mobility/api/insert_mobility");
      const data = await response.json();
      setMobilityData(data.mobilities || []);
    }

    fetchMobilityData();
  }, []);

  const handleChange = (
    id: number,
    field: keyof MobilityData,
    value: string | number | null,
  ) => {
    setMobilityData((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry,
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/mobility/api/insert_mobility", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: mobilityData }),
      });

      if (response.ok) {
        alert("Data saved successfully!");
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
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
          {mobilityData.map((mobility) => (
            <tr key={mobility.id}>
              <td>{mobility.firstName}</td>
              <td>{mobility.lastName}</td>
              <td>
                <input
                  type="date"
                  value={mobility.startDate || ""}
                  onChange={(e) =>
                    handleChange(mobility.id, "startDate", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="date"
                  value={mobility.endDate || ""}
                  onChange={(e) =>
                    handleChange(mobility.id, "endDate", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={mobility.weeksCount || ""}
                  onChange={(e) =>
                    handleChange(
                      mobility.id,
                      "weeksCount",
                      Number(e.target.value) || null,
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={mobility.destinationCountry || ""}
                  onChange={(e) =>
                    handleChange(mobility.id, "destinationCountry", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={mobility.destinationName || ""}
                  onChange={(e) =>
                    handleChange(mobility.id, "destinationName", e.target.value)
                  }
                />
              </td>
              <td>
                <select
                  value={mobility.mobilityStatus}
                  onChange={(e) =>
                    handleChange(mobility.id, "mobilityStatus", e.target.value)
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
      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
