
import React, { useEffect, useRef } from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Zap, Bookmark } from 'lucide-react';
import { useCart } from '../App';
import { useNavigate } from 'react-router-dom';

const CartSidebar: React.FC = () => {
  const { cart, isCartOpen, toggleCartSidebar, removeFromCart, updateQuantity, totalPrice, saveForLater } = useCart();
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggleCartSidebar();
    };
    if (isCartOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isCartOpen, toggleCartSidebar]);

  const handleCheckout = () => {
    toggleCartSidebar();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    toggleCartSidebar();
    navigate('/cart');
  };

  const formattedTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[150] transition-opacity duration-500 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={toggleCartSidebar}
      />

      {/* Sidebar Panel Sáng */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[160] shadow-[-20px_0_80px_rgba(44,36,30,0.1)] border-l border-[#B48C48]/10 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header Sáng */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-[#B48C48]/10 bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B48C48]/10 flex items-center justify-center text-[#B48C48]">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#2C241E] uppercase tracking-tight">Giỏ hàng</h2>
              <p className="text-[9px] font-bold text-[#B48C48] uppercase tracking-[0.2em]">{cart.length} sản phẩm</p>
            </div>
          </div>
          <button 
            onClick={toggleCartSidebar}
            className="w-10 h-10 rounded-full bg-white border border-[#B48C48]/10 flex items-center justify-center text-[#7C746E] hover:text-[#B48C48] transition-all shadow-sm"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Sáng */}
        <div className="flex-grow overflow-y-auto no-scrollbar p-6 space-y-6 bg-white">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="w-20 h-24 rounded-2xl overflow-hidden bg-[#FAF9F6] border border-[#B48C48]/5 shrink-0 shadow-sm">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                </div>
                <div className="flex-grow min-w-0 space-y-2">
                  <div className="flex justify-between gap-2">
                    <h4 className="text-[11px] font-black text-[#2C241E] uppercase tracking-tight line-clamp-1 serif">{item.name}</h4>
                    <button onClick={() => removeFromCart(item.id)} className="text-[#7C746E]/20 hover:text-[#D9534F] transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-[10px] font-black text-[#B48C48]">{new Intl.NumberFormat('vi-VN').format(item.price)}đ</p>
                    <button 
                      onClick={() => saveForLater(item)}
                      className="text-[8px] font-black text-[#7C746E]/40 hover:text-[#B48C48] uppercase flex items-center gap-1"
                    >
                      <Bookmark size={10} /> Lưu
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-[#FAF9F6] border border-[#B48C48]/10 rounded-xl overflow-hidden h-9 shadow-inner">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-full flex items-center justify-center text-[#B48C48] hover:bg-white"><Minus size={12} /></button>
                      <span className="w-8 text-center font-black text-[#2C241E] text-[10px]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-full flex items-center justify-center text-[#B48C48] hover:bg-white"><Plus size={12} /></button>
                    </div>
                    <span className="text-[11px] font-black text-[#2C241E] tracking-tight">{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-[#FAF9F6] rounded-full flex items-center justify-center text-[#B48C48]/10 border border-[#B48C48]/5">
                <ShoppingBag size={48} />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-black text-[#2C241E] uppercase tracking-widest">Giỏ hàng trống</p>
                <p className="text-[9px] text-[#7C746E] font-bold uppercase tracking-widest max-w-[220px] leading-relaxed">Khám phá các dòng rượu ngâm đặc sản để bồi bổ sức khỏe.</p>
              </div>
              <button 
                onClick={toggleCartSidebar}
                className="px-10 py-3.5 bg-[#B48C48] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#2C241E] transition-all shadow-lg"
              >
                MUA SẮM NGAY
              </button>
            </div>
          )}
        </div>

        {/* Footer Sáng */}
        {cart.length > 0 && (
          <div className="p-8 border-t border-[#B48C48]/10 bg-[#FAF9F6] space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[#7C746E]">
                <span>Tạm tính</span>
                <span className="text-[#2C241E]">{formattedTotal}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#B48C48]">Tổng thanh toán</span>
                <span className="text-2xl font-black text-gradient leading-none">{formattedTotal}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleCheckout}
                className="w-full bg-[#B48C48] text-white py-4.5 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-[#2C241E] transition-all flex items-center justify-center gap-3 btn-shine shadow-xl"
              >
                ĐẶT HÀNG NGAY <ArrowRight size={16} />
              </button>
              <button 
                onClick={handleViewCart}
                className="w-full py-4 rounded-[20px] border border-[#B48C48]/10 text-[#7C746E] hover:text-[#B48C48] hover:bg-white transition-all font-black text-[10px] uppercase tracking-widest bg-white/50"
              >
                XEM GIỎ CHI TIẾT
              </button>
            </div>
            
            <p className="text-center text-[8px] font-black text-[#B48C48] uppercase tracking-[0.4em] opacity-60 flex items-center justify-center gap-2">
               <Zap size={10} fill="currentColor" /> MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
