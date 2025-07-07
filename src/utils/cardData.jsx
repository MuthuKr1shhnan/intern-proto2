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
    description: "Combine multiple PDF files into a single document",
    icon: mergeSvg,
    link: "/merge-pdf",
    new: true,
  },
  {
    id: 2,
    title: "Split PDF",
    description: "Divide a single PDF into multiple separate files",
    icon: splitSvg,
    link: "/split-pdf",
    new: true,
  },
  {
    id: 3,
    title: "Compress PDF",
    description: "Reduce the file size of your PDF documents.",
    icon: compressSvg,
    link: "/compress-pdf",
    new: true,
  },
  {
    id: 4,
    title: "PDF to Word",
    description: "Transform PDF file into editable word document",
    icon: pdftowordSvg,
    link: "/pdf-to-word",
    new: true,
  },
  {
    id: 5,
    title: "PDF to Excel",
    description: "Transform PDF file into editable excel file",
    icon: pdftoexcelSvg,
    link: "/pdf-to-excel",
    new: true,
  },
  {
    id: 6,
    title: "PDF to Powerpoint",
    description: "Transform PDF file into editable PPT file",
    icon: pdftopowerpointSvg,
    link: "/pdf-to-powerpoint",
    new: true,
  },
  {
    id: 7,
    title: "Word to PDF",
    description: "Transform word document to PDF file",
    icon: wordtopdfSvg,
    link: "/word-to-pdf",
    new: true,
  },
  {
    id: 8,
    title: "Powerpoint to PDF",
    description: "Transform PDF file into image",
    icon: powerpointtopdfSvg,
    link: "/powerpoint-to-pdf",
    new: true,
  },
  {
    id: 9,
    title: "Excel to PDF",
    description: "Transform PDF file into image",
    icon: exceltopdfSvg,
    link: "/excel-to-pdf",
    new: true,
  },
  {
    id: 10,
    title: "More tools coming soon",
    description: "",
    icon: null,
    link: "#",
    new: false,
  },
];
