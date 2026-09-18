import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../service/api";

function Catalog() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const [error, setError] = useState(null);

  const categoryId = location.state?.categoryToFilter;

  const hasCategory = categoryId !== undefined && categoryId !== null;

  const filteredProducts = hasCategory
    ? products.filter((product) =>
        product.categories.some((category) => category.id === categoryId)
      )
    : products;

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-6 pb-12">
          {/* SECCIÓN 2 - Productos */}
          <div className="w-full">
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
  );
}

export default Catalog;
