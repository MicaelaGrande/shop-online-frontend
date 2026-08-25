import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import SidePanel from "../components/SidePanel";
import MenuContent from "../components/MenuContent";
import CartContent from "./CartContent";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import WhatsAppButton from "../components/WhatsAppButton";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
const promoBanners = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    alt: "Juguetería",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
    alt: "Blanquería",
  },
];

function Catalog() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);

  const categoryId = location.state?.categoryToFilter;

  const hasCategory = categoryId !== undefined && categoryId !== null;

  const filteredProducts = hasCategory
    ? availableProducts.filter((product) =>
        product.categories.some((category) => category.id === categoryId)
      )
    : availableProducts;
  const showProducts = async (category = null) => {
    navigate("/catalog", { state: { categoryToFilter: category } });
  };
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
        <Header
          setMenuOpen={setMenuOpen}
          setShopOpen={setShopOpen}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
        />

        {/* CONTENEDOR MAESTRO CENTRAL */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 mt-6 pb-12">
          {/* SECCIÓN 2 - Productos */}
          <div className="w-full">
            {/* <button
              onClick={() => navigate(-1)}
              className="
                        mb-6
                        inline-flex items-center gap-2
                        rounded-lg
                        bg-[#3163b3]
                        px-5 py-2.5
                        text-sm font-bold text-white
                        shadow-md
                        transition-all duration-200
                        hover:bg-[#3163b3]
                        hover:scale-105
                        active:scale-95
                    "
            >
              ← Volver
            </button> */}
            {error ? (
              <p className="text-center text-xl font-semibold text-red-600">
                Ocurrió un error al cargar los productos.
              </p>
            ) : loading ? (
              <p className="text-center text-xl font-semibold text-[#3163b3]">
                Cargando productos...
              </p>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center text-xl font-semibold text-[#3163b3]">
                No hay productos en esta categoría.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN 3 - Info */}
        <Footer />
      </div>
      {/* BOTÓN FLOTANTE DE WHATSAPP */}
      <WhatsAppButton />
      {/* PANELES LATERALES */}
      <SidePanel
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Menú"
        side="left"
      >
        <MenuContent  onCategorySelect={() => setMenuOpen(false)}/>
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

export default Catalog;
