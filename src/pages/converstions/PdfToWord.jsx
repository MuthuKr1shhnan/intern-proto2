import FileGetter from "../../components/FileGetter";
import { useState } from "react";
import { tools } from "../../utils/cardData";
import PdfPreviewCanvas from "../../components/PdfPreviewCanvas";
function PdfToWord() {
  const [files, setFiles] = useState([]);
  const handleFileSelect = (selected) => {
    const withIds = selected.map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`,
      file,
    }));
    setFiles(withIds);
  };
  const handlePdfToWord = async () => {
    alert("Compress logic goes here.");
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
  return (
    <FileGetter onFileSelect={handleFileSelect} multipleFiles={false}>
      {files.length > 0 && (
        <div
          className='relative flex flex-col  overflow-y-auto overflow-x-hidden'
          style={{ height: "calc(100vh - 60px)" }}
        >
          <div className='relative flex flex-col items-center h-full tool px-6 md:px-28 bg-[#f8f8f8] overflow-y-auto text-center'>
            {/* Header */}
            <div
              className='sticky top-0 z-10 w-full md:w-[45%] mx-auto overflow-hidden p-[12px] pb-6 md:pl-8 rounded-[4px] h-[88px] md:h-[105px] mt-[80px] mb-6 text-start'
              style={{ backgroundColor: extractedColor }}
            >
              <h1 className='text-[20px] md:text-[32px] font-bold text-gray-800'>
                {title}
              </h1>
              <p className='text-[12px] w-[80%] md:text-[16px] text-gray-300 mt-1'>
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
            <button
              onClick={handlePdfToWord}
              className='sticky block md:hidde mt-auto  bottom-20 bg-[#2869DA] text-white py-3 rounded-md w-[254px] hover:bg-blue-700 shadow '
            >
             PDF to Word
            </button>
          </div>
        
        </div>
      )}
    </FileGetter>
  );
}

export default PdfToWord;
