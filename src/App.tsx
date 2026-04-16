import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  Plus, 
  Minus, 
  Navigation, 
  X, 
  Send, 
  ChevronLeft,
  Map as MapIcon,
  MessageSquare
} from 'lucide-react';
import { AreaId, AreaData, Message } from './types';
import { AREAS, INITIAL_ASSISTANT_MESSAGE } from './constants';

// --- Components ---

const MapScreen = ({ onSelectArea }: { onSelectArea: (area: AreaData) => void }) => {
  return (
    <div className="relative w-full h-full bg-[#e2e8f0] overflow-hidden flex flex-col">
      {/* Top Bar */}
      <header className="bg-white px-4 h-16 flex items-center justify-between border-b border-[#cbd5e1] z-50">
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 active:scale-95 transition-transform">
            <Menu size={20} />
          </button>
          <h1 className="text-base font-bold text-[#0f172a] tracking-tight">地図</h1>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
          <img 
            src="https://picsum.photos/seed/user/100/100" 
            alt="User" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </header>

      {/* Map Content */}
      <main className="flex-grow relative bg-[#f1f5f9]">
        {/* Header Overlay */}
        <div className="absolute top-4 left-4 right-4 z-40 pointer-events-none">
          <div className="text-xs font-semibold text-[#64748b]">
            1. 観光エリアを選ぶ
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white text-slate-900 rounded-full shadow-md flex items-center justify-center active:scale-90 transition-transform border border-slate-200">
            <Plus size={20} />
          </button>
          <button className="w-10 h-10 bg-white text-slate-900 rounded-full shadow-md flex items-center justify-center active:scale-90 transition-transform border border-slate-200">
            <Minus size={20} />
          </button>
        </div>

        {/* SVG Map Layer */}
        <div className="absolute inset-0 w-full h-full p-4">
          <div className="w-full h-full bg-[#f8fafc] rounded-2xl border border-[#cbd5e1] relative overflow-hidden">
            {/* Mock Map Background */}
            <img 
              src="https://picsum.photos/seed/tokyomap/1000/1500?grayscale&blur=2" 
              alt="Map" 
              className="w-full h-full object-cover opacity-10"
              referrerPolicy="no-referrer"
            />

            <svg viewBox="0 0 400 800" className="absolute inset-0 w-full h-full">
              {Object.values(AREAS).map((area) => (
                <g 
                  key={area.id} 
                  className="cursor-pointer group"
                  onClick={() => onSelectArea(area)}
                >
                  <motion.path 
                    d={`M ${area.points} Z`}
                    fill={area.fillColor}
                    fillOpacity={0.8}
                    stroke={area.strokeColor}
                    strokeWidth={2}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="transition-all duration-200"
                  />
                  <foreignObject 
                    x={area.labelPos.x} 
                    y={area.labelPos.y} 
                    width="100" 
                    height="30"
                    className="pointer-events-none"
                  >
                    <div className="flex justify-center">
                      <span className="text-[10px] font-bold text-[#0f172a] uppercase tracking-tighter">
                        {area.name}
                      </span>
                    </div>
                  </foreignObject>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
};

const BottomSheet = ({ 
  area, 
  onClose, 
  onStartChat 
}: { 
  area: AreaData | null; 
  onClose: () => void;
  onStartChat: () => void;
}) => {
  return (
    <AnimatePresence>
      {area && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px] z-[60]"
          />
          {/* Sheet */}
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-[70] px-4 pt-6 pb-10 border-t border-[#cbd5e1]"
          >
            <h3 className="text-[20px] font-extrabold text-[#0f172a] mb-2">{area.name}</h3>
            
            <p className="text-[13px] leading-[1.6] text-[#475569] mb-6">
              {area.summary}
              <br />
              <span className="text-[11px] opacity-60 mt-2 block">
                品川・大井町・芝公園・お台場の観光基本データをもとに、AIと会話できます。
              </span>
            </p>

            <button 
              onClick={onStartChat}
              className="w-full h-12 bg-[#06b6d4] text-white rounded-full font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <MessageSquare size={16} />
              チャットで尋ねる
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ChatScreen = ({ 
  area, 
  onBack 
}: { 
  area: AreaData; 
  onBack: () => void;
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: INITIAL_ASSISTANT_MESSAGE,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock assistant response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `${area.name}と芝公園・東京タワーを比較すると、芝公園は面積あたりの施設密度が高く凝縮されているのに対し、${area.name}はより広い面積に施設が点在している傾向が見られます。`,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-[#0f172a] z-[100] flex flex-col"
    >
      {/* Chat Header */}
      <header className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-[#0f172a] sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-1 text-[#67e8f9] active:scale-95 transition-transform"
        >
          <ChevronLeft size={18} />
          <span className="text-xs font-bold">地図へ戻る</span>
        </button>
        <h2 className="text-white font-bold text-sm">{area.name}</h2>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        <div className="flex items-center gap-1.5 text-[10px] text-[#94a3b8] mb-2">
          <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full" />
          Dify接続中
        </div>
        
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] px-4 py-3 text-[13px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#06b6d4] text-[#0f172a] font-medium rounded-2xl rounded-br-none' 
                  : 'bg-white/7 text-[#f1f5f9] border border-white/10 rounded-2xl rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#111827] border-t border-white/10 pb-8">
        <div className="relative flex items-center gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="入力例：このエリアはどんな観光体験に向いていますか？"
            className="flex-grow bg-[#0f172a] border border-[#67e8f9]/25 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-[#67e8f9]/50 transition-colors text-xs"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 bg-[#06b6d4] text-[#0f172a] rounded-xl flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);
  const [view, setView] = useState<'map' | 'chat'>('map');

  const handleSelectArea = (area: AreaData) => {
    setSelectedArea(area);
  };

  const handleStartChat = () => {
    if (selectedArea) {
      setView('chat');
    }
  };

  const handleBackToMap = () => {
    setView('map');
  };

  return (
    <div className="w-full h-screen bg-slate-200 font-sans selection:bg-cyan-200 selection:text-cyan-900">
      <MapScreen onSelectArea={handleSelectArea} />
      
      <BottomSheet 
        area={selectedArea} 
        onClose={() => setSelectedArea(null)}
        onStartChat={handleStartChat}
      />

      <AnimatePresence>
        {view === 'chat' && selectedArea && (
          <ChatScreen 
            area={selectedArea} 
            onBack={handleBackToMap} 
          />
        )}
      </AnimatePresence>

      {/* Global Navigation Hint (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-slate-900/10 pointer-events-none z-[200]" />
    </div>
  );
}
