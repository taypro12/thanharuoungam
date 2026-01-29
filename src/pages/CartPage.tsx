
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
/* Added ShieldCheck and CheckCircle to the imports from lucide-react */
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Bookmark, ShoppingCart, ChevronRight, Heart, ShieldCheck, CheckCircle } from 'lucide-react';
import { useCart } from '../App';
import { BRAND_NAME } from '../constants';
import SEO from '../components/SEO';

const CartPage: React.FC = () => {
  const { 
    cart, 
    savedItems, 
    removeFromCart, 
    updateQuantity, 
    saveForLater, 
    moveToCart, 
    removeFromSaved, 
    totalPrice 
  } = useCart();
  const navigate = useNavigate();

  const formattedTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);

  if (cart.length === 0 && savedItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center space-y-6 bg-[#FAF9F6]">
        <div className="w-24 h-24 bg-[#B48C48]/5 rounded-full flex items-center justify-center mx-auto text-[#B48C48]/20">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-black serif text-[#2C241E] uppercase tracking-tight">Giỏ hàng trống!</h2>
        <p className="text-[#7C746E] max-w-xs mx-auto text-sm font-medium">Khám phá ngay tinh hoa rượu hạ thổ Thanh Hà để bồi bổ sức khỏe và làm quà biếu sang trọng.</p>
        <Link to="/products" className="inline-block px-10 py-4 bg-[#B48C48] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#8C6A3A] transition-all shadow-xl btn-shine">
          ĐI MUA SẮM NGAY
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] pb-32 pt-28 min-h-screen">
      <SEO title="Giỏ Hàng" description="Quản lý các sản phẩm rượu ngâm thượng hạng bạn đã chọn." />
      
      <div className="container mx-auto px-4 lg:px-8">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-[1px] bg-[#B48C48]"></span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#B48C48]">Túi hàng của bạn</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-[#2C241E] tracking-tighter uppercase">Giỏ Hàng</h1>
            <p className="text-[#7C746E] text-[10px] font-black uppercase tracking-widest mt-2 opacity-60">Bạn có {cart.length} mặt hàng đang chờ thanh toán</p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#B48C48] hover:text-[#2C241E] transition-colors bg-white px-5 py-2.5 rounded-full border border-[#B48C48]/10 shadow-sm">
            <ArrowLeft size={14} /> Tiếp tục mua sắm
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-12">
            {/* Active Cart Items */}
            {cart.length > 0 ? (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="group relative flex flex-col sm:flex-row items-center gap-4 md:gap-8 bg-white p-5 md:p-6 rounded-[28px] border border-[#B48C48]/10 hover:border-[#B48C48]/30 transition-all shadow-sm hover:shadow-xl">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-40 sm:h-36 rounded-2xl overflow-hidden shrink-0 bg-[#FAF9F6] border border-[#B48C48]/5">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow w-full flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[7px] font-black uppercase tracking-widest bg-[#B48C48]/10 text-[#B48C48] px-1.5 py-0.5 rounded">{item.category}</span>
                          </div>
                          <Link to={`/product/${item.id}`} className="font-bold text-base md:text-lg text-[#2C241E] hover:text-[#B48C48] transition-colors line-clamp-1 mb-1 serif">
                            {item.name}
                          </Link>
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#7C746E]">{item.volume} • {item.strength}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-base md:text-xl font-black text-[#B48C48] tracking-tight">{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ</p>
                          <p className="text-[9px] text-[#7C746E] font-bold uppercase mt-1">Đơn giá: {new Intl.NumberFormat('vi-VN').format(item.price)}đ</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-8">
                        <div className="flex items-center bg-[#FAF9F6] rounded-xl border border-[#B48C48]/10 overflow-hidden shadow-inner">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-10 h-10 flex items-center justify-center text-[#B48C48] hover:bg-white transition-colors"><Minus size={14} /></button>
                          <span className="w-10 text-center font-black text-[#2C241E] text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-10 h-10 flex items-center justify-center text-[#B48C48] hover:bg-white transition-colors"><Plus size={14} /></button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => saveForLater(item)} 
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#B48C48]/10 text-[#7C746E] hover:text-[#B48C48] hover:bg-[#B48C48]/5 transition-all text-[9px] font-black uppercase tracking-widest"
                            title="Lưu mua sau"
                          >
                            <Bookmark size={14} /> <span className="hidden sm:inline">Lưu mua sau</span>
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#D9534F]/10 text-[#D9534F]/40 hover:text-[#D9534F] hover:bg-[#D9534F]/5 transition-all"
                            title="Xóa khỏi giỏ"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-[#B48C48]/20 p-12 rounded-[40px] text-center">
                <p className="text-[#7C746E]/40 text-[10px] font-black uppercase tracking-[0.3em]">Giỏ thanh toán đang trống</p>
              </div>
            )}

            {/* Saved Items Section */}
            {savedItems.length > 0 && (
              <section className="pt-8 border-t border-[#B48C48]/10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#B48C48]/10 rounded-xl flex items-center justify-center text-[#B48C48]">
                      <Heart size={20} fill="currentColor" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-[#2C241E] uppercase tracking-tight">Sản phẩm đã lưu</h2>
                      <p className="text-[9px] font-bold text-[#7C746E] uppercase tracking-widest">Mua sau khi bạn đã sẵn sàng</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-[#B48C48] bg-white px-3 py-1 rounded-full border border-[#B48C48]/10 shadow-sm">{savedItems.length} món</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {savedItems.map((product) => (
                    <div key={product.id} className="bg-white/60 p-5 rounded-[28px] border border-[#B48C48]/10 flex gap-5 items-center hover:bg-white hover:shadow-lg transition-all group">
                      <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0 border border-[#B48C48]/5 bg-[#FAF9F6]">
                        <img src={product.image} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" alt={product.name} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-sm text-[#2C241E] line-clamp-1 mb-1 serif">{product.name}</h4>
                        <p className="text-[10px] font-black text-[#B48C48] mb-4">{new Intl.NumberFormat('vi-VN').format(product.price)}đ</p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => moveToCart(product)} 
                            className="flex-grow py-2.5 bg-[#B48C48] text-white text-[8px] font-black uppercase tracking-widest rounded-xl hover:bg-[#8C6A3A] transition-all shadow-md flex items-center justify-center gap-2"
                          >
                            <ShoppingCart size={12} /> Thêm lại giỏ
                          </button>
                          <button 
                            onClick={() => removeFromSaved(product.id)} 
                            className="w-10 h-10 flex items-center justify-center text-[#7C746E] hover:text-[#D9534F] transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Checkout Summary Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 md:p-10 rounded-[40px] border border-[#B48C48]/10 shadow-2xl sticky top-28 space-y-8 overflow-hidden">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FAF9F6] -mr-16 -mt-16 rounded-full border border-[#B48C48]/5"></div>
              
              <h3 className="text-xl font-black text-[#2C241E] border-b border-[#B48C48]/10 pb-6 tracking-tight uppercase relative z-10">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-5 relative z-10">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#7C746E]">
                  <span>Tạm tính ({cart.reduce((acc, i) => acc + i.quantity, 0)} món):</span>
                  <span className="text-[#2C241E]">{formattedTotal}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#7C746E]">
                  <span>Phí vận chuyển:</span>
                  <span className="text-[#3FB984] font-black bg-[#3FB984]/5 px-2.5 py-1 rounded-full border border-[#3FB984]/10">MIỄN PHÍ</span>
                </div>
                
                <div className="pt-8 border-t border-[#B48C48]/10 flex flex-col gap-2">
                  <span className="text-[9px] font-black text-[#7C746E]/50 uppercase tracking-[0.4em]">Tổng cộng cần thanh toán</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl font-black text-gradient leading-none">{formattedTotal}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 pt-4">
                <button 
                  disabled={cart.length === 0}
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#B48C48] text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-[#2C241E] transition-all shadow-xl flex items-center justify-center gap-3 group disabled:opacity-30 btn-shine"
                >
                  THANH TOÁN NGAY
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/products')}
                  className="w-full py-4 text-[#7C746E] hover:text-[#B48C48] text-[9px] font-black uppercase tracking-widest transition-colors"
                >
                  Chọn thêm sản phẩm khác
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-6 border-t border-[#B48C48]/5">
                 <div className="flex flex-col items-center gap-2 p-3 bg-[#FAF9F6] rounded-2xl">
                    <ShieldCheck size={16} className="text-[#B48C48]" />
                    <span className="text-[7px] font-black uppercase tracking-widest text-[#7C746E] text-center">Bảo mật giao dịch</span>
                 </div>
                 <div className="flex flex-col items-center gap-2 p-3 bg-[#FAF9F6] rounded-2xl">
                    <CheckCircle size={16} className="text-[#3FB984]" />
                    <span className="text-[7px] font-black uppercase tracking-widest text-[#7C746E] text-center">Cam kết chính hãng</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
