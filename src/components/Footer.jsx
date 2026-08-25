import { Instagram, Phone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Footer() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const navigate = useNavigate();
  const showProducts = async (category = null) => {
    navigate("/catalog", { state: { categoryToFilter: category } });
  };

  return (
    <div className="bg-[#3163b3] text-white py-12 px-6 mt-12 w-full shrink-0 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {/* Columna 1: Menú Info */}
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-xl mb-4">Menu</h3>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-white/70 hover:text-white text-sm font-medium underline transition-colors"
          >
            Volver al inicio
          </button>
          <button
            onClick={() => setAboutOpen(true)}
            className="text-white/70 hover:text-white text-sm font-medium underline transition-colors"
          >
            Quiénes somos
          </button>
          <button
            onClick={() => showProducts()}
            className="text-white/70 hover:text-white text-sm font-medium underline transition-colors"
          >
            Catálogo
          </button>
          {/* <button className="text-white/70 hover:text-white text-sm font-medium underline transition-colors">
            Pedidos y entregas
          </button> */}
        </div>

        {/* Columna 2: Redes (Instagram) */}
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-xl mb-4">Seguinos</h3>
          <a
            href="https://instagram.com/mixshop.gp"
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Instagram className="w-4 h-4" /> mixshop.gp
          </a>
        </div>

        {/* Columna 3: Contacto (WhatsApp) */}
        <div className="flex flex-col items-center">
          <h3 className="font-bold text-xl mb-3">Contacto</h3>
          <a
            href="https://wa.me/5493516566498?text=Hola%20Mica!%20Te%20escribo%20desde%20la%20tienda%20online,%20me%20gustaria%20hacer%20una%20consulta"
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white transition-colors flex items-center justify-center gap-2 mb-2"
          >
            <Phone className="w-4 h-4" />
            Mica: 3516566498
          </a>
          <a
            href="https://wa.me/5493516807168?text=Hola%20Norma!%20Te%20escribo%20desde%20la%20tienda%20online,%20me%20gustaria%20hacer%20una%20consulta"
            target="_blank"
            rel="noreferrer"
            className="text-white/80 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Norma : 3516807168
          </a>
        </div>
      </div>
      {aboutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setAboutOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="about-title"
            className="w-full max-w-md rounded-xl bg-white p-6 text-gray-700 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>Quiénes somos</h2>

            <div className="space-y-4 text-justify text-sm leading-relaxed">
              <p>
                ¡Hola! Somos Mixshop, un emprendimiento familiar hecho con amor
                de madre a hija. Nuestra idea nació para acercarte un bazar
                lleno de sorpresas y soluciones para todos los días.
              </p>

              <p>
                Navegá por nuestra tienda online como si estuvieras recorriendo
                las góndolas de tu negocio de confianza: encontrá variedad, los
                mejores precios y una atención súper cálida, sin moverte de tu
                casa.
              </p>
            </div>
            <button
              onClick={() => setAboutOpen(false)}
              className="mt-6 rounded-lg bg-[#0a3d64] px-5 py-2.5 font-bold text-white transition hover:bg-[#3163b3]"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Footer;
