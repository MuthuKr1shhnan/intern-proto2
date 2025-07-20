import { useState } from "react";
import axios from "axios";

import FileGetter from "../../components/FileGetter";
import Done from "../../components/Done";

function ExcelToPdf() {
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleFileSelect = async (selected) => {
    if (!selected || selected.length === 0) return;

    const file = selected[0]; // Only one Excel file expected
    const base_URL = import.meta.env.VITE_BASE_URL;
    try {
      setIsDone(true);
      const formData = new FormData();
      formData.append("file", file); // assuming backend expects 'file'

      const response = await axios.post(
        `${base_URL}api/excel/convert`,
        formData,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setConvertedFileUrl(url);
      setIsCompleted(true);
    } catch (error) {
      console.error("Excel to PDF conversion failed:", error);
      alert("Conversion failed. Please try again.");
    }
  };

  if (isDone) {
    return (
      <Done
        action='Excel to PDF'
        downloadUrl={convertedFileUrl}
        onDownload={() => {
          const link = document.createElement("a");
          link.href = convertedFileUrl;
          link.download = "converted_Excel_To_PDF.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        isCompleted={isCompleted}
      />
    );
  }

  return (
    <FileGetter
      onFileSelect={handleFileSelect}
      acceptedFileTypes='.xls,.xlsx,.csv'
      multipleFiles={false}
    />
  );
}

export default ExcelToPdf;
