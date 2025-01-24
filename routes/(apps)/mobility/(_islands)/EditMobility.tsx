import { useEffect, useState } from "preact/hooks";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  promotionId: number;
}

interface Promotion {
  id: number;
  name: string;
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

export default function EditMobility() {
  const [data, setData] = useState<{ promotions?: Promotion[]; students?: Student[]; mobilities?: Mobility[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log("EditMobility: Fetching data from API...");
      try {
        const response = await fetch("/mobility/api/insert_mobility");
        console.log("EditMobility: API response status:", response.status);

        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("EditMobility: Data fetched successfully:", result);
        setData(result);
      } catch (err) {
        console.error("EditMobility: Error fetching data:", err);
        setError("Failed to load mobility data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    studentId: string,
    field: keyof Mobility,
    value: string | number | null,
  ) => {
    if (!data) return;

    setData((prevData) => {
      if (!prevData) return null;

      const updatedMobilities = prevData.mobilities?.map((mobility) => {
        if (mobility.studentId === studentId) {
          return { ...mobility, [field]: value };
        }
        return mobility;
      }) || [];

      return { ...prevData, mobilities: updatedMobilities };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/mobility/api/insert_mobility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: data?.mobilities }),
      });

      console.log("EditMobility: Save response status:", response.status);

      if (response.ok) {
        alert("Data saved successfully!");
        window.location.reload(); // Refresh the page to load updated data
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

  if (error) {
    return <p className="error">{error}</p>;
  }

  if (!data?.promotions) {
    return <p>Loading data...</p>;
  }

  return (
    <section>
      <h2>Edit Mobility</h2>
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
                  const mobility = data.mobilities?.find((mob) => mob.studentId === student.id) || {
                    studentId: student.id,
                    startDate: null,
                    endDate: null,
                    weeksCount: null,
                    destinationCountry: null,
                    destinationName: null,
                    mobilityStatus: "N/A",
                  };

                  return (
                    <tr key={student.id}>
                      <td>{student.id}</td>
                      <td>{student.firstName}</td>
                      <td>{student.lastName}</td>
                      <td>
                        <input
                          type="date"
                          value={mobility.startDate || ""}
                          onChange={(e) => handleChange(student.id, "startDate", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={mobility.endDate || ""}
                          onChange={(e) => handleChange(student.id, "endDate", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={mobility.weeksCount || ""}
                          onChange={(e) =>
                            handleChange(student.id, "weeksCount", Number(e.target.value) || null)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={mobility.destinationCountry || ""}
                          onChange={(e) => handleChange(student.id, "destinationCountry", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={mobility.destinationName || ""}
                          onChange={(e) => handleChange(student.id, "destinationName", e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={mobility.mobilityStatus}
                          onChange={(e) => handleChange(student.id, "mobilityStatus", e.target.value)}
                        >
                          <option value="N/A">N/A</option>
                          <option value="Planned">Planned</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Validated">Validated</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ))}
      <button onClick={handleSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Confirm"}
      </button>
    </section>
  );
}
