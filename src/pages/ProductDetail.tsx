
import React, { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RefreshCcw, 
  Plus, 
  Minus, 
  Share2, 
  Check, 
  Gift, 
  ChevronRight,
  Play,
  Zap,
  Box,
  Layers,
  Info,
  Droplets,
  Home as HomeIcon,
  ArrowLeft,
  Activity
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { useCart } from '../App';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, showNotification } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'extra' | 'reviews'>('desc');
  const [selectedImg, setSelectedImg] = useState(0);
  const [isCopying, setIsCopying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  
  const [selectedSize, setSelectedSize] = useState('Tiêu chuẩn'); 
  const [selectedPackage, setSelectedPackage] = useState('Chai thủy tinh');

  const product = MOCK_PRODUCTS.find(p => p.id === id);

  const basePrice = product?.price || 0;
  const currentPrice = useMemo(() => {
    let price = basePrice;
    if (selectedSize === 'Lớn') price *= 1.8;
    if (selectedSize === 'Đại') price *= 3.2;
    if (selectedPackage === 'Hộp gỗ cao cấp') price += 250000;
    return price;
  }, [basePrice, selectedSize, selectedPackage]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center bg-[#FAF9F6]">
        <h2 className="text-2xl font-black serif text-[#2C241E] uppercase">Không tìm thấy sản phẩm!</h2>
        <button onClick={() => navigate('/products')} className="mt-4 text-[#B48C48] font-black uppercase tracking-widest text-xs">Quay lại cửa hàng</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    const customizedProduct = {
      ...product,
      name: `${product.name} (${selectedSize})`,
      price: currentPrice
    };
    addToCart(customizedProduct, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentPrice);

  const flavorStats = [
    { label: 'Độ Mạnh', value: product.flavorProfile?.strength || 70, icon: <Activity size={12} /> },
    { label: 'Độ Êm', value: product.flavorProfile?.smoothness || 85, icon: <Droplets size={12} /> },
    { label: 'Hương Thơm', value: product.flavorProfile?.aroma || 80, icon: <Zap size={12} /> },
    { label: 'Độ Ngọt', value: product.flavorProfile?.sweetness || 30, icon: <Star size={12} /> },
  ];

  return (
    <div className="bg-[#FAF9F6] pb-32">
      <SEO title={product.name} description={product.description} image={product.image} />
      
      <div className="container mx-auto px-4 lg:px-8 pt-20 md:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-24">
          
          {/* Gallery - Mobile Optimized */}
          <div className="space-y-4 md:space-y-6">
            <div className="aspect-[4/5] rounded-[32px] md:rounded-[48px] overflow-hidden bg-white border border-[#B48C48]/10 relative shadow-2xl">
              <img src={product.gallery[selectedImg] || product.image} className="w-full h-full object-cover" alt={product.name} />
              
              {/* Mobile Indicator */}
              <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                 {product.gallery.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all ${selectedImg === i ? 'w-6 bg-[#B48C48]' : 'w-2 bg-[#B48C48]/30'}`}></div>
                 ))}
              </div>
            </div>
            
            {/* Thumbnails - Horizontal Scroll on Mobile */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory px-1">
              {product.gallery.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedImg(idx)}
                  className={`min-w-[80px] md:min-w-[110px] aspect-square rounded-2xl overflow-hidden border-2 transition-all snap-start ${selectedImg === idx ? 'border-[#B48C48] shadow-md' : 'border-transparent opacity-60'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="mb-6 md:mb-10">
              <span className="text-[10px] font-black text-[#B48C48] uppercase tracking-[0.3em] bg-[#B48C48]/5 px-3 py-1 rounded-full border border-[#B48C48]/10 mb-4 inline-block">{product.category}</span>
              <h1 className="text-3xl md:text-5xl font-black serif text-[#2C241E] mb-4 leading-tight uppercase">{product.name}</h1>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl md:text-5xl font-black text-gradient tracking-tighter">{formattedPrice}</span>
              </div>
            </div>

            {/* Flavor Profile Visualized */}
            <div className="bg-white p-6 rounded-[32px] border border-[#B48C48]/10 shadow-sm mb-8">
              <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-[#B48C48] mb-6 flex items-center gap-2">
                <Activity size={12} /> Đặc tính cốt rượu
              </h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {flavorStats.map((stat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-[#7C746E]">
                      <span>{stat.label}</span>
                      <span className="text-[#B48C48]">{stat.value}%</span>
                    </div>
                    <div className="h-1 bg-[#FAF9F6] rounded-full overflow-hidden">
                      <div className="h-full bg-[#B48C48] rounded-full transition-all duration-1000" style={{ width: `${stat.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="space-y-8 mb-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C746E]/60 ml-1">Dung tích lựa chọn</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {['Tiêu chuẩn', 'Lớn', 'Đại'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-[20px] border-2 transition-all font-black uppercase text-[10px] tracking-widest ${selectedSize === size ? 'border-[#B48C48] bg-[#B48C48]/5 text-[#B48C48]' : 'border-[#B48C48]/5 bg-white text-[#2C241E]'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Desktop */}
            <div className="hidden md:flex gap-4 mb-10">
              <div className="flex items-center bg-[#FAF9F6] border border-[#B48C48]/10 rounded-2xl overflow-hidden h-14">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-6 text-[#B48C48]"><Minus size={18} /></button>
                <span className="w-12 text-center font-black text-[#2C241E]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="px-6 text-[#B48C48]"><Plus size={18} /></button>
              </div>
              <button onClick={handleAddToCart} className="flex-grow flex items-center justify-center gap-3 bg-white border-2 border-[#B48C48] text-[#B48C48] rounded-2xl font-black uppercase text-[11px] tracking-widest">
                <ShoppingCart size={20} /> Thêm vào giỏ
              </button>
              <button onClick={handleBuyNow} className="flex-grow bg-[#B48C48] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl btn-shine">
                MUA NGAY
              </button>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#B48C48]/10">
              {[
                { icon: ShieldCheck, text: "Dược liệu sạch", color: "text-[#3FB984]" },
                { icon: Truck, text: "Giao nhanh 2h", color: "text-[#B48C48]" },
                { icon: RefreshCcw, text: "Đổi trả 7 ngày", color: "text-[#7C746E]" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2 group">
                  <div className={`w-10 h-10 rounded-full bg-white border border-[#B48C48]/10 flex items-center justify-center ${item.color} shadow-sm group-hover:shadow-md transition-all`}>
                    <item.icon size={18} />
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#7C746E]/60">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Mobile Buy Bar */}
        <div className="md:hidden fixed bottom-0 left-0 w-full z-[150] p-4 glass border-t border-[#B48C48]/10">
          <div className="flex gap-3">
             <div className="flex items-center bg-[#FAF9F6] border border-[#B48C48]/10 rounded-2xl h-14 shadow-inner">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 flex justify-center text-[#B48C48]"><Minus size={16} /></button>
                <span className="w-8 text-center font-black text-[#2C241E] text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-12 flex justify-center text-[#B48C48]"><Plus size={16} /></button>
             </div>
             <button 
               onClick={handleBuyNow}
               className="flex-grow h-14 bg-[#B48C48] text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-2"
             >
               MUA NGAY <Zap size={14} fill="currentColor" />
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-20">
           <div className="flex border-b border-[#B48C48]/10 mb-8 overflow-x-auto no-scrollbar gap-10">
              {['desc', 'extra', 'reviews'].map((t) => (
                <button 
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`pb-4 text-[10px] font-black uppercase tracking-[0.3em] relative transition-all ${activeTab === t ? 'text-[#B48C48]' : 'text-[#7C746E]/40'}`}
                >
                  {t === 'desc' ? 'Mô tả chi tiết' : t === 'extra' ? 'Quy trình ngâm' : 'Đánh giá'}
                  {activeTab === t && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#B48C48] rounded-full" />}
                </button>
              ))}
           </div>
           <div className="bg-white p-6 md:p-12 rounded-[40px] border border-[#B48C48]/10 shadow-lg min-h-[300px]">
              {activeTab === 'desc' && (
                <div className="max-w-4xl text-sm md:text-lg text-[#7C746E] leading-relaxed space-y-6">
                  <p className="first-letter:text-5xl first-letter:font-black first-letter:text-[#B48C48] first-letter:mr-3 first-letter:float-left first-letter:leading-none">{product.description}</p>
                  <p>Mỗi giọt rượu là sự kết tinh của thời gian và tâm huyết. Quy trình chưng cất 2 lần giúp loại bỏ hoàn toàn aldehyde, mang lại cảm giác êm dịu, không gây đau đầu.</p>
                </div>
              )}
           </div>
        </div>

        {/* Related */}
        <div>
           <h3 className="text-xl md:text-3xl font-black serif text-[#2C241E] uppercase mb-10 tracking-tight">Sản phẩm tương tự</h3>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             {MOCK_PRODUCTS.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
