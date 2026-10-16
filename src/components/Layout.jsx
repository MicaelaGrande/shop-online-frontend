import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/useCart';
import SidePanel from './SidePanel';
import MenuContent from './MenuContent';
import CartContent from '../containers/CartContent';
import Footer from './Footer';
import Header from './Header';
import WhatsAppButton from './WhatsAppButton';
import SessionExpiredModal from './SessionExpireModal';
import { useAuth } from '../contexts/useAuth';


function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { refreshCart, cartNotice, dismissCartNotice } = useCart();
  const { admin } = useAuth();

  const handleSearch = () => {
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      navigate('/catalog');
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

      <SidePanel isOpen={menuOpen} onClose={() => setMenuOpen(false)} title="Menú" side="left">
        <MenuContent onCategorySelect={() => setMenuOpen(false)} />
      </SidePanel>

      <SidePanel
        isOpen={shopOpen}
        onClose={() => setShopOpen(false)}
        title={admin ? 'Pedidos pendientes' : 'Carrito'}
        side="right"
      >
        <CartContent onClosePanel={() => setShopOpen(false)} />
      </SidePanel>

      <SessionExpiredModal />
      {cartNotice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-4 top-24 z-[60] flex max-w-sm items-center gap-3 rounded-lg border border-green-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-lg"
        >
          <span className="flex-1">{cartNotice}</span>
          <button
            type="button"
            onClick={() => {
              dismissCartNotice();
              setShopOpen(true);
            }}
            className="font-semibold text-[#3163b3] hover:underline"
          >
            Ver carrito
          </button>
        </div>
      )}
    </div>
  );
}

export default Layout;
