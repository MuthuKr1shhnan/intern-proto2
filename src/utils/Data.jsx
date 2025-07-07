import mergeSvg from '../assets/merge.svg';
import splitSvg from '../assets/split.svg';
import compressSvg from '../assets/compress.svg';
import pdftowordSvg from '../assets/pdftoword.svg';
import pdftoexcelSvg from '../assets/pdftoexcel.svg';
import pdftopowerpointSvg from '../assets/pdftopowerpoint.svg';
import wordtopdfSvg from '../assets/wordtopdf.svg';
import powerpointtopdfSvg from '../assets/powerpointtopdf.svg';
import exceltopdfSvg from '../assets/exceltopdf.svg';

export const data = [
  {
    id: 1,
    title: 'Merge PDF',
    description: "Combine multiple PDF files into one",
    icon: mergeSvg,
    path: "merge-pdf",
    new: true,
  },
  {
    id: 2,
    title: 'Split PDF',
    description: "Split a PDF file into multiple files",
    icon: splitSvg,
    path: "split-pdf",
    new: true,
  },
  {
    id: 3,
    title: 'Compress PDF',
    description: "Reduce the file size of a PDF",
    icon: compressSvg,
    path: "compress-pdf",
    new: true,
  },
  {
    id: 4,
    title: 'PDF to Word',
    description: "Convert PDF files to Word documents",
    icon: pdftowordSvg,
    path: "pdf-word",
    new: true,
  },
  {
    id: 5,
    title: 'PDF to Excel',
    description: "Convert PDF files to Excel spreadsheets",
    icon: pdftoexcelSvg,
    path: "pdf-excel",
    new: true,
  },
  {
    id: 6,
    title: 'PDF to PowerPoint',
    description: "Convert PDF files to PowerPoint presentations",
    icon: pdftopowerpointSvg,
    path: "pdf-powerpoint",
    new: true,
  },
  {
    id: 7,
    title: 'Word to PDF',
    description: "Convert Word to PDF",
    icon: wordtopdfSvg,
    path: "word-pdf",
    new: true,
  },
  {
    id: 8,
    title: 'PowerPoint to PDF',
    description: "Convert PowerPoint to PDF",
    icon: powerpointtopdfSvg,
    path: "powerpoint-pdf",
    new: true,
  },
  {
    id: 9,
    title: 'Excel to PDF',
    description: "Convert Excel to PDF",
    icon: exceltopdfSvg,
    path: "excel-pdf",
    new: true,
  },
  {
    id: 10,
    title: 'More tools coming',
    description: "",
    icon: "",
    path: "#",
    new: false,
  },
];