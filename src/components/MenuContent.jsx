import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, getInactiveCategories, deleteCategory, updateCategoryStatus } from '../service/api';
import { Pencil, Plus, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import CategoryDialog from './CategoryDialog';
import { useAuth } from '../contexts/useAuth';

export default function MenuContent({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingCategoryId, setPendingCategoryId] = useState(null);
  const [categoryActionError, setCategoryActionError] = useState('');

  function editCategory(category) {
    setCategoryToEdit(category);
    setDialogOpen(true);
  }
  function createNewCategory() {
    setCategoryToEdit(null);
    setDialogOpen(true);
  }

  async function toggleCategoryStatus(category) {
    setPendingCategoryId(category.id);
    setCategoryActionError('');

    try {
      const updatedCategory = await updateCategoryStatus(category.id, !category.is_active);
      setCategories((current) => current.map((item) => (item.id === updatedCategory.id ? updatedCategory : item)));
    } catch (requestError) {
      setCategoryActionError(requestError.message || 'No se pudo cambiar el estado.');
    } finally {
      setPendingCategoryId(null);
    }
  }

  async function removeCategory(category) {
    const confirmed = window.confirm(
      `¿Eliminar definitivamente "${category.name}"? Se quitará de los productos asociados y no se podrá recuperar.`
    );

    if (!confirmed) return;

    setPendingCategoryId(category.id);
    setCategoryActionError('');

    try {
      await deleteCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
    } catch (requestError) {
      setCategoryActionError(requestError.message || 'No se pudo eliminar la categoría.');
    } finally {
      setPendingCategoryId(null);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      setLoading(true);
      setError(false);

      try {
        const activeCategories = await getCategories();
        const inactiveCategories = admin ? await getInactiveCategories() : [];

        if (!cancelled) {
          const allCategories = [...activeCategories, ...inactiveCategories].sort((first, second) =>
            first.name.localeCompare(second.name)
          );
          setCategories(allCategories);
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

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, [admin]);
  const goHome = () => {
    onCategorySelect?.();
    navigate('/');
  };

  const selectCategory = (categoryId) => {
    onCategorySelect?.();
    navigate('/catalog', {
      state: { categoryToFilter: categoryId }
    });
  };

  const showAllProducts = () => {
    onCategorySelect?.();
    navigate('/catalog', {
      state: { categoryToFilter: null }
    });
  };

  return (
    <>
      <ul className="flex flex-col gap-4 p-6 text-lg font-medium text-gray-700">
        <li>
          <button
            onClick={goHome}
            className="w-full rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#3163b3] hover:text-white"
          >
            Inicio
          </button>
        </li>
        <li>
          <button
            onClick={showAllProducts}
            className="w-full rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#3163b3] hover:text-white"
          >
            Todos los productos
          </button>
        </li>

        {loading ? (
          <li className="text-sm text-gray-500">Cargando categorías...</li>
        ) : error ? (
          <li className="text-sm text-red-600">Ocurrió un error al cargar las categorías.</li>
        ) : categories.length === 0 ? (
          <li className="text-sm text-gray-500">No hay categorías disponibles.</li>
        ) : (
          categories.map((category) => (
            <div className="flex items-center justify-between gap-2 ">
              {category.is_active ? (
                <button
                  type="button"
                  onClick={() => selectCategory(category.id)}
                  className="w-full rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#3163b3] hover:text-white"
                >
                  {category.name}
                </button>
              ) : (
                <span className="w-full px-4 py-3 text-left text-gray-400">{category.name}</span>
              )}

              {admin && (
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => editCategory(category)}
                    aria-label={`Editar ${category.name}`}
                    title={`Editar ${category.name}`}
                    disabled={pendingCategoryId === category.id}
                  >
                    <Pencil size={16} aria-hidden="true" className="text-[#3163b3]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCategoryStatus(category)}
                    aria-label={category.is_active ? `Desactivar ${category.name}` : `Activar ${category.name}`}
                    title={category.is_active ? 'Desactivar' : 'Activar'}
                    disabled={pendingCategoryId === category.id}
                  >
                    {category.is_active ? (
                      <ToggleRight size={20} aria-hidden="true" className="text-green-600" />
                    ) : (
                      <ToggleLeft size={20} aria-hidden="true" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    aria-label={`Eliminar definitivamente ${category.name}`}
                    title="Eliminar definitivamente"
                    disabled={pendingCategoryId === category.id}
                  >
                    <Trash2 size={16} aria-hidden="true" className="text-red-600" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        {admin && (
          <>
            <li>
              <button
                type="button"
                onClick={createNewCategory}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#3163b3] hover:text-white"
              >
                <span>Nueva categoría</span>
                <Plus size={16} aria-hidden="true" />
              </button>
            </li>
          </>
        )}
      </ul>
      {admin && (
        <>
          {categoryActionError && (
            <p className="px-6 text-sm text-red-700" role="alert">
              {categoryActionError}
            </p>
          )}
          <CategoryDialog
            open={dialogOpen}
            category={categoryToEdit}
            onClose={() => setDialogOpen(false)}
            onSaved={(savedCategory) => {
              setCategories((current) => {
                const alreadyExists = current.some((item) => item.id === savedCategory.id);
                const updated = alreadyExists
                  ? current.map((item) => (item.id === savedCategory.id ? savedCategory : item))
                  : [...current, savedCategory];

                return updated.sort((first, second) => first.name.localeCompare(second.name));
              });
            }}
          />
        </>
      )}
    </>
  );
}
