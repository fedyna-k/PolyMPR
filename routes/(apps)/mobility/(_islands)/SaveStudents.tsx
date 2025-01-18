import { useSignal } from "@preact/signals";
import Papa from "https://cdn.skypack.dev/papaparse";

type Student = {
  firstName: string;
  lastName: string;
  email: string;
};

type Promotion = {
  name: string;
  students: Student[];
};

export default function SaveStudents() {
  const promotions = useSignal<Promotion[]>([]);
  const statusMessage = useSignal<string>("");

  const loadCSV = async () => {
    try {
      const response = await fetch("/api/students"); // Assurez-vous que l'API est appelée correctement
      if (!response.ok) {
        throw new Error("Failed to load CSV file");
      }
      const csvText = await response.text(); // Lire le contenu en texte
  
      const parsedData = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
      });
  
      const groupedPromotions: Record<string, Student[]> = {};
      parsedData.data.forEach((row: any) => {
        const { promotion, firstName, lastName, email } = row;
        if (!groupedPromotions[promotion]) {
          groupedPromotions[promotion] = [];
        }
        groupedPromotions[promotion].push({ firstName, lastName, email });
      });
  
      const loadedPromotions = Object.entries(groupedPromotions).map(
        ([name, students]) => ({
          name,
          students,
        })
      );
  
      promotions.value = loadedPromotions;
      statusMessage.value = "Data loaded successfully!";
    } catch (error) {
      console.error("Error loading CSV file:", error);
      statusMessage.value = "Failed to load data. Please try again.";
    }
  };
  
  

  // Charger les données CSV dès le chargement du composant
  loadCSV();

  return (
    <div>
      <h2>Loaded Promotions</h2>
      <button onClick={loadCSV}>Actualiser</button>
      <p>{statusMessage.value}</p>
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
  );
}
