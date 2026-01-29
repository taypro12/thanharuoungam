
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  ArrowUpRight, 
  CheckCircle,
  Truck,
  Database,
  RefreshCw,
  Loader2,
  Eye,
  Lock,
  Unlock,
  LogIn,
  ShieldAlert,
  Plus,
  X,
  Trash2,
  Save
} from 'lucide-react';
import { supabase } from '../supabase';
import { MOCK_PRODUCTS } from '../constants';
import SEO from '../components/SEO';
import { Product } from '../types';

interface Order {
  id: number;
  info_code: string;
  customer_name: string;
  phone: string;
  address: string;
  total_price: number;
  status: string;
  created_at: string;
  items: any[];
}

const Admin: React.FC = () => {
  // --- PHẦN BẢO MẬT ---
  const ADMIN_PASSWORD = "admin"; 
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  // --- QUẢN LÝ DỮ LIỆU ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard');
  const [orders, setOrders] = useState<Order[]>([]);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  
  // Form sản phẩm mới
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Rượu Sâm',
    price: 0,
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c76cf?q=80&w=800',
    description: '',
    rating: 5,
    tags: []
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
      fetchProducts();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) { console.error(err); } 
    finally { setIsLoading(false); }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setDbProducts(data || []);
    } catch (err) { console.error(err); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const id = newProduct.name?.toLowerCase().replace(/\s+/g, '-');
      const productToSave = { ...newProduct, id, gallery: [newProduct.image] };
      const { error } = await supabase.from('products').insert([productToSave]);
      if (error) throw error;
      alert("Thêm sản phẩm thành công!");
      setShowAddProduct(false);
      fetchProducts();
    } catch (err) {
      alert("Lỗi thêm sản phẩm. Hãy kiểm tra bảng 'products' đã tạo chưa.");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      fetchProducts();
    } catch (err) { console.error(err); }
  };

  const updateOrderStatus = async (id: number, newStatus: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      fetchOrders();
    } catch (err) { console.error(err); }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
        <SEO title="Đăng nhập Quản trị" />
        <div className="max-w-md w-full bg-white rounded-[48px] p-10 shadow-2xl border border-[#B48C48]/10 text-center space-y-8 animate-slide-up">
           <div className="w-20 h-20 bg-[#B48C48]/10 text-[#B48C48] rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock size={32} />
           </div>
           <h1 className="text-2xl font-black text-[#2C241E] uppercase tracking-tighter">Hệ Thống Quản Trị</h1>
           <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="password" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Nhập mật khẩu quản trị"
                className="w-full bg-[#FAF9F6] px-6 py-4 rounded-2xl border border-[#B48C48]/20 text-center text-lg font-bold outline-none focus:border-[#B48C48]"
                autoFocus
              />
              <button type="submit" className="w-full bg-[#B48C48] text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-[#2C241E] transition-all">XÁC THỰC</button>
           </form>
        </div>
      </div>
    );
  }

  const StatsCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-[32px] border border-[#B48C48]/10 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#7C746E] mb-1">{title}</p>
        <h3 className="text-3xl font-black text-[#2C241E]">{value}</h3>
      </div>
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white`}><Icon size={24} /></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-24 pb-20">
      <SEO title="Quản Trị Hệ Thống" />
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0 space-y-2">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B48C48] mb-6 px-4">Menu Quản Lý</h2>
            {[
              { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
              { id: 'orders', label: 'Đơn hàng', icon: ShoppingBag },
              { id: 'products', label: 'Sản phẩm', icon: Package },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-[#B48C48] text-white shadow-lg' : 'text-[#7C746E] hover:bg-white hover:text-[#B48C48]'}`}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
            <div className="pt-10 space-y-2">
              <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"><Lock size={18} /> Đăng xuất</button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow space-y-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-10 animate-in fade-in">
                <header><h1 className="text-4xl font-black text-[#2C241E] uppercase tracking-tighter">Bảng điều khiển</h1></header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard title="Tổng đơn hàng" value={orders.length} icon={ShoppingBag} color="bg-[#B48C48]" />
                  <StatsCard title="Doanh thu" value={`${new Intl.NumberFormat('vi-VN').format(orders.reduce((acc, o) => acc + o.total_price, 0))}đ`} icon={ArrowUpRight} color="bg-[#3FB984]" />
                  <StatsCard title="Sản phẩm" value={dbProducts.length || MOCK_PRODUCTS.length} icon={Package} color="bg-[#8C6A3A]" />
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-8 animate-in fade-in">
                <header className="flex justify-between items-end">
                   <div><h1 className="text-4xl font-black text-[#2C241E] uppercase tracking-tighter">Quản lý Đơn hàng</h1></div>
                   <button onClick={fetchOrders} className="p-3 bg-white border border-[#B48C48]/10 rounded-xl text-[#7C746E] hover:text-[#B48C48]"><RefreshCw size={20} /></button>
                </header>
                <div className="bg-white rounded-[40px] border border-[#B48C48]/10 p-8 shadow-xl">
                  {orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map(order => (
                        <div key={order.id} className="p-6 bg-[#FAF9F6] rounded-[28px] border border-[#B48C48]/5 flex flex-col md:flex-row justify-between gap-6">
                          <div className="space-y-2">
                            <span className="text-[11px] font-black text-[#B48C48]">#{order.info_code}</span>
                            <h4 className="text-xl font-black text-[#2C241E]">{order.customer_name} - {order.phone}</h4>
                            <p className="text-xs text-[#7C746E] flex items-center gap-2"><Truck size={14} /> {order.address}</p>
                            <div className="flex gap-2 pt-2">
                               {order.items?.map((item: any, idx: number) => (
                                 <img key={idx} src={item.image} className="w-10 h-10 rounded-lg object-cover border border-[#B48C48]/10" alt="" />
                               ))}
                            </div>
                          </div>
                          <div className="flex flex-col md:items-end justify-between gap-4">
                             <p className="text-2xl font-black text-[#B48C48]">{new Intl.NumberFormat('vi-VN').format(order.total_price)}đ</p>
                             <div className="flex gap-2">
                                {['Đã tiếp nhận', 'Đang giao', 'Hoàn tất'].map(s => (
                                  <button key={s} onClick={() => updateOrderStatus(order.id, s)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${order.status === s ? 'bg-[#B48C48] text-white' : 'bg-white text-[#7C746E] border border-[#B48C48]/10'}`}>{s}</button>
                                ))}
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-center py-20 text-[#7C746E]">Chưa có đơn hàng nào.</p>}
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-8 animate-in fade-in">
                <header className="flex justify-between items-end">
                   <div><h1 className="text-4xl font-black text-[#2C241E] uppercase tracking-tighter">Kho Sản phẩm</h1></div>
                   <button onClick={() => setShowAddProduct(true)} className="px-6 py-3 bg-[#B48C48] text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2"><Plus size={16} /> Thêm mới</button>
                </header>

                <div className="bg-white rounded-[40px] border border-[#B48C48]/10 p-8 shadow-xl">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {(dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS).map(product => (
                        <div key={product.id} className="p-4 bg-[#FAF9F6] rounded-[24px] border border-[#B48C48]/5 flex items-center gap-4">
                           <img src={product.image} className="w-16 h-20 rounded-xl object-cover" alt="" />
                           <div className="flex-grow">
                              <h5 className="font-black text-[11px] uppercase text-[#2C241E] line-clamp-1">{product.name}</h5>
                              <p className="text-[#B48C48] font-black text-sm">{new Intl.NumberFormat('vi-VN').format(product.price)}đ</p>
                              <button onClick={() => deleteProduct(product.id)} className="mt-2 text-[#D9534F] hover:text-red-700 transition-colors"><Trash2 size={16} /></button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal Thêm Sản Phẩm */}
      {showAddProduct && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddProduct(false)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[40px] p-10 relative z-10 shadow-2xl animate-in zoom-in duration-300">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight">Sản phẩm mới</h2>
                <button onClick={() => setShowAddProduct(false)} className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#7C746E]"><X size={20} /></button>
             </div>
             <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-[#B48C48]">Tên rượu</label>
                   <input required className="w-full bg-[#FAF9F6] px-6 py-4 rounded-2xl border border-[#B48C48]/10 outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-[#B48C48]">Danh mục</label>
                   <select className="w-full bg-[#FAF9F6] px-6 py-4 rounded-2xl border border-[#B48C48]/10 outline-none" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}>
                      <option>Rượu Sâm</option><option>Rượu Nấm</option><option>Rượu Ba Kích</option><option>Rượu Đông Trùng</option><option>Rượu Trái Cây</option>
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-[#B48C48]">Giá bán (VNĐ)</label>
                   <input type="number" required className="w-full bg-[#FAF9F6] px-6 py-4 rounded-2xl border border-[#B48C48]/10 outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                </div>
                <div className="col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-[#B48C48]">Link hình ảnh (Unsplash/Imgur)</label>
                   <input required className="w-full bg-[#FAF9F6] px-6 py-4 rounded-2xl border border-[#B48C48]/10 outline-none" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                </div>
                <div className="col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-[#B48C48]">Mô tả công dụng</label>
                   <textarea rows={3} className="w-full bg-[#FAF9F6] px-6 py-4 rounded-2xl border border-[#B48C48]/10 outline-none resize-none" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
                </div>
                <button type="submit" className="col-span-2 py-5 bg-[#B48C48] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl flex items-center justify-center gap-2"><Save size={18} /> LƯU SẢN PHẨM</button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
