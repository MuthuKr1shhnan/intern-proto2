// 📦 Importing React hooks and other dependencies
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../index.css";
import { tools as data } from "../utils/cardData";
import draganddrop from "../assets/draganddrop.svg";

// 🎯 Main component for file upload functionality
const FileGetter = ({
  // 🔧 Configurable props with default values
  acceptedFileTypes = ".pdf",          // 📄 Allowed file types
  buttonText = "Select PDF file",     // 🖱️ Button text
  multipleFiles = true,               // ➕ Allow multiple files?
  onFileSelect,                       // 📞 Callback when files are selected
  // 🎨 Styling classes for different parts
  wrapperClass = "w-full bg-[#f8f8f8] flex justify-center px-4 md:px-20",
  cardClass = "w-full max-w-5xl flex flex-col items-center",
  titleClass = "text-[20px] md:text-[32px] font-bold text-gray-800",
  subtitleClass = "text-[12px] w-[80%] md:text-[14px] text-gray-500 mt-1 text-start",
  dropZoneClass = "border-2 border-dashed border-gray-300 w-full rounded-md mt-6 p-10 text-center transition-all duration-200",
  dropZoneActiveClass = "border-blue-500 bg-blue-50",
  iconClass = "w-8 h-8 mx-auto",
  selectButtonClass = "bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4",
  children,                           // 👶 Child components to render when files are selected
}) => {
  // 🖱️ Reference to the hidden file input element
  const fileInputRef = useRef(null);
  // 📂 State for storing selected files
  const [files, setFiles] = useState([]);
  // 🖱️ State for tracking drag-and-drop activity
  const [isDragging, setIsDragging] = useState(false);

  // 🗺️ Get current route information
  const location = useLocation();
  const currentPath = location.pathname.replace("/", "");
  
  // 🔍 Find tool data matching current route
  const matchedTool = data.find(
    (tool) => tool.link.replace("/", "") === currentPath
  );

  // 🏷️ Extract tool information or use defaults
  const title = matchedTool?.title || "Tool";
  const subtitle = matchedTool?.description || "Upload and process your files";
  const image = matchedTool?.icon || "";
  
  // 🎨 Extract color from tool data (with fallback)
  const extractedColor =
    matchedTool?.color?.startsWith("bg-[") && matchedTool.color.includes("#")
      ? matchedTool.color.slice(4, -1)
      : "#DBEAFE";

  // 🖱️ Trigger file input click
  const handleFileClick = () => fileInputRef.current.click();

  // 📂 Add new files to state
  const addFiles = (newFiles) => {
    // 🔄 Convert FileList to array
    const selectedFiles = Array.from(newFiles);
    // ➕ Either merge with existing files or replace (based on multipleFiles)
    const updatedFiles = multipleFiles
      ? [...files, ...selectedFiles]
      : selectedFiles;
    // 📞 Notify parent component if callback provided
    if (onFileSelect) onFileSelect(updatedFiles);
    // 💾 Update state
    setFiles(updatedFiles);
  };

  // 📄 Handle file selection via input
  const handleFileChange = (e) => addFiles(e.target.files);

  // 🖱️ Handle file drop (drag-and-drop)
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      addFiles(e.dataTransfer.files);
      e.dataTransfer.clearData(); // 🧹 Clean up
    }
  };

  // 🖱️ Handle drag over (visual feedback)
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  // 🖱️ Handle drag leave (visual feedback)
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // 🎨 Convert HEX color to RGB
  const hexToRgb = (hex) => {
    hex = hex.replace("#", "");
    // Handle shorthand HEX (like #FFF)
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  };

  // 🎨 Calculate readable text color based on background
  const getContrastTextColor = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    // YIQ formula for perceived brightness
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    // Return softer colors for better readability
    return yiq >= 128 ? "#4B5563" : "#D1D5DB";
  };

  // 🎨 Get subtitle color that contrasts with background
  const subtitleColor = getContrastTextColor(extractedColor);

  return (
    <>
      {/* 📂 Show children if files are selected, otherwise show upload UI */}
      {files.length > 0 ? (
        <div className='w-full'>{children}</div>
      ) : (
        <div className={wrapperClass} style={{ height: "calc(100vh - 60px)" }}>
          <div className={cardClass}>
            {/* 🏷️ Header section with dynamic styling */}
            <div
              className='relative w-full max-w-2xl overflow-hidden p-3 md:px-10 rounded-[8px] h-auto md:h-[105px] mt-[80px] mb-6 text-start'
              style={{ backgroundColor: extractedColor }}
            >
              <h1 className={titleClass}>{title}</h1>
              <p className={subtitleClass} style={{ color: subtitleColor }}>
                {subtitle}
              </p>
              {/* 🖼️ Tool icon (if available) */}
              {image && (
                <img
                  src={image}
                  alt={title}
                  className='absolute -bottom-6 -right-7 w-[120px] h-[120px] object-contain z-0 opacity-50 brightness-[120] contrast-[80] saturate-50'
                />
              )}
            </div>

            {/* 🖱️ Desktop drag-and-drop zone (hidden on mobile) */}
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

            {/* 📄 Hidden file input (triggered by buttons) */}
            <input
              type='file'
              accept={acceptedFileTypes}
              multiple={multipleFiles}
              ref={fileInputRef}
              onChange={handleFileChange}
              className='hidden'
            />
            
            {/* 📱 Mobile-only select button (hidden on desktop) */}
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

// 🚀 Export the component
export default FileGetter;