import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../service/api";

function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getProduct(productId)
      .then((data) => {
        setProduct(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  if (error || !product) {
    return <p>No se pudo cargar el producto.</p>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <div>
          <img
            src={
              product.media?.[0]?.url ||
              "https://placehold.co/600x700?text=Sin+Imagen"
            }
            alt={product.name}
            className="w-full aspect-[4/5] object-cover rounded-xl"
          />
        </div>
        <div className="flex w-full flex-col gap-4 self-start rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md md:p-6">
          {" "}
          <h1 className="text-2xl md:text-4xl font-bold text-[#3163b3]">
            {product.name}
          </h1>
          {product.categories?.length > 0 && (
            <p className="text-sm md:text-base font-semibold text-gray-600">
              {product.categories.map((category) => category.name).join(" • ")}
            </p>
          )}
          <p className="text-gray-700 text-base md:text-lg">
            {product.description}
          </p>
          <p className="text-2xl font-bold text-[#3163b3]">${product.price}</p>
          <button
            type="button"
            className="w-full md:w-fit bg-[#3163b3] text-white rounded-md px-6 py-3 font-semibold hover:bg-[#244b8a] transition-colors"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
