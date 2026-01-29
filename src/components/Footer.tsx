
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { BRAND_NAME } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF9F6] text-[#7C746E] pt-20 pb-10 border-t border-[#B48C48]/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B48C48] to-[#8C6A3A] flex items-center justify-center shadow-md">
                 <span className="text-xl">🍷</span>
              </div>
              <span className="text-2xl font-bold serif text-[#2C241E]">Thanh Hà</span>
            </Link>
            <p className="text-sm leading-relaxed font-medium">
              Chuyên rượu ngâm dược liệu chuẩn vị: sâm, nấm, ba kích, đông trùng... Gìn giữ tinh hoa dược liệu Việt cho sức khỏe cộng đồng.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-[#B48C48]/10 flex items-center justify-center hover:bg-[#B48C48] hover:text-white transition-all shadow-sm">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-[#B48C48]/10 flex items-center justify-center hover:bg-[#0068ff] hover:text-white transition-all shadow-sm">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold serif text-[#B48C48] mb-8 uppercase tracking-widest">Sản Phẩm</h4>
            <ul className="space-y-4">
              <li><Link to="/products" className="text-sm hover:text-[#B48C48] transition-colors">Rượu Sâm Quý</Link></li>
              <li><Link to="/products" className="text-sm hover:text-[#B48C48] transition-colors">Rượu Thuốc Gia Truyền</Link></li>
              <li><Link to="/products" className="text-sm hover:text-[#B48C48] transition-colors">Rượu Trái Cây Lên Men</Link></li>
              <li><Link to="/products" className="text-sm hover:text-[#B48C48] transition-colors">Bình Ngâm Nghệ Thuật</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold serif text-[#B48C48] mb-8 uppercase tracking-widest">Thông Tin</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <MapPin size={20} className="text-[#B48C48] shrink-0" />
                <span className="text-sm font-medium">Đống Đa, Hà Nội, Việt Nam</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={20} className="text-[#B48C48] shrink-0" />
                <span className="text-sm font-medium">090x xxx xxx</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={20} className="text-[#B48C48] shrink-0" />
                <span className="text-sm font-medium">buingoctay1@mail.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold serif text-[#B48C48] mb-8 uppercase tracking-widest">Newsletter</h4>
            <p className="text-sm mb-6 font-medium">Nhận thông tin ưu đãi mới nhất từ chúng tôi qua Email.</p>
            <div className="flex bg-white rounded-xl border border-[#B48C48]/20 overflow-hidden p-1 shadow-sm">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="bg-transparent px-4 py-2 text-sm w-full focus:outline-none text-[#2C241E]"
              />
              <button className="bg-[#B48C48] text-white p-3 rounded-lg hover:bg-[#8C6A3A] transition-colors">
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] mt-4 text-[#7C746E] italic">* Không bán rượu cho người dưới 18 tuổi.</p>
          </div>
        </div>

        <div className="border-t border-[#B48C48]/10 pt-10 text-center">
          <p className="text-[11px] font-bold text-[#7C746E] uppercase tracking-widest opacity-60">
            &copy; {new Date().getFullYear()} {BRAND_NAME} — Tinh Hoa Dược Liệu Việt.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
