import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCategories,
  getInactiveCategories,
  deleteCategory,
  updateCategoryStatus,
} from "../service/api";
import CategoryAdminActions from "./CategoryAdminActions";
import AdminMenuActions from "./AdminMenuActions";
import CategoryDialog from "./CategoryDialog";
import { useAuth } from "../contexts/useAuth";

export default function MenuContent({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { admin, logoutAdmin } = useAuth();
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pendingCategoryId, setPendingCategoryId] = useState(null);
  const [categoryActionError, setCategoryActionError] = useState("");

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
    setCategoryActionError("");

    try {
      const updatedCategory = await updateCategoryStatus(
        category.id,
        !category.is_active
      );
      setCategories((current) =>
        current.map((item) =>
          item.id === updatedCategory.id ? updatedCategory : item
        )
      );
    } catch (requestError) {
      setCategoryActionError(
        requestError.message || "No se pudo cambiar el estado."
      );
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
    setCategoryActionError("");

    try {
      await deleteCategory(category.id);
      setCategories((current) =>
        current.filter((item) => item.id !== category.id)
      );
    } catch (requestError) {
      setCategoryActionError(
        requestError.message || "No se pudo eliminar la categoría."
      );
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
          const allCategories = [
            ...activeCategories,
            ...inactiveCategories,
          ].sort((first, second) => first.name.localeCompare(second.name));
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
    navigate("/");
  };

  const selectCategory = (categoryId) => {
    onCategorySelect?.();
    navigate("/catalog", {
      state: { categoryToFilter: categoryId },
    });
  };

  const showAllProducts = () => {
    onCategorySelect?.();
    navigate("/catalog", {
      state: { categoryToFilter: null },
    });
  };
  const handleLogout = async () => {
    await logoutAdmin();
    onCategorySelect?.();
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="flex h-full min-h-0 flex-col">
        <div className="shrink-0 border-b border-gray-200 p-4">
          <button
            type="button"
            onClick={goHome}
            className="w-full rounded-lg px-4 py-3 text-left hover:bg-[#3163b3] hover:text-white"
          >
            Inicio
          </button>

          <button
            type="button"
            onClick={showAllProducts}
            className="mt-2 w-full rounded-lg px-4 py-3 text-left hover:bg-[#3163b3] hover:text-white"
          >
            Todos los productos
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-4 p-6 text-lg font-medium text-gray-700">
            {loading ? (
              <li className="text-sm text-gray-500">Cargando categorías...</li>
            ) : error ? (
              <li className="text-sm text-red-600">
                Ocurrió un error al cargar las categorías.
              </li>
            ) : categories.length === 0 ? (
              <li className="text-sm text-gray-500">
                No hay categorías disponibles.
              </li>
            ) : (
              categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between gap-2"
                >
                  {category.is_active ? (
                    <button
                      type="button"
                      onClick={() => selectCategory(category.id)}
                      className="w-full rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#3163b3] hover:text-white"
                    >
                      {category.name}
                    </button>
                  ) : (
                    <span className="w-full px-4 py-3 text-left text-gray-400">
                      {category.name}
                    </span>
                  )}

                  {admin && (
                    <CategoryAdminActions
                      category={category}
                      pending={pendingCategoryId === category.id}
                      onEdit={editCategory}
                      onToggle={toggleCategoryStatus}
                      onDelete={removeCategory}
                    />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
        {admin && (
          <div className="shrink-0 border-t border-gray-200 bg-white p-4">
            <AdminMenuActions
              onCreateCategory={createNewCategory}
              onLogout={handleLogout}
            />
          </div>
        )}
      </div>
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
                const alreadyExists = current.some(
                  (item) => item.id === savedCategory.id
                );
                const updated = alreadyExists
                  ? current.map((item) =>
                      item.id === savedCategory.id ? savedCategory : item
                    )
                  : [...current, savedCategory];

                return updated.sort((first, second) =>
                  first.name.localeCompare(second.name)
                );
              });
            }}
          />
        </>
      )}
    </>
  );
}
