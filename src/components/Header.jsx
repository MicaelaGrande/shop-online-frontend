import { Menu, Search, ShoppingBag } from "lucide-react";

function Header({ setMenuOpen, setShopOpen, searchOpen, setSearchOpen }) {
  return (
    <div className="h-auto bg-white/10 backdrop-blur-sm p-4 transition-colors duration-200 ">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-4">
        {/* VERSIÓN MOBILE*/}
        <div className="md:hidden flex flex-col items-center justify-center gap-4">
          <div className="w-full grid grid-cols-3 items-center">
            <div className="flex justify-start">
              <button
                onClick={() => setMenuOpen(true)}
                className="text-gray-800 hover:text-[#3163b3] p-1"
              >
                <Menu className="w-8 h-8" />
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src="/logo titulo.png"
                alt="Logo"
                className="h-16 object-contain"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShopOpen(true)}
                className="text-gray-500 hover:text-[#3163b3] p-1"
              >
                <ShoppingBag className="w-8 h-8" />
              </button>
            </div>
          </div>

          <div className="flex w-full items-center gap-2">
            <input
              type="text"
              placeholder="Buscar..."
              className="h-10 w-full px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="h-10 px-3 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Search className="w-5 h-5 mx-1" />
            </button>
          </div>
        </div>
        {/* VERSIÓN DESKTOP/TABLET*/}
        <div className="hidden md:flex w-full items-center gap-8 justify-between">
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-gray-800 hover:text-[#3163b3] transition-colors"
            >
              <Menu className="w-10 h-10" />
            </button>
            <img
              src="/logo titulo.png"
              alt="Logo"
              className="h-30 max-w-[200px] object-contain"
            />
          </div>

          <div className="flex flex-1 max-w-3xl items-center gap-2">
            <input
              type="text"
              placeholder="Buscar productos en toda la tienda..."
              className="h-12 w-full px-6 border shadow-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="h-12 px-6 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
            >
              <Search className="w-6 h-6" />
            </button>
          </div>

          <div className="flex justify-end shrink-0">
            <button
              onClick={() => setShopOpen(true)}
              className="text-gray-500 hover:text-[#3163b3] transition-colors"
            >
              <ShoppingBag className="w-10 h-10" />
            </button>
          </div>
        </div>

        {/* Subtítulo central para todas las pantallas */}
        <div className="w-full text-center mt-2 mb-1">
          <h3 className="text-[#3163b3] font-medium text-sm md:text-base lg:text-lg tracking-wide">
            💙 Tienda de bazar, juguetería, electrónica y más 💙
          </h3>
        </div>
      </div>
    </div>
  );
}

export default Header;