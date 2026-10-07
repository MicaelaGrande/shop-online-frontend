import React from "react";
import { Link } from "react-router-dom";
import ProductPrice from "./ProductPrice";
import { useCart } from "../contexts/useCart";

function ProductCard({
  product,
  selectionMode = false,
  selected = false,
  onToggleSelection,
}) {
  const { addToCart } = useCart();
  return (
    <div className="relative bg-white/20 backdrop-blur-md p-3 md:p-6 rounded-xl shadow-lg text-[#3163b3] flex flex-col gap-2 md:gap-4 cursor-pointer hover:bg-[#3163b3] hover:text-white transition-all duration-300 ease-out group max-w-sm">
      <Link
        to={`/products/${product.id}`}
        className="block"
        onClick={(event) => {
          if (selectionMode) {
            event.preventDefault();
            onToggleSelection();
          }
        }}
      >
        <img
          src={
            product.media && product.media[0]?.url
              ? product.media[0].url
              : "https://placehold.co/300x400?text=Sin+Imagen"
          }
          alt={product.name}
          className="w-full h-32 md:h-48 object-cover rounded-md"
        />
        <div className="flex items-center">
          <h2 className="text-sm md:text-2xl font-bold leading-tight">
            {product.name}
          </h2>
        </div>
        <div className="mt-2 flex w-full flex-col items-start gap-1">
          <p className="w-full break-words text-left text-xs font-semibold text-gray-600 group-hover:text-gray-200 md:text-sm">
            {product.categories
              .slice(0, 3)
              .map((category) => category.name)
              .join(" • ")}
          </p>
          <div className="flex w-full justify-end text-right text-sm">
            <ProductPrice
              price={product.price}
              isOnSale={product.is_on_sale}
              salePrice={product.sale_price}
              compact
            />
          </div>{" "}
        </div>{" "}
      </Link>
      {selectionMode && (
        <label className="absolute left-3 top-3 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white shadow">
          <input
            type="checkbox"
            checked={selected}
            onClick={(event) => event.stopPropagation()}
            onChange={onToggleSelection}
            aria-label={`Seleccionar ${product.name}`}
            className="h-4 w-4 accent-[#3163b3]"
          />
        </label>
      )}

      <button
        onClick={() => addToCart(product)}
        disabled={selectionMode}
        className={`rounded-md py-1.5 md:py-2 text-xs md:text-base font-semibold mt-1 transition-colors ${
          selectionMode
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#3163b3] text-white cursor-pointer active:scale-[0.98] group-hover:bg-[#d5dee4] group-hover:text-gray-900"
        }`}
      >
        Añadir
      </button>
    </div>
  );
}

export default ProductCard;
