// @deno-types="https://cdn.sheetjs.com/xlsx-0.20.3/package/types/index.d.ts"
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";
import { useSignal } from "@preact/signals";

export default function UploadStudents() {
  const statusMessage = useSignal<string>("");
  const fileData = useSignal<File | null>(null);

  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      fileData.value = input.files[0];
      statusMessage.value = "File selected: " + input.files[0].name;
    } else {
      fileData.value = null;
      statusMessage.value = "No file selected";
    }
  };

  const confirmUpload = () => {
    if (!fileData.value) {
      statusMessage.value = "Please select a file before confirming upload.";
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        for (const sheetName of workbook.SheetNames) {
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet, {
            header: ["Identifiant", "Nom", "Prénom", "Mail"],
            range: 1, // Ignorer les en-têtes
          });

          console.log(`Data from sheet ${sheetName}:`, data);

          const response = await fetch("/students/api/insert_students", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ promoName: sheetName, data }),
          });

          if (!response.ok) {
            throw new Error(`Failed to insert data for promotion ${sheetName}`);
          }
        }

        statusMessage.value = "Data uploaded and inserted successfully!";
      };

      reader.onerror = () => {
        statusMessage.value = "Error reading the file.";
      };

      reader.readAsArrayBuffer(fileData.value);
    } catch (error) {
      console.error("Error uploading file:", error);
      statusMessage.value = "An unexpected error occurred during upload.";
    }
  };

  return (
    <div>
      <h2>Upload Students</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={confirmUpload}>Confirm Upload</button>
      <p>{statusMessage.value}</p>
    </div>
  );
}
