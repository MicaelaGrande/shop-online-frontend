import { useEffect, useState } from "react";
import { CartContext } from "./cart-context";
import { fetchUpdatedCartItems } from "./cart-utils";

const CART_STORAGE_KEY = "mixshop-cart";

function readStoredCart() {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    const unitPrice =
      product.is_on_sale && product.sale_price != null
        ? Number(product.sale_price)
        : Number(product.price);

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentItems,
        {
          id: product.id,
          name: product.name,
          unitPrice,
          imageUrl: product.media?.[0]?.url ?? null,
          quantity: 1,
          isAvailable: true,
          priceWasUpdated: false,
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = items.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );
  const refreshCart = async () => {
    const updatesById = await fetchUpdatedCartItems(items);

    const refreshedItems = items.map((item) => ({
      ...item,
      ...updatesById.get(item.id),
    }));

    setItems(refreshedItems);

    return refreshedItems;
  };
  const acknowledgePriceChange = (productId) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId ? { ...item, priceWasUpdated: false } : item
      )
    );
  };
  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        acknowledgePriceChange,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
