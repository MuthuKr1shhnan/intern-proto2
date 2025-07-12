import { useEffect, useState } from "react";
import done from "../assets/done.svg";

const Done = ({ action = "Merge", downloadUrl, onDownload }) => {
  const [status, setStatus] = useState("uploading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (status !== "done") {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            if (status === "uploading") {
              setStatus("converting");
              setProgress(0);
            } else if (status === "converting") {
              setStatus("done");
            }
            return 100;
          }
          return prev + 2;
        });
      }, 50);
    }

    return () => clearInterval(interval);
  }, [status]);

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
        <div className="flex flex-col items-center gap-1">
          <div className="flex justify-center items-center gap-2">
            <img src={done} alt="Done" className="w-8 h-8" />
            <h1 className="text-[32px] text-center font-extrabold text-black">Done</h1>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Your files are {action.toLowerCase()}d successfully
          </p>
          <button
            onClick={handleDownload}
            className="mt-4 w-full px-6 py-2 bg-blue-600 text-white font-medium rounded-[4px] hover:bg-blue-700 transition"
          >
            Download file
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center gap-2 w-full">
          <h1 className="text-xl font-semibold text-gray-800">
            {status === "uploading" ? "Uploading..." : "Converting..."}
          </h1>
          <div className="w-full bg-gray-300 rounded-full h-3 mt-2">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>
      );
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center bg-[#f8f8f8]"
      style={{ height: "calc(100vh - 57px)" }}
    >
      <div className="w-[20%] h-full justify-start mt-40 flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
};

export default Done;
