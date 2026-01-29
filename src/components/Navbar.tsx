
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ChevronDown, Search, ArrowRight, Star, Zap, Award } from 'lucide-react';
import { useCart } from '../App';
import { Category } from '../types';
import { MOCK_PRODUCTS } from '../constants';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartBumping, setIsCartBumping] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  
  const { totalItems, toggleCartSidebar } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const categories: {name: Category, icon: string, desc: string}[] = [
    { name: 'Rượu Sâm', icon: '🌿', desc: 'Sâm Ngọc Linh, Sâm Cau rừng' },
    { name: 'Rượu Nấm', icon: '🍄', desc: 'Linh Chi đỏ, Nấm Lim Xanh' },
    { name: 'Rượu Ba Kích', icon: '💎', desc: 'Ba Kích Tím Quảng Ninh ủ chuẩn' },
    { name: 'Rượu Đông Trùng', icon: '🧶', desc: 'Đông Trùng Hạ Thảo ký chủ' },
    { name: 'Rượu Trái Cây', icon: '🍎', desc: 'Táo Mèo Yên Bái, Chuối Hột' },
    { name: 'Quà Biếu', icon: '🎁', desc: 'Set quà gỗ thượng hạng' },
    { name: 'Cao Cấp', icon: '👑', desc: 'Bình ngâm nghệ thuật cao cấp' }
  ];

  const featuredInMenu = MOCK_PRODUCTS.find(p => p.id === 'sam-ngoc-linh');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (totalItems > 0) {
      setIsCartBumping(true);
      const timer = setTimeout(() => setIsCartBumping(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsCategoryMenuOpen(false);
  }, [location]);

  return (
    <header className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'h-16 md:h-18 glass shadow-lg' : 'h-20 md:h-22 bg-transparent'}`}>
      <div className="container mx-auto px-4 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-10 shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#B48C48] to-[#8C6A3A] flex items-center justify-center shadow-md transition-transform group-hover:rotate-12">
                <span className="text-xl">🍷</span>
              </div>
              <span className="text-lg md:text-xl font-black text-[#2C241E] tracking-tighter uppercase">THANH HÀ</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/products" className="text-[10px] font-black uppercase tracking-widest text-[#7C746E] hover:text-[#B48C48] transition-colors">Cửa hàng</Link>
              
              <div 
                className="relative group/cat" 
                onMouseEnter={() => setIsCategoryMenuOpen(true)} 
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#7C746E] hover:text-[#B48C48] transition-colors py-8">
                  Danh mục <ChevronDown size={12} className={`transition-transform duration-500 ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <div className={`absolute top-full left-0 w-full h-4 ${isCategoryMenuOpen ? 'block' : 'hidden'}`}></div>

                {/* Mega Menu Panel Sáng */}
                <div className={`absolute top-[calc(100%-8px)] left-[-150px] w-[750px] glass rounded-[32px] border-[#B48C48]/10 shadow-2xl p-1 overflow-hidden transition-all duration-300 origin-top-left ${isCategoryMenuOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-4 scale-95'}`}>
                  <div className="grid grid-cols-12 bg-white">
                    {/* Left: Categories Grid */}
                    <div className="col-span-7 p-6 grid grid-cols-1 gap-1">
                      <p className="text-[9px] font-black text-[#B48C48] uppercase tracking-[0.3em] mb-4 ml-2">Bộ sưu tập dược tửu</p>
                      {categories.map((cat) => (
                        <Link 
                          key={cat.name}
                          to={`/products?category=${cat.name}`}
                          className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-[#B48C48]/10 group/item transition-all"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[#B48C48]/5 flex items-center justify-center text-xl group-hover/item:bg-[#B48C48]/20 group-hover/item:scale-110 transition-all">{cat.icon}</div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#2C241E] group-hover/item:text-[#B48C48]">{cat.name}</p>
                            <p className="text-[8px] font-bold text-[#7C746E] group-hover/item:text-[#7C746E] uppercase tracking-tighter">{cat.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Right: Featured Item */}
                    <div className="col-span-5 bg-[#FAF9F6] p-6 border-l border-[#B48C48]/5 flex flex-col">
                       <p className="text-[9px] font-black text-[#B48C48] uppercase tracking-[0.3em] mb-4">Sản phẩm tiêu biểu</p>
                       {featuredInMenu && (
                         <div className="flex-grow flex flex-col">
                            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-[#B48C48]/10 group/img">
                               <img src={featuredInMenu.image} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" alt={featuredInMenu.name} />
                               <div className="absolute top-2 left-2 bg-[#B48C48] text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase">Best Seller</div>
                            </div>
                            <h4 className="text-[11px] font-black text-[#2C241E] uppercase tracking-tight mb-2 line-clamp-1">{featuredInMenu.name}</h4>
                            <div className="flex items-center gap-2 mb-4">
                               <div className="flex text-[#B48C48]"><Star size={10} fill="currentColor" /></div>
                               <span className="text-[10px] font-bold text-[#7C746E]">{featuredInMenu.rating} (120+ lượt mua)</span>
                            </div>
                            <Link to={`/product/${featuredInMenu.id}`} className="mt-auto w-full py-3 bg-[#B48C48] text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#8C6A3A] transition-all">
                               Chi tiết <ArrowRight size={12} />
                            </Link>
                         </div>
                       )}
                    </div>
                  </div>
                  
                  <Link to="/products" className="block w-full py-3 bg-[#FAF9F6] text-center text-[9px] font-black uppercase tracking-widest text-[#7C746E] hover:text-[#B48C48] hover:bg-white transition-all border-t border-[#B48C48]/5">
                    Xem toàn bộ 50+ mẫu rượu thượng hạng
                  </Link>
                </div>
              </div>

              <Link to="/products?category=Quà Biếu" className="text-[10px] font-black uppercase tracking-widest text-[#7C746E] hover:text-[#B48C48] transition-colors">Quà Biếu</Link>
            </nav>
          </div>

          {/* Right: Actions Sáng */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center justify-center w-10 h-10 glass border-[#B48C48]/10 rounded-full text-[#7C746E] hover:text-[#B48C48] transition-all">
              <Search size={18} />
            </button>
            
            <button 
              onClick={toggleCartSidebar}
              className={`flex items-center gap-3 bg-[#B48C48] text-white px-4 md:px-6 py-2.5 md:py-3 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shadow-md hover:bg-[#8C6A3A] active:scale-95 ${isCartBumping ? 'scale-105' : ''}`}
            >
              <div className="relative">
                <ShoppingCart size={16} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 bg-[#D9534F] text-white rounded-full flex items-center justify-center text-[8px] md:text-[9px] font-black border-2 border-white animate-in zoom-in duration-300">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden md:inline">Giỏ hàng</span>
            </button>
            
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 glass border-[#B48C48]/10 rounded-full flex items-center justify-center text-[#2C241E] hover:text-[#B48C48] transition-all"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Sáng */}
      <div className={`fixed inset-0 bg-[#FAF9F6] z-[90] transition-all duration-500 lg:hidden ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col h-full overflow-y-auto no-scrollbar">
          <div className="space-y-6">
            <Link to="/products" className="block text-2xl font-black text-[#2C241E] uppercase tracking-tighter">Cửa hàng</Link>
            <div className="h-[1px] bg-[#B48C48]/10 w-full"></div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B48C48]">Danh mục sản phẩm</p>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((cat) => (
                  <Link 
                    key={cat.name}
                    to={`/products?category=${cat.name}`}
                    className="flex items-center gap-4 py-3 px-4 glass rounded-2xl border-[#B48C48]/10"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#B48C48]/5 flex items-center justify-center text-xl">{cat.icon}</div>
                    <div>
                      <span className="text-sm font-bold text-[#2C241E] uppercase tracking-widest block">{cat.name}</span>
                      <span className="text-[8px] text-[#7C746E] uppercase font-black tracking-tighter">{cat.desc}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="h-[1px] bg-[#B48C48]/10 w-full"></div>
            <Link to="/products?category=Quà Biếu" className="block text-xl font-bold text-[#2C241E] uppercase tracking-widest">Quà Biếu Đặc Tuyển</Link>
          </div>
          
          <div className="mt-12 space-y-6">
            <button className="w-full py-4 glass border-[#B48C48]/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#B48C48]">
              <Search size={18} /> Tìm kiếm sản phẩm
            </button>
            <div className="flex justify-center gap-6 text-[#7C746E] mt-auto">
              <span className="text-[8px] font-black uppercase tracking-[0.5em]">THANH HÀ MALL • PREMIUM EST. 2000</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
