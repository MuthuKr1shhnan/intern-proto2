import mergeSvg from '../assets/merge.svg';
import splitSvg from '../assets/split.svg';
import compressSvg from '../assets/compress.svg';

import pdftoexcelSvg from '../assets/pdftoexcel.svg';
import pdftopowerpointSvg from '../assets/pdftopowerpoint.svg';
import wordtopdfSvg from '../assets/wordtopdf.svg';
import powerpointtopdfSvg from '../assets/powerpointtopdf.svg';
import exceltopdfSvg from '../assets/exceltopdf.svg';



const allTools = {
  "All Tools": [
    {
      id: 1,
      img: <img src={mergeSvg} alt="Merge PDF" className="nav-icon" width={24} height={24} />,
      label: "Merge PDF",
      to: "/merge-pdf",
    },
    {
      id: 2,
      img: <img src={splitSvg} alt="Split PDF" className="nav-icon" width={24} height={24} />,
      label: "Split PDF",
      to: "/split-pdf",
    },
    {
      id: 3,
      img: <img src={compressSvg} alt="Remove Pages" className="nav-icon" width={24} height={24} />,
      label: "Compress PDF",
      to: "/compress-pdf",
    },
  
    {
      id: 4,
      img: <img src={pdftoexcelSvg} alt="Organize PDF" className="nav-icon" width={24} height={24} />,
      label: "Pdf to Excel",
      to: "/pdf-to-excel",
    },
    {
      id: 5,
      img: <img src={pdftopowerpointSvg } alt="Scan to PDF" className="nav-icon" width={24} height={24} />,
      label: "PDF to Powerpoint",
      to: "/pdf-to-powerpoint",
    },
    {
      id: 6,
      img: <img src={wordtopdfSvg } alt="Scan to PDF" className="nav-icon" width={24} height={24} />,
      label: "Word to PDF",
      to: "/word-to-pdf",
    },
    {
      id: 7,
      img: <img src={powerpointtopdfSvg } alt="Scan to PDF" className="nav-icon" width={24} height={24} />,
      label: "Powerpoint to PDF",
      to: "/powerpoint-to-pdf",
    },
    {
      id: 8,
      img: <img src={exceltopdfSvg} alt="Scan to PDF" className="nav-icon" width={24} height={24} />,
      label: "Excel to PDF",
      to: "/excel-to-pdf",
    },
  ],
  // You can continue other sections like CONVERT PDF, etc. using:
  // img: <img src={yourImportedSVG} alt="..." />
};

export default allTools;
