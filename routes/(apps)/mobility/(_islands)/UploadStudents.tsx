// @deno-types="https://cdn.sheetjs.com/xlsx-0.20.3/package/types/index.d.ts"
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";
import { useSignal } from "@preact/signals";
import Papa from "https://cdn.skypack.dev/papaparse"; // Bibliothèque pour manipuler CSVs

type Student = {
  firstName: string;
  lastName: string;
  email: string;
};

type Promotion = {
  name: string;
  students: Student[];
};

export default function UploadStudents() {
  const promotions = useSignal<Promotion[]>([]);
  const tempPromotions = useSignal<Promotion[]>([]);
  const statusMessage = useSignal<string>("");

  const handleFileUpload = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      statusMessage.value = "No file selected";
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;

        // Lire le classeur Excel
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const newPromotions: Promotion[] = [];
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const students: Student[] = XLSX.utils.sheet_to_json(worksheet, {
            header: ["firstName", "lastName", "email"],
            range: 1, // Skip header row
          });

          newPromotions.push({ name: sheetName, students });
        });

        tempPromotions.value = newPromotions; // Charger temporairement les promotions
        statusMessage.value = "File loaded. Please confirm to save.";
      } catch (error) {
        statusMessage.value = "Error processing file";
        console.error(error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const confirmFileUpload = () => {
    if (tempPromotions.value.length > 0) {
      promotions.value = tempPromotions.value; // Mettre à jour les promotions
      tempPromotions.value = []; // Réinitialiser le tampon temporaire
      statusMessage.value = "Promotions updated successfully!";
      savePromotionsToCSV(promotions.value); // Enregistrer dans un fichier CSV
    } else {
      statusMessage.value = "No data to confirm.";
    }
  };

  const savePromotionsToCSV = (data: Promotion[]) => {
    const csvData = data.map((promotion) => {
      return promotion.students.map((student) => ({
        promotion: promotion.name,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      }));
    });

    const flatData = csvData.flat();
    const csv = Papa.unparse(flatData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Télécharger le fichier
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "students.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1>Upload Promotions</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      <button onClick={confirmFileUpload}>Confirm Upload</button>
      <p>{statusMessage.value}</p>

      <div>
        <h2>Available Promotions</h2>
        <ul>
          {promotions.value.map((promotion) => (
            <li key={promotion.name}>
              <strong>{promotion.name}</strong>
              <ul>
                {promotion.students.map((student, index) => (
                  <li key={index}>
                    {student.firstName} {student.lastName} - {student.email}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
