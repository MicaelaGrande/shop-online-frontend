import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "@fontsource/league-spartan";
import PrincipalPage from "./containers/PrincipalPage";
import Catalog from "./containers/Catalog";
import Login from "./containers/Login";
import Layout from "./components/Layout";
import ProductPage from "./containers/productPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PrincipalPage />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/products/:productId" element={<ProductPage />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;