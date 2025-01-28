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
          attestationFile: existingMobility?.attestationFile || null,
          promotionId: student.promotionId,
          promotionName: student.promotionName,
        };
      });
      setMobilityData(initializedData);
    }

    fetchMobilityData();
  }, []);

  const handleFileChange = (studentId: string, file: File | null) => {
    if (file && file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    setMobilityData((prev) =>
      prev.map((entry) =>
        entry.studentId === studentId ? { ...entry, attestationFile: file } : entry
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      console.log("EditMobility: Sending data to API...");

      const formData = new FormData();

      mobilityData.forEach((entry) => {
        formData.append(
          "data",
          JSON.stringify({
            id: entry.id,
            studentId: entry.studentId,
            startDate: entry.startDate,
            endDate: entry.endDate,
            destinationCountry: entry.destinationCountry,
            destinationName: entry.destinationName,
            mobilityStatus: entry.mobilityStatus,
          })
        );

        if (entry.attestationFile instanceof File) {
          formData.append(`file_${entry.studentId}`, entry.attestationFile);
        }
      });

      const response = await fetch("/mobility/api/insert-mobility", {
        method: "POST",
        body: formData,
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

  const handleDownload = (id: number) => {
    window.open(`/mobility/api/download/${id}`, "_blank");
  };

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
                    <th>Attestation File</th>
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
                            setMobilityData((prev) =>
                              prev.map((data) =>
                                data.studentId === entry.studentId
                                  ? { ...data, startDate: e.target.value }
                                  : data
                              )
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          value={entry.endDate || ""}
                          onChange={(e) =>
                            setMobilityData((prev) =>
                              prev.map((data) =>
                                data.studentId === entry.studentId
                                  ? { ...data, endDate: e.target.value }
                                  : data
                              )
                            )
                          }
                        />
                      </td>
                      <td>{entry.weeksCount || "0"}</td>
                      <td>
                        <input
                          type="text"
                          value={entry.destinationCountry || ""}
                          onChange={(e) =>
                            setMobilityData((prev) =>
                              prev.map((data) =>
                                data.studentId === entry.studentId
                                  ? { ...data, destinationCountry: e.target.value }
                                  : data
                              )
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={entry.destinationName || ""}
                          onChange={(e) =>
                            setMobilityData((prev) =>
                              prev.map((data) =>
                                data.studentId === entry.studentId
                                  ? { ...data, destinationName: e.target.value }
                                  : data
                              )
                            )
                          }
                        />
                      </td>
                      <td>
                        <select
                          value={entry.mobilityStatus}
                          onChange={(e) =>
                            setMobilityData((prev) =>
                              prev.map((data) =>
                                data.studentId === entry.studentId
                                  ? { ...data, mobilityStatus: e.target.value }
                                  : data
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
                      <td>
                        {entry.attestationFile ? (
                          <>
                            <button onClick={() => handleDownload(entry.id!)}>
                              Download
                            </button>
                            <button
                              onClick={() =>
                                setMobilityData((prev) =>
                                  prev.map((data) =>
                                    data.studentId === entry.studentId
                                      ? { ...data, attestationFile: null }
                                      : data
                                  )
                                )
                              }
                            >
                              Delete
                            </button>
                          </>
                        ) : (
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) =>
                              handleFileChange(
                                entry.studentId,
                                e.target.files?.[0] || null
                              )
                            }
                          />
                        )}
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
