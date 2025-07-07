import { useRef, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import FileGetter from "../../components/FileGetter";
import PdfPreviewCanvas from "../../components/PdfPreviewCanvas";
import { FaPlus } from "react-icons/fa";

function Merge() {
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (selected) => {
    setFiles(selected);
  };

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const handleMerge = async () => {
    alert("Merge logic goes here.");
  };

  return (
    <FileGetter
      title="Merge PDF files"
      subtitle="Combine PDFs in the order you want with the easiest PDF merger available."
      acceptedFileTypes="application/pdf"
      buttonText="Select PDF Files"
      onFileSelect={handleFileSelect}
    >
      <div className="flex flex-col items-center w-full">
        <div className="relative w-full bg-gray-100 rounded-lg py-10 px-6 flex justify-center gap-6 flex-wrap min-h-[260px]">
          <ReactSortable
            list={files}
            setList={setFiles}
            className="flex flex-wrap justify-center gap-6"
          >
            {files.map((file, index) => (
              <div
                key={index}
                className="flex flex-col items-center transition-all duration-200"
              >
                <div className="relative w-[150px] h-[180px] flex justify-center items-center bg-white rounded-lg shadow hover:shadow-md overflow-hidden">
                  <div className="absolute top-0 left-0 bg-black text-white text-[10px] px-1 py-[2px] rounded-br z-10">
                    PDF
                  </div>
                  <PdfPreviewCanvas file={files[0]} pageNumber={1} />
                </div>
                <p className="mt-2 text-xs text-gray-700 max-w-[110px] text-center truncate">
                  {file.name}
                </p>
              </div>
            ))}
          </ReactSortable>

          <button
            onClick={handleAddClick}
            className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-10"
          >
            <FaPlus />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        <button
          onClick={handleMerge}
          className="mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 shadow-md"
        >
          Merge files
        </button>
      </div>
    </FileGetter>
  );
}

export default Merge;
