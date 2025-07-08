import mergeSvg from '../assets/merge.svg';
import splitSvg from '../assets/split.svg';
import compressSvg from '../assets/compress.svg';
import pdftowordSvg from '../assets/pdftoword.svg';
import pdftoexcelSvg from '../assets/pdftoexcel.svg';
import pdftopowerpointSvg from '../assets/pdftopowerpoint.svg';
import wordtopdfSvg from '../assets/wordtopdf.svg';
import powerpointtopdfSvg from '../assets/powerpointtopdf.svg';
import exceltopdfSvg from '../assets/exceltopdf.svg';

export const tools = [
  {
    id: 1,
    title: "Merge PDF",
    description: "Transform PDF into Word, Excel, JPG, or other formats",
    icon: mergeSvg,
    cornerImage: mergeSvg,
    link: "/merge-pdf",
    color: "bg-[#D6E7FF]",
  },
  {
    id: 2,
    title: "Split PDF",
    description: "Divide a single PDF into multiple separate files",
    icon: splitSvg,
    cornerImage: splitSvg,
    link: "/split-pdf",
    color: "bg-[#7DF6CD]",
  },
  {
    id: 3,
    title: "Compress PDF",
    description: "Reduce the file size of your PDF documents.",
    icon: compressSvg,
    cornerImage: compressSvg,
    link: "/compress-pdf",
    color: "bg-[#F1ED44]",
  },
  {
    id: 4,
    title: "PDF to Word",
    description: "Transform PDF file into editable word document",
    icon: pdftowordSvg,
    cornerImage: pdftowordSvg,
    link: "/pdftoword-pdf",
    color: "bg-[#C968E1]",
  },
  {
    id: 5,
    title: "PDF to Excel",
    description: "Transform PDF file into editable excel file",
    icon: pdftoexcelSvg,
    cornerImage: pdftoexcelSvg,
    link: "/pdftoexcel-pdf",
    color: "bg-[#FEBCAF]",
  },
  {
    id: 6,
    title: "PDF to Powerpoint",
    description: "Transform PDF file into editable PPT file",
    icon: pdftopowerpointSvg,
    cornerImage: pdftopowerpointSvg,
    link: "/pdftopowerpoint-pdf",
    color: "bg-[#C2F496]",
  },
  {
    id: 7,
    title: "Word to PDF",
    description: "Transform word document to PDF file",
    icon: wordtopdfSvg,
    cornerImage: wordtopdfSvg,
    link: "/wordtopdf-pdf",
    color: "bg-[#8AD3D8]",
  },
  {
    id: 8,
    title: "Powerpoint to PDF",
    description: "Transform PPT file to PDF file",
    icon: powerpointtopdfSvg,
    cornerImage: powerpointtopdfSvg,
    link: "/PowerPointtopdf-pdf",
    color: "bg-[#D6E7FF]",
  },
  {
    id: 9,
    title: "Excel to PDF",
    description: "Transform excel document to PDF",
    icon: exceltopdfSvg,
    cornerImage: exceltopdfSvg,
    link: "/Exceltopdf-pdf",
    color: "bg-[#F6F17F]",
  },
  {
    id: 10,
    title: "More tools coming soon",
    description: "",
    icon: false,
    cornerImage: "",
    link: "#-pdf",
    color: "bg-[#FFEFF8]",
  },
];