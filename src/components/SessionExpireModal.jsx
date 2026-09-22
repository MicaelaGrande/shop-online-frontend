import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

function SessionExpiredModal() {
  const navigate = useNavigate();
  const { sessionExpired } = useAuth();

  if (!sessionExpired) {
    return null;
  }

  const goToLogin = () => {
    navigate("/login", { replace: true });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-2xl"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="session-expired-title"
      >
        <h2
          id="session-expired-title"
          className="mb-3 text-xl font-bold text-[#3163b3]"
        >
          Sesión vencida
        </h2>

        <p className="mb-6 text-gray-700">
          Tu sesión de administrador terminó. Iniciá sesión nuevamente para
          continuar.
        </p>

        <button
          type="button"
          onClick={goToLogin}
          className="w-full rounded-md bg-[#3163b3] px-5 py-3 font-semibold text-white hover:bg-[#244b8a]"
        >
          Volver a iniciar sesión
        </button>
      </div>
    </div>
  );
}

export default SessionExpiredModal;