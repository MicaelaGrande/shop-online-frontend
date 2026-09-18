import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import ProductCard from "../components/ProductCard";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getProducts } from "../service/api";

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
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data.slice(0, 16));
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const showProducts = async (category = null) => {
    navigate("/catalog", { state: { categoryToFilter: category } });
  };
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-6 pb-12">
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
            {error ? (
              <p className="text-center text-xl font-semibold text-red-600">
                Ocurrió un error al cargar los productos.
              </p>
            ) : loading ? (
              <p className="text-[#3163b3] font-semibold text-xl text-center">
                Cargando productos...
              </p>
            ) : products.length === 0 ? (
              <p className="text-[#3163b3] font-semibold text-xl text-center">
                No hay productos disponibles
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
      </div>
  );
}

export default PrincipalPage;
