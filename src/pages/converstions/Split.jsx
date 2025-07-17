import { useState, useEffect } from "react";
import FileGetter from "../../components/FileGetter";
import { useLocation } from "react-router-dom";
import { tools } from "../../utils/cardData";
import { getDocument } from "pdfjs-dist";
import PdfPreviewCanvas from "../../components/PdfPreviewCanvas";
import revealbtnSvg from "../../assets/arrowbtn.svg";

function Split() {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState("split");
  const [pageInput, setPageInput] = useState("");
  const [splitRanges, setSplitRanges] = useState([{ from: "", to: "" }]);
  const [totalPages, setTotalPages] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPages, setSelectedPages] = useState([]);
  const [activeRangeIndex, setActiveRangeIndex] = useState(0);

  const handleFileSelect = (selected) => {
    setFiles(selected);
    setSelectedPages([]);
    setSplitRanges([{ from: "", to: "" }]);
    setActiveRangeIndex(0);
    setPageInput("");
  };

  const handleExtractAll = () => {
    setPageInput("all");
    if (totalPages > 0) {
      setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
    }
  };

  useEffect(() => {
    const loadPages = async () => {
      if (!files[0] || files[0].type !== "application/pdf") return;
      const arrayBuffer = await files[0].arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);
      setSelectedPages([]);
      setSplitRanges([{ from: "", to: "" }]);
      setActiveRangeIndex(0);
      setPageInput("");
    };
    loadPages();
  }, [files]);

  const handlePageClick = (pageNumber) => {
    if (mode === "extract") {
      setSelectedPages(prev => {
        const newSelection = prev.includes(pageNumber)
          ? prev.filter(p => p !== pageNumber)
          : [...prev, pageNumber];
        return newSelection.sort((a, b) => a - b);
      });
      
      setPageInput(prev => {
        const currentPages = prev === "all" ? 
          Array.from({ length: totalPages }, (_, i) => i + 1) :
          prev.split(",").map(p => parseInt(p.trim())).filter(p => !isNaN(p));
        
        const newPages = currentPages.includes(pageNumber)
          ? currentPages.filter(p => p !== pageNumber)
          : [...currentPages, pageNumber];
          
        return newPages.sort((a, b) => a - b).join(",");
      });
    } else if (mode === "split") {
      const currentRange = splitRanges[activeRangeIndex];
      let newFrom = currentRange.from;
      let newTo = currentRange.to;
      
      if (!newFrom || !newTo) {
        newFrom = pageNumber.toString();
        newTo = pageNumber.toString();
      } else {
        const fromNum = parseInt(newFrom);
        const toNum = parseInt(newTo);
        
        if (pageNumber < fromNum) {
          newFrom = pageNumber.toString();
        } else if (pageNumber > toNum) {
          newTo = pageNumber.toString();
        } else {
          const fromDist = Math.abs(pageNumber - fromNum);
          const toDist = Math.abs(pageNumber - toNum);
          
          if (fromDist < toDist) {
            newFrom = pageNumber.toString();
          } else {
            newTo = pageNumber.toString();
          }
        }
      }
      
      const updatedRanges = [...splitRanges];
      updatedRanges[activeRangeIndex] = { from: newFrom, to: newTo };
      setSplitRanges(updatedRanges);
      
      if (newFrom && newTo) {
        const from = parseInt(newFrom);
        const to = parseInt(newTo);
        if (from > 0 && to > 0 && from <= to) {
          const rangePages = [];
          for (let i = from; i <= to; i++) {
            rangePages.push(i);
          }
          
          const allSelected = splitRanges
            .filter((_, idx) => idx !== activeRangeIndex)
            .flatMap(range => {
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
          
          setSelectedPages(Array.from(new Set(allSelected)).sort((a, b) => a - b));
        }
      }
    }
  };

  const handleSplit = () => {
    if (!files[0]) return alert("Please upload a PDF first.");

    if (mode === "extract") {
      if (pageInput === "all") {
        alert(`✅ Simulating extract: All ${totalPages} pages will be extracted.`);
      } else {
        const pages = pageInput
          .split(",")
          .map((p) => parseInt(p.trim()))
          .filter((p) => !isNaN(p) && p > 0 && p <= totalPages);

        if (pages.length === 0) {
          alert("❌ Invalid input. Please enter valid page numbers.");
          return;
        }

        alert(`✅ Simulating extract: Pages [${pages.join(", ")}] will be extracted.`);
      }
    } else if (mode === "split") {
      const validRanges = splitRanges
        .map(({ from, to }) => ({
          from: parseInt(from),
          to: parseInt(to),
        }))
        .filter(
          ({ from, to }) =>
            !isNaN(from) &&
            !isNaN(to) &&
            from > 0 &&
            to <= totalPages &&
            from <= to
        );

      if (validRanges.length === 0) {
        alert("❌ Please enter at least one valid page range.");
        return;
      }

      const rangeList = validRanges.map(({ from, to }) => `${from}-${to}`).join(", ");
      alert(`✅ Simulating split: Ranges [${rangeList}] will be processed.`);
    } else {
      alert("❌ Please select a mode first.");
    }
  };

  const handleRangeChange = (index, key, value) => {
    if (value === "" || /^[0-9\b]+$/.test(value)) {
      const updated = [...splitRanges];
      updated[index][key] = value;
      setSplitRanges(updated);
      setActiveRangeIndex(index);
      
      const allSelected = updated.flatMap(range => {
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
    setSplitRanges([...splitRanges, { from: "", to: "" }]);
    setActiveRangeIndex(splitRanges.length);
  };

  const removeRange = (index) => {
    if (splitRanges.length <= 1) return;
    const updated = splitRanges.filter((_, i) => i !== index);
    setSplitRanges(updated);
    setActiveRangeIndex(Math.min(activeRangeIndex, updated.length - 1));
    
    const allSelected = updated.flatMap(range => {
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

  const handlePageInputChange = (e) => {
    const value = e.target.value;
    
    if (value === "all") {
      setPageInput("all");
      if (totalPages > 0) {
        setSelectedPages(Array.from({ length: totalPages }, (_, i) => i + 1));
      }
      return;
    }
    
    // Clean input - remove any non-digit characters except commas
    const cleanedValue = value.replace(/[^\d,]/g, '');
    
    // Remove duplicate commas and leading/trailing commas
    const normalizedValue = cleanedValue
      .replace(/,+/g, ',')
      .replace(/^,|,$/g, '');
    
    // Split into array of numbers and filter out invalid entries
    const pages = normalizedValue
      .split(',')
      .map(p => parseInt(p.trim()))
      .filter(p => !isNaN(p) && p > 0 && p <= totalPages);
    
    // Update selected pages
    setSelectedPages(pages);
    
    // Update input value (show only valid numbers)
    setPageInput(pages.join(','));
  };

  const location = useLocation();
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

  return (
    <FileGetter onFileSelect={handleFileSelect}>
      {files.length > 0 && (
        <div
          className='relative flex flex-col md:flex-row overflow-y-auto overflow-x-hidden'
          style={{ height: "calc(100vh - 60px)" }}
        >
          {/* Left Section */}
          <div className='relative h-full flex-1 tool px-6 md:px-28 bg-[#f8f8f8] overflow-y-auto text-center'>
            {/* Header */}
            <div
              className='sticky top-0 z-10 w-full md:w-[72%] mx-auto overflow-hidden p-[12px] pb-6 md:pl-8  rounded-[4px] h-[88px] md:h-[105px] mt-[80px] mb-6 text-start'
              style={{ backgroundColor: extractedColor }}
            >
              <h1 className='text-[20px] md:text-[32px] font-bold text-gray-800'>{title}</h1>
              <p className='text-[12px] w-[80%] md:text-[16px] text-gray-500 mt-1'>{subtitle}</p>
              {image && (
                <img
                  src={image}
                  alt={title}
                  className='absolute -bottom-4 -right-2 w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-contain z-0 opacity-50 brightness-[120] contrast-[80] saturate-50'
                />
              )}
            </div>

            {/* Page Previews */}
            <div className='flex justify-around gap-y-10 pt-2 pl-5 gap-12 pr-5 md:pl-8 md:pr-8 flex-wrap'>
              {Array.from({ length: totalPages }).map((_, i) => (
                <div
                  key={i}
                  onClick={() => handlePageClick(i + 1)}
                  className={`m-1 w-[144px] h-[204px] flex flex-col items-center justify-center relative border border-transparent rounded-[2px] shadow-[0_0_8px_0_rgba(0,0,0,0.08)] cursor-pointer ${
                    selectedPages.includes(i + 1) ? 'bg-[#E9F1FE]' : 'bg-[#fdfdfd]'
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

            {/* Bottom button on mobile */}
            <button
              onClick={handleSplit}
              className='sticky block md:hidden mx-auto bottom-2 bg-[#2869DA] text-white py-3 rounded-md w-[188px] hover:bg-blue-700 shadow mt-auto'
            >
              {mode.slice(0, 1).toUpperCase() + mode.slice(1) + " PDF"}
            </button>
          </div>

          {/* Right Sidebar */}
          <div
            className={`fixed top-0 right-0 h-full bg-white z-10 md:static md:translate-x-0 transition-transform duration-300 border-l border-[#E5E8EB] ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ width: "303px" }}
          >
            {/* Reveal Btn */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className='md:hidden absolute -left-6 top-1/2 transform -translate-y-1/2 z-50 flex items-center justify-center'
            >
              <img
                src={revealbtnSvg}
                alt=''
                className={`transition-transform duration-300 ${
                  isSidebarOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <div className='w-full h-full p-6 flex flex-col mt-20 md:mt-0 gap-3'>
              {/* Extract Mode */}
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
                      <p className='font-bold text-[14px] text-gray-800'>Extract pages</p>
                      <p className='text-[12px] text-gray-500'>Separate pages as individual file</p>
                    </div>
                  </label>
                </div>

                {mode === "extract" && (
                  <div className='pl-3 pr-3 pt-2 pb-2 rounded-[4px]'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex justify-between'>
                        <p className='font-semibold text-[14px] text-gray-800'>Pages</p>
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

              {/* Split Mode */}
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
                      <p className='font-bold text-[14px] text-gray-800'>Split by page range</p>
                      <p className='text-[12px] text-gray-500'>Split based on pages you select</p>
                    </div>
                  </label>
                </div>

                {mode === "split" && (
                  <div className='pl-3 pr-3 pt-2 pb-2 rounded-[4px]'>
                    <div className='flex flex-col gap-2'>
                      {splitRanges.map((range, i) => (
                        <div key={i} className={`flex flex-col gap-2 p-2 rounded ${activeRangeIndex === i ? 'bg-blue-50' : ''}`}>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium text-gray-700'>Range {i + 1}</span>
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

              {/* Desktop Split Button */}
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
    </FileGetter>
  );
}

export default Split;