import Merge from "./pages/converstions/Merge";

import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Split from "./pages/converstions/Split";
import Compress from "./pages/converstions/Compress";
import PdfToWord from "./pages/converstions/PdfToWord";
import PdfToExcel from "./pages/converstions/PdfToExcel";
import PdfToPowerpoint from "./pages/converstions/PdfToPowerpoint";
import WordToPdf from "./pages/converstions/WordToPdf";
import PowerpointToPdf from "./pages/converstions/PowerpointToPdf";
import ExcelToPdf from "./pages/converstions/ExcelToPdf";
import Done from "./components/Done";
import OfflineScreen from "./components/OfflineScreen";

function App() {
  return (
    <>
      <OfflineScreen />
      <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/merge-pdf' element={<Merge />} />
        <Route path='/split-pdf' element={<Split />} />
        <Route path='/compress-pdf' element={<Compress />} />
        <Route path='/pdf-to-word' element={<PdfToWord />} />
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
