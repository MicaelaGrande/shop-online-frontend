import React from 'react';

function ProductCard({ product }) {
  return (
    <div
      className="bg-white/20 backdrop-blur-md p-3 md:p-6 rounded-xl shadow-lg text-[#3163b3] flex flex-col gap-2 md:gap-4 cursor-pointer hover:bg-[#3163b3] hover:text-white transition-all duration-300 ease-out group max-w-sm"
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

      <div className="flex flex-colum justify-between items-center gap-4 mt-auto">
        <p className="text-gray-600 group-hover:text-gray-200 text-xs md:text-sm font-semibold">
          {product.categories
            .slice(0, 3)
            .map((category) => category.name)
            .join(" • ")}
        </p>
        <div className="bg-[#3163b3] min-w-[40px] h-10 md:min-w-[48px] md:h-12 px-2 rounded-full flex items-center justify-center font-bold text-white text-xs md:text-base ml-2 shrink-0 group-hover:bg-[#d5dee4] group-hover:text-gray-900 transition-colors">
          ${product.price}
        </div>
      </div>

      <button className="bg-[#3163b3] cursor-pointer active:scale-[0.98] group-hover:bg-[#d5dee4] group-hover:text-gray-900 transition-colors text-white rounded-md py-1.5 md:py-2 text-xs md:text-base font-semibold mt-1">
        Añadir
      </button>
    </div>
  );
}

export default ProductCard;