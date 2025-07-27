// 🧰 IMPORTING TOOLS 🧰
import { useRef, useState } from "react"; // React hooks for state and refs
import { useLocation } from "react-router-dom"; // For getting current URL path
import { ReactSortable } from "react-sortablejs"; // For drag-and-drop reordering
import axios from "axios"; // For making HTTP requests

// 🧩 IMPORTING COMPONENTS 🧩
import FileGetter from "../../components/FileGetter"; // File upload component
import PdfPreviewCanvas from "../../components/PdfPreviewCanvas"; // PDF preview component
import Done from "../../components/Done"; // Success screen component

// 📚 IMPORTING ASSETS AND DATA 📚
import { tools } from "../../utils/cardData"; // Tool metadata
import addbtn from "../../assets/addbtn.svg"; // Add button icon
import revealbtnSvg from "../../assets/arrowbtn.svg"; // Sidebar toggle icon
import Error from "../../components/Error";

function Merge() {
  // 🧠 STATE VARIABLES 🧠
  const [files, setFiles] = useState([]); // Stores uploaded PDF files
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls sidebar visibility
  const [mergedFileUrl, setMergedFileUrl] = useState(null); // Stores merged PDF URL
  const [isDone, setIsDone] = useState(false); // Tracks if merge is complete
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState(null); // Tracks if merge succeeded

  // 🔗 REFS AND HOOKS 🔗
  const fileInputRef = useRef(null); // Reference to hidden file input
  const location = useLocation(); // Gets current route location
  const base_URL = import.meta.env.VITE_BASE_URL; // API base URL from env

  // 📁 FILE HANDLING FUNCTIONS 📁
  const handleFileSelect = (selected) => {
    // Add unique IDs to each file for React tracking
    const withIds = selected.map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`, // Unique ID using name + timestamp
      file, // The actual file object
    }));
    setFiles(withIds); // Update files state
  };

  const handleFileInputChange = (e) => {
    // Convert FileList to array and add IDs
    const newFiles = Array.from(e.target.files).map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`,
      file,
    }));
    // Add new files to existing ones
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleAddClick = () => {
    // Trigger hidden file input click
    fileInputRef.current.click();
  };

  // 🧩 MERGE FUNCTION 🧩
  const handleMerge = async () => {
    // Check if we have files to merge
    if (files.length === 0) {
      alert("Please upload at least one PDF.");
      return;
    }

    try {
      setIsDone(true); // Show we're starting the merge

      // Prepare form data with all files
      const formData = new FormData();
      files.forEach((item) => {
        formData.append("files", item.file); // Add each file with key "files"
      });

      // 🚀 SEND TO MERGE API 🚀
      const response = await axios.post(
        `${base_URL}api/pdf/merge`, // Merge endpoint
        formData, // Our files
        {
          responseType: "blob", // Expect PDF binary in response
        }
      );

      // 💾 CREATE DOWNLOADABLE FILE 💾
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob); // Create download link

      // Save results and mark as completed
      setMergedFileUrl(url);
      setIsCompleted(true);
    } catch (error) {
      console.error("Merge failed:", error);
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

  // 🔍 GET TOOL INFO FROM URL 🔍
  const currentPath = location.pathname.replace("/", "");
  const matchedData = tools.find(
    (tool) => tool.link.replace("/", "") === currentPath
  );

  // Set default values if no match found
  const title = matchedData?.title || "Tool";
  const subtitle = matchedData?.description || "Upload and process your files";
  const image = matchedData?.icon || "";
  // Extract color from Tailwind bg-[#color] format
  const extractedColor =
    matchedData?.color?.startsWith("bg-[") && matchedData.color.includes("#")
      ? matchedData.color.slice(4, -1)
      : "#DBEAFE"; // Default color

  // 🎉 DONE SCREEN 🎉 And Error Screen
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
        action='Merge' // Action name for Done screen
        downloadUrl={mergedFileUrl} // PDF download URL
        onDownload={() => {
          // Create and trigger download
          const link = document.createElement("a");
          link.href = mergedFileUrl;
          link.download = "merged.pdf"; // Default filename
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        isCompleted={isCompleted} // Pass success status
      />
    );
  }

  // 🖥️ MAIN UI 🖥️
  return (
    <FileGetter onFileSelect={handleFileSelect}>
      <section
        className='overflow-y-hidden'
        style={{ height: "calc(100vh - 60px)" }}
      >
        {/* Only show preview area if files exist */}
        {files.length > 0 && (
          <div
            className='relative flex flex-col md:flex-row overflow-y-auto overflow-x-hidden'
            style={{ height: "calc(100vh - 60px)" }}
          >
            {/* LEFT SECTION - File Previews */}
            <div className='relative h-full flex-1 tool px-6 md:px-28 bg-[#f8f8f8] overflow-y-auto text-center'>
              {/* Tool Header */}
              <div
                className='sticky top-0 z-10 w-full md:w-[72%] mx-auto overflow-hidden p-[12px] pb-6 md:pl-8 rounded-[4px] h-[88px] md:h-[105px] mt-[80px] mb-6 text-start'
                style={{ backgroundColor: extractedColor }}
              >
                <h1 className='text-[20px] md:text-[32px] font-bold text-gray-800'>
                  {title}
                </h1>
                <p className='text-[12px] w-[80%] md:text-[16px] text-gray-500 mt-1'>
                  {subtitle}
                </p>
                {/* Tool icon in corner */}
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className='absolute -bottom-3 -right-4 w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-contain z-0 opacity-50 brightness-[120] contrast-[80] saturate-50'
                  />
                )}
              </div>

              {/* PDF Preview Area */}
              <div className='flex justify-around gap-y-2 pt-2 pl-5 pr-5 md:pl-0 md:pr-0 flex-wrap'>
                <div className='relative w-auto bg-[#f4f4f4] rounded-lg py-10 px-6 flex justify-center gap-6 flex-wrap min-h-[260px]'>
                  {/* Drag-and-drop sortable list */}
                  <ReactSortable
                    list={files}
                    setList={setFiles} // Update order when dragged
                    className='flex flex-wrap justify-center gap-6'
                    animation={200} // Smooth 200ms animation
                  >
                    {/* Render each PDF preview */}
                    {files.map((item) => (
                      <div
                        key={item.id}
                        className='flex flex-col items-center transition-all duration-200'
                      >
                        {/* PDF Preview Box */}
                        <div className='relative w-[150px] h-[182px] flex justify-center items-center bg-white hover:shadow-md overflow-hidden'>
                          <div className='absolute top-0 left-0 bg-black text-white text-[10px] px-1 py-[2px] rounded-br z-1'>
                            PDF
                          </div>
                          {/* Show first page of PDF */}
                          <PdfPreviewCanvas file={item.file} pageNumber={1} />
                        </div>
                        {/* Filename */}
                        <p className='mt-2 text-xs text-gray-700 max-w-[110px] text-center truncate'>
                          {item.file.name}
                        </p>
                      </div>
                    ))}
                  </ReactSortable>

                  {/* Desktop Add Button */}
                  <button
                    onClick={handleAddClick}
                    className='absolute hidden md:block md:right-[-20px] -right-12 top-4 md:top-1/2 transform -translate-y-1/2 z-10'
                  >
                    <img src={addbtn} alt='Add PDF' className='w-10 h-10' />
                  </button>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='application/pdf' // Only accept PDFs
                    multiple // Allow multiple selection
                    onChange={handleFileInputChange}
                    className='hidden' // Hide the ugly default input
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR - Controls */}
            <div
              className={`fixed top-0 right-0 h-full bg-white z-10 md:static md:translate-x-0 transition-transform duration-300
                border-l border-[#E5E8EB]
                ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
              `}
              style={{ width: "303px" }}
            >
              {/* Mobile Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className='w-[20px] h-14 bg-[#2869DA] rounded-[4px] md:hidden absolute -left-5 top-1/2 transform -translate-y-1/2 z-50 flex items-center justify-center'
              >
                <img
                  src={revealbtnSvg}
                  alt='Toggle Sidebar'
                  className={`transition-transform duration-300 ${
                    isSidebarOpen ? "rotate-180" : "rotate-0"
                  } w-4`}
                />
              </button>

              {/* Sidebar Content */}
              <div className='w-full h-full flex flex-col justify-center p-6'>
                <div className='w-full max-w-[260px] flex flex-col gap-4 md:mt-auto'>
                  {/* Instructions Box */}
                  <div className='w-full bg-white border border-[#6B7582] pt-2 pb-2 px-3 rounded-[2px]'>
                    <p className='text-center text-[#6B7582]'>
                      Reorder your pdf by drag and drop the files as you like
                    </p>
                  </div>
                </div>

                {/* Desktop Merge Button */}
                <button
                  onClick={handleMerge}
                  className='w-full mt-auto hidden md:block bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 shadow'
                >
                  Merge PDF
                </button>
              </div>
            </div>

            {/* Mobile Add Button */}
            <button
              onClick={handleAddClick}
              className='absolute right-3 top-2/6 md:hidden transform -translate-y-1/2 '
            >
              <img src={addbtn} alt='Add PDF' className='w-10 h-10' />
            </button>
          </div>
        )}

        {/* Mobile Merge Button */}
        <button
          onClick={handleMerge}
          className='sticky block md:hidden mx-auto bottom-2 bg-[#2869DA] text-white py-3 z-1 rounded-md w-[188px] hover:bg-blue-700 shadow mt-auto'
        >
          Merge PDF
        </button>
      </section>
    </FileGetter>
  );
}

export default Merge;
