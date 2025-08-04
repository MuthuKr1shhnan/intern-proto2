// 📦 IMPORTING REQUIRED TOOLS 📦
import { useState, useEffect } from "react"; // React hooks for state and side effects
import FileGetter from "../../components/FileGetter"; // File upload component
import { useLocation } from "react-router-dom"; // For getting current URL path
import { tools } from "../../utils/cardData"; // Tool metadata
import { getDocument } from "pdfjs-dist"; // PDF.js library for PDF processing
import PdfPreviewCanvas from "../../components/PdfPreviewCanvas"; // PDF preview component
import revealbtnSvg from "../../assets/arrowbtn.svg"; // Sidebar toggle icon
import axios from "axios"; // For making HTTP requests
import Done from "../../components/Done"; // Success screen component
import Error from "../../components/Error"; // Error display component

function Split() {
  // 🧠 STATE VARIABLES 🧠
  const [files, setFiles] = useState([]); // Stores uploaded PDF files
  const [mode, setMode] = useState("split"); // Current mode: "split" or "extract"
  const [pageInput, setPageInput] = useState(""); // User input for pages to extract
  const [splitRanges, setSplitRanges] = useState([{ from: "", to: "" }]); // Page ranges for splitting
  const [totalPages, setTotalPages] = useState(0); // Total pages in the PDF
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controls sidebar visibility
  const [selectedPages, setSelectedPages] = useState([]); // Currently selected pages
  const [activeRangeIndex, setActiveRangeIndex] = useState(0); // Active range being edited
  const [isDone, setIsDone] = useState(false); // Tracks if operation is complete
  const [isCompleted, setIsCompleted] = useState(false); // Tracks if operation succeeded
  const [downloadUrl, setDownloadUrl] = useState(null); // Download URL for result
  const [error, setError] = useState(null); // Stores error information
  const base_URL = import.meta.env.VITE_BASE_URL; // API base URL from env

  // 📁 FILE HANDLING FUNCTIONS 📁
  const handleFileSelect = (selected) => {
    // Reset all state when new file is selected
    setFiles(selected);
    setSelectedPages([]);
    setSplitRanges([{ from: "", to: "" }]);
    setActiveRangeIndex(0);
    setPageInput("");
  };

  const handleExtractAll = () => {
    // Select all pages for extraction
    setPageInput("all");
    if (totalPages > 0) {
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  };

  // 🔄 EFFECT TO LOAD PDF PAGES WHEN FILE CHANGES 🔄
  useEffect(() => {
    const loadPages = async () => {
      if (!files[0] || files[0].type !== "application/pdf") return;
      
      try {
        // Convert file to ArrayBuffer
        const arrayBuffer = await files[0].arrayBuffer();
        // Load PDF document
        const pdf = await getDocument({ data: arrayBuffer }).promise;
        // Update total pages and reset selections
        setTotalPages(pdf.numPages);
        setSelectedPages([]);
        setSplitRanges([{ from: "", to: "" }]);
        setActiveRangeIndex(0);
        setPageInput("");
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError({ message: "Failed to load PDF", code: 400 });
      }
    };
    loadPages();
  }, [files]);

  // 🖱️ HANDLE PAGE CLICK (FOR SELECTION) 🖱️
  const handlePageClick = (pageNumber) => {
    if (mode === "extract") {
      // Toggle page selection for extract mode
      setSelectedPages((prev) => {
        const newSelection = prev.includes(pageNumber)
          ? prev.filter((p) => p !== pageNumber) // Remove if already selected
          : [...prev, pageNumber]; // Add if not selected
        return newSelection.sort((a, b) => a - b); // Keep sorted
      });

      // Update page input text
      setPageInput((prev) => {
        const currentPages =
          prev === "all"
            ? Array.from({ length: totalPages }, (_, i) => i + 1)
            : prev
                .split(",")
                .map((p) => parseInt(p.trim()))
                .filter((p) => !isNaN(p));

        const newPages = currentPages.includes(pageNumber)
          ? currentPages.filter((p) => p !== pageNumber)
          : [...currentPages, pageNumber];

        return newPages.sort((a, b) => a - b).join(",");
      });
    } else if (mode === "split") {
      // Handle range selection for split mode
      const currentRange = splitRanges[activeRangeIndex];
      let newFrom = currentRange.from;
      let newTo = currentRange.to;

      if (!newFrom || !newTo) {
        // If range is empty, set both to clicked page
        newFrom = pageNumber.toString();
        newTo = pageNumber.toString();
      } else {
        // Adjust range based on clicked page
        const fromNum = parseInt(newFrom);
        const toNum = parseInt(newTo);

        if (pageNumber < fromNum) {
          newFrom = pageNumber.toString();
        } else if (pageNumber > toNum) {
          newTo = pageNumber.toString();
        } else {
          // Clicked inside range - adjust nearest boundary
          const fromDist = Math.abs(pageNumber - fromNum);
          const toDist = Math.abs(pageNumber - toNum);

          if (fromDist < toDist) {
            newFrom = pageNumber.toString();
          } else {
            newTo = pageNumber.toString();
          }
        }
      }

      // Update the range
      const updatedRanges = [...splitRanges];
      updatedRanges[activeRangeIndex] = { from: newFrom, to: newTo };
      setSplitRanges(updatedRanges);

      // Update selected pages visualization
      if (newFrom && newTo) {
        const from = parseInt(newFrom);
        const to = parseInt(newTo);
        if (from > 0 && to > 0 && from <= to) {
          const rangePages = [];
          for (let i = from; i <= to; i++) {
            rangePages.push(i);
          }

          // Combine all ranges into selected pages
          const allSelected = splitRanges
            .filter((_, idx) => idx !== activeRangeIndex)
            .flatMap((range) => {
              if (range.from && range.to) {
                const f = parseInt(range.from);
                const t = parseInt(range.to);
                if (f > 0 && t > 0 && f <= t) {
                  return Array.from({ length: t - f + 1 }, (_, i) => f + i);
                }
              }
              return [];
            })
            .concat(rangePages);

          setSelectedPages(
            Array.from(new Set(allSelected)).sort((a, b) => a - b)
          );
        }
      }
    }
  };

  // ✂️ HANDLE SPLIT/EXTRACT OPERATION ✂️
  const handleSplit = async () => {
    if (!files[0]) {
      setError("Please upload a PDF first.");
      return;
    }

    setIsDone(true);
    setIsCompleted(false);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);

      let pagesParam = "";
      if (mode === "extract") {
        if (pageInput === "all") {
          // Select all pages
          pagesParam = Array.from({ length: totalPages }, (_, i) => i + 1).join(
            ","
          );
        } else {
          // Use user-provided pages
          pagesParam = pageInput
            .split(",")
            .map((p) => parseInt(p.trim()))
            .filter((p) => !isNaN(p) && p > 0 && p <= totalPages)
            .join(",");
        }
        formData.append("range", pagesParam);
      } else if (mode === "split") {
        // Convert ranges to server format (e.g., "1-3,5-7")
        pagesParam = splitRanges
          .filter(({ from, to }) => from && to)
          .map(({ from, to }) => `${from}-${to}`)
          .join(",");
        formData.append("range", pagesParam);
      }

      if (!pagesParam) {
        throw new Error("Invalid page selection");
      }

      // 🚀 SEND TO SERVER 🚀
      const response = await axios.post(
        `${base_URL}pdf/extract-and-zip`,
        formData,
        {
          responseType: "blob", // Expect ZIP file in response
        }
      );

      // 💾 CREATE DOWNLOADABLE FILE 💾
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsCompleted(true);
    } catch (err) {
      console.error("Error processing PDF:", err);
      let errorMessage = "Failed to process PDF. Please try again.";
      let errorCode = 500; // Default error code

      // Handle different error scenarios
      if (err.response) {
        errorCode = err.response.status;
        switch (errorCode) {
          case 400:
            errorMessage = "Invalid request. Please check your file and try again.";
            break;
          case 401:
            errorMessage = "Authentication required. Please login and try again.";
            break;
          case 403:
            errorMessage = "You don't have permission to perform this action.";
            break;
          case 404:
            errorMessage = "The service is currently unavailable.";
            break;
          case 413:
            errorMessage = "File too large. Please choose a smaller file.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          case 503:
            errorMessage = "Service temporarily unavailable. Please try again later.";
            break;
          default:
            errorMessage = `Error ${errorCode}: Failed to process PDF.`;
        }
      } else if (err.request) {
        errorMessage = "Network error. Please check your connection.";
        errorCode = 0;
      }

      setError({
        message: errorMessage,
        code: errorCode,
      });
      setIsCompleted(false);
    }
  };

  // 🔢 RANGE INPUT HANDLERS 🔢
  const handleRangeChange = (index, key, value) => {
    // Only allow numbers or empty string
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      const updated = [...splitRanges];
      updated[index][key] = value;
      setSplitRanges(updated);
      setActiveRangeIndex(index);

      // Update selected pages visualization
      const allSelected = updated.flatMap((range) => {
        if (range.from && range.to) {
          const from = parseInt(range.from);
          const to = parseInt(range.to);
          if (from > 0 && to > 0 && from <= to) {
            return Array.from({ length: to - from + 1 }, (_, i) => from + i);
          }
        }
        return [];
      });

      setSelectedPages(Array.from(new Set(allSelected)).sort((a, b) => a - b));
    }
  };

  const addNewRange = () => {
    // Add a new empty range
    setSplitRanges([...splitRanges, { from: "", to: "" }]);
    setActiveRangeIndex(splitRanges.length);
  };

  const removeRange = (index) => {
    if (splitRanges.length <= 1) return; // Keep at least one range
    
    // Remove the specified range
    const updated = splitRanges.filter((_, i) => i !== index);
    setSplitRanges(updated);
    setActiveRangeIndex(Math.min(activeRangeIndex, updated.length - 1));

    // Update selected pages visualization
    const allSelected = updated.flatMap((range) => {
      if (range.from && range.to) {
        const from = parseInt(range.from);
        const to = parseInt(range.to);
        if (from > 0 && to > 0 && from <= to) {
          return Array.from({ length: to - from + 1 }, (_, i) => from + i);
        }
      }
      return [];
    });

    setSelectedPages(Array.from(new Set(allSelected)).sort((a, b) => a - b));
  };

  // 📝 PAGE INPUT HANDLER (FOR EXTRACT MODE) 📝
  const handlePageInputChange = (e) => {
    const value = e.target.value;

    if (value === "all") {
      setPageInput("all");
      if (totalPages > 0) {
        setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
      }
      return;
    }

    // Clean the input: only numbers and commas
    const cleanedValue = value.replace(/[^0-9,]/g, "");
    const normalizedValue = cleanedValue.replace(/,+/g, ","); // Remove duplicate commas
    const finalValue = normalizedValue.replace(/^,|,$/g, ""); // Remove leading/trailing commas

    setPageInput(finalValue);

    // Update selected pages
    const pages = finalValue
      .split(",")
      .map((p) => parseInt(p.trim()))
      .filter((p) => !isNaN(p) && p > 0 && p <= totalPages);

    setSelectedPages(pages);
  };

  // 🔍 GET TOOL INFO FROM URL 🔍
  const location = useLocation();
  const currentPath = location.pathname.replace("/", "");
  const matchedData = tools.find(
    (tool) => tool.link.replace("/", "") === currentPath
  );

  // Set default values if no match found
  const title = matchedData?.title || "Tool";
  const subtitle = matchedData?.description || "Upload and process your files";
  const image = matchedData?.icon || "";
  const extractedColor =
    matchedData?.color?.startsWith("bg-[") && matchedData.color.includes("#")
      ? matchedData.color.slice(4, -1)
      : "#DBEAFE";

  // 🚨 ERROR SCREEN 🚨
  if (error) {
    return (
      <Error
        message={error.message}
        code={error.code}
        onClose={() => setError(null)}
      />
    );
  } 
  // 🎉 DONE SCREEN 🎉
  else if (isDone) {
    return (
      <Done
        action={mode === "extract" ? "Extract" : "Split"}
        downloadUrl={downloadUrl}
        onDownload={() => {
          // Create and trigger download
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.download = `${
            mode === "extract" ? "extracted-pages" : "split-pages"
          }.zip`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        isCompleted={isCompleted}
        error={error}
        onRetry={() => setIsDone(false)}
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
            {/* LEFT SECTION - PDF Preview */}
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
                    className='absolute -bottom-4 -right-2 w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-contain z-0 opacity-50 brightness-[120] contrast-[80] saturate-50'
                  />
                )}
              </div>

              {/* PDF Page Thumbnails */}
              <div className='flex justify-around gap-y-10 pt-2 pl-5 gap-12 pr-5 md:pl-8 md:pr-8 flex-wrap'>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <div
                    key={i}
                    onClick={() => handlePageClick(i + 1)}
                    className={`m-1 w-[144px] h-[204px] flex flex-col items-center justify-center relative border border-transparent rounded-[2px] shadow-[0_0_8px_0_rgba(0,0,0,0.08)] cursor-pointer ${
                      selectedPages.includes(i + 1)
                        ? "bg-[#E9F1FE]" // Highlight selected pages
                        : "bg-[#fdfdfd]"
                    }`}
                  >
                    <div className='range__canvas'>
                      <PdfPreviewCanvas file={files[0]} pageNumber={i + 1} />
                    </div>
                    <div className='file__info mt-2'>
                      <span className='file__info__name'>{i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR - Controls */}
            <div
              className={`fixed top-0 right-0 h-full bg-white z-10 md:static md:translate-x-0 transition-transform duration-300 border-l border-[#E5E8EB] ${
                isSidebarOpen ? "translate-x-0" : "translate-x-full"
              }`}
              style={{ width: "303px" }}
            >
              {/* Mobile Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className='w-[20px] h-14 bg-[#2869DA] rounded-[4px] md:hidden absolute -left-5 top-1/2 transform -translate-y-1/2 z-50 flex items-center justify-center'
              >
                <img
                  src={revealbtnSvg}
                  alt=''
                  className={`transition-transform duration-300 ${
                    isSidebarOpen ? "rotate-180" : "rotate-0"
                  } w-4`}
                />
              </button>

              <div className='w-full h-full p-6 flex flex-col mt-20 md:mt-0 gap-3'>
                {/* EXTRACT MODE SECTION */}
                <div className='flex flex-col gap-3'>
                  <div
                    className={`pl-3 pr-3 pt-2 pb-2 ${
                      mode == "extract" ? "bg-[#E9F1FE]" : "bg-none"
                    } border border-[#E9F1FE] rounded-[4px]`}
                  >
                    <label className='flex items-start gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='splitOption'
                        value='extract'
                        checked={mode === "extract"}
                        onChange={() => {
                          setMode("extract");
                          setSelectedPages([]);
                          setPageInput("");
                        }}
                        className='peer hidden'
                      />
                      <div className='mt-[6px] w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center peer-checked:border-[#2869DA]'>
                        <div
                          className={`w-2.5 h-2.5 rounded-full block bg-[#2869DA] ${
                            mode === "extract" ? "scale-100" : "scale-0"
                          }`}
                        />
                      </div>
                      <div>
                        <p className='font-bold text-[14px] text-gray-800'>
                          Extract pages
                        </p>
                        <p className='text-[12px] text-gray-500'>
                          Separate pages as individual file
                        </p>
                      </div>
                    </label>
                  </div>
                  {mode === "extract" && (
                    <div className='pl-3 pr-3 pt-2 pb-2 rounded-[4px]'>
                      <div className='flex flex-col gap-2'>
                        <div className='flex justify-between'>
                          <p className='font-semibold text-[14px] text-gray-800'>
                            Pages
                          </p>
                          <button
                            onClick={handleExtractAll}
                            className='text-sm text-blue-600 underline'
                          >
                            Extract all
                          </button>
                        </div>
                        <input
                          type='text'
                          value={pageInput}
                          onChange={handlePageInputChange}
                          placeholder='1,2,3 or "all"'
                          className='flex-1 px-3 py-2 text-sm border rounded border-gray-300'
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* SPLIT MODE SECTION */}
                <div className='flex flex-col gap-3'>
                  <div
                    className={`pl-3 pr-3 pt-2 pb-2 ${
                      mode == "split" ? "bg-[#E9F1FE]" : "bg-none"
                    } border border-[#E9F1FE] rounded-[4px]`}
                  >
                    <label className='flex items-start gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='splitOption'
                        value='split'
                        checked={mode === "split"}
                        onChange={() => {
                          setMode("split");
                          setSelectedPages([]);
                          setSplitRanges([{ from: "", to: "" }]);
                          setActiveRangeIndex(0);
                        }}
                        className='peer hidden'
                      />
                      <div className='mt-[6px] w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center peer-checked:border-[#2869DA]'>
                        <div
                          className={`w-2.5 h-2.5 rounded-full block bg-[#2869DA] ${
                            mode === "split" ? "scale-100" : "scale-0"
                          }`}
                        />
                      </div>
                      <div>
                        <p className='font-bold text-[14px] text-gray-800'>
                          Split by page range
                        </p>
                        <p className='text-[12px] text-gray-500'>
                          Split based on pages you select
                        </p>
                      </div>
                    </label>
                  </div>
                  {mode === "split" && (
                    <div className='pl-3 pr-3 pt-2 pb-2 rounded-[4px]'>
                      <div className='flex flex-col gap-2'>
                        {/* Render each range input */}
                        {splitRanges.map((range, i) => (
                          <div
                            key={i}
                            className={`flex flex-col gap-2 p-2 rounded ${
                              activeRangeIndex === i ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className='flex items-center justify-between'>
                              <span className='text-sm font-medium text-gray-700'>
                                Range {i + 1}
                              </span>
                              {splitRanges.length > 1 && (
                                <button
                                  onClick={() => removeRange(i)}
                                  className='text-red-400 text-xs font-bold hover:underline'
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <div className='flex items-center gap-2'>
                              <p className='text-sm text-gray-800'>Page from</p>
                              <input
                                type='text'
                                placeholder='1'
                                value={range.from}
                                onChange={(e) =>
                                  handleRangeChange(i, "from", e.target.value)
                                }
                                onClick={() => setActiveRangeIndex(i)}
                                className='px-3 py-2 text-sm border rounded text-center border-gray-300 w-[48px]'
                              />
                              <p className='text-sm text-gray-800'>to</p>
                              <input
                                type='text'
                                placeholder='3'
                                value={range.to}
                                onChange={(e) =>
                                  handleRangeChange(i, "to", e.target.value)
                                }
                                onClick={() => setActiveRangeIndex(i)}
                                className='px-3 py-2 text-sm border rounded text-center border-gray-300 w-[48px]'
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={addNewRange}
                          className='text-blue-600 w-full justify-end flex text-sm font-medium hover:underline'
                        >
                          + Add another range
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Action Button */}
                <button
                  onClick={handleSplit}
                  className='mt-auto w-full hidden md:block bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 shadow'
                >
                  {mode.slice(0, 1).toUpperCase() + mode.slice(1) + " PDF"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Action Button */}
        <button
          onClick={handleSplit}
          className='sticky block md:hidden mx-auto bottom-2 bg-[#2869DA] text-white py-3 z-1 rounded-md w-[188px] hover:bg-blue-700 shadow mt-auto'
        >
          {mode.slice(0, 1).toUpperCase() + mode.slice(1) + " PDF"}
        </button>
      </section>
    </FileGetter>
  );
}

export default Split;