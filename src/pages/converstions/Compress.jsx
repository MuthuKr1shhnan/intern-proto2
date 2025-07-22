import { useState } from "react";
import FileGetter from "../../components/FileGetter";
import { useLocation } from "react-router-dom";
import { tools } from "../../utils/cardData";
import PdfPreviewCanvas from "../../components/PdfPreviewCanvas";
import revealbtnSvg from "../../assets/arrowbtn.svg";
import Done from "../../components/Done";
import axios from "axios";

function Compress() {
  const [files, setFiles] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const [mode, setMode] = useState("high");
  const [compressedFileUrl, setCompressedFileUrl] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const base_URL = import.meta.env.VITE_BASE_URL;
  const handleFileSelect = (selected) => {
    const withIds = selected.map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`,
      file,
    }));
    setFiles(withIds);
  };

  const handleCompress = async () => {
    if (!files.length) return;

    const formData = new FormData();
    formData.append("file", files[0].file);
    formData.append("level", mode);

    try {
      setIsDone(true);
      const response = await axios.post(
        `${base_URL}api/pdf/compress-pdf`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );
      setIsCompleted(true);

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setCompressedFileUrl(url);
    } catch (error) {
      console.error("Compression failed:", error);
      alert("Failed to compress PDF. Please try again.");
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

  if (isDone) {
    return (
      <Done
        action='Compress'
        downloadUrl={compressedFileUrl}
        onDownload={() => {
          const link = document.createElement("a");
          link.href = compressedFileUrl;
          link.download = `compressed(${mode}).pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        isCompleted={isCompleted}
      />
    );
  }

  return (
    <FileGetter onFileSelect={handleFileSelect}>
      <section  className="overflow-y-hidden" style={{ height: "calc(100vh - 60px)" }}>
        {files.length > 0 && (
          <div
            className='relative flex flex-col md:flex-row overflow-y-auto overflow-x-hidden'
            style={{ height: "calc(100vh - 60px)" }}
          >
            {/* Left Section */}
            <div className='relative h-full flex-1 tool px-6 md:px-28 bg-[#f8f8f8] overflow-y-auto text-center'>
              {/* Header */}
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
                {image && (
                  <img
                    src={image}
                    alt={title}
                    className='absolute -bottom-3 -right-4 w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-contain z-0 opacity-50 brightness-[120] contrast-[80] saturate-50'
                  />
                )}
              </div>
              {/* Page Previews */}
              <div className='flex justify-around gap-y-2 pt-2 pl-5 pr-5 md:pl-0 md:pr-0 flex-wrap'>
                <div className='relative w-auto bg-[#f4f4f4] rounded-lg py-10 px-6 flex justify-center gap-6 flex-wrap min-h-[260px]'>
                  {files.map((item) => (
                    <div
                      key={item.id}
                      className='flex flex-col items-center transition-all duration-200'
                    >
                      <div className='relative w-[150px] h-[182px] flex justify-center items-center bg-white hover:shadow-md overflow-hidden'>
                        <div className='absolute top-0 left-0 bg-black text-white text-[10px] px-1 py-[2px] rounded-br z-1'>
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
            </div>
           
            {/* Right Sidebar */}
            <div
              className={`fixed top-0 right-0 h-full bg-white z-10 md:static md:translate-x-0 transition-transform duration-300
                border-l border-[#E5E8EB]
                ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
              `}
              style={{ width: "303px" }}
            >
              {/* Reveal Btn (Mobile) */}
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
              <div className='w-full h-full flex flex-col justify-center p-6'>
                <div className='w-full max-w-[260px] flex flex-col gap-4 md:mt-auto'>
                  <div className='flex flex-col gap-3'>
                    {/* High Compression */}
                    <div
                      className={`pl-3 pr-3 pt-2 pb-2 ${
                        mode === "high" ? "bg-[#E9F1FE]" : "bg-none"
                      } border border-[#E9F1FE] rounded-[4px]`}
                    >
                      <label className='flex items-start gap-2 cursor-pointer'>
                        <input
                          type='radio'
                          name='compression'
                          value='high'
                          checked={mode === "high"}
                          onChange={() => setMode("high")}
                          className='peer hidden'
                        />
                        <div className='mt-[6px] w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center peer-checked:border-[#2869DA]'>
                          <div
                            className={`w-2.5 h-2.5 rounded-full bg-[#2869DA] ${
                              mode === "high" ? "scale-100" : "scale-0"
                            } transition-transform`}
                          />
                        </div>
                        <div>
                          <p className='font-bold text-[14px] text-gray-800'>
                            High Compression
                          </p>
                          <p className='text-[12px] text-gray-500'>
                            Lower file size and Low quality
                          </p>
                        </div>
                      </label>
                    </div>
                    {/* Low Compression */}
                    <div
                      className={`pl-3 pr-3 pt-2 pb-2 ${
                        mode === "low" ? "bg-[#E9F1FE]" : "bg-none"
                      } border border-[#E9F1FE] rounded-[4px]`}
                    >
                      <label className='flex items-start gap-2 cursor-pointer'>
                        <input
                          type='radio'
                          name='compression'
                          value='low'
                          checked={mode === "low"}
                          onChange={() => setMode("low")}
                          className='peer hidden'
                        />
                        <div className='mt-[6px] w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center peer-checked:border-[#2869DA]'>
                          <div
                            className={`w-2.5 h-2.5 rounded-full bg-[#2869DA] ${
                              mode === "low" ? "scale-100" : "scale-0"
                            } transition-transform`}
                          />
                        </div>
                        <div>
                          <p className='font-bold text-[14px] text-gray-800'>
                            Low Compression
                          </p>
                          <p className='text-[12px] text-gray-500'>
                            Higher file size and high quality
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCompress}
                  className='w-full mt-auto hidden md:block bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 shadow'
                >
                  Compress PDF
                </button>
              </div>
            </div>
          </div>
        )}
         {/* Mobile Compress Button */}
            <button
              onClick={handleCompress}
              className='sticky block md:hidden mx-auto bottom-2 bg-[#2869DA] text-white py-3 z-1 rounded-md w-[188px] hover:bg-blue-700 shadow mt-auto'
            >
              Compress PDF
            </button>
      </section>
    </FileGetter>
  );
}

export default Compress;
