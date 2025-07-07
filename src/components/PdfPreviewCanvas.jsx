// PDFPreviewCanvas.jsx
import { useEffect, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const PdfPreviewCanvas = ({ file, pageNumber }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Disconnect once visible to avoid rerenders
        }
      },
      {
        rootMargin: "100px", // Start loading a bit before it enters viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const render = async () => {
      if (!file || !containerRef.current || !isVisible) return;

      containerRef.current.innerHTML = "";

      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;

        if (pageNumber > pdf.numPages) return;

        const page = await pdf.getPage(pageNumber);
        const scale = 0.4;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        canvas.style.width = "110px";
        canvas.style.height = "150px";
        canvas.style.backgroundColor = "white";
        canvas.className = "rounded object-cover shadow";

        await page.render({
          canvasContext: canvas.getContext("2d"),
          viewport,
        }).promise;

        if (!isCancelled && containerRef.current) {
          containerRef.current.appendChild(canvas);
        }
      } catch (e) {
        console.error("PDF page render error:", e);
      }
    };

    render();

    return () => {
      isCancelled = true;
    };
  }, [file, pageNumber, isVisible]);

  return <div ref={containerRef} className="w-[110px] h-[150px]" />;
};

export default PdfPreviewCanvas;
