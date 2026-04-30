export default function MenuContent() {
  return (
    <ul className="flex flex-col p-6 gap-6 text-lg text-gray-700 font-medium">
      <li className="hover:text-[#3163b3] cursor-pointer transition-colors">
        🏠 Inicio
      </li>
      <li className="hover:text-[#3163b3] cursor-pointer transition-colors">
        🍷 Todos los Vinos
      </li>
      <li className="hover:text-[#3163b3] cursor-pointer transition-colors">
        ✨ Ofertas
      </li>
      <li className="hover:text-[#3163b3] cursor-pointer transition-colors">
        ℹ️ Sobre Nosotros
      </li>
      <li className="hover:text-[#3163b3] cursor-pointer transition-colors">
        📞 Contacto
      </li>
    </ul>
  );
}