
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, 
  X, 
  ChevronDown, 
  RotateCcw,
  Check,
  LayoutGrid,
  Filter,
  Star,
  Zap,
  TrendingUp,
  Clock,
  Menu,
  ChevronRight,
  Package,
  Layers,
  Award,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';
import { Product, Category, SortOption } from '../types';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { supabase, isSupabaseConfigured } from '../supabase';

const ProductList: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') as Category || 'Tất cả';
  const initialSearch = queryParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [selectedSort, setSelectedSort] = useState<SortOption>('featured');
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState<number>(5000000);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isSupabaseConfigured) {
        // Nếu chưa cấu hình, đợi 1 chút rồi dùng mock data để giả lập loading
        setTimeout(() => {
          setProducts(MOCK_PRODUCTS);
          setIsLoading(false);
        }, 800);
        return;
      }

      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
        setProducts(MOCK_PRODUCTS); // Fallback
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const allTags = useMemo(() => Array.from(new Set(products.flatMap(p => p.tags || []))), [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'Tất cả') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (selectedTags.length > 0) {
      result = result.filter(p => selectedTags.some(tag => p.tags?.includes(tag)));
    }
    result = result.filter(p => p.price <= priceRange);
    
    switch (selectedSort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating-desc': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [products, selectedCategory, selectedSort, searchQuery, priceRange, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const resetFilters = () => {
    setSelectedCategory('Tất cả');
    setSearchQuery('');
    setPriceRange(5000000);
    setSelectedTags([]);
    setSelectedSort('featured');
  };

  const FilterSidebar = () => (
    <aside className="space-y-8">
      <div className="space-y-6">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B48C48] mb-4 flex items-center gap-2">
            <Layers size={12} /> Cốt rượu
          </p>
          <div className="grid grid-cols-1 gap-1">
            {['Tất cả', 'Rượu Sâm', 'Rượu Nấm', 'Rượu Ba Kích', 'Rượu Đông Trùng', 'Rượu Trái Cây'].map(name => (
              <button
                key={name}
                onClick={() => setSelectedCategory(name as Category)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between group ${
                  selectedCategory === name ? 'bg-[#B48C48] text-white shadow-lg' : 'text-[#7C746E] hover:text-[#B48C48] hover:bg-[#B48C48]/5'
                }`}
              >
                <span className="flex items-center gap-2">{name}</span>
                {selectedCategory === name && <Check size={12} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 space-y-6 border-t border-[#B48C48]/10">
        <div className="space-y-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#7C746E]/40 border-l border-[#B48C48] pl-2">Ngân sách</p>
          <input 
            type="range" min="100000" max="5000000" step="100000" value={priceRange}
            onChange={(e) => setPriceRange(parseInt(e.target.value))}
            className="w-full accent-[#B48C48] h-1.5 bg-[#B48C48]/10 rounded-full appearance-none cursor-pointer"
          />
          <div className="text-[9px] font-black text-[#B48C48] uppercase">Dưới {new Intl.NumberFormat('vi-VN').format(priceRange)}đ</div>
        </div>

        <div className="space-y-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-[#7C746E]/40 border-l border-[#B48C48] pl-2">Đặc tính</p>
          <div className="flex flex-wrap gap-1.5">
             {allTags.map(tag => (
               <button 
                 key={tag}
                 onClick={() => toggleTag(tag)}
                 className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${selectedTags.includes(tag) ? 'bg-[#B48C48] border-[#B48C48] text-white' : 'bg-[#FAF9F6] border-[#B48C48]/10 text-[#7C746E] hover:border-[#B48C48]/30'}`}
               >
                 {tag}
               </button>
             ))}
          </div>
        </div>
      </div>

      <button onClick={resetFilters} className="w-full py-4 bg-white border border-[#B48C48]/20 rounded-2xl text-[9px] font-black uppercase tracking-widest text-[#7C746E] flex items-center justify-center gap-2">
        <RotateCcw size={12} /> THIẾT LẬP LẠI
      </button>
    </aside>
  );

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <SEO title="Danh Mục Sản Phẩm" description="Khám phá các dòng rượu ngâm dược liệu gia truyền hạ thổ Thanh Hà." />

      <div className="container mx-auto px-4 lg:px-8 pt-32 pb-32">
        {!isSupabaseConfigured && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4 animate-in fade-in duration-500">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">Chế độ xem thử (Demo Mode)</p>
              <p className="text-[10px] text-amber-700 font-medium">Supabase chưa được kết nối. Dữ liệu dưới đây là mẫu.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="hidden lg:block lg:col-span-3">
             <div className="sticky top-28 bg-white border border-[#B48C48]/10 rounded-[32px] p-6 shadow-xl">
               <FilterSidebar />
             </div>
          </div>

          <div className="lg:col-span-9 space-y-8">
            <div className="bg-white px-6 py-4 rounded-[24px] border border-[#B48C48]/10 flex flex-wrap items-center justify-between gap-4 shadow-md">
              <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                <LayoutGrid size={14} className="text-[#7C746E]/40" />
                <div className="flex gap-2">
                  {['featured', 'newest'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => setSelectedSort(opt as any)}
                      className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedSort === opt ? 'bg-[#B48C48] text-white shadow-lg' : 'bg-[#FAF9F6] text-[#7C746E]'}`}
                    >
                      {opt === 'featured' ? 'Hot' : 'Mới'}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-6 py-3 bg-[#B48C48] text-white rounded-xl font-black text-[10px] uppercase tracking-widest">
                <Filter size={12} /> BỘ LỌC
              </button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 size={48} className="text-[#B48C48] animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-[#7C746E]">Đang tải tinh hoa dược tửu...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-[#B48C48]/10">
                <Package size={48} className="text-[#B48C48]/20 mx-auto mb-6" />
                <h3 className="text-xl font-black serif uppercase">Không tìm thấy sản phẩm</h3>
                <button onClick={resetFilters} className="mt-6 px-10 py-4 bg-[#B48C48] text-white rounded-2xl font-black uppercase text-[10px]">XEM TẤT CẢ</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)}></div>
           <div className="absolute top-0 right-0 h-full w-full max-w-[300px] bg-white p-6 overflow-y-auto no-scrollbar shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-xl font-black serif uppercase">BỘ LỌC</h2>
                 <button onClick={() => setIsMobileFilterOpen(false)} className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#7C746E]"><X size={20} /></button>
              </div>
              <FilterSidebar />
           </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
