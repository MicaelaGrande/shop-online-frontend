import { useEffect, useRef, useState } from 'react';
import { createCategory, updateCategory } from '../service/api';

export default function CategoryDialog({ open, onClose, onSaved, category = null }) {
  const dialogRef = useRef(null);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      setName(category?.name ?? '');
      setError('');
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, category?.name]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      setError('El nombre debe tener entre 2 y 50 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const savedCategory = category
        ? await updateCategory(category.id, trimmedName)
        : await createCategory(trimmedName);

      onSaved?.(savedCategory);
      onClose();
    } catch (requestError) {
      setError(requestError.message || 'No se pudo crear la categoría.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="category-dialog-title"
      onClose={onClose}
      className="m-auto w-[92vw] max-w-md rounded-lg border-0 p-0 shadow-xl backdrop:bg-black/50"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <h2 id="category-dialog-title" className="text-lg font-bold text-[#3163b3]">
          {category ? 'Editar categoría' : 'Nueva categoría'}
        </h2>

        <div>
          <label htmlFor="category-name" className="mb-1 block text-sm font-semibold text-[#3163b3]">
            Nombre
          </label>
          <input
            id="category-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={2}
            maxLength={50}
            required
            autoFocus
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {error && (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-md border border-gray-400 px-4 py-2 font-semibold text-gray-700 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || name.trim().length < 2}
            className="rounded-md bg-[#3163b3] px-4 py-2 font-semibold text-white disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : category ? 'Guardar cambios' : 'Crear categoría'}
          </button>
        </div>
      </form>
    </dialog>
  );
}
