// 📦 Importing necessary tools from React
import { useEffect, useState } from "react";
// 🖼️ Importing the done icon image
import done from "../assets/done.svg";

// 🎯 This component shows progress and completion status for file operations
const Done = ({ action = "Merge", downloadUrl, onDownload, isCompleted }) => {
  // 🏷️ Track current status: "uploading", "processing", or "done"
  const [status, setStatus] = useState("uploading");
  // 📊 Track progress percentage (0-100)
  const [progress, setProgress] = useState(0);

  // 🔄 This runs our progress animation
  useEffect(() => {
    let interval; // 🕒 Will store our timer

    // 🚦 Only animate if not done yet
    if (status !== "done") {
      // ⏱️ Set up a repeating timer (every 50ms)
      interval = setInterval(() => {
        // 📈 Update progress each time timer runs
        setProgress((prev) => {
          // 🎯 Check if progress reached 100%
          if (prev >= 100) {
            // 🔄 If we were uploading, switch to processing
            if (status === "uploading") {
              setStatus("processing");
              return 0; // 🔄 Reset progress for processing phase
            } 
            // 🔄 If we were processing, just keep at 0 (spinner shows)
            else if (status === "processing") {
              return 0;
            }
          }
          // ➕ Add 2% to progress each time (makes it go up smoothly)
          return prev + 2;
        });
      }, 50); // ⏰ Runs every 50 milliseconds
    }

    // 🧹 Clean up timer when component unmounts or status changes
    return () => clearInterval(interval);
  }, [status]); // 👀 Watch for status changes

  // 👀 Watch for when backend finishes (isCompleted becomes true)
  useEffect(() => {
    if (isCompleted) {
      setStatus("done"); // 🏁 Mark as done
      setProgress(100); // ✅ Set progress to 100%
    }
  }, [isCompleted]); // 👀 Runs when isCompleted changes

  // 📥 Handle file download when user clicks button
  const handleDownload = () => {
    // 1️⃣ First choice: Use callback function if provided
    if (onDownload) {
      onDownload(); // 📞 Call the parent's download function
    } 
    // 2️⃣ Second choice: Use download URL if provided
    else if (downloadUrl) {
      // 🏗️ Create invisible link element
      const link = document.createElement("a");
      link.href = downloadUrl; // 🔗 Set file location
      link.download = "output.pdf"; // 💾 Set default filename
      document.body.appendChild(link); // ➕ Add to page
      link.click(); // 🖱️ Programmatically click it
      document.body.removeChild(link); // ➖ Clean up after
    } 
    // 3️⃣ If neither option available, show error
    else {
      alert("No file available for download."); // 🚨 Tell user
    }
  };

  // 🎨 This function decides what to show on screen
  const renderContent = () => {
    // 🏁 If operation is complete
    if (status === "done") {
      return (
        <div className='flex flex-col items-center gap-1'>
          <div className='flex justify-center items-center gap-2'>
            {/* ✅ Show checkmark icon */}
            <img src={done} alt='Done' className='w-8 h-8' />
            {/* 🎉 Big "Done" heading */}
            <h1 className='text-[28px] sm:text-[32px] text-center font-extrabold text-black'>
              Done
            </h1>
          </div>
          {/* 📝 Success message with action name */}
          <p className='text-sm text-gray-600 mt-1 text-center'>
           🎉 All done! Your requested process ({action.toLowerCase()}) is finished successfully. You can Download Now! 
          </p>
          {/* 📥 Download button */}
          <button
            onClick={handleDownload}
            className='mt-4 w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-[4px] hover:bg-blue-700 transition'
          >
            Download file
          </button>
        </div>
      );
    } 
    // ⏳ If still working (uploading or processing)
    else {
      return (
        <div className='flex flex-col items-center gap-2 w-full'>
          {/* 📌 Show current status heading */}
          <h1 className='text-lg sm:text-xl font-semibold text-gray-800 text-center'>
            {status === "uploading" ? "Uploading..." : "Processing..."}
          </h1>
          <div className='w-full flex justify-center items-center gap-4'>
            {/* 🌀 Show spinner during processing */}
            {status === "processing" && (
              <div className='flex justify-center items-center mt-2'>
                <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
              </div>
            )}
            {/* 📊 Show progress bar during uploading */}
            {status === "uploading" && (
              <div className='w-full bg-gray-300 rounded-full h-3 mt-2'>
                <div
                  className='bg-blue-600 h-3 rounded-full transition-all'
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
            {/* 🔢 Show percentage during uploading */}
            {status == "uploading" && (
              <span className='text-sm h-3 text-gray-500'>{progress}%</span>
            )}
          </div>
        </div>
      );
    }
  };

  // 🖼️ Main container for the component
  return (
    <div
      className='flex flex-col items-center justify-center bg-[#f8f8f8]'
      style={{ height: "calc(100vh - 57px)" }} // 📏 Full height minus header
    >
      {/* 📦 Inner container with responsive sizing */}
      <div className='w-full sm:w-[20%] h-full justify-start sm:mt-40 mt-20 px-4 flex flex-col'>
        {renderContent()} {/* 🎨 Show the appropriate content */}
      </div>
    </div>
  );
};

// 🚀 Export the component for use in other files
export default Done;