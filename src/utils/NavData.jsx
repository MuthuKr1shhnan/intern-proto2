import mergeSvg from '../assets/merge.svg';
import splitSvg from '../assets/split.svg';
import compressSvg from '../assets/compress.svg';
import pdftowordSvg from '../assets/pdftoword.svg';
import pdftoexcelSvg from '../assets/pdftoexcel.svg';
import pdftopowerpointSvg from '../assets/pdftopowerpoint.svg';
import wordtopdfSvg from '../assets/wordtopdf.svg';
import powerpointtopdfSvg from '../assets/powerpointtopdf.svg';
import exceltopdfSvg from '../assets/exceltopdf.svg';



const allTools = {
  "All Tools": [
    {
      img: <img src={mergeSvg} alt="Merge PDF" className="nav-icon" width={24} height={24} />,
      label: "Merge PDF",
      to: "/merge-pdf",
    },
    {
      img: <img src={splitSvg} alt="Split PDF" className="nav-icon" width={24} height={24} />,
      label: "Split PDF",
      to: "/split-pdf",
    },
    {
      img: <img src={compressSvg} alt="Remove Pages" className="nav-icon" width={24} height={24} />,
      label: "Compress PDF",
      to: "/compress-pdf",
    },
    {
      img: <img src={pdftowordSvg} alt="Extract Pages" className="nav-icon" width={24} height={24} />,
      label: "Pdf to Word",
      to: "/pdf-to-word",
    },
    {
      img: <img src={pdftoexcelSvg} alt="Organize PDF" className="nav-icon" width={24} height={24} />,
      label: "Pdf to Excel",
      to: "/pdf-to-excel",
    },
 
    {
      img: <img src={pdftopowerpointSvg } alt="Scan to PDF" className="nav-icon" width={24} height={24} />,
      label: "PDF to Powerpoint",
      to: "/scan-to-pdf",
    },
    {
      img: <img src={wordtopdfSvg } alt="Scan to PDF" className="nav-icon" width={24} height={24} />,
      label: "Word to PDF",
      to: "/scan-to-pdf",
    },
    {
      img: <img src={powerpointtopdfSvg } alt="Scan to PDF" className="nav-icon" width={24} height={24} />,
      label: "Powerpoint to PDF",
      to: "/scan-to-pdf",
    },
    {
      img: <img src={exceltopdfSvg} alt="Scan to PDF" className="nav-icon" width={24} height={24} />,
      label: "Excel to PDF",
      to: "/scan-to-pdf",
    },
  ],
  // You can continue other sections like CONVERT PDF, etc. using:
  // img: <img src={yourImportedSVG} alt="..." />
};

export default allTools;
