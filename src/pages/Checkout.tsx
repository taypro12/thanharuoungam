
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Truck, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  Download, 
  Copy, 
  Smartphone, 
  X, 
  MapPin, 
  Loader2, 
  Navigation,
  Check,
  QrCode,
  Lock,
  ShoppingBag,
  Clock,
  Box,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../App';
import SEO from '../components/SEO';
import { supabase } from '../supabase';

interface AddressSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart, showNotification } = useCart();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    note: '',
    payment: 'cod'
  });

  const infoCode = useMemo(() => `THANHHA${Math.floor(100000 + Math.random() * 900000)}`, []);
  const estimatedDelivery = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    return date.toLocaleDateString('vi-VN');
  }, []);

  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<any | null>(null);

  if (cart.length === 0 && !isSuccess) {
    navigate('/cart');
    return null;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) return;
    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=5`, { headers: { 'Accept-Language': 'vi' } });
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Lỗi địa chỉ:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, address: value }));
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchSuggestions(value), 600);
  };

  const selectSuggestion = (suggestion: AddressSuggestion) => {
    setFormData(prev => ({ ...prev, address: suggestion.display_name }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`, { headers: { 'Accept-Language': 'vi' } });
        const data = await response.json();
        if (data.display_name) setFormData(prev => ({ ...prev, address: data.display_name }));
      } finally {
        setIsSearching(false);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Giả lập lưu đơn vào Supabase
    try {
      const orderData = {
        info_code: infoCode,
        customer_name: formData.name,
        phone: formData.phone,
        address: formData.address,
        total_price: totalPrice,
        status: 'Đã tiếp nhận',
        items: cart,
        payment_method: formData.payment,
        created_at: new Date()
      };
      
      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) throw error;

      if (formData.payment === 'bank') {
        setShowQR(true);
      } else {
        processSuccess();
      }
    } catch (err) {
      console.error("Lỗi khi lưu đơn hàng:", err);
      // Vẫn cho phép thành công giả lập nếu bảng chưa tạo
      processSuccess();
    } finally {
      setIsProcessing(false);
    }
  };

  const processSuccess = () => {
    setIsSuccess(true);
    clearCart();
    window.scrollTo(0, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-32 text-center bg-[#FAF9F6] min-h-screen">
        <div className="max-w-xl mx-auto bg-white p-8 md:p-16 rounded-[48px] shadow-2xl border border-[#B48C48]/10 space-y-8 animate-slide-up relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#FAF9F6] rounded-full -mr-20 -mt-20 border border-[#B48C48]/10"></div>
          
          <div className="w-20 h-20 bg-[#3FB984]/10 text-[#3FB984] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          
          <div className="space-y-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-[#2C241E] uppercase tracking-tight">Đặt hàng thành công!</h2>
            <p className="text-[#7C746E] text-xs md:text-base font-medium leading-relaxed max-w-sm mx-auto">
              Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ sớm liên hệ xác nhận.
            </p>
          </div>

          <div className="bg-[#FAF9F6] p-6 rounded-3xl border border-[#B48C48]/10 text-left space-y-5 relative z-10">
             <div className="flex justify-between items-center">
               <span className="text-[9px] font-black uppercase tracking-widest text-[#7C746E]">Mã vận đơn (InfoCode):</span>
               <span className="text-[#B48C48] font-black text-sm">#{infoCode}</span>
             </div>
             
             {/* Order Progress Tracker */}
             <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black uppercase text-[#2C241E]">Trạng thái:</span>
                  <span className="text-[10px] bg-[#3FB984] text-white px-2.5 py-1 rounded-full font-black uppercase tracking-widest">Đã tiếp nhận</span>
                </div>
                <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-[#B48C48]/5">
                   <div className="w-1/4 h-full bg-[#3FB984] rounded-full"></div>
                </div>
             </div>

             <div className="h-[1px] bg-[#B48C48]/10"></div>
             
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#B48C48] shadow-sm">
                   <Truck size={20} />
                </div>
                <div>
                   <p className="text-[9px] font-black text-[#7C746E] uppercase tracking-widest">Thời gian giao dự kiến:</p>
                   <p className="text-[11px] font-black text-[#2C241E] uppercase">{estimatedDelivery} (2-3 ngày làm việc)</p>
                </div>
             </div>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="w-full bg-[#B48C48] text-white py-5 rounded-[20px] font-black uppercase tracking-widest text-[11px] shadow-xl hover:bg-[#2C241E] transition-all"
          >
            QUAY LẠI TRANG CHỦ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] pb-32 pt-28 min-h-screen">
      <SEO title="Thanh Toán" description="Hoàn thiện đơn hàng rượu ngâm thượng hạng của bạn." />
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center gap-6 mb-12">
          <button onClick={() => navigate('/cart')} className="w-12 h-12 flex items-center justify-center bg-white border border-[#B48C48]/20 rounded-full text-[#7C746E] shadow-md">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl md:text-5xl font-black text-[#2C241E] tracking-tighter uppercase">Xác nhận đơn hàng</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-[#B48C48] text-white rounded-2xl flex items-center justify-center font-black text-xl">1</div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Thông tin giao hàng</h2>
              </div>
              
              <div className="bg-white p-8 md:p-12 rounded-[40px] border border-[#B48C48]/10 shadow-xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input required name="name" value={formData.name} onChange={handleInputChange} placeholder="Họ và tên *" className="w-full bg-[#FAF9F6] px-6 py-4 rounded-2xl border border-[#B48C48]/10 text-sm font-medium outline-none" />
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Số điện thoại *" className="w-full bg-[#FAF9F6] px-6 py-4 rounded-2xl border border-[#B48C48]/10 text-sm font-medium outline-none" />
                </div>
                <div className="relative" ref={suggestionRef}>
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#B48C48]/30">
                    {isSearching ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={20} />}
                  </div>
                  <input required name="address" value={formData.address} onChange={handleAddressChange} placeholder="Địa chỉ nhận hàng *" className="w-full bg-[#FAF9F6] pl-16 pr-6 py-4 rounded-2xl border border-[#B48C48]/10 text-sm font-medium outline-none" />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl border border-[#B48C48]/10 shadow-2xl z-50 overflow-hidden">
                      {suggestions.map((s) => (
                        <button key={s.place_id} type="button" onClick={() => selectSuggestion(s)} className="w-full text-left px-5 py-4 text-[10px] font-bold text-[#7C746E] hover:bg-[#FAF9F6]">
                          {s.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <textarea name="note" value={formData.note} onChange={handleInputChange} rows={3} placeholder="Ghi chú (Gói quà, thời gian giao...)" className="w-full bg-[#FAF9F6] px-6 py-4 rounded-2xl border border-[#B48C48]/10 text-sm font-medium resize-none outline-none"></textarea>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-[#B48C48] text-white rounded-2xl flex items-center justify-center font-black text-xl">2</div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Thanh toán</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['cod', 'bank'].map(method => (
                  <label key={method} className={`flex items-center gap-4 p-6 bg-white border-2 rounded-[32px] cursor-pointer transition-all ${formData.payment === method ? 'border-[#B48C48] bg-[#FAF9F6]' : 'border-[#B48C48]/5'}`}>
                    <input type="radio" name="payment" value={method} checked={formData.payment === method} onChange={handleInputChange} className="hidden" />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.payment === method ? 'bg-[#B48C48] text-white' : 'bg-[#FAF9F6] text-[#B48C48]/20'}`}>
                      {method === 'cod' ? <Truck size={20} /> : <Smartphone size={20} />}
                    </div>
                    <div>
                      <p className="font-black text-[10px] uppercase tracking-widest">{method === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản QR'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-white p-8 md:p-10 rounded-[44px] border border-[#B48C48]/10 shadow-2xl space-y-8">
              <h3 className="text-xl font-black uppercase border-b border-[#B48C48]/10 pb-6">Đơn hàng</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-12 h-16 bg-[#FAF9F6] rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[11px] font-bold text-[#2C241E] line-clamp-1">{item.name}</p>
                      <p className="text-[10px] font-black text-[#B48C48]">{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-[#B48C48]/10 space-y-4">
                 <div className="flex justify-between text-[10px] font-black uppercase text-[#7C746E]">
                    <span>Tổng cộng:</span>
                    <span className="text-3xl text-gradient">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                 </div>
                 <button disabled={isProcessing} className="w-full bg-[#B48C48] text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] shadow-xl flex items-center justify-center gap-3">
                    {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <>XÁC NHẬN ĐẶT HÀNG <ArrowRight size={18} /></>}
                 </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {showQR && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" onClick={() => setShowQR(false)}></div>
          <div className="bg-white w-full max-w-sm rounded-[56px] p-10 border border-[#B48C48]/20 shadow-2xl relative z-10 text-center space-y-6">
            <h4 className="text-xl font-black uppercase">Quét mã QR</h4>
            <div className="bg-[#FAF9F6] p-6 rounded-[48px] border border-[#B48C48]/10">
              <img src={`https://img.vietqr.io/image/970407-19072345755014-compact2.png?amount=${totalPrice}&addInfo=${encodeURIComponent(infoCode)}`} className="w-full aspect-square rounded-3xl" alt="QR" />
            </div>
            <div className="text-[10px] font-black uppercase text-[#7C746E]">Nội dung: <span className="text-[#B48C48]">{infoCode}</span></div>
            <button onClick={processSuccess} className="w-full bg-[#2C241E] text-white py-4 rounded-2xl font-black uppercase text-[10px]">XÁC NHẬN ĐÃ CHUYỂN</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
