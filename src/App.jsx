import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "@fontsource/league-spartan";
import PrincipalPage from "./containers/PrincipalPage";
import Catalog from "./containers/Catalog";
import Login from "./containers/Login";
import Layout from "./components/Layout";
import ProductPage from "./containers/productPage";
import ProductCreatePage from "./containers/ProductCreatePage";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContexts";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        {" "}
        <AuthProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<PrincipalPage />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/products/new" element={<ProductCreatePage />} />
              <Route path="/products/:productId" element={<ProductPage />} />
              <Route path="/products/:productId" element={<ProductPage />} />
            </Route>

            <Route path="/login" element={<Login />} />
          </Routes>
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
export default App;
