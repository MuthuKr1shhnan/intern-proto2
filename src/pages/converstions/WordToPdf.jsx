import { useState } from "react";
import axios from "axios";

import FileGetter from "../../components/FileGetter";
import Done from "../../components/Done";

function WordToPdf() {
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const base_URL = import.meta.env.VITE_BASE_URL;

  const handleFileSelect = async (selected) => {
    if (!selected || selected.length === 0) return;

    const file = selected[0]; // Only one Word file expected

    try {
      setIsDone(true);
      const formData = new FormData();
      formData.append("file", file); // assuming backend expects 'file'

      const response = await axios.post(
        `${base_URL}api/convert/word-to-pdf`,
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
      console.error("Word to PDF conversion failed:", error);
      alert("Conversion failed. Please try again.");
    }
  };

  if (isDone) {
    return (
      <Done
        action='Word to PDF'
        downloadUrl={convertedFileUrl}
        onDownload={() => {
          const link = document.createElement("a");
          link.href = convertedFileUrl;
          link.download = "converted_Word_To_PDF.pdf";
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
      multipleFiles={false}
      acceptedFileTypes=".doc,.docx,.docm,.rtf,.odt"
    />
  );
}

export default WordToPdf;
