import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const USE_BACKEND = false;

const mockCategories = [
  { id: 1, name: "Ropa Men" },
  { id: 2, name: "Oversize" },
  { id: 3, name: "Calzado" },
  { id: 4, name: "Urbano" },
  { id: 999, name: "Categoría vacía" },
];

export default function MenuContent({ onCategorySelect }) {
  const [categories, setCategories] = useState(mockCategories);
  const [loading, setLoading] = useState(USE_BACKEND);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!USE_BACKEND) {
      return;
    }

    fetch("http://localhost:8000/products/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudieron cargar las categorías");
        }

        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  return (
    <ul className="flex flex-col gap-4 p-6 text-lg font-medium text-gray-700">
      <li>
        <button
          onClick={showAllProducts}
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
        <li className="text-sm text-red-600">
          Ocurrió un error al cargar las categorías.
        </li>
      ) : categories.length === 0 ? (
        <li className="text-sm text-gray-500">
          No hay categorías disponibles.
        </li>
      ) : (
        categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => selectCategory(category.id)}
              className="w-full rounded-lg px-4 py-3 text-left transition-colors hover:bg-[#3163b3] hover:text-white"
            >
              {category.name}
            </button>
          </li>
        ))
      )}
    </ul>
  );
}