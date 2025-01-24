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
    const fetchMobilityData = async () => {
      console.log("EditMobility: Fetching mobility data...");
      try {
        const response = await fetch("/mobility/api/insert_mobility");
        console.log("EditMobility: API response status:", response.status);

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("EditMobility: Data fetched successfully:", data);
        setMobilityData(data.mobilities || []);
      } catch (err) {
        console.error("EditMobility: Error fetching data:", err);
      }
    };

    fetchMobilityData();
  }, []);

  const handleSave = async () => {
    console.log("EditMobility: Saving data...");
    setIsSaving(true);

    try {
      const response = await fetch("/mobility/api/insert_mobility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: mobilityData }),
      });

      console.log("EditMobility: Save response status:", response.status);

      if (response.ok) {
        console.log("EditMobility: Data saved successfully.");
        alert("Data saved successfully!");
      } else {
        throw new Error(`Failed to save data: ${response.statusText}`);
      }
    } catch (error) {
      console.error("EditMobility: Error saving data:", error);
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
                    setMobilityData((prev) =>
                      prev.map((entry) =>
                        entry.id === mobility.id
                          ? { ...entry, startDate: e.target.value }
                          : entry
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="date"
                  value={mobility.endDate || ""}
                  onChange={(e) =>
                    setMobilityData((prev) =>
                      prev.map((entry) =>
                        entry.id === mobility.id
                          ? { ...entry, endDate: e.target.value }
                          : entry
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={mobility.weeksCount || ""}
                  onChange={(e) =>
                    setMobilityData((prev) =>
                      prev.map((entry) =>
                        entry.id === mobility.id
                          ? { ...entry, weeksCount: Number(e.target.value) || null }
                          : entry
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={mobility.destinationCountry || ""}
                  onChange={(e) =>
                    setMobilityData((prev) =>
                      prev.map((entry) =>
                        entry.id === mobility.id
                          ? { ...entry, destinationCountry: e.target.value }
                          : entry
                      )
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={mobility.destinationName || ""}
                  onChange={(e) =>
                    setMobilityData((prev) =>
                      prev.map((entry) =>
                        entry.id === mobility.id
                          ? { ...entry, destinationName: e.target.value }
                          : entry
                      )
                    )
                  }
                />
              </td>
              <td>
                <select
                  value={mobility.mobilityStatus}
                  onChange={(e) =>
                    setMobilityData((prev) =>
                      prev.map((entry) =>
                        entry.id === mobility.id
                          ? { ...entry, mobilityStatus: e.target.value }
                          : entry
                      )
                    )
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
