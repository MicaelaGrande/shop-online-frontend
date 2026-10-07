import { Pencil, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";

function CategoryAdminActions({
  category,
  pending,
  onEdit,
  onToggle,
  onDelete,
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={() => onEdit(category)}
        aria-label={`Editar ${category.name}`}
        title={`Editar ${category.name}`}
        disabled={pending}
      >
        <Pencil
          size={16}
          aria-hidden="true"
          className="text-[#3163b3]"
        />
      </button>

      <button
        type="button"
        onClick={() => onToggle(category)}
        aria-label={
          category.is_active
            ? `Desactivar ${category.name}`
            : `Activar ${category.name}`
        }
        title={category.is_active ? "Desactivar" : "Activar"}
        disabled={pending}
      >
        {category.is_active ? (
          <ToggleRight
            size={20}
            aria-hidden="true"
            className="text-green-600"
          />
        ) : (
          <ToggleLeft size={20} aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onDelete(category)}
        aria-label={`Eliminar definitivamente ${category.name}`}
        title="Eliminar definitivamente"
        disabled={pending}
      >
        <Trash2
          size={16}
          aria-hidden="true"
          className="text-red-600"
        />
      </button>
    </div>
  );
}

export default CategoryAdminActions;