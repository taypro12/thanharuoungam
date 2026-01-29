
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { MOCK_PRODUCTS } from '../constants';

const AISommelier: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Chào bạn, tôi là Chuyên gia tư vấn của Thanh Hà. Bạn đang tìm kiếm loại rượu ngâm nào cho nhu cầu sức khỏe hay làm quà biếu?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const productContext = MOCK_PRODUCTS.map(p => 
        `- ${p.name}: ${p.description} (Dành cho: ${p.tags?.join(', ')}). Giá: ${p.price}đ`
      ).join('\n');

      const systemInstruction = `
        Bạn là một chuyên gia về rượu thuốc và rượu ngâm dược liệu tại "Rượu Ngâm Thanh Hà".
        Nhiệm vụ: Tư vấn sản phẩm phù hợp nhất dựa trên nhu cầu sức khỏe (mất ngủ, đau xương khớp, sinh lực) hoặc mục đích biếu tặng.
        Danh sách sản phẩm của cửa hàng:
        ${productContext}
        
        Quy tắc:
        1. Phản hồi ngắn gọn, sang trọng, am hiểu về đông y.
        2. Luôn gợi ý 1-2 sản phẩm cụ thể từ danh sách trên bằng cách nêu tên chính xác.
        3. Nếu khách hỏi về sức khỏe, hãy khuyên họ sử dụng điều độ và không dùng quá liều.
        4. Trả lời bằng tiếng Việt, giọng điệu chuyên nghiệp và nhiệt tình.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const aiText = response.text || "Xin lỗi, tôi gặp chút gián đoạn. Bạn có thể hỏi lại được không?";
      setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Tôi đang bận một chút, bạn vui lòng nhắn lại sau hoặc gọi hotline nhé!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[100] flex flex-col items-end">
      {isOpen ? (
        <div className="w-[320px] md:w-[380px] h-[500px] glass bg-white/95 rounded-[32px] border-[#B48C48]/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header Sáng */}
          <div className="p-4 bg-white border-b border-[#B48C48]/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B48C48]/10 flex items-center justify-center text-[#B48C48] border border-[#B48C48]/20">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-[11px] font-black text-[#2C241E] uppercase tracking-widest">AI Sommelier</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3fb984] animate-pulse"></div>
                  <span className="text-[8px] font-bold text-[#7C746E] uppercase">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#7C746E] hover:text-[#B48C48] transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Sáng */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar bg-[#FAF9F6]/30">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-[12px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                  ? 'bg-[#B48C48] text-white font-bold rounded-tr-none' 
                  : 'bg-white text-[#2C241E] border border-[#B48C48]/10 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-[#B48C48]/10 shadow-sm">
                  <Loader2 size={16} className="animate-spin text-[#B48C48]" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area Sáng */}
          <div className="p-4 border-t border-[#B48C48]/10 bg-white">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex items-center gap-2"
            >
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hỏi về sâm, ba kích..."
                className="flex-grow bg-[#FAF9F6] border border-[#B48C48]/10 rounded-xl px-4 py-2.5 text-xs text-[#2C241E] outline-none focus:border-[#B48C48]/40 transition-all"
              />
              <button 
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-[#B48C48] text-white flex items-center justify-center transition-all hover:bg-[#8C6A3A] disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="text-[8px] text-center mt-2 text-[#7C746E]/50 uppercase font-black tracking-widest flex items-center justify-center gap-1">
              <Sparkles size={8} /> Powered by Gemini Flash
            </p>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-br from-[#B48C48] to-[#8C6A3A] text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group relative"
        >
          <div className="absolute inset-0 rounded-full bg-[#B48C48] animate-ping opacity-20 group-hover:hidden"></div>
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default AISommelier;
