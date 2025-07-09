import FileGetter from "../../components/FileGetter";
import { useState } from "react";
function ExcelToPdf() {
  const [files, setFiles] = useState([]);
  const handleFileSelect = (selected) => {
    const withIds = selected.map((file, i) => ({
      id: `${file.name}-${Date.now()}-${i}`,
      file,
    }));
    setFiles(withIds);
  };
  return (
    <FileGetter onFileSelect={handleFileSelect}>
      {files.length > 0 &&
        (() => {
          alert("Development in progress!");

          return null;
        })()}
    </FileGetter>
  );
}

export default ExcelToPdf;
