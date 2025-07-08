// import { useRef, useState } from "react";
// import { ReactSortable } from "react-sortablejs";
// import FileGetter from "../../components/FileGetter";
// import PdfPreviewCanvas from "../../components/PdfPreviewCanvas";
// import { FaPlus } from "react-icons/fa";

// function Merge() {
//   const [files, setFiles] = useState([]);
//   const fileInputRef = useRef(null);

//   const handleFileSelect = (selected) => {
//     setFiles(selected);
//   };

//   const handleAddClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleFileInputChange = (e) => {
//     setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
//   };

//   const handleMerge = async () => {
//     alert("Merge logic goes here.");
//   };

//   return (
//     <FileGetter
//       title="Merge PDF files"
//       subtitle="Combine PDFs in the order you want with the easiest PDF merger available."
//       acceptedFileTypes="application/pdf"
//       buttonText="Select PDF Files"
//       onFileSelect={handleFileSelect}
//     >
//       <div className="flex flex-col items-center w-full">
//         <div className="relative w-full bg-gray-100 rounded-lg py-10 px-6 flex justify-center gap-6 flex-wrap min-h-[260px]">
//           <ReactSortable
//             list={files}
//             setList={setFiles}
//             className="flex flex-wrap justify-center gap-6"
//           >
//             {files.map((file, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col items-center transition-all duration-200"
//               >
//                 <div className="relative w-[150px] h-[180px] flex justify-center items-center bg-white rounded-lg shadow hover:shadow-md overflow-hidden">
//                   <div className="absolute top-0 left-0 bg-black text-white text-[10px] px-1 py-[2px] rounded-br z-10">
//                     PDF
//                   </div>
//                   <PdfPreviewCanvas file={files[0]} pageNumber={1} />
//                 </div>
//                 <p className="mt-2 text-xs text-gray-700 max-w-[110px] text-center truncate">
//                   {file.name}
//                 </p>
//               </div>
//             ))}
//           </ReactSortable>

//           <button
//             onClick={handleAddClick}
//             className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-10"
//           >
//             <FaPlus />
//           </button>

//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="application/pdf"
//             multiple
//             onChange={handleFileInputChange}
//             className="hidden"
//           />
//         </div>

//         <button
//           onClick={handleMerge}
//           className="mt-8 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 shadow-md"
//         >
//           Merge files
//         </button>
//       </div>
//     </FileGetter>
//   );
// }

// export default Merge;

import { useState, useRef } from "react";
import FileGetter from "../../components/FileGetter";
import { useLocation } from "react-router-dom";
import { tools } from "../../utils/cardData";
import addbtn from "../../assets/addbtn.svg";

import PdfPreviewCanvas from "../../components/PdfPreviewCanvas";
import revealbtnSvg from "../../assets/arrowbtn.svg";
import { ReactSortable } from "react-sortablejs";

function Merge() {
  const [files, setFiles] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef(null);
  const location = useLocation();

  const handleFileSelect = (selected) => {
    const withIds = selected.map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`,
      file,
    }));
    setFiles(withIds);
  };

  const handleFileInputChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`,
      file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleAddClick = () => {
    fileInputRef.current.click();
  };

  const handleMerge = async () => {
    alert("Merge logic goes here.");
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
    <FileGetter onFileSelect={handleFileSelect}>
      {files.length > 0 && (
        <div
          className='relative flex flex-col md:flex-row overflow-y-auto overflow-x-hidden'
          style={{ height: "calc(100vh - 60px)" }}
        >
          {/* Left Section */}
          <div className='relative h-full flex-1 tool px-6 md:px-28 bg-[#f5f5fa] overflow-y-auto text-center'>
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
              <div className='relative w-auto bg-[#e2e2e3] rounded-lg py-10 px-6 flex justify-center gap-6 flex-wrap min-h-[260px]'>
                <ReactSortable
                  list={files}
                  setList={setFiles}
                  className='flex flex-wrap justify-center gap-6'
                  animation={200}
                >
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
                </ReactSortable>

                {/* Add Button */}
                <button
                  onClick={handleAddClick}
                  className='absolute right-[-20px] top-1/2 transform -translate-y-1/2 z-10'
                >
                  <img src={addbtn} alt='Add PDF' className='w-10 h-10' />
                </button>

                <input
                  ref={fileInputRef}
                  type='file'
                  accept='application/pdf'
                  multiple
                  onChange={handleFileInputChange}
                  className='hidden'
                />
              </div>
            </div>

            {/* Mobile Merge Button */}
            <button
              onClick={handleMerge}
              className='sticky block md:hidden mx-auto bottom-2 bg-[#2869DA] text-white py-3 rounded-md w-[188px] hover:bg-blue-700 shadow mt-auto'
            >
              Merge PDF
            </button>
          </div>

          {/* Right Sidebar */}
          <div
            className={`fixed top-0 right-0 h-full bg-white z-50 md:static md:translate-x-0 transition-transform duration-300
              border-l border-[#E5E8EB]
              ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
            `}
            style={{ width: "303px" }}
          >
            {/* Reveal Btn (Mobile) */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className='md:hidden absolute -left-6 top-1/2 transform -translate-y-1/2 z-50 flex items-center justify-center'
            >
              <img
                src={revealbtnSvg}
                alt='Toggle Sidebar'
                className={`transition-transform duration-300 ${
                  isSidebarOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <div className='w-full h-full   flex flex-col justify-center p-6'>
              <div className='w-full max-w-[260px]  flex flex-col gap-4 md:mt-auto'>
                <div className='w-full bg-white border border-[#6B7582] pt-2 pb-2 px-3 rounded-[2px]'>
                  <p className='text-center text-[#6B7582]'>
                    Reorder your pdf by drag and drop the files as you like
                  </p>
                </div>
              </div>

              <button
                onClick={handleMerge}
                className='w-full mt-auto hidden md:block bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 shadow'
              >
                Merge PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </FileGetter>
  );
}

export default Merge;
