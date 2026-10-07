import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/useCart";
import SidePanel from "./SidePanel";
import MenuContent from "./MenuContent";
import CartContent from "../containers/CartContent";
import Footer from "./Footer";
import Header from "./Header";
import WhatsAppButton from "./WhatsAppButton";
import SessionExpiredModal from "./SessionExpireModal";

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  const handleSearch = () => {
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      navigate("/catalog");
      return;
    }

    navigate(`/catalog?search=${encodeURIComponent(trimmedSearch)}`);
    setSearchOpen(false);
  };

  const handleOpenShop = () => {
    setShopOpen(true);
    refreshCart();
  };

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
          setShopOpen={handleOpenShop}
          searchOpen={searchOpen}
          setSearchOpen={setSearchOpen}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
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

      <SessionExpiredModal />
    </div>
  );
}

export default Layout;
