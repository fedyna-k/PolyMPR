// @deno-types="https://cdn.sheetjs.com/xlsx-0.20.3/package/types/index.d.ts"
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";
import { useSignal } from "@preact/signals";
import handleUpload from "../api/insert_students.ts";

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
    statusMessage.value = handleUpload(fileData.value);
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
