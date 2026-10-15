import { X } from "lucide-react";

const statusLabels = {
  pending: "Pendiente",
  paid: "Confirmado",
  cancelled: "Cancelado",
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export default function OrderDetailDialog({ order, loading, error, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="order-detail-title" className="text-xl font-bold text-[#3163b3]">
            Detalle del pedido
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            title="Cerrar"
            className="text-gray-600 hover:text-red-700"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {loading ? (
          <p className="py-6 text-center text-gray-600">Cargando detalle...</p>
        ) : error ? (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : order ? (
          <div className="space-y-4 text-sm text-gray-700">
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <dt className="font-semibold">Cliente</dt>
                <dd>{order.customer_name}</dd>
              </div>
              <div>
                <dt className="font-semibold">Teléfono</dt>
                <dd>{order.customer_phone}</dd>
              </div>
              <div>
                <dt className="font-semibold">Fecha</dt>
                <dd>{dateFormatter.format(new Date(order.created_at))}</dd>
              </div>
              <div>
                <dt className="font-semibold">Estado</dt>
                <dd>{statusLabels[order.status] ?? order.status}</dd>
              </div>
              <div>
                <dt className="font-semibold">Vendedor</dt>
                <dd>{order.assigned_admin_name}</dd>
              </div>
              <div>
                <dt className="font-semibold">Procesado por</dt>
                <dd>{order.processed_by_admin_name || "Sin procesar"}</dd>
              </div>
            </dl>

            {order.customer_address && (
              <p>
                <span className="font-semibold">Dirección: </span>
                {order.customer_address}
              </p>
            )}

            {order.comments && (
              <p>
                <span className="font-semibold">Comentarios: </span>
                {order.comments}
              </p>
            )}

            <div>
              <h3 className="mb-2 font-semibold">Productos</h3>
              <ul className="divide-y divide-gray-200 border-y">
                {order.items.map((item, index) => (
                  <li
                    key={`${item.name}-${index}`}
                    className="flex justify-between gap-4 py-2"
                  >
                    <span>
                      {item.quantity} x {item.name}
                    </span>
                    <span>
                      {currencyFormatter.format(Number(item.unit_price))} c/u
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="border-t pt-3 text-right text-base font-bold text-[#3163b3]">
              Total: {currencyFormatter.format(Number(order.total))}
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}