import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from '../components/ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getProducts } from '../service/api';
import { useAuth } from '../contexts/useAuth';
import MixshopBanner from '../animation/MixshopAnimation';
import CategoryShortcuts from '../components/CategoryShortCuts';

function PrincipalPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { admin } = useAuth();
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
    navigate('/catalog', { state: { categoryToFilter: category } });
  };
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-6 pb-12">
      {/* SECCIÓN 1.5 - Carrusel */}
      <MixshopBanner />
      <CategoryShortcuts />

      {/* BANNER NUEVOS INGRESOS */}
      <div className="w-full py-2 px-4 md:py-3 md:px-6 bg-[#3163b3]/20 rounded-2xl overflow-hidden shadow-md mb-6">
        <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl md:text-2xl font-bold text-[#3163b3] mb-0">
            {admin ? '¡Bienvenido Admin!' : '¡Nuevos ingresos!'}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => showProducts()}
              className="bg-[#3163b3] cursor-pointer active:scale-[0.98] text-white rounded-md py-1.5 md:py-2 text-xs md:text-base font-semibold px-4"
            >
              {admin ? 'Editar productos' : 'Más productos'}
            </button>

            {admin && (
              <button
                onClick={() => navigate('/products/new')}
                className="bg-[#3163b3] cursor-pointer active:scale-[0.98] text-white rounded-md py-1.5 md:py-2 text-xs md:text-base font-semibold px-4"
              >
                Crear producto
              </button>
            )}
          </div>
        </div>{' '}
      </div>

      {/* SECCIÓN 2 - Productos */}
      <div className="w-full">
        {error ? (
          <p className="text-center text-xl font-semibold text-red-600">Ocurrió un error al cargar los productos.</p>
        ) : loading ? (
          <p className="text-[#3163b3] font-semibold text-xl text-center">Cargando productos...</p>
        ) : products.length === 0 ? (
          <p className="text-[#3163b3] font-semibold text-xl text-center">No hay productos disponibles</p>
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
