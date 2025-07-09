import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../index.css";
import { tools as data } from "../utils/cardData";
import draganddrop from "../assets/draganddrop.svg";
const FileGetter = ({
  acceptedFileTypes = ".pdf",
  buttonText = "Select PDF file",
  multipleFiles = true,
  onFileSelect,
  wrapperClass = " w-full bg-[#f8f8f8] flex justify-center px-4 md:px-20",
  cardClass = "w-full max-w-5xl  flex flex-col items-center",
  titleClass = "text-[20px] md:text-[32px] font-bold text-gray-800",
  subtitleClass = "text-[12px] w-[80%] md:text-[14px] text-gray-500 mt-1 text-start",
  dropZoneClass = "border-2 border-dashed border-gray-300 w-full rounded-md mt-6 p-10 text-center transition-all duration-200",
  dropZoneActiveClass = "border-blue-500 bg-blue-50",
  iconClass = "w-8 h-8 mx-auto",
  selectButtonClass = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4",
  children,
}) => {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname.replace("/", "");
  const matchedTool = data.find(
    (tool) => tool.link.replace("/", "") === currentPath
  );

  const title = matchedTool?.title || "Tool";
  const subtitle = matchedTool?.description || "Upload and process your files";
  const image = matchedTool?.icon || "";
  const extractedColor =
    matchedTool?.color?.startsWith("bg-[") && matchedTool.color.includes("#")
      ? matchedTool.color.slice(4, -1)
      : "#DBEAFE";

  const handleFileClick = () => fileInputRef.current.click();

  const addFiles = (newFiles) => {
    const selectedFiles = Array.from(newFiles);
    const updatedFiles = multipleFiles
      ? [...files, ...selectedFiles]
      : selectedFiles;
    if (onFileSelect) onFileSelect(updatedFiles);
    setFiles(updatedFiles);
  };

  const handleFileChange = (e) => addFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  return (
    <>
      {files.length > 0 ? (
        <div className='w-full'>{children}</div>
      ) : (
        <div className={wrapperClass} style={{ height: "calc(100vh - 60px)" }}>
          <div className={cardClass}>
            {/* Header */}
            <div
              className='relative w-full max-w-2xl overflow-hidden p-3  md:px-10 rounded-[8px] h-auto md:h-[105px] mt-[80px] mb-6 text-start'
              style={{ backgroundColor: extractedColor }}
            >
              <h1 className={titleClass}>{title}</h1>
              <p className={subtitleClass}>{subtitle}</p>
              {image && (
                <img
                  src={image}
                  alt={title}
                  className='absolute -bottom-6 -right-7 w-[120px] h-[120px] object-contain z-0 opacity-50 brightness-[120] contrast-[80] saturate-50'
                />
              )}
            </div>

            {/* Drag & Drop (Desktop only) */}
            <div
              className={`${dropZoneClass} ${
                isDragging ? dropZoneActiveClass : ""
              } hidden md:block`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <img src={draganddrop} className={iconClass} alt='' />
              <p className='text-gray-500'>Drag & drop files here</p>
              <button className={selectButtonClass} onClick={handleFileClick}>
                {buttonText}
              </button>
            </div>

            {/* Always visible select button */}
            <input
              type='file'
              accept={acceptedFileTypes}
              multiple={multipleFiles}
              ref={fileInputRef}
              onChange={handleFileChange}
              className='hidden'
            />
            <button
              className={`${selectButtonClass} md:hidden`}
              onClick={handleFileClick}
            >
              {buttonText}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FileGetter;
