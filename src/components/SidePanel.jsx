import { X } from "lucide-react";

export default function SidePanel({
  isOpen,
  onClose,
  title,
  side = "left",
  children,
}) {
  // segun el lado ("left" o "rigth"), preparamos las clases de Tailwind
  const panelClasses =
    side === "left"
      ? `left-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
      : `right-0 ${isOpen ? "translate-x-0" : "translate-x-full"}`;
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity cursor-pointer"
          onClick={onClose}
        />
      )}

      {/* Cajón blanco que se desliza */}
      <div
        className={`fixed top-0 h-full w-64 md:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${panelClasses}`}
      >
        {/* Encabezado: Título y botón cerrar */}
        <div className="p-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#3163b3]">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-md"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto h-[calc(100%-73px)]">{children}</div>
      </div>
    </>
  );
}
