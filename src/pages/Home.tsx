
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Wine, 
  Flame,
  ChevronRight,
  Award,
  Zap,
  ShieldCheck,
  Droplets,
  Play,
  Star,
  Quote,
  CheckCircle,
  ThumbsUp
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { Category } from '../types';

const Home: React.FC = () => {
  const featuredProducts = MOCK_PRODUCTS.filter(p => p.featured).slice(0, 4);
  const discoveryProducts = [...MOCK_PRODUCTS].sort(() => 0.5 - Math.random()).slice(0, 8);
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  
  const [timeLeft, setTimeLeft] = useState({ hours: 12, mins: 45, secs: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchVal)}`);
    } else {
      navigate('/products');
    }
  };

  const mainCategories: { name: Category; icon: string; bg: string; label: string }[] = [
    { name: 'Rượu Sâm', icon: '🌿', bg: 'bg-green-100', label: 'Sâm Quý' },
    { name: 'Rượu Nấm', icon: '🍄', bg: 'bg-orange-100', label: 'Nấm Rừng' },
    { name: 'Rượu Ba Kích', icon: '💎', bg: 'bg-purple-100', label: 'Ba Kích' },
    { name: 'Rượu Đông Trùng', icon: '🧶', bg: 'bg-yellow-100', label: 'Đông Trùng' },
    { name: 'Rượu Trái Cây', icon: '🍎', bg: 'bg-red-100', label: 'Trái Cây' },
    { name: 'Quà Biếu', icon: '🎁', bg: 'bg-amber-100', label: 'Quà Biếu' },
    { name: 'Cao Cấp', icon: '👑', bg: 'bg-blue-100', label: 'Thượng Hạng' },
    { name: 'Tất cả', icon: '🍶', bg: 'bg-stone-100', label: 'Tất Cả' },
  ];

  const testimonials = [
    { name: "Anh Hoàng Nam", role: "CEO tại Techcom", text: "Rượu hạ thổ Thanh Hà thực sự êm, không bị nồng gắt. Tôi dùng làm quà biếu đối tác ai cũng khen.", avatar: "https://i.pravatar.cc/150?u=1" },
    { name: "Chị Minh Thư", role: "Chủ doanh nghiệp", text: "Thiết kế hộp quà rất sang trọng, thiệp viết tay chỉn chu. Rất hài lòng với dịch vụ chăm sóc khách hàng.", avatar: "https://i.pravatar.cc/150?u=2" },
    { name: "Bác Hùng", role: "Hưu trí", text: "Uống rượu ba kích Thanh Hà thấy người khỏe hẳn, đặc biệt là không bị đau đầu sau khi uống như các loại rượu khác.", avatar: "https://i.pravatar.cc/150?u=3" }
  ];

  return (
    <div className="bg-[#FAF9F6] overflow-hidden">
      <SEO 
        title="Trang Chủ - Rượu Sâm & Dược Liệu Quý"
        description="Chào mừng đến với Rượu Ngâm Thanh Hà. Chuyên cung cấp các loại rượu ngâm thảo dược thượng hạng, hạ thổ 365 ngày."
      />
      
      {/* Hero Section Sáng */}
      <section className="relative h-[65vh] lg:h-[75vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover" 
            alt="Hero Banner" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-12">
          <div className="max-w-4xl space-y-5 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 glass text-[#B48C48] text-[8px] font-black uppercase tracking-[0.3em] rounded-full border border-[#B48C48]/20 bg-white/50">
              <Award size={10} className="animate-pulse" /> Thanh Hà Mall • Chất Lượng Thượng Hạng
            </div>
            
            <h1 className="text-4xl lg:text-7xl font-black text-[#2C241E] leading-[0.95] tracking-tighter">
              Tinh Hoa <br /> <span className="text-gradient">Rượu Hạ Thổ</span>
            </h1>
            
            <p className="text-[#7C746E] text-xs md:text-base max-w-lg font-medium leading-relaxed">
              Kế thừa bí quyết ngâm ủ gia truyền Bách Nhật, chúng tôi chắt lọc tinh túy từ những vị thuốc quý hiếm nhất của đại ngàn.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
              <form onSubmit={handleSearch} className="flex flex-grow w-full sm:max-w-lg bg-white border border-[#B48C48]/10 p-1 rounded-xl group focus-within:border-[#B48C48]/50 transition-all shadow-lg">
                <div className="flex-grow flex items-center px-4">
                  <Search size={16} className="text-[#B48C48] mr-2" />
                  <input 
                    type="text" 
                    placeholder="Tìm danh trà, rượu sâm..." 
                    className="bg-transparent border-none outline-none w-full text-[#2C241E] font-medium py-2.5 text-xs"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                  />
                </div>
                <button type="submit" className="bg-[#B48C48] text-white px-6 py-2.5 rounded-lg font-black uppercase text-[9px] tracking-widest hover:bg-[#8C6A3A] transition-all">
                  TÌM
                </button>
              </form>
              <Link to="/products" className="w-full sm:w-auto px-6 py-3.5 glass border-[#B48C48]/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#7C746E] hover:text-[#B48C48] transition-all flex items-center justify-center gap-2">
                KHÁM PHÁ <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Sáng */}
      <section className="container mx-auto px-4 lg:px-8 -mt-10 relative z-20 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-3 glass rounded-[24px] border-[#B48C48]/10 shadow-xl bg-white/80">
          {[
            { label: 'Sản phẩm mẫu', val: '500+', icon: Wine },
            { label: 'Năm uy tín', val: '25+', icon: Award },
            { label: 'Đánh giá 5 sao', val: '12k+', icon: Star },
            { label: 'Vận chuyển 2h', val: 'Siêu tốc', icon: Zap }
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-1.5 border-r border-[#B48C48]/5 last:border-none">
              <div className="w-9 h-9 rounded-lg bg-[#B48C48]/10 flex items-center justify-center text-[#B48C48]">
                <stat.icon size={18} />
              </div>
              <div>
                <p className="text-base font-black text-[#2C241E] leading-none">{stat.val}</p>
                <p className="text-[7px] font-black uppercase tracking-widest text-[#7C746E] mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-8 pb-16">
        {/* Category Grid Sáng */}
        <section className="container mx-auto px-4 lg:px-8">
          <div className="bg-white border border-[#B48C48]/10 rounded-[28px] overflow-hidden shadow-lg relative">
            <div className="px-5 py-3.5 border-b border-[#B48C48]/5 flex items-center justify-between bg-[#FAF9F6]/50">
              <h2 className="text-[9px] font-black text-[#2C241E] tracking-[0.2em] uppercase">Phân Loại Dược Tửu</h2>
              <Link to="/products" className="text-[8px] font-black uppercase tracking-widest text-[#B48C48] hover:text-[#8C6A3A] transition-colors flex items-center gap-1">
                TẤT CẢ <ChevronRight size={10} />
              </Link>
            </div>
            <div className="p-4 md:p-5">
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
                {mainCategories.map((cat, idx) => (
                  <button 
                    key={idx}
                    onClick={() => navigate(`/products?category=${cat.name}`)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl ${cat.bg} border border-[#B48C48]/5 flex items-center justify-center text-lg group-hover:scale-105 group-hover:bg-white transition-all duration-300 shadow-sm`}>
                      {cat.icon}
                    </div>
                    <span className="text-[7px] font-black uppercase tracking-widest text-[#7C746E] text-center group-hover:text-[#B48C48] transition-colors">
                      {cat.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Flash Sale Sáng */}
        <section className="container mx-auto px-4 lg:px-8">
          <div className="bg-white border border-[#B48C48]/10 rounded-[28px] overflow-hidden shadow-xl">
            <div className="px-5 py-4 md:px-7 border-b border-[#B48C48]/5 flex flex-wrap items-center justify-between gap-4 bg-[#FAF9F6]/30">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-[#D9534F]">
                  <Flame size={16} className="animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Hot Deals</span>
                </div>
                <div className="h-5 w-[1px] bg-[#B48C48]/10"></div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[7px] font-black uppercase tracking-widest text-[#7C746E]">Kết thúc sau:</span>
                  <div className="flex items-center gap-1">
                    <span className="bg-[#B48C48]/10 px-1.5 py-0.5 rounded text-[#B48C48] font-black text-[9px]">{String(timeLeft.hours).padStart(2, '0')}h</span>
                    <span className="bg-[#B48C48]/10 px-1.5 py-0.5 rounded text-[#B48C48] font-black text-[9px]">{String(timeLeft.mins).padStart(2, '0')}m</span>
                    <span className="bg-[#B48C48]/10 px-1.5 py-0.5 rounded text-[#B48C48] font-black text-[9px] animate-pulse">{String(timeLeft.secs).padStart(2, '0')}s</span>
                  </div>
                </div>
              </div>
              <Link to="/products" className="text-[8px] font-black uppercase tracking-widest text-[#7C746E] hover:text-[#B48C48] flex items-center gap-1 group">
                XEM BỘ SƯU TẬP <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            
            <div className="p-4 md:p-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Discovery Section Sáng */}
        <section className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
               <div className="w-1 h-5 bg-[#B48C48] rounded-full"></div>
               <h2 className="text-base md:text-lg font-black text-[#2C241E] tracking-tight uppercase">Gợi Ý Thưởng Thức</h2>
            </div>
            <Link to="/products" className="text-[8px] font-black uppercase tracking-widest text-[#7C746E] hover:text-[#B48C48] flex items-center gap-1">
              XEM TẤT CẢ <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {discoveryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Testimonials Sáng */}
        <section className="container mx-auto px-4 lg:px-8">
          <div className="bg-white rounded-[32px] border border-[#B48C48]/10 p-6 lg:p-12 relative overflow-hidden shadow-xl">
             <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
                <span className="text-[#B48C48] font-black uppercase text-[7px] tracking-[0.5em]">TÍN NHIỆM</span>
                <h2 className="text-2xl lg:text-4xl font-black text-[#2C241E] tracking-tighter uppercase">Uy Tín Tạo <span className="text-gradient">Đẳng Cấp</span></h2>
                <div className="flex items-center justify-center gap-3 pt-2">
                   <div className="flex items-center gap-1.5 glass bg-[#FAF9F6] px-3 py-1.5 rounded-full border-[#B48C48]/10">
                      <CheckCircle size={12} className="text-[#3fb984]" />
                      <span className="text-[7px] font-black text-[#2C241E] uppercase tracking-widest">ISO 22000</span>
                   </div>
                   <div className="flex items-center gap-1.5 glass bg-[#FAF9F6] px-3 py-1.5 rounded-full border-[#B48C48]/10">
                      <ThumbsUp size={12} className="text-[#B48C48]" />
                      <span className="text-[7px] font-black text-[#2C241E] uppercase tracking-widest">99% Hài Lòng</span>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t, idx) => (
                  <div key={idx} className="bg-[#FAF9F6] p-6 rounded-[24px] border border-[#B48C48]/10 relative group hover:border-[#B48C48]/40 transition-all duration-500 shadow-sm">
                    <Quote className="absolute top-4 right-6 text-[#B48C48]/5" size={32} />
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 rounded-full overflow-hidden border border-[#B48C48]/20">
                          <img src={t.avatar} className="w-full h-full object-cover" alt={t.name} />
                       </div>
                       <div>
                          <h4 className="text-[10px] font-black text-[#2C241E] uppercase tracking-widest">{t.name}</h4>
                          <p className="text-[8px] font-bold text-[#7C746E] uppercase tracking-widest">{t.role}</p>
                       </div>
                    </div>
                    <p className="text-xs text-[#7C746E] leading-relaxed font-medium italic">"{t.text}"</p>
                    <div className="flex gap-0.5 mt-4 text-[#B48C48]">
                       {[...Array(5)].map((_, i) => <Star key={i} size={8} fill="currentColor" />)}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
