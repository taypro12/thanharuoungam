
import React, { useState, createContext, useContext, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { 
  MessageCircle, 
  Phone,
  CheckCircle as LucideCheckCircle
} from 'lucide-react';
import { CartItem, Product } from './types';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import CartPage from './pages/CartPage';
import Admin from './pages/Admin';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import AISommelier from './components/AISommelier';

// Context for Cart & Saved for Later
interface CartContextType {
  cart: CartItem[];
  savedItems: Product[];
  isCartOpen: boolean;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  saveForLater: (product: Product) => void;
  moveToCart: (product: Product) => void;
  removeFromSaved: (productId: string) => void;
  clearCart: () => void;
  toggleCartSidebar: () => void;
  totalItems: number;
  totalPrice: number;
  notification: string | null;
  showNotification: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedItems, setSavedItems] = useState<Product[]>(() => {
    const saved = localStorage.getItem('savedItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('savedItems', JSON.stringify(savedItems));
  }, [savedItems]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleCartSidebar = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showNotification(`Đã thêm "${product.name}" vào giỏ hàng`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const saveForLater = (product: Product) => {
    removeFromCart(product.id);
    setSavedItems(prev => {
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, product];
    });
    showNotification(`Đã lưu "${product.name}" để mua sau`);
  };

  const moveToCart = (product: Product) => {
    setSavedItems(prev => prev.filter(item => item.id !== product.id));
    addToCart(product, 1);
  };

  const removeFromSaved = (productId: string) => {
    setSavedItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      savedItems, 
      isCartOpen,
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      saveForLater, 
      moveToCart, 
      removeFromSaved, 
      clearCart, 
      toggleCartSidebar,
      totalItems, 
      totalPrice,
      notification,
      showNotification
    }}>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#2C241E]">
          <Navbar />
          <CartSidebar />
          <AISommelier />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>

          <Footer />

          {/* Toast Notification */}
          {notification && (
            <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-white border border-[#B48C48]/30 text-[#2C241E] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <LucideCheckCircle size={18} className="text-[#3fb984]" />
              <span className="text-[10px] font-black uppercase tracking-widest">{notification}</span>
            </div>
          )}

          {/* Floating Actions */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[80]">
            <a 
              href="https://zalo.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-[#0068ff] text-white p-3.5 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center border border-white/50"
              title="Liên hệ Zalo"
            >
              <MessageCircle size={24} />
            </a>
            <a 
              href="tel:0900000000" 
              className="bg-[#B48C48] text-white p-3.5 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center border border-white/50"
              title="Gọi ngay"
            >
              <Phone size={24} />
            </a>
          </div>
        </div>
      </Router>
    </CartContext.Provider>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default App;
