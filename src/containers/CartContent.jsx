import { Minus, Plus, ShoppingBag, Trash2, Check } from 'lucide-react';
import { useCart } from '../contexts/useCart';
import { useState } from 'react';
import CheckoutForm from '../components/CheckoutForm';

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS'
});

export default function CartContent() {
  const { items, removeFromCart, updateQuantity, totalItems, totalPrice, refreshCart, acknowledgePriceChange } =
    useCart();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
    setRefreshMessage('');
  };
  const handleBeforeCheckout = async () => {
    setIsRefreshing(true);
    setRefreshMessage('');

    try {
      const refreshedItems = await refreshCart();

      const hasUnavailableItems = refreshedItems.some((item) => !item.isAvailable);

      const hasUpdatedPrices = refreshedItems.some((item) => item.priceWasUpdated);

      if (hasUnavailableItems) {
        setRefreshMessage('Hay productos que ya no están disponibles. Revisá el carrito.');
        return;
      }

      if (hasUpdatedPrices) {
        setRefreshMessage('Algunos precios se actualizaron. Revisá el nuevo total antes de continuar.');
        return;
      }
      setRefreshMessage('');
      setCheckoutOpen(true);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-gray-500">
        <ShoppingBag className="mb-4 h-16 w-16 text-gray-300" />
        <p className="mb-2 text-lg font-medium">Tu carrito está vacío</p>
        <p className="text-center text-sm">Agregá productos para verlos acá.</p>
      </div>
    );
  }
  const hasPriceChanges = items.some((item) => item.priceWasUpdated);

  const hasUnavailableItems = items.some((item) => !item.isAvailable);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {hasPriceChanges && (
          <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 p-3">
            <p className="text-sm font-semibold text-amber-800">El precio cambió. Revisá antes de continuar.</p>
          </div>
        )}
        {items.map((item) => (
          <article key={item.id} className="border-b border-gray-200 pb-4">
            <div className="flex gap-3">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
              )}

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>

                <p className="text-sm text-gray-600">{currencyFormatter.format(item.unitPrice)}</p>

                {!item.isAvailable && (
                  <p className="text-sm font-semibold text-red-600">Este producto ya no está disponible.</p>
                )}

                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label={`Disminuir cantidad de ${item.name}`}
                      className="rounded border border-gray-300 p-1 disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="min-w-6 text-center">{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label={`Aumentar cantidad de ${item.name}`}
                      className="rounded border border-gray-300 p-1"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  {item.priceWasUpdated && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-semibold text-amber-700">Precio actualizado</span>

                      <button
                        type="button"
                        onClick={() => acknowledgePriceChange(item.id)}
                        aria-label={`Aceptar nuevo precio de ${item.name}`}
                        title="Aceptar nuevo precio"
                        className="rounded-full p-1 text-green-600 hover:bg-green-100"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label={`Eliminar ${item.name} del carrito`}
                    title="Eliminar producto"
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <p className="mt-2 text-right font-semibold text-[#3163b3]">
                  {currencyFormatter.format(item.unitPrice * item.quantity)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="border-t border-gray-200 bg-white p-4">
        {hasUnavailableItems && (
          <p className="mb-3 text-sm font-semibold text-red-600">
            Quitá los productos no disponibles antes de comprar.
          </p>
        )}

        <div className="flex justify-between text-sm text-gray-600">
          <span>Productos</span>
          <span>{totalItems}</span>
        </div>

        <div className="mt-2 flex justify-between text-lg font-bold text-[#3163b3]">
          <span>Total</span>
          <span>{currencyFormatter.format(totalPrice)}</span>
        </div>

        <button
          type="button"
          onClick={handleBeforeCheckout}
          disabled={hasUnavailableItems || isRefreshing || hasPriceChanges}
          className="mt-4 w-full rounded-lg bg-[#3163b3] px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRefreshing ? 'Actualizando...' : 'Comprar'}
        </button>
        {refreshMessage && (
          <p className="mt-3 text-sm font-semibold text-[#3163b3]" role="alert">
            {refreshMessage}
          </p>
        )}
      </div>
      {checkoutOpen && <CheckoutForm items={items} onClose={() => setCheckoutOpen(false)} />}
    </div>
  );
}
