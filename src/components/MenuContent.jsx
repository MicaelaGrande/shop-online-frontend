import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../service/api";


export default function MenuContent({ onCategorySelect }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  getCategories()
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