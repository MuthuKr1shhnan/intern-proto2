import { useEffect, useState } from "react";
import done from "../assets/done.svg";

const Done = ({ action = "Merge", downloadUrl, onDownload, isCompleted }) => {
  const [status, setStatus] = useState("uploading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;

    // only run animation if not done
    if (status !== "done") {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (status === "uploading") {
              setStatus("processing");
              return 0;
            } else if (status === "processing") {
              return 0;
            }
          }
          return prev + 2;
        });
      }, 50);
    }

    return () => clearInterval(interval);
  }, [status]);

  // Watch for backend completion
  useEffect(() => {
    if (isCompleted) {
      setStatus("done");
      setProgress(100);
    }
  }, [isCompleted]);

  const handleDownload = () => {
    if (onDownload) {
      onDownload(); // use passed prop
    } else if (downloadUrl) {
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "output.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No file available for download.");
    }
  };

  const renderContent = () => {
    if (status === "done") {
      return (
        <div className='flex flex-col items-center gap-1'>
          <div className='flex justify-center items-center gap-2'>
            <img src={done} alt='Done' className='w-8 h-8' />
            <h1 className='text-[28px] sm:text-[32px] text-center font-extrabold text-black'>
              Done
            </h1>
          </div>
          <p className='text-sm text-gray-600 mt-1 text-center'>
            Your files are {action.toLowerCase()} action successfully completed.
          </p>
          <button
            onClick={handleDownload}
            className='mt-4 w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-[4px] hover:bg-blue-700 transition'
          >
            Download file
          </button>
        </div>
      );
    } else {
      return (
        <div className='flex flex-col items-center gap-2 w-full'>
          <h1 className='text-lg sm:text-xl font-semibold text-gray-800 text-center'>
            {status === "uploading" ? "Uploading..." : "Processing..."}
          </h1>
          <div className='w-full flex justify-center items-center gap-4'>
            {/* Spinner */}
            {status === "processing" && (
              <div className='flex justify-center items-center mt-2'>
                <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
              </div>
            )}
            {/* Progress Bar */}
            {status === "uploading" && (
              <div className='w-full bg-gray-300 rounded-full h-3 mt-2'>
                <div
                  className='bg-blue-600 h-3 rounded-full transition-all'
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
            {status == "uploading" && (
              <span className='text-sm h-3 text-gray-500'>{progress}%</span>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className='flex flex-col items-center justify-center bg-[#f8f8f8]'
      style={{ height: "calc(100vh - 57px)" }}
    >
      <div className='w-full sm:w-[20%] h-full justify-start sm:mt-40 mt-20 px-4 flex flex-col'>
        {renderContent()}
      </div>
    </div>
  );
};

export default Done;
