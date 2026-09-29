import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCategories, getProduct, updateProductWithMedia } from '../service/api';
import ProductGallery from '../components/ProductGallery';
import ProductEditForm from '../components/ProductEditForm';
import ProductPrice from '../components/ProductPrice';
import { Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/useAuth';

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setSaveError('No se pudieron cargar las categorías.'));
  }, []);

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
      category_ids: product.categories.map((category) => category.id),
      description: product.description ?? '',
      price: product.price,
      is_on_sale: product.is_on_sale,
      sale_price: product.sale_price ?? ''
    });

    setEditMode(true);
  };
  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveError('');

    try {
      const updatedProduct = await updateProductWithMedia(
        productId,
        {
          name: draftProduct.name,
          category_ids: draftProduct.category_ids,
          description: draftProduct.description,
          price: draftProduct.price,
          is_on_sale: draftProduct.is_on_sale,
          sale_price: draftProduct.is_on_sale ? draftProduct.sale_price : null
        },
        mediaToDelete,
        newMedia
      );

      setProduct(updatedProduct);

      newMedia.forEach((media) => {
        URL.revokeObjectURL(media.previewUrl);
      });

      setDraftProduct(null);
      setMediaToDelete([]);
      setNewMedia([]);
      setEditMode(false);
    } catch (error) {
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };
  const cancelEditing = () => {
    setDraftProduct(null);
    setMediaToDelete([]);
    setNewMedia([]);
    setEditMode(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-10">
      <div className="flex justify-end gap-2">
        {!authLoading && admin && (
          <>
            {editMode ? (
              <>
                {' '}
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="rounded-md bg-[#3163b3] px-4 py-2 font-semibold text-white transition hover:bg-[#244b8a]"
                >
                  {isSaving ? 'Guardando...' : 'Confirmar cambios'}
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
      {saveError && (
        <p className="text-sm font-semibold text-red-600" role="alert">
          {saveError}
        </p>
      )}
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
          <ProductEditForm
            product={product}
            draftProduct={draftProduct}
            setDraftProduct={setDraftProduct}
            categories={categories}
          />
        ) : (
          <div className=" relative flex w-full flex-col gap-4 self-start rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md md:p-6">
            <h1 className=" pr-14 text-2xl font-bold text-[#3163b3] md:text-4xl">{product.name}</h1>

            {product.categories?.length > 0 && (
              <p className="text-sm font-semibold text-gray-600 md:text-base">
                {product.categories.map((category) => category.name).join(' • ')}
              </p>
            )}

            <p className="text-base text-gray-700 md:text-lg">{product.description}</p>

            <ProductPrice price={product.price} isOnSale={product.is_on_sale} salePrice={product.sale_price} />

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
