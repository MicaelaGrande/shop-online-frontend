import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidePanel from "./SidePanel";
import MenuContent from "./MenuContent";
import CartContent from "../containers/CartContent";
import Footer from "./Footer";
import Header from "./Header";
import WhatsAppButton from "./WhatsAppButton";

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div
      className="
        min-h-screen
        bg-[url('/mixshopbg.png')]
        bg-cover
        bg-center
        bg-fixed
        bg-no-repeat
      "
    >
      <div className="min-h-screen flex flex-col">
        <Header
          setMenuOpen={setMenuOpen}
          setShopOpen={setShopOpen}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
        />

        <main className="flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>

      <WhatsAppButton />

      <SidePanel
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Menú"
        side="left"
      >
        <MenuContent onCategorySelect={() => setMenuOpen(false)} />
      </SidePanel>

      <SidePanel
        isOpen={shopOpen}
        onClose={() => setShopOpen(false)}
        title="Carrito"
        side="right"
      >
        <CartContent />
      </SidePanel>
    </div>
  );
}

export default Layout;