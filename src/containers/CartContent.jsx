import { ShoppingBag } from "lucide-react";

export default function CartContent() {
  return (
    <div className="flex flex-col items-center justify-center p-8 h-full text-gray-500">
      <ShoppingBag className="w-16 h-16 mb-4 text-gray-300" />
      <p className="text-lg font-medium mb-2">Tu carrito está vacío</p>
      <p className="text-sm text-center mb-6">
        ¡Parece que aún no has agregado ningún vino delicioso!
      </p>
      
      <button className="px-6 py-2 bg-[#3163b3] text-white font-medium rounded-lg hover:bg-blue-800 transition-colors w-full">
        Ver Productos
      </button>
    </div>
  );
}