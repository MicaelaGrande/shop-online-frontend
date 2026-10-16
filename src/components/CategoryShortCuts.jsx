import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tags, ShoppingBag, Laptop, Blocks, Zap, Shirt, Coffee, House } from 'lucide-react';

import { getCategories } from '../service/api';

export default function CategoryShortcuts() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const categoryIcons = {
    tags: Tags,
    'shopping-bag': ShoppingBag,
    laptop: Laptop,
    blocks: Blocks,
    zap: Zap,
    shirt: Shirt,
    coffee: Coffee,
    house: House
  };

  useEffect(() => {
    let cancelled = false;

    getCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectCategory = (categoryId) => {
    navigate('/catalog', {
      state: { categoryToFilter: categoryId }
    });
  };

  if (loading) {
    return <p className="py-4 text-center text-[#3163b3]">Cargando categorías...</p>;
  }

  if (error) {
    return (
      <p role="alert" className="py-4 text-center text-red-600">
        No se pudieron cargar las categorías.
      </p>
    );
  }

  if (categories.length === 0) {
    return <p className="py-4 text-center text-gray-500">No hay categorías disponibles.</p>;
  }

  return (
    <nav aria-label="Categorías" className="my-6">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.map((category) => {
          const Icon = categoryIcons[category.icon_key] ?? Tags;

          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => selectCategory(category.id)}
                className="flex w-full flex-col items-center gap-2 py-3 font-semibold text-[#3163b3] hover:text-[#0a3d64]"
              >
                <Icon size={30} aria-hidden="true" />
                <span className="text-center">{category.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
