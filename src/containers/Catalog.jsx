import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { deactivateProduct, getDeletedProducts, getProducts, restoreProduct } from '../service/api';
import { useAuth } from '../contexts/useAuth';

function Catalog() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const location = useLocation();
  const [error, setError] = useState(null);
  const { admin } = useAuth();
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [isUpdatingSelection, setIsUpdatingSelection] = useState(false);
  const [selectionError, setSelectionError] = useState('');
  const [productStatusFilter, setProductStatusFilter] = useState('active');
  const categoryId = location.state?.categoryToFilter;

  const hasCategory = categoryId !== undefined && categoryId !== null;
  const categoryFilteredProducts = hasCategory
    ? products.filter((product) => product.categories.some((category) => category.id === categoryId))
    : products;

  const filteredProducts = categoryFilteredProducts.filter((product) =>
    productStatusFilter === 'active' ? product.is_active : !product.is_active
  );

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError(false);

      try {
        const [activeProducts, inactiveProducts] = await Promise.all([
          getProducts(),
          admin ? getDeletedProducts() : Promise.resolve([])
        ]);

        if (!cancelled) {
          setProducts([...activeProducts, ...inactiveProducts]);
        }
      } catch {
        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, [admin]);

  const startSelection = () => {
    setSelectedProductIds([]);
    setSelectionMode(true);
  };

  const cancelSelection = () => {
    setSelectedProductIds([]);
    setSelectionMode(false);
  };

  const toggleProductSelection = (productId) => {
    setSelectedProductIds((currentIds) =>
      currentIds.includes(productId) ? currentIds.filter((id) => id !== productId) : [...currentIds, productId]
    );
  };
  const updateSelectedProductsStatus = async () => {
    if (selectedProductIds.length === 0) return;

    const shouldActivate = productStatusFilter === 'inactive';
    const action = shouldActivate ? restoreProduct : deactivateProduct;
    const actionLabel = shouldActivate ? 'Activar' : 'Desactivar';
    const confirmed = window.confirm(`¿${actionLabel} ${selectedProductIds.length} productos seleccionados?`);

    if (!confirmed) return;

    setIsUpdatingSelection(true);
    setSelectionError('');

    const results = await Promise.allSettled(selectedProductIds.map((productId) => action(productId)));

    const successfulIds = selectedProductIds.filter((_, index) => results[index].status === 'fulfilled');
    const failedIds = selectedProductIds.filter((_, index) => results[index].status === 'rejected');

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        successfulIds.includes(product.id) ? { ...product, is_active: shouldActivate } : product
      )
    );
    setSelectedProductIds(failedIds);

    if (failedIds.length === 0) {
      cancelSelection();
    } else {
      setSelectionError(
        `Se ${shouldActivate ? 'activaron' : 'desactivaron'} ${successfulIds.length}; no se pudieron actualizar ${failedIds.length}.`
      );
    }

    setIsUpdatingSelection(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-6 pb-12">
      {admin && (
        <>
          <div className="w-full py-2 px-4 md:py-3 md:px-6 bg-[#3163b3]/20 rounded-2xl overflow-hidden shadow-md mb-6">
            <div className=" flex flex-wrap items-center justify-end gap-3">
              {selectionMode ? (
                <>
                  <button
                    type="button"
                    onClick={cancelSelection}
                    className="rounded-md border border-gray-400 px-4 py-2 font-semibold text-gray-700 hover:bg-white/60"
                  >
                    Cancelar selección
                  </button>
                  <button
                    type="button"
                    onClick={updateSelectedProductsStatus}
                    disabled={selectedProductIds.length === 0 || isUpdatingSelection}
                    className="rounded-md bg-[#3163b3] px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUpdatingSelection
                      ? 'Actualizando...'
                      : `${productStatusFilter === 'inactive' ? 'Activar' : 'Desactivar'} seleccionados (${selectedProductIds.length})`}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/products/new"
                    className="rounded-md bg-[#3163b3] px-4 py-2 font-semibold text-white hover:bg-[#284f91]"
                  >
                    Crear producto
                  </Link>
                  <button
                    type="button"
                    onClick={startSelection}
                    className="rounded-md border border-[#3163b3] px-4 py-2 font-semibold text-[#3163b3] hover:bg-[#3163b3] hover:text-white"
                  >
                    Seleccionar productos
                  </button>
                </>
              )}
            </div>
          </div>
          {admin && (
            <div
              className="mb-4 flex items-center gap-2 text-sm font-semibold md:text-base"
              role="group"
              aria-label="Filtrar productos por estado"
            >
              <button
                type="button"
                aria-pressed={productStatusFilter === 'active'}
                onClick={() => setProductStatusFilter('active')}
                className={productStatusFilter === 'active' ? 'text-[#3163b3]' : 'text-gray-500 hover:text-[#3163b3]'}
              >
                Activos
              </button>

              <span className="text-gray-400" aria-hidden="true">
                |
              </span>

              <button
                type="button"
                aria-pressed={productStatusFilter === 'inactive'}
                onClick={() => setProductStatusFilter('inactive')}
                className={productStatusFilter === 'inactive' ? 'text-[#3163b3]' : 'text-gray-500 hover:text-[#3163b3]'}
              >
                Inactivos
              </button>
            </div>
          )}
        </>
      )}
      {/* SECCIÓN 2 - Productos */}
      <div className="w-full">
        {error ? (
          <p className="text-center text-xl font-semibold text-red-600">Ocurrió un error al cargar los productos.</p>
        ) : loading ? (
          <p className="text-center text-xl font-semibold text-[#3163b3]">Cargando productos...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="text-center text-xl font-semibold text-[#3163b3]">No hay productos en esta categoría.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selectionMode={selectionMode}
                  selected={selectedProductIds.includes(product.id)}
                  onToggleSelection={() => toggleProductSelection(product.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Catalog;
