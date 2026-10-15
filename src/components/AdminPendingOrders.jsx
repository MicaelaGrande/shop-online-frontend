import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminOrders } from '../service/api';
import { useAuth } from '../contexts/useAuth';

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short'
});

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS'
});

export default function AdminPendingOrders({onClosePanel}) {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!admin) return;

    let isMounted = true;

    const loadOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await getAdminOrders({ status: 'pending', limit: 10 });

        if (isMounted) {
          setOrders(result);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(requestError.message || 'No se pudieron cargar los pedidos.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    const handleOrdersUpdated = () => {
      loadOrders();
    };

    window.addEventListener('orders:updated', handleOrdersUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('orders:updated', handleOrdersUpdated);
    };
  }, [admin]);
  if (!admin) return null;

  return (
    <section className="border-t border-gray-200 bg-white p-4">
      <h3 className="mb-3 font-bold text-[#3163b3]">Últimos pedidos pendientes</h3>

      {loading ? (
        <p className="text-sm text-gray-600">Cargando pedidos...</p>
      ) : error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-gray-600">No hay pedidos pendientes.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order.id} className="flex justify-between gap-3 py-2 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-medium">{order.customer_name}</span>
                <span className="text-gray-500">{dateFormatter.format(new Date(order.created_at))}</span>
              </span>
              <span className="shrink-0 font-semibold">{currencyFormatter.format(Number(order.total))}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => {
          onClosePanel?.();
          navigate('/admin/orders');
        }}
        className="mt-3 w-full border-t border-gray-200 pt-3 text-left font-semibold text-[#3163b3] hover:underline"
      >
        Ver más pedidos...
      </button>
    </section>
  );
}
