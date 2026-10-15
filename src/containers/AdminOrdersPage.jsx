import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { Check, Eye, X } from 'lucide-react';
import { getAdminOrder, getAdminOrders, getOrderAdmins, updateAdminOrderStatus } from '../service/api';
import OrderDetailDialog from '../components/OrderDetailDialog';

const PAGE_SIZE = 20;

const statusLabels = {
  pending: 'Pendiente',
  paid: 'Confirmado',
  cancelled: 'Cancelado'
};

const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  dateStyle: 'short',
  timeStyle: 'short'
});

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS'
});

export default function AdminOrdersPage() {
  const { admin, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [sellerFilter, setSellerFilter] = useState('');
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    if (!admin) return;

    let cancelled = false;

    getOrderAdmins()
      .then((result) => {
        if (!cancelled) setAdmins(result);
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message);
      });

    return () => {
      cancelled = true;
    };
  }, [admin]);

  useEffect(() => {
    if (!admin) return;

    let cancelled = false;
    setLoadingOrders(true);
    setError('');

    getAdminOrders({
      status: statusFilter || undefined,
      assignedAdminId: sellerFilter ? Number(sellerFilter) : undefined,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE
    })
      .then((result) => {
        if (!cancelled) {
          setOrders(result);
          setHasNextPage(result.length === PAGE_SIZE);
        }
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || 'No se pudieron cargar los pedidos.');
      })
      .finally(() => {
        if (!cancelled) setLoadingOrders(false);
      });

    return () => {
      cancelled = true;
    };
  }, [admin, statusFilter, sellerFilter, page]);

  const showOrderDetail = async (orderId) => {
    setSelectedOrder(null);
    setDetailError('');
    setLoadingDetail(true);

    try {
      setSelectedOrder(await getAdminOrder(orderId));
    } catch (requestError) {
      setDetailError(requestError.message || 'No se pudo cargar el detalle.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const changeOrderStatus = async (order, status) => {
    if (status === 'cancelled' && !window.confirm(`¿Cancelar el pedido de ${order.customer_name}?`)) {
      return;
    }

    setUpdatingOrderId(order.id);
    setError('');

    try {
      const updatedOrder = await updateAdminOrderStatus(order.id, status);
      setOrders((current) =>
        current.map((item) => (item.id === updatedOrder.id ? { ...item, status: updatedOrder.status } : item))
      );
    } catch (requestError) {
      setError(requestError.message || 'No se pudo actualizar el pedido.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (authLoading) {
    return <p className="p-6 text-center">Verificando sesión...</p>;
  }

  if (!admin) {
    return <p className="p-6 text-center">Esta página es solo para administradores.</p>;
  }

  const resetPage = (setter, value) => {
    setter(value);
    setPage(0);
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6">
      <h1 className="mb-5 text-2xl font-bold text-[#3163b3]">Pedidos</h1>

      <div className="mb-5 flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Estado
          <select
            value={statusFilter}
            onChange={(event) => resetPage(setStatusFilter, event.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2"
          >
            <option value="">Todos</option>
            <option value="pending">Pendiente</option>
            <option value="cancelled">Cancelado</option>
            <option value="paid">Confirmado</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Vendedor
          <select
            value={sellerFilter}
            onChange={(event) => resetPage(setSellerFilter, event.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-2"
          >
            <option value="">Todos</option>
            {admins.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {loadingOrders ? (
        <p className="py-8 text-center text-gray-600">Cargando pedidos...</p>
      ) : orders.length === 0 ? (
        <p className="py-8 text-center text-gray-600">No hay pedidos para estos filtros.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200 bg-white">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Vendedor</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="px-4 py-3 font-medium">{order.customer_name}</td>
                  <td className="px-4 py-3">{order.customer_phone}</td>
                  <td className="px-4 py-3">{dateFormatter.format(new Date(order.created_at))}</td>
                  <td className="px-4 py-3">{currencyFormatter.format(Number(order.total))}</td>
                  <td className="px-4 py-3">{statusLabels[order.status] ?? order.status}</td>
                  <td className="px-4 py-3">{order.assigned_admin_name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => showOrderDetail(order.id)}
                        aria-label={`Ver detalle del pedido ${order.id}`}
                        title="Ver detalle"
                        className="text-gray-700 hover:text-[#3163b3]"
                      >
                        <Eye size={18} aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => changeOrderStatus(order, 'paid')}
                        disabled={updatingOrderId === order.id || order.status === 'paid'}
                        aria-label={`Confirmar pedido ${order.id}`}
                        title="Confirmar"
                        className="text-green-700 disabled:opacity-40"
                      >
                        <Check size={18} aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => changeOrderStatus(order, 'cancelled')}
                        disabled={updatingOrderId === order.id || order.status === 'cancelled'}
                        aria-label={`Cancelar pedido ${order.id}`}
                        title="Cancelar"
                        className="text-red-700 disabled:opacity-40"
                      >
                        <X size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setPage((current) => Math.max(0, current - 1))}
          disabled={page === 0 || loadingOrders}
          className="rounded-md border border-gray-300 px-3 py-2 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-600">Página {page + 1}</span>
        <button
          type="button"
          onClick={() => setPage((current) => current + 1)}
          disabled={!hasNextPage || loadingOrders}
          className="rounded-md border border-gray-300 px-3 py-2 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
      {(loadingDetail || detailError || selectedOrder) && (
        <OrderDetailDialog
          order={selectedOrder}
          loading={loadingDetail}
          error={detailError}
          onClose={() => {
            setSelectedOrder(null);
            setDetailError('');
          }}
        />
      )}
    </main>
  );
}
