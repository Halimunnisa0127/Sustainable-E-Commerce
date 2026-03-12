//App.jsx

import { BrowserRouter,Routes,Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import CategoryGenerator from "./pages/CategoryGenerator"
import ProposalGenerator from "./pages/ProposalGenerator"

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