function ProductPrice({ price, isOnSale, salePrice, compact = false }) {
  const regularPrice = Number(price);
  const discountedPrice = Number(salePrice);
  const hasValidSale =
    isOnSale && Number.isFinite(discountedPrice) && discountedPrice > 0 && discountedPrice < regularPrice;

  if (!hasValidSale) {
    return <p className={compact ? 'font-bold' : 'text-2xl font-bold text-[#3163b3]'}>${regularPrice.toFixed(2)}</p>;
  }

  const discountPercent = Math.round(((regularPrice - discountedPrice) / regularPrice) * 100);

  return (
    <>
      <div className={compact ? 'flex flex-wrap items-baseline gap-2' : 'flex flex-wrap items-baseline gap-3'}>
        <span className="text-sm text-gray-500 line-through">${regularPrice.toFixed(2)}</span>
        <span className="font-bold text-[#3163b3]">${discountedPrice.toFixed(2)}</span>
      </div>

      <span className="absolute right-3 top-3 z-10 flex h-12 w-12  items-center justify-center rounded-full bg-[#3163b3] text-xs font-bold text-white shadow-md">
        -{discountPercent}%
      </span>
    </>
  );
}

export default ProductPrice;
