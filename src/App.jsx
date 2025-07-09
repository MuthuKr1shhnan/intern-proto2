import Merge from "./pages/converstions/Merge";


import { Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import  Home  from "./pages/Home";
import Split from "./pages/converstions/Split";
import Compress from "./pages/converstions/Compress";


function App() {
  return (
    <>
    <Nav/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/merge-pdf' element={<Merge />} />
        <Route path='/split-pdf' element={<Split />} />
        <Route path='/compress-pdf' element={<Compress />} />
         
      </Routes>
    </>
  );
}

export default App;
