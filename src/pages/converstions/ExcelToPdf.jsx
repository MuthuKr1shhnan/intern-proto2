// 📦 IMPORTING REQUIRED TOOLS 📦
// These are like special tools we need from the toolbox
import { useState } from "react"; // Helps us remember things in our component
import axios from "axios"; // Helps us talk to servers (like sending files)

// 🧩 IMPORTING OUR OWN COMPONENTS 🧩
// These are like pre-built pieces of our app we can reuse
import FileGetter from "../../components/FileGetter"; // Handles file selection
import Done from "../../components/Done"; // Shows the "done" screen after conversion

function ExcelToPdf() {
  // 🧠 MEMORY BOXES (STATE VARIABLES) 🧠
  // These help our component remember things and re-render when they change
  const [convertedFileUrl, setConvertedFileUrl] = useState(null); // Where we'll store the PDF download link
  const [isDone, setIsDone] = useState(false); // Tracks if conversion is complete
  const [isCompleted, setIsCompleted] = useState(false); // Tracks if conversion was successful

  // 📂 HANDLE FILE SELECTION 📂
  // This runs when user picks an Excel file
  const handleFileSelect = async (selected) => {
    // First, check if we actually got a file
    if (!selected || selected.length === 0) return;

    // We only work with the first file (since multipleFiles is false)
    const file = selected[0]; 
    
    // Get our server's address from environment variables
    const base_URL = import.meta.env.VITE_BASE_URL;
    
    try {
      // Show that we're starting the conversion
      setIsDone(true);
      
      // Prepare the file for sending to the server
      const formData = new FormData();
      formData.append("file", file); // Attach the file with the key "file"

      // 🚀 SEND TO SERVER 🚀
      // Ask our server to convert the Excel to PDF
      const response = await axios.post(
        `${base_URL}api/excel/convert`, // The server's conversion endpoint
        formData, // Our file data
        {
          responseType: "blob", // We expect a PDF file (binary data) back
        }
      );

      // 🎉 CONVERSION SUCCESSFUL! 🎉
      // Convert the response to something we can download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob); // Create a special link for downloading

      // Save the download link and mark as completed
      setConvertedFileUrl(url);
      setIsCompleted(true);
    } catch (error) {
      // 😢 OH NO, SOMETHING WENT WRONG 😢
      console.error("Excel to PDF conversion failed:", error);
      alert("Conversion failed. Please try again.");
    }
  };

  // 🏁 DONE SCREEN 🏁
  // If conversion is done, show the Done component
  if (isDone) {
    return (
      <Done
        action='Excel to PDF' // Tell the Done component what we were doing
        downloadUrl={convertedFileUrl} // Pass the PDF download link
        onDownload={() => {
          // When download button is clicked:
          // 1. Create an invisible link
          const link = document.createElement("a");
          // 2. Set the link to our PDF
          link.href = convertedFileUrl;
          // 3. Set a nice filename
          link.download = "converted_Excel_To_PDF.pdf";
          // 4. Add it to the page (invisibly)
          document.body.appendChild(link);
          // 5. Click it automatically
          link.click();
          // 6. Clean up by removing it
          document.body.removeChild(link);
        }}
        isCompleted={isCompleted} // Tell Done component if it worked
      />
    );
  }

  // 🖼️ MAIN FILE SELECTION SCREEN 🖼️
  // Show the file picker when the app starts
  return (
    <FileGetter
      onFileSelect={handleFileSelect} // Pass our file handler function
      acceptedFileTypes='.xls,.xlsx,.csv' // Only accept Excel files
      multipleFiles={false} // Don't allow multiple files
    />
  );
}

export default ExcelToPdf; // Share this component with the rest of the app