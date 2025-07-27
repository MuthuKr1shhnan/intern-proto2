import { useState } from "react";
import axios from "axios";

import FileGetter from "../../components/FileGetter";
import Done from "../../components/Done";
import Error from "../../components/Error";
function PowerpointToPdf() {
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const base_URL = import.meta.env.VITE_BASE_URL;
  const [error, setError] = useState(null);

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
      let errorMessage = "Failed to compress PDF. Please try again.";
      let errorCode = 500; // Default error code

      if (error.response) {
        // The request was made and the server responded with a status code
        errorCode = error.response.status;

        switch (errorCode) {
          case 400:
            errorMessage =
              "Invalid request. Please check your file and try again.";
            break;
          case 401:
            errorMessage =
              "Authentication required. Please login and try again.";
            break;
          case 403:
            errorMessage = "You don't have permission to perform this action.";
            break;
          case 404:
            errorMessage = "The compression service is currently unavailable.";
            break;
          case 413:
            errorMessage = "File too large. Please choose a smaller file.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          case 503:
            errorMessage =
              "Service temporarily unavailable. Please try again later.";
            break;
          default:
            errorMessage = `Error ${errorCode}: Failed to compress PDF.`;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "Network error. Please check your connection.";
        errorCode = 0; // No response code
      }

      setError({
        message: errorMessage,
        code: errorCode,
      });
    }
  };
  if (error) {
    return (
      <Error
        message={error.message}
        code={error.code}
        onClose={() => setError(null)}
      />
    );
  } else if (isDone) {
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

  return (
    <FileGetter
      onFileSelect={handleFileSelect}
      acceptedFileTypes='.ppt,.pptx'
      multipleFiles={false}
    />
  );
}

export default PowerpointToPdf;
