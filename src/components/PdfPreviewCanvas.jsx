// 📦 Importing React hooks and PDF.js library
import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// 🔧 Configure PDF.js worker (needed for PDF processing)
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

// 🎯 Component to display a preview of a PDF page
const PdfPreviewCanvas = ({ file, pageNumber }) => {
  // 🖼️ Reference to the container div where we'll put our canvas
  const containerRef = useRef(null);
  // 👀 State to track if component is visible on screen (for lazy loading)
  const [isVisible, setIsVisible] = useState(false);

  // 🔍 Effect to set up Intersection Observer for lazy loading
  useEffect(() => {
    // 👁️ Create an observer to check when component enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        // 🎯 When component becomes visible...
        if (entries[0].isIntersecting) {
          setIsVisible(true); // ✅ Mark as visible
          observer.disconnect(); // 🛑 Stop observing (we only need to load once)
        }
      },
      {
        rootMargin: "100px", // 🔍 Start checking 100px before entering viewport
      }
    );

    // 🎯 Start observing our container if it exists
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // 🧹 Clean up observer when component unmounts
    return () => observer.disconnect();
  }, []); // 🏁 Empty dependency array = runs only once

  // 📄 Effect to render PDF when file/page/visibility changes
  useEffect(() => {
    // 🚫 Flag to cancel rendering if component unmounts
    let isCancelled = false;

    // 🎨 Async function to render the PDF page
    const render = async () => {
      // 🚦 Check if we have everything we need
      if (!file || !containerRef.current || !isVisible) return;

      // 🧹 Clear previous content
      containerRef.current.innerHTML = "";

      try {
        // 🔄 Convert file to ArrayBuffer (raw binary data)
        const arrayBuffer = await file.arrayBuffer();
        // 📂 Load the PDF document
        const pdf = await getDocument({ data: arrayBuffer }).promise;

        // 🔢 Check if requested page exists
        if (pageNumber > pdf.numPages) return;

        // 📄 Get the specific page we want to render
        const page = await pdf.getPage(pageNumber);
        // 🔍 Set zoom level (40% of original size)
        const scale = 0.4;
        // 🖼️ Calculate dimensions for our view
        const viewport = page.getViewport({ scale });

        // 🎨 Create a canvas element to draw on
        const canvas = document.createElement("canvas");
        // 📏 Set canvas internal dimensions (for sharp rendering)
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // 🖌️ Set display dimensions (smaller thumbnail size)
        canvas.style.width = "110px";
        canvas.style.height = "150px";
        canvas.style.backgroundColor = "white"; // ⚪ White background
        canvas.className = "rounded object-cover shadow"; // 🖼️ Styling classes

        // 🎨 Render the PDF page onto our canvas
        await page.render({
          canvasContext: canvas.getContext("2d"),
          viewport,
        }).promise;

        // ✅ Only add canvas if we haven't been cancelled
        if (!isCancelled && containerRef.current) {
          containerRef.current.appendChild(canvas);
        }
      } catch (e) {
        // ❌ Handle any errors that occur during rendering
        console.error("PDF page render error:", e);
      }
    };

    // 🏁 Start the rendering process
    render();

    // 🧹 Cleanup function - runs when component unmounts or dependencies change
    return () => {
      isCancelled = true; // 🚫 Mark rendering as cancelled
    };
  }, [file, pageNumber, isVisible]); // 🔄 Re-run when these change

  // 🖼️ Render just an empty div (canvas will be added later)
  return <div ref={containerRef} className="w-[110px] h-[150px]" />;
};

// 🚀 Export the component
export default PdfPreviewCanvas;