
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "@fontsource/league-spartan";
import PrincipalPage from "./containers/PrincipalPage";
import Catalog from "./containers/Catalog";
import Login from "./containers/Login"
import { LogIn } from "lucide-react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PrincipalPage />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path= "/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
