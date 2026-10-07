import { useEffect, useState } from "react";
import { createOrder, getOrderAdmins } from "../service/api";
import { useCart } from "../contexts/useCart";

export default function CheckoutForm({ items, onClose }) {
  const { clearCart } = useCart();
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    comments: "",
  });

  useEffect(() => {
    let cancelled = false;

    getOrderAdmins()
      .then((availableAdmins) => {
        if (!cancelled) setAdmins(availableAdmins);
      })
      .catch((requestError) => {
        if (!cancelled) {
          setError(requestError.message || "No se pudieron cargar los administradores.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingAdmins(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const createdOrder = await createOrder({
        customer_name: form.customer_name.trim(),
        customer_phone: form.customer_phone.trim(),
        customer_address: form.customer_address.trim() || null,
        comments: form.comments.trim() || null,
        assigned_admin_id: Number(selectedAdminId),
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });

      clearCart();
      setOrderId(createdOrder.id);
    } catch (requestError) {
      setError(requestError.message || "No se pudo crear el pedido.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl"
      >
        {orderId ? (
          <div className="text-center">
            <h2 id="checkout-title" className="text-xl font-bold text-[#3163b3]">
              Pedido creado
            </h2>
            <p className="my-4 text-gray-700">
              Tu pedido se registro correctamente.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-[#3163b3] px-5 py-3 font-semibold text-white"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <h2 id="checkout-title" className="mb-5 text-xl font-bold text-[#3163b3]">
              Datos del pedido
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Nombre
                <input
                  required
                  minLength={2}
                  maxLength={80}
                  value={form.customer_name}
                  onChange={(event) =>
                    setForm({ ...form, customer_name: event.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Teléfono
                <input
                  required
                  minLength={5}
                  maxLength={50}
                  type="tel"
                  value={form.customer_phone}
                  onChange={(event) =>
                    setForm({ ...form, customer_phone: event.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Dirección (opcional)
                <input
                  maxLength={255}
                  value={form.customer_address}
                  onChange={(event) =>
                    setForm({ ...form, customer_address: event.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Comentarios (opcional)
                <textarea
                  value={form.comments}
                  onChange={(event) =>
                    setForm({ ...form, comments: event.target.value })
                  }
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                  rows={3}
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Administrador
                <select
                  required
                  value={selectedAdminId}
                  onChange={(event) => setSelectedAdminId(event.target.value)}
                  disabled={loadingAdmins || admins.length === 0}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                >
                  <option value="" disabled>
                    {loadingAdmins ? "Cargando administradores..." : "Seleccioná un administrador"}
                  </option>
                  {admins.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} ({admin.whatsapp_phone})
                    </option>
                  ))}
                </select>
              </label>

              {admins.length === 0 && !loadingAdmins && (
                <p className="text-sm text-red-700" role="alert">
                  No hay administradores disponibles para asignar el pedido.
                </p>
              )}

              {error && (
                <p className="text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-700"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  disabled={submitting || loadingAdmins || admins.length === 0}
                  className="rounded-md bg-[#3163b3] px-4 py-2 font-semibold text-white disabled:opacity-50"
                >
                  {submitting ? "Enviando..." : "Confirmar pedido"}
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}