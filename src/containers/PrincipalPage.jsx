import { useState } from "react";
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

function PrincipalPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
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
          {/* SECCIÓN 1.5 - Carrusel */}
          <div className="w-full rounded-2xl overflow-hidden shadow-md mb-6">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={0} // Espacio entre diapositivas
              slidesPerView={1} // Muestra una imagen a la vez
              navigation
              pagination={{ clickable: true }} // Puntos debajo
              autoplay={{ delay: 3000, disableOnInteraction: false }} // Pasa automático
              loop={true} // Vuelve a empezar al terminar
              className="w-full h-40 md:h-72 lg:h-96" // Tamaños responsivos
            >
              {promoBanners.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <img
                    src={banner.url}
                    alt={banner.alt}
                    className="w-full h-full object-cover"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* BANNER NUEVOS INGRESOS */}
          <div className="w-full py-2 px-4 md:py-3 md:px-6 bg-[#3163b3]/20 rounded-2xl overflow-hidden shadow-md mb-6">
            <div className="flex w-full items-center justify-between">
              <h3 className="text-xl md:text-2xl font-bold text-[#3163b3] mb-0">
                ¡Nuevos ingresos!
              </h3>
              <button
                onClick={() => showProducts()}
                className="bg-[#3163b3] cursor-pointer active:scale-[0.98]  text-white rounded-md py-1.5 md:py-2 text-xs md:text-base font-semibold px-4 "
              >
                Mas productos
              </button>
            </div>
          </div>

          {/* SECCIÓN 2 - Productos */}
          <div className="w-full">
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
                {availableProducts.slice(0, 12).map((product) => (
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
