import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../service/api";
import ProductGallery from "../components/ProductGallery";
import { Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../contexts/useAuth";

function ProductPage() {
  const { productId } = useParams();
  const { admin, loading: authLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [draftProduct, setDraftProduct] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState([]);
  const [newMedia, setNewMedia] = useState([]);

  useEffect(() => {
    getProduct(productId)
      .then((data) => {
        setProduct(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return <p>Cargando producto...</p>;
  }

  if (error || !product) {
    return <p>No se pudo cargar el producto.</p>;
  }
  const startEditing = () => {
    setDraftProduct({
      name: product.name,
      description: product.description ?? "",
      price: product.price,
      is_on_sale: product.is_on_sale,
      sale_price: product.sale_price ?? "",
    });

    setEditMode(true);
  };

  const cancelEditing = () => {
    setDraftProduct(null);
    setMediaToDelete([]);
    setNewMedia([]);
    setEditMode(false);
  };
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10">
      <div className="mb-4 flex justify-end gap-2">
        {!authLoading && admin && (
          <>
            {editMode ? (
              <>
                {" "}
                <button
                  type="button"
                  className="rounded-md bg-[#3163b3] px-4 py-2 font-semibold text-white transition hover:bg-[#244b8a]"
                >
                  Confirmar cambios
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-md border border-gray-500 px-4 py-2 font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={startEditing}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#3163b3] shadow-md transition hover:bg-white"
                  aria-label="Editar producto"
                  title="Editar producto"
                >
                  <Pencil className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-red-600 shadow-md transition hover:bg-white"
                  aria-label="Eliminar producto"
                  title="Eliminar producto"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </>
            )}
          </>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        <ProductGallery
          product={product}
          editMode={editMode}
          mediaToDelete={mediaToDelete}
          setMediaToDelete={setMediaToDelete}
          newMedia={newMedia}
          setNewMedia={setNewMedia}
        />
        {editMode ? (
          <div className="flex w-full flex-col gap-4 self-start rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md md:p-6">
            <label className="flex flex-col gap-1">
              <span className="font-semibold text-[#3163b3]">Título</span>

              <input
                type="text"
                value={draftProduct.name}
                onChange={(event) =>
                  setDraftProduct({
                    ...draftProduct,
                    name: event.target.value,
                  })
                }
                className="rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-800"
              />
            </label>

            {product.categories?.length > 0 && (
              <p className="text-sm font-semibold text-gray-600">
                {product.categories
                  .map((category) => category.name)
                  .join(" • ")}
              </p>
            )}

            <label className="flex flex-col gap-1">
              <span className="font-semibold text-[#3163b3]">Descripción</span>

              <textarea
                value={draftProduct.description}
                onChange={(event) =>
                  setDraftProduct({
                    ...draftProduct,
                    description: event.target.value,
                  })
                }
                className="min-h-32 rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-800"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="font-semibold text-[#3163b3]">Precio</span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={draftProduct.price}
                onChange={(event) =>
                  setDraftProduct({
                    ...draftProduct,
                    price: event.target.value,
                  })
                }
                className="rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-800"
              />
            </label>
            <label className="flex items-center gap-3 font-semibold text-[#3163b3]">
              <input
                type="checkbox"
                checked={draftProduct.is_on_sale}
                onChange={(event) =>
                  setDraftProduct({
                    ...draftProduct,
                    is_on_sale: event.target.checked,
                    sale_price: event.target.checked
                      ? draftProduct.sale_price
                      : "",
                  })
                }
                className="h-5 w-5 accent-[#3163b3]"
              />
              Activar oferta
            </label>
            {draftProduct.is_on_sale && (
              <label className="flex flex-col gap-1">
                <span className="font-semibold text-[#3163b3]">
                  Precio de oferta
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={draftProduct.sale_price}
                  onChange={(event) =>
                    setDraftProduct({
                      ...draftProduct,
                      sale_price: event.target.value,
                    })
                  }
                  className="rounded-md border border-gray-300 bg-white/70 px-3 py-2 text-gray-800"
                />
              </label>
            )}
          </div>
        ) : (
          <div className="flex w-full flex-col gap-4 self-start rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md md:p-6">
            <h1 className="text-2xl font-bold text-[#3163b3] md:text-4xl">
              {product.name}
            </h1>

            {product.categories?.length > 0 && (
              <p className="text-sm font-semibold text-gray-600 md:text-base">
                {product.categories
                  .map((category) => category.name)
                  .join(" • ")}
              </p>
            )}

            <p className="text-base text-gray-700 md:text-lg">
              {product.description}
            </p>

            <p className="text-2xl font-bold text-[#3163b3]">
              ${product.price}
            </p>

            <button
              type="button"
              className="w-full rounded-md bg-[#3163b3] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#244b8a] md:w-fit"
            >
              Agregar al carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
