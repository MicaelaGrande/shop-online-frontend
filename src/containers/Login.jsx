import { useState } from "react";
import { loginAdmin } from "../service/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let valid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("No es un email válido");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.length < 12) {
      setPasswordError("La contraseña debe contener al menos 12 caracteres");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    if (!validate()) return;
    setIsLoading(true);

    try {
      await loginAdmin(email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        setError("No se pudo conectar con el servidor");
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="
        grid
        min-h-dvh
        grid-rows-[5%_75%_20%]
        sm:grid-rows-[8%_70%_22%]
        md:grid-rows-[5%_60%_35%]
        lg:grid-rows-[12%_55%_33%]
        bg-[url('/Mixshop.png')]
        bg-cover
        bg-center
        bg-no-repeat
      "
    >
      {/* FILA 1 */}
      <div></div>

      <div className="flex flex-col items-center justify-center gap-2 mt-8">
        <form noValidate
          onSubmit={handleSubmit}
          className="flex flex-col  items-center w-[calc(100%-2rem)] max-w-md rounded-xl bg-[#DDE8F3] space-y-3 p-5 shadow-lg sm:p-6"
        >
          <div className="flex flex-col items-center justify-center gap-0">
            {/* Logo */}

            <img
              src="/logoSinFondo.png"
              alt="logo Shop"
              draggable="false"
              className="
                w-[clamp(5rem,20vw,10rem)]
                aspect-square
                object-contain
                shrink-0
                select-none
              "
            />
            {/* Título */}
            <h1 className="font-spartan font-black text-[clamp(1.5rem,6vw,3.5rem)] tracking-wide text-[#035596]">
              MIXSHOP
            </h1>
          </div>
          <label
            htmlFor="email"
            className="font-spartan font-black text-[#0a3d64] text-base sm:text-l md:text-xl lg:text-2xl tracking-wide"
          >
            Correo electronico:
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="
                        w-full rounded-md border border-slate-300
                        bg-white px-3 py-2 text-base text-slate-900
                        outline-none
                        focus:border-[#0a3d64] focus:ring-2 focus:ring-[#0a3d64]/30
                      "
          ></input>
          {emailError && (
            <p className="w-full text-center text-sm font-medium text-red-600" role="alert">
              {emailError}
            </p>
          )}
          <label
            htmlFor="password"
            className="font-spartan font-black text-[#0a3d64] text-base sm:text-l md:text-xl lg:text-2xl tracking-wide"
          >
            Contraseña:
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="
              w-full
              rounded-md
              border
              border-slate-300
              bg-white
              px-3
              py-2
              text-base
              text-slate-900
              outline-none
              focus:border-[#0a3d64]
              focus:ring-2
              focus:ring-[#0a3d64]/30
            "
          />

          {passwordError && (
            <p className="w-full text-center text-sm font-medium text-red-600" role="alert">
              {passwordError}
            </p>
          )}
          {error && (
            <div
              className="fixed
  inset-0
  z-[9999]
  flex
  min-h-screen
  w-screen
  items-center
  justify-center
 bg-black/40
  px-4"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="error-title"
            >
              <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
                <h2
                  id="error-title"
                  className="text-lg font-bold text-[#0a3d64]"
                >
                  Ocurrió un problema
                </h2>

                <p className="mt-3 text-sm text-slate-600">{error}</p>

                <button
                  type="button"
                  onClick={() => setError("")}
                  className="mt-5 rounded-lg bg-[#0a3d64] px-5 py-2 font-bold text-white"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="
              mt-8
              w-full
              rounded-lg
              bg-[#0a3d64]
              px-6
              py-3
              text-sm
              font-bold
              text-white
              transition-transform
              duration-150
              hover:scale-[1.02]
              active:scale-95
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:w-auto
              sm:px-8
              sm:text-base
              md:px-12
              md:py-4
              md:text-lg
            "
          >
            {isLoading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
