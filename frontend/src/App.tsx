import Files from "../src/pages/Files"
import Logs from "../src/pages/Logs"
import Sidebar from "./components/Sidebar"
import { BrowserRouter, Routes, Route} from "react-router-dom"             
import "./App.css"
const App = () => {
  return (
    <BrowserRouter>
    < div className="app-layout">
      <Sidebar/>
     <Routes>
       <Route path="/" element={<Files />}/>
       <Route path="/files" element={<Files />}/>
       <Route path="/logs" element={< Logs />}/>
      </Routes>
    </div>
    </BrowserRouter>
  )
}
export default App
