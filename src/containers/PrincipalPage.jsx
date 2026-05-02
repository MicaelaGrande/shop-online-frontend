import { useState } from "react";
import { Menu, Search, ShoppingBag, Instagram, Phone } from "lucide-react";
import SidePanel from "../components/SidePanel";
import MenuContent from "../components/MenuContent";
import CartContent from "./CartContent";

const availableProducts = [
  {
    id: 1,
    name: "Remera Oversize",
    description: "Remera 100% algodón, corte oversize.",
    price: 2005.5,
    categories: [
      { id: 1, name: "Ropa Men" },
      { id: 2, name: "Oversize" },
      { id: 3, name: "Oversize" },
      { id: 4, name: "Oversize" },
      { id: 5, name: "Oversize" },
    ],
    media: [
      { id: 1, url: "https://placehold.co/300x400/png?text=Foto+1" },
      { id: 2, url: "https://placehold.co/300x400/png?text=Foto+2" },
    ],
  },
  {
    id: 20,
    name: "Zapatillas Urban",
    description: "Zapatillas cómodas para el día a día.",
    price: 50000,
    categories: [
      { id: 3, name: "Calzado" },
      { id: 4, name: "Urbano" },
    ],
    media: [{ id: 3, url: "https://placehold.co/300x400/png?text=Zapas+1" }],
  },
  {
    id: 30,
    name: "Remera Oversize",
    description: "Remera 100% algodón, corte oversize.",
    price: 25.0,
    categories: [
      { id: 1, name: "Ropa Men" },
      { id: 2, name: "Oversize" },
    ],
    media: [
      { id: 1, url: "https://placehold.co/300x400/png?text=Foto+1" },
      { id: 2, url: "https://placehold.co/300x400/png?text=Foto+2" },
    ],
  },
  {
    id: 40,
    name: "Zapatillas Urban",
    description: "Zapatillas cómodas para el día a día.",
    price: 50000,
    categories: [
      { id: 3, name: "Calzado" },
      { id: 4, name: "Urbano" },
    ],
    media: [{ id: 3, url: "https://placehold.co/300x400/png?text=Zapas+1" }],
  },
  {
    id: 12,
    name: "Remera Oversize",
    description: "Remera 100% algodón, corte oversize.",
    price: 25.0,
    categories: [
      { id: 1, name: "Ropa Men" },
      { id: 2, name: "Oversize" },
    ],
    media: [
      { id: 1, url: "https://placehold.co/300x400/png?text=Foto+1" },
      { id: 2, url: "https://placehold.co/300x400/png?text=Foto+2" },
    ],
  },
  {
    id: 22,
    name: "Zapatillas Urban",
    description: "Zapatillas cómodas para el día a día.",
    price: 8000.5,
    categories: [
      { id: 3, name: "Calzado" },
      { id: 4, name: "Urbano" },
    ],
    media: [{ id: 3, url: "https://placehold.co/300x400/png?text=Zapas+1" }],
  },
  {
    id: 32,
    name: "Remera Oversize",
    description: "Remera 100% algodón, corte oversize.",
    price: 25.0,
    categories: [
      { id: 1, name: "Ropa Men" },
      { id: 2, name: "Oversize" },
    ],
    media: [
      { id: 1, url: "https://placehold.co/300x400/png?text=Foto+1" },
      { id: 2, url: "https://placehold.co/300x400/png?text=Foto+2" },
    ],
  },
  {
    id: 42,
    name: "Zapatillas Urban",
    description: "Zapatillas cómodas para el día a día.",
    price: 50000,
    categories: [
      { id: 3, name: "Calzado" },
      { id: 4, name: "Urbano" },
    ],
    media: [{ id: 3, url: "https://placehold.co/300x400/png?text=Zapas+1" }],
  },
  {
    id: 11,
    name: "Remera Oversize",
    description: "Remera 100% algodón, corte oversize.",
    price: 25.0,
    categories: [
      { id: 1, name: "Ropa Men" },
      { id: 2, name: "Oversize" },
    ],
    media: [
      { id: 1, url: "https://placehold.co/300x400/png?text=Foto+1" },
      { id: 2, url: "https://placehold.co/300x400/png?text=Foto+2" },
    ],
  },
  {
    id: 21,
    name: "Zapatillas Urban",
    description: "Zapatillas cómodas para el día a día.",
    price: 50000,
    categories: [
      { id: 3, name: "Calzado" },
      { id: 4, name: "Urbano" },
    ],
    media: [{ id: 3, url: "https://placehold.co/300x400/png?text=Zapas+1" }],
  },
  {
    id: 31,
    name: "Remera Oversize",
    description: "Remera 100% algodón, corte oversize.",
    price: 25.0,
    categories: [
      { id: 1, name: "Ropa Men" },
      { id: 2, name: "Oversize" },
    ],
    media: [
      { id: 1, url: "https://placehold.co/300x400/png?text=Foto+1" },
      { id: 2, url: "https://placehold.co/300x400/png?text=Foto+2" },
    ],
  },
  {
    id: 41,
    name: "Zapatillas Urban",
    description: "Zapatillas cómodas para el día a día.",
    price: 50000,
    categories: [
      { id: 3, name: "Calzado" },
      { id: 4, name: "Urbano" },
    ],
    media: [{ id: 3, url: "https://placehold.co/300x400/png?text=Zapas+1" }],
  },
];

function PrincipalPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const vendedores = ["5493516566498", "5493516807168"];
  const vendedorVentaAleatoria =
    vendedores[Math.floor(Math.random() * vendedores.length)];
  const whatsappLinkVentas = `https://wa.me/${vendedorVentaAleatoria}?text=Hola!%20Te%20escribo%20desde%20la%20tienda%20online,%20me%20gustaria%20mas%20informacion%20sobre`;

  return (
    // Configuracion del fondo
    <div
      className="
        min-h-screen
        bg-[url('/mixshopbg.png')]
        bg-cover
        bg-center
        bg-fixed
        bg-no-repeat
      "
    >
      {/*Division de la pagina por secciones HEADER-CENTER-INFO  */}
      <div className="min-h-screen flex flex-col">
        {/* SECCIÓN 1 - Header */}
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
              {/* Lado izquierdo (Menú + Logo) */}
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

              {/* Centro: (La Mega Barra De Búsqueda) */}
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

              {/* Lado derecho (Solo carrito) */}
              <div className="flex justify-end shrink-0">
                <button
                  onClick={() => setShopOpen(true)}
                  className="text-gray-500 hover:text-[#3163b3] transition-colors"
                >
                  <ShoppingBag className="w-10 h-10" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2 - Carrusel */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {loading ? (
              <p className="text-[#3163b3] font-semibold text-xl text-center">
                Cargando productos...
              </p>
            ) : availableProducts.length === 0 ? (
              <p className="text-[#3163b3] font-semibold text-xl text-center">
                No hay productos disponibles
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {availableProducts.map((product) => (
                  <div
                    key={product.id}
                    // onClick={() => {
                    //   setSelectedproductId(product.id);
                    //    setOpen(true);
                    // }}
                    className="bg-white/20
                            backdrop-blur-md
                            p-3 md:p-6 
                            rounded-xl 
                            shadow-lg 
                            text-[#3163b3]
                            flex flex-col gap-2 md:gap-4 
                            cursor-pointer 
                            hover:bg-[#3163b3] hover:text-white
                            transition-all 
                            duration-300 ease-out
                            group
                            max-w-sm
                          "
                  >
                    <img
                      src={
                        product.media[0]?.url ||
                        "https://placehold.co/300x400?text=Sin+Imagen"
                      }
                      alt={product.name}
                      className="w-full h-32 md:h-48 object-cover rounded-md"
                    />
                    <div className="flex items-center">
                      <h2 className="text-sm md:text-2xl font-bold leading-tight">
                        {product.name}
                      </h2>
                    </div>

                    <div className="flex flex-colum justify-between items-center gap-4 mt-auto">
                      <p className="text-gray-600 group-hover:text-gray-200 text-xs md:text-sm font-semibold ">
                        {product.categories
                          .slice(0, 3)
                          .map((category) => category.name)
                          .join(" • ")}
                      </p>
                      <div className="bg-[#3163b3] min-w-[40px] h-10 md:min-w-[48px] md:h-12 px-2 rounded-full flex items-center justify-center font-bold text-white text-xs md:text-base ml-2 shrink-0 group-hover:bg-[#d5dee4] group-hover:text-gray-900 transition-colors">
                        ${product.price}
                      </div>
                    </div>

                    <button className="bg-[#3163b3] cursor-pointer active:scale-[0.98]  group-hover:bg-[#d5dee4] group-hover:text-gray-900 transition-colors text-white rounded-md py-1.5 md:py-2 text-xs md:text-base font-semibold mt-1 ">
                      Añadir
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN 3 - Info */}
        <div className="bg-[#3163b3] text-white py-12 px-6 mt-12 w-full shrink-0">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Columna 1: Envíos */}
            <div>
              <h3 className="font-bold text-xl mb-4">Entregas y Envíos</h3>
              <p className="text-white/80">Realizamos envíos a todo el país.</p>
              <p className="text-white/80">Entregas en 48hs hábiles.</p>
            </div>

            {/* Columna 2: Redes (Instagram) */}
            <div>
              <h3 className="font-bold text-xl mb-4">Seguinos</h3>
              <a
                href="https://instagram.com/mixshop.gp"
                target="_blank"
                rel="noreferrer"
                className="text-white/80 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2"
              >
                <Instagram className="w-4 h-4" /> mixshop.gp
              </a>
            </div>

            {/* Columna 3: Contacto (WhatsApp) */}
            <div>
              <h3 className="font-bold text-xl mb-3">Contacto</h3>
              <a
                href="https://wa.me/5493516566498?text=Hola%20Mica!%20Te%20escribo%20desde%20la%20tienda%20online,%20me%20gustaria%20hacer%20una%20consulta"
                target="_blank"
                rel="noreferrer"
                className="text-white/80 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2 mb-2"
              >
                <Phone className="w-4 h-4" />
                Mica: 3516566498
              </a>
              <a
                href="https://wa.me/5493516807168?text=Hola%20Mica!%20Te%20escribo%20desde%20la%20tienda%20online,%20me%20gustaria%20hacer%20una%20consulta"
                target="_blank"
                rel="noreferrer"
                className="text-white/80 hover:text-white transition-colors flex items-center justify-center md:justify-start gap-2"
              >
                <Phone className="w-4 h-4" />
                Norma : 3516807168
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <a
        href={whatsappLinkVentas}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 hover:bg-[#20bd5a] transition-all duration-300 cursor-pointer flex items-center justify-center"
        title="Chat en WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
        </svg>
      </a>
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
