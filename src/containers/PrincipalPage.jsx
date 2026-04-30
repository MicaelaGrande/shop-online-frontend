import { useState } from "react";
import { Menu, Search, ShoppingBag } from "lucide-react";
import SidePanel from "../components/SidePanel";
import MenuContent from "../components/MenuContent";
import CartContent from "./CartContent";

function PrincipalPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  return (
    // Configuracion del fondo
    <div
      className="
     
        h-screen
        overflow-hidden
        bg-[url('/mixshopbg.png')]
        bg-cover
        bg-center
        bg-no-repeat
      "
    >
      {/*Division de la pagina por secciones HEADER-CENTER-INFO  */}
      <div className="min-h-screen flex flex-col">
        {/* SECCIÓN 1 - Header */}
        <div className="h-auto bg-white/10 backdrop-blur-sm p-4 transition-colors duration-200 ">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            <div className="w-full grid grid-cols-3 items-center px-4 md:px-8">
              {/* 1. Izquierda: Menu */}
              <div className="flex justify-start">
                <button
                  onClick={() => setMenuOpen(true)}
                  className="p-2 text-gray-800 hover:text-[#3163b3] transition-colors p-2 cursor-pointer"
                >
                  <Menu className="w-8 h-8 md:w-10 md:h-10 border border-transparent"></Menu>
                </button>
              </div>

              {/* 2. Centro: Logo */}
              <div className="flex justify-center">
                <img
                  src="/logo titulo.png"
                  alt="Logo"
                  className="w-auto h-20 md:h-24 object-contain"
                />
              </div>

              {/* 3. Derecha: Carrito */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShopOpen(true)}
                  className="text-gray-500 hover:text-[#3163b3] transition-colors p-2 cursor-pointer"
                >
                  <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 border border-transparent" />
                </button>
              </div>
            </div>

            <div className="flex w-full md:w-auto items-center justify-center gap-2">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="h-10 w-full md:min-w-[400px] px-6 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="h-10 px-3 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Search className="w-5 h-5 mx-1" />
              </button>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2 - Carrusel */}
        <div className="flex-1 ">
          <div></div>
        </div>

        {/* SECCIÓN 3 - Info */}
        <div className="h-auto bg-gray-800 text-white">
          {/* Información de la empresa */}
        </div>
      </div>
      {/* PANELES LATERALES */}

      <SidePanel
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Menú"
        side="left"
      >
        <MenuContent />
      </SidePanel>

      <SidePanel
        isOpen={shopOpen}
        onClose={() => setShopOpen(false)}
        title="Carrito"
        side="right"
      >
        <CartContent />
      </SidePanel>
    </div>
  );
}

export default PrincipalPage;
