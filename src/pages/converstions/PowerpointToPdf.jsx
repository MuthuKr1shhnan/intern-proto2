import { useState } from "react";
import axios from "axios";

import FileGetter from "../../components/FileGetter";
import Done from "../../components/Done";

function PowerpointToPdf() {
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const base_URL = import.meta.env.VITE_BASE_URL;

  const handleFileSelect = async (selected) => {
    if (!selected || selected.length === 0) return;

    const file = selected[0]; // Only one PowerPoint file is expected

    try {
      setIsDone(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${base_URL}api/ppt/convert`,
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
      console.error("PowerPoint to PDF conversion failed:", error);
      alert("Conversion failed. Please try again.");
    }
  };

  if (isDone) {
    return (
      <Done
        action='PowerPoint to PDF'
        downloadUrl={convertedFileUrl}
        onDownload={() => {
          const link = document.createElement("a");
          link.href = convertedFileUrl;
          link.download = "converted_PPT_TO_PDF.pdf";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        isCompleted={isCompleted}
      />
    );
  }

  return <FileGetter onFileSelect={handleFileSelect} acceptedFileTypes=".ppt,.pptx" multipleFiles={false} />;
}

export default PowerpointToPdf;
