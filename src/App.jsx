import Merge from "./pages/converstions/Merge";

import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Split from "./pages/converstions/Split";
import Compress from "./pages/converstions/Compress";

import PdfToExcel from "./pages/converstions/PdfToExcel";
import PdfToPowerpoint from "./pages/converstions/PdfToPowerpoint";
import WordToPdf from "./pages/converstions/WordToPdf";
import PowerpointToPdf from "./pages/converstions/PowerpointToPdf";
import ExcelToPdf from "./pages/converstions/ExcelToPdf";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/merge-pdf' element={<Merge />} />
        <Route path='/split-pdf' element={<Split />} />
        <Route path='/compress-pdf' element={<Compress />} />

        <Route path='/pdf-to-excel' element={<PdfToExcel />} />
        <Route path='/pdf-to-powerpoint' element={<PdfToPowerpoint />} />
        <Route path='/word-to-pdf' element={<WordToPdf />} />
        <Route path='/powerpoint-to-pdf' element={<PowerpointToPdf />} />
        <Route path='/excel-to-pdf' element={<ExcelToPdf />} />
      </Routes>
    </>
  );
}

export default App;
