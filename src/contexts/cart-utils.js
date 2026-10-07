import { getProduct } from "../service/api";

export async function fetchUpdatedCartItems(initialItems) {
  const results = await Promise.all(
    initialItems.map(async (item) => {
      try {
        const product = await getProduct(item.id);

        const unitPrice =
          product.is_on_sale && product.sale_price != null
            ? Number(product.sale_price)
            : Number(product.price);

        return {
          id: item.id,
          updates: {
            name: product.name,
            unitPrice,
            imageUrl: product.media?.[0]?.url ?? null,
            isAvailable: true,
            priceWasUpdated:
              item.unitPrice != null && item.unitPrice !== unitPrice,
          },
        };
      } catch {
        return {
          id: item.id,
          updates: {
            isAvailable: false,
            priceWasUpdated: false,
          },
        };
      }
    })
  );

  return new Map(results.map((result) => [result.id, result.updates]));
}
