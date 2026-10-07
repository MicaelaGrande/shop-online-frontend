import { LogOut, Plus } from "lucide-react";

function AdminMenuActions({ onCreateCategory, onLogout }) {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onCreateCategory}
        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left hover:bg-[#3163b3] hover:text-white"
      >
        <span>Nueva categoría</span>
        <Plus size={16} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-red-600 hover:bg-red-100"
      >
        <span>Cerrar sesión</span>
        <LogOut size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default AdminMenuActions;
