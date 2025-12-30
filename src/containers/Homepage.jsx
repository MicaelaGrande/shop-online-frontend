import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const showProducts = async () => {
    navigate("/principalPage");
  };


  return (
    <div
      className="
        grid
        grid-rows-[5%_75%_20%]
        sm:grid-rows-[8%_70%_22%]
        md:grid-rows-[5%_60%_35%]
        lg:grid-rows-[12%_55%_33%]
        h-screen
        overflow-hidden
        bg-[url('/Mixshop.png')]
        bg-cover
        bg-center
        bg-no-repeat
      "
    >
      {/* FILA 1 */}
      <div></div>

      <div className="flex flex-col items-center justify-center gap-2 mt-8">
        {/* Logo */}
        <img
          src="/logoSinFondo.png"
          alt="logo Shop"
          draggable="false"
          className="
      w-full
      max-w-[200px]
      sm:max-w-[250px]
      md:max-w-[300px]
      lg:max-w-[350px]
      select-none
    "
        />

        {/* Título */}

        <h1
          className="text-5xl sm:text-4xl md:text-6xl lg:text-8xl text-[#0a3d64]"
          style={{ fontFamily: "Brittanny" }}
        >
          {" "}
          Somos
        </h1>
        <h1 className="font-spartan font-black text-[#035596] text-5xl sm:text-4xl md:text-6xl lg:text-8xl tracking-wide">
          MIXSHOP
        </h1>

        <button
          className="
              mt-8
              w-full sm:w-auto px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 font-bold
              text-sm sm:text-base md:text-lg
              text-white bg-[#0a3d64] rounded-lg
              transition-transform duration-150
              hover:scale-105 
              active:scale-95
              cursor-pointer
              will-change-transform
            "
            onClick={showProducts}

        >
          ¡Ver productos!
        </button>
      </div>
      {/* FILA 3 */}
      <div className="flex items-start justify-center px-4 sm:px-8 pt-2 sm:pt-4 md:pt-6"></div>
    </div>
  );
}

export default Home;
