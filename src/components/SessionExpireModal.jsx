import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { logoutAdmin } from "../service/api";

function SessionExpiredModal() {
  const navigate = useNavigate();
  const { sessionExpired, logoutAdmin } = useAuth();

  if (!sessionExpired) {
    return null;
  }

  const goToLogin = async () => {
    await logoutAdmin();
    navigate("/login", { replace: true });
  };

  const goToHome = async () => {
    await logoutAdmin();
    navigate("/", { replace: true });
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
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={goToHome}
            className="w-full rounded-md border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Volver a la página principal
          </button>

          <button
            type="button"
            onClick={goToLogin}
            className="w-full rounded-md bg-[#3163b3] px-5 py-3 font-semibold text-white hover:bg-[#244b8a]"
          >
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default SessionExpiredModal;
