import Merge from "./pages/converstions/Merge";


import { Route, Routes } from "react-router-dom";

import  Home  from "./pages/Home";
import Split from "./pages/converstions/Split";


function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/merge-pdf' element={<Merge />} />
        <Route path='/split-pdf' element={<Split />} />
         
      </Routes>
    </>
  );
}

export default App;
