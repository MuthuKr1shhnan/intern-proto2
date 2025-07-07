import { useState, useEffect } from "react";
import FileGetter from "../../components/FileGetter";
import { useLocation } from "react-router-dom";
import { data } from "../../utils/Data";
import { getDocument } from "pdfjs-dist";
import PdfPreviewCanvas from "../../components/PdfPreviewCanvas";

function Split() {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState("");
  const [pageInput, setPageInput] = useState("");
  const [splitRanges, setSplitRanges] = useState([{ from: "", to: "" }]);

  const handleFileSelect = (selected) => setFiles(selected);

  const handleExtractAll = () => setPageInput("all");
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadPages = async () => {
      if (!files[0]) return;
      if (files[0].type !== "application/pdf") return;

      const arrayBuffer = await files[0].arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);
    };

    loadPages();
  }, [files]);

  const handleSplit = () => {
    if (mode === "extract") {
      const pages =
        pageInput === "all"
          ? "All pages"
          : pageInput
              .split(",")
              .map((p) => parseInt(p.trim()))
              .filter((p) => !isNaN(p));

      alert(
        `Extracting Pages: ${Array.isArray(pages) ? pages.join(", ") : pages}`
      );
    } else if (mode === "split") {
      const ranges = splitRanges.filter((r) => r.from && r.to);
      const parsed = ranges
        .map(({ from, to }) => ({
          from: parseInt(from),
          to: parseInt(to),
        }))
        .filter((r) => !isNaN(r.from) && !isNaN(r.to) && r.from <= r.to);

      if (parsed.length === 0) {
        alert("Please enter at least one valid range.");
        return;
      }

      alert("Splitting with ranges: " + JSON.stringify(parsed));
    } else {
      alert("Please select a mode first.");
    }
  };

  const handleRangeChange = (index, key, value) => {
    const updated = [...splitRanges];
    updated[index][key] = value;
    setSplitRanges(updated);
  };

  const addNewRange = () => {
    setSplitRanges([...splitRanges, { from: "", to: "" }]);
  };

  const location = useLocation();
  const currentPath = location.pathname.replace("/", "");

  const matchedData = data.find((tool) => tool.path === currentPath);
  const title = matchedData?.title || "Tool";
  const subtitle = matchedData?.description || "Upload and process your files";
  const image = matchedData?.icon || "";

  return (
    <FileGetter onFileSelect={handleFileSelect}>
      {files.length > 0 && (
        <div
          className='relative flex overflow-y-auto mt-15 overflow-x-hidden box-border'
          style={{ height: "calc(100vh - 60px)" }}
        >
          {/* Left Section */}
          <div
            className='relative h-full tool pl-28 pr-28 bg-[#f5f5fa] overflow-y-auto overflow-x-hidden text-center box-border'
            style={{ flex: 1 }}
          >
            <div className='bg-blue-100 sticky top-0 z-1 relative w-full overflow-hidden pt-6 pb-6 pl-8 pr-8 rounded-[8px] mt-[80px] mb-6 text-start'>
              <h1 className='text-2xl font-bold text-gray-800'>{title}</h1>
              <p className='text-sm text-gray-500 mt-1'>{subtitle}</p>
              {image && (
                <img
                  src={image}
                  alt={title}
                  className='absolute right-0 top-8 fill-white w-[84px] header h-[84px]'
                />
              )}
            </div>

            {/* Static preview for now */}
            <div className='flex justify-around gap-y-2 pt-2 flex-wrap'>
              {Array.from({ length: totalPages }).map((_, i) => (
                <div
                  key={i}
                  className='m-1 w-[198px] h-[244px] flex flex-col items-center justify-center relative border border-transparent bg-[#fdfdfd] rounded-lg shadow-[0_0_8px_0_rgba(0,0,0,0.08)]'
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

          {/* Right Sidebar */}
          <div
            className='relative flex p-8 flex-col overflow-y-auto h-full border-l-[1px] border-[#E5E8EB]'
            style={{ flexBasis: "440px" }}
          >
            <div className='w-full flex flex-col gap-3 h-full'>
              {/* Extract Mode */}
              <div className='flex flex-col gap-3'>
                <div
                  className={`pl-3 pr-3 pt-2 pb-2 ${
                    mode == "extract" ? " bg-[#E9F1FE]" : "bg-none"
                  } border-[1px] border-[#E9F1FE] rounded-[4px]`}
                >
                  <label className='flex items-start gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='splitOption'
                      value='extract'
                      checked={mode === "extract"}
                      onChange={() => setMode("extract")}
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
                      <p className='font-bold text-4 text-gray-800'>
                        Extract pages
                      </p>
                      <p className='text-3 text-gray-500'>
                        Separate pages as individual file
                      </p>
                    </div>
                  </label>
                </div>

                {/* Extract input */}
                <div
                  className={`pl-3 pr-3 pt-2 pb-2 rounded-[4px] ${
                    mode === "extract" ? "block" : "hidden"
                  }`}
                >
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
                      onChange={(e) => setPageInput(e.target.value)}
                      placeholder='1,2,3'
                      disabled={pageInput === "all"}
                      className='flex-1 px-3 py-2 text-sm border rounded border-gray-300'
                    />
                  </div>
                </div>
              </div>

              {/* Split Mode */}
              <div className='flex flex-col gap-3'>
                <div
                  className={`pl-3 pr-3 pt-2 pb-2 ${
                    mode == "split" ? " bg-[#E9F1FE]" : "bg-none"
                  } border-[1px] border-[#E9F1FE] rounded-[4px]`}
                >
                  <label className='flex items-start gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='splitOption'
                      value='split'
                      checked={mode === "split"}
                      onChange={() => setMode("split")}
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
                      <p className='font-bold text-4 text-gray-800'>
                        Split pages
                      </p>
                      <p className='text-3 text-gray-500'>
                        Separate specific page ranges
                      </p>
                    </div>
                  </label>
                </div>

                {/* Split inputs */}
                <div
                  className={`pl-3 pr-3 pt-2 pb-2 rounded-[4px] ${
                    mode === "split" ? "block" : "hidden"
                  }`}
                >
                  <div className='flex flex-col gap-2'>
                    {splitRanges.map((range, i) => (
                      <div key={i} className='flex items-center gap-2'>
                        <p className='text-sm text-gray-800'>Page from</p>
                        <input
                          type='text'
                          placeholder='1'
                          value={range.from}
                          onChange={(e) =>
                            handleRangeChange(i, "from", e.target.value)
                          }
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
                          className='px-3 py-2 text-sm border rounded text-center border-gray-300 w-[48px]'
                        />
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
              </div>
            </div>

            {/* Split Button */}
            <button
              onClick={handleSplit}
              className='mt-6 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 shadow'
            >
              Split PDF
            </button>
          </div>
        </div>
      )}
    </FileGetter>
  );
}

export default Split;
