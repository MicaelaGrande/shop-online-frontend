import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./containers/Homepage";
import "@fontsource/league-spartan";
import PrincipalPage from "./containers/PrincipalPage";
import Catalog from "./containers/Catalog";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/principalPage" element={<PrincipalPage />} />
        <Route path="/catalog" element={<Catalog />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
