import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import FileGetter from "../../components/FileGetter";
import PdfPreviewCanvas from "../../components/PdfPreviewCanvas";
import Done from "../../components/Done";
import { tools } from "../../utils/cardData";
import Error from "../../components/Error";
function PdfToExcel() {
  const [files, setFiles] = useState([]);
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const base_URL = import.meta.env.VITE_BASE_URL;

  const handleFileSelect = (selected) => {
    const withIds = selected.map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`,
      file,
    }));
    setFiles(withIds);
  };

  const handlePdfToExcel = async () => {
    if (files.length === 0) {
      alert("Please upload a PDF file.");
      return;
    }

    try {
      setIsDone(true);
      const formData = new FormData();
      formData.append("file", files[0].file); // assuming only one file for this tool

      const response = await axios.post(
        `${base_URL}api/pdf/pdf-to-excel/?mode=single`,
        formData,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      setConvertedFileUrl(url);
      setIsCompleted(true);
    } catch (error) {
      console.error("PDF to Excel failed:", error);
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

  const currentPath = location.pathname.replace("/", "");
  const matchedData = tools.find(
    (tool) => tool.link.replace("/", "") === currentPath
  );

  const title = matchedData?.title || "Tool";
  const subtitle = matchedData?.description || "Upload and process your files";
  const image = matchedData?.icon || "";
  const extractedColor =
    matchedData?.color?.startsWith("bg-[") && matchedData.color.includes("#")
      ? matchedData.color.slice(4, -1)
      : "#DBEAFE";

  //Error and Done Screen
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
        action='PDF to Excel'
        downloadUrl={convertedFileUrl}
        onDownload={() => {
          const link = document.createElement("a");
          link.href = convertedFileUrl;
          link.download = "converted.xlsx";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        isCompleted={isCompleted}
      />
    );
  }

  return (
    <FileGetter onFileSelect={handleFileSelect} multipleFiles={false}>
      {files.length > 0 && (
        <div
          className='relative flex flex-col overflow-y-auto overflow-x-hidden'
          style={{ height: "calc(100vh - 60px)" }}
        >
          <div className='relative flex flex-col items-center h-full tool px-6 md:px-28 bg-[#f8f8f8] overflow-y-auto text-center'>
            {/* Header */}
            <div
              className='sticky top-0 z-10 w-full md:w-[50%] mx-auto overflow-hidden p-[12px] pb-6 md:pl-8 rounded-[4px] h-[88px] md:h-[105px] mt-[80px] mb-6 text-start'
              style={{ backgroundColor: extractedColor }}
            >
              <h1 className='text-[20px] md:text-[32px] font-bold text-gray-800'>
                {title}
              </h1>
              <p className='text-[12px] w-[80%] md:text-[16px] text-gray-500 mt-1'>
                {subtitle}
              </p>
              {image && (
                <img
                  src={image}
                  alt={title}
                  className='absolute -bottom-3 -right-4 w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-contain z-0 opacity-50 brightness-[120] contrast-[80] saturate-50'
                />
              )}
            </div>

            {/* Page Preview */}
            <div className='flex justify-around gap-y-2 pt-2 pl-5 pr-5 md:pl-0 md:pr-0 flex-wrap'>
              <div className='relative w-auto bg-[#f4f4f4] rounded-lg py-10 px-6 flex justify-center gap-6 flex-wrap min-h-[260px]'>
                {files.map((item) => (
                  <div
                    key={item.id}
                    className='flex flex-col items-center transition-all duration-200'
                  >
                    <div className='relative w-[150px] h-[182px] flex justify-center items-center bg-white hover:shadow-md overflow-hidden'>
                      <div className='absolute top-0 left-0 bg-black text-white text-[10px] px-1 py-[2px] rounded-br z-10'>
                        PDF
                      </div>
                      <PdfPreviewCanvas file={item.file} pageNumber={1} />
                    </div>
                    <p className='mt-2 text-xs text-gray-700 max-w-[110px] text-center truncate'>
                      {item.file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handlePdfToExcel}
              className='sticky block  mt-auto bottom-20 bg-[#2869DA] text-white py-3 rounded-md w-[254px] hover:bg-blue-700 shadow'
            >
              PDF to Excel
            </button>
          </div>
        </div>
      )}
    </FileGetter>
  );
}

export default PdfToExcel;
