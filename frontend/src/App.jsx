//App.jsx

import { BrowserRouter,Routes,Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/pages/Home"
import CategoryGenerator from "./components/pages/CategoryGenerator"
import ProposalGenerator from "./components/pages/ProposalGenerator"
import "./App.css"
function App(){

 return(

  <BrowserRouter>

   <Navbar/>

   <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/category" element={<CategoryGenerator/>} />

    <Route path="/proposal" element={<ProposalGenerator/>} />

   </Routes>

  </BrowserRouter>

 )

}

export default App