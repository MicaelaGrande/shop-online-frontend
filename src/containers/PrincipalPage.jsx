function PrincipalPage() {
  const products = [
    {
      id: "1",
      img: "/vino.png",
      title: "Vinito",
      price: "$4500",
    },   {
      id: "1",
      img: "/vino.png",
      title: "Vinito",
      price: "$4500",
    },
       {
      id: "1",
      img: "/vino.png",
      title: "Vinito",
      price: "$4500",
    },
       {
      id: "1",
      img: "/vino.png",
      title: "Vinito",
      price: "$4500",
    },

  ];

  return (
    <div
      className="
     
        h-screen
        overflow-hidden
        bg-[url('/mixshopbg.png')]
        bg-cover
        bg-center
        bg-no-repeat
      "
    >
      <div className="mt-16"></div>
      <div className="grid grid-cols-2  lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            data-testid="ProductCard"
            key={product.id}
            className="bg-[#76afdb]/70 
                            p-6 
                            rounded-lg 
                            shadow-lg 
                            text-white 
                            flex flex-col gap-4 
                            cursor-pointer 
                            hover:bg-[#035596]/90 
                            active:scale-95 
                            transition-all 
                            duration-150
                            max-w-xs 
                          "
          >
            {" "}
            <div className="flex justify-center gap-8 ">
              <img src="/logo.png" className="w-32 h-32 object-contain"></img>
              <h2 className="text-2xl font-bold">{product.title}</h2>
            </div>
          </div>
        ))}
      </div>
      <div></div>
    </div>
  );
}

export default PrincipalPage;
