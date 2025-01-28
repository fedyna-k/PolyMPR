// @deno-types="https://cdn.sheetjs.com/xlsx-0.20.3/package/types/index.d.ts"
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";
import { Signal, useSignal } from "@preact/signals";

/**
 * Create a new handler for file change that displays
 * messages in statusMessage and gets file data in fileData.
 * @param statusMessage The status message signal.
 * @param fileData The file data signal.
 * @returns The file change handler.
 */
function getFileChangeHandler(
  statusMessage: Signal<string>,
  fileData: Signal<File | null>,
): (event: Event) => void {
  /**
   * Handle file change.
   * @param event The file change event.
   */
  return (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      fileData.value = input.files[0];
      statusMessage.value = `File selected: ${input.files[0].name}`;
    } else {
      fileData.value = null;
      statusMessage.value = "No file selected";
    }
  };
}

/**
 * Create a new handler that sends data file to server.
 * @param statusMessage The status message signal.
 * @param fileData The file data signal.
 * @returns The file confirmation handler.
 */
function getUploadConfirmationFunction(
  statusMessage: Signal<string>,
  fileData: Signal<File | null>,
): () => void {
  /**
   * Add students to database.
   * @returns Confirm upload of students.
   */
  return () => {
    if (!fileData.value) {
      statusMessage.value = "Please select a file before confirming upload.";
      return;
    }

    const reader = new FileReader();

    /**
     * Send all data to the server.
     * @param event The finished progress event.
     */
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      const arrayBuffer = event.target!.result as ArrayBuffer;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      let allOK = true;

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, {
          header: ["userId", "lastName", "firstName", "mail"],
          range: 1,
        });

        const response = await fetch("/students/api/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promoName: sheetName, data }),
        });

        if (!response.ok) {
          allOK = false;
        }
      }

      statusMessage.value = allOK
        ? "Failed to insert all data."
        : "Data uploaded and inserted successfully!";
    };

    /**
     * Display error message if any.
     */
    reader.onerror = () => {
      statusMessage.value = "Error reading the file.";
    };

    reader.readAsArrayBuffer(fileData.value);
  };
}

export default function UploadStudents() {
  const statusMessage = useSignal<string>("");
  const fileData = useSignal<File | null>(null);

  const handleFileChange = getFileChangeHandler(statusMessage, fileData);
  const confirmUpload = getUploadConfirmationFunction(statusMessage, fileData);

  return (
    <>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={confirmUpload}>Confirm Upload</button>
      <p>{statusMessage.value}</p>
    </>
  );
}
