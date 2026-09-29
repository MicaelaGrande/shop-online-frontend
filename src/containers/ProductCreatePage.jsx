import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductEditForm from '../components/ProductEditForm';
import { createProduct, getCategories, uploadProductMedia } from '../service/api';
import { useAuth } from '../contexts/useAuth';
import ProductGallery from '../components/ProductGallery';

const emptyProduct = {
  name: '',
  category_ids: [],
  description: '',
  price: '',
  is_on_sale: false,
  sale_price: ''
};

function ProductCreatePage() {
  const { admin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [draftProduct, setDraftProduct] = useState(emptyProduct);
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [newMedia, setNewMedia] = useState([]);
  const [mediaToDelete, setMediaToDelete] = useState([]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setError('No se pudieron cargar las categorías.'));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const price = Number(draftProduct.price);
    const salePrice = Number(draftProduct.sale_price);

    if (draftProduct.name.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.');
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError('El precio debe ser mayor que cero.');
      return;
    }

    if (draftProduct.is_on_sale && (!Number.isFinite(salePrice) || salePrice <= 0 || salePrice >= price)) {
      setError('El precio de oferta debe ser mayor que cero y menor que el precio normal.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const product = await createProduct({
        name: draftProduct.name.trim(),
        category_ids: draftProduct.category_ids,
        description: draftProduct.description,
        price,
        is_on_sale: draftProduct.is_on_sale,
        sale_price: draftProduct.is_on_sale ? salePrice : null
      });

      try {
        for (const media of newMedia) {
          await uploadProductMedia(product.id, media.file);
        }
      } catch (uploadError) {
        newMedia.forEach((media) => URL.revokeObjectURL(media.previewUrl));
        window.alert(
          `El producto se creó, pero alguna imagen no se pudo subir. Puedes ir al producto y completar las imágenes desde Editar. Detalle: ${uploadError.message}`
        );
        navigate(`/products/${product.id}`);
        return;
      }

      newMedia.forEach((media) => URL.revokeObjectURL(media.previewUrl));
      navigate(`/products/${product.id}`);
    } catch (requestError) {
      setError(requestError.message || 'No se pudo crear el producto.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return <p className="p-6 text-center">Verificando sesión...</p>;
  }

  if (!admin) {
    return <p className="p-6 text-center">Esta página es solo para administradores.</p>;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 md:py-10">
      <h1 className="mb-6 text-2xl font-bold text-[#3163b3]">Crear producto</h1>

      {error && (
        <p className="mb-4 text-sm font-semibold text-red-700" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ProductGallery
            product={{ name: draftProduct.name || 'Nuevo producto', media: [] }}
            editMode
            mediaToDelete={mediaToDelete}
            setMediaToDelete={setMediaToDelete}
            newMedia={newMedia}
            setNewMedia={setNewMedia}
          />

          <ProductEditForm draftProduct={draftProduct} setDraftProduct={setDraftProduct} categories={categories} />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/catalog')}
            disabled={isSaving}
            className="rounded-md border border-gray-400 px-4 py-2 font-semibold text-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-[#3163b3] px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {isSaving ? 'Creando...' : 'Crear producto'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductCreatePage;
