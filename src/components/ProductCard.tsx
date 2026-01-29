
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Zap, Heart, Check } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../App';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    navigate('/checkout');
  };

  return (
    <article className="group bg-white rounded-[24px] transition-all duration-500 border border-[#B48C48]/10 hover:border-[#B48C48]/30 hover-lift flex flex-col h-full relative overflow-hidden shadow-sm">
      {/* Product Image Area - Tối ưu tỷ lệ 3:4 cho chai rượu trên Mobile */}
      <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#FAF9F6]">
        {/* Shimmer Placeholder */}
        {!isLoaded && <div className="absolute inset-0 shimmer-bg z-0" />}
        
        <Link to={`/product/${product.id}`} className="block h-full">
          <img 
            src={product.image} 
            alt={product.name} 
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1 z-10">
          {product.originalPrice && (
            <span className="bg-[#D9534F] text-white text-[7px] md:text-[8px] font-black px-1.5 md:px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
          {product.featured && (
            <span className="bg-[#B48C48] text-white text-[7px] md:text-[8px] font-black px-1.5 md:px-2 py-0.5 rounded-full uppercase tracking-widest shadow-md animate-hot-flash">
              Hot
            </span>
          )}
        </div>

        <button className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 rounded-full glass flex items-center justify-center text-[#7C746E] hover:text-[#D9534F] transition-colors z-10">
          <Heart size={14} />
        </button>
      </div>

      {/* Product Info Area */}
      <div className="p-3 md:p-5 flex flex-col flex-grow bg-white">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] md:text-[9px] font-black text-[#B48C48] uppercase tracking-[0.15em] opacity-80">{product.category}</span>
          <div className="flex items-center gap-1">
            <Star size={10} fill="#B48C48" className="text-[#B48C48]" />
            <span className="text-[9px] md:text-[10px] font-bold text-[#2C241E]">{product.rating}</span>
          </div>
        </div>
        
        <Link to={`/product/${product.id}`} className="flex-grow">
          <h3 className="text-[11px] md:text-sm font-bold text-[#2C241E] serif mb-2 line-clamp-2 leading-tight group-hover:text-[#B48C48] transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm md:text-lg font-black text-[#2C241E] tracking-tight">{formattedPrice}</span>
          </div>
          
          <div className="flex gap-1.5">
            <button 
              onClick={handleQuickBuy}
              className="flex-grow py-2.5 md:py-3 bg-[#B48C48] text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#8C6A3A] transition-all shadow-md active:scale-95 btn-shine flex items-center justify-center gap-1.5"
            >
              <Zap size={12} className="fill-current" />
              <span>Mua ngay</span>
            </button>
            <button 
              onClick={handleAddToCart}
              className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl border transition-all flex items-center justify-center active:scale-90 shadow-sm ${isAdded ? 'bg-[#3fb984] border-[#3fb984] text-white' : 'bg-white text-[#7C746E] border-[#B48C48]/20 hover:bg-[#FAF9F6]'}`}
              title="Thêm vào giỏ"
            >
              {isAdded ? <Check size={18} className="animate-in zoom-in duration-300" /> : <ShoppingCart size={18} />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
