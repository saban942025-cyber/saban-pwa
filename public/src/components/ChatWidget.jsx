import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

// נתונים סטטיים לבוט (בפרודקשן יגיעו מ-GitHub/Firebase כפי שבנינו קודם)
const MOCK_KB = [
  { keys: ['מחיר', 'עולה'], ans: 'המחירים באתר מעודכנים. להצעת מחיר כמותית מומלץ לשלוח הזמנה בווטסאפ.' },
  { keys: ['שעות', 'פתוח'], ans: 'אנחנו פתוחים בימים א-ה בין 07:00-17:00, ובימי ו עד 13:00.' },
  { keys: ['משלוח', 'הובלה'], ans: 'יש לנו שירותי מנוף והובלה לכל הארץ. עלות הובלה תלויה במיקום ובכמות.' },
  { keys: ['יבוש', 'זמן'], ans: 'זמני הייבוש משתנים ממוצר למוצר. בדוק את לשונית "מפרט טכני" בדף המוצר.' }
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'אהלן! אני הבוט של סבן. ממתין בתור? שאל אותי כל דבר על המוצרים.' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (isOpen && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // User Msg
    const userMsg = { type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Bot Logic
    setTimeout(() => {
      const lower = userMsg.text.toLowerCase();
      const match = MOCK_KB.find(kb => kb.keys.some(k => lower.includes(k)));
      
      const botResponse = match 
        ? match.ans 
        : 'לא בטוח לגבי זה. נסה לשאול על מחירים, שעות פתיחה, או משלוחים. או שתדבר עם נציג בדלפק.';
        
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 left-4 z-40 p-3 rounded-full shadow-xl transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'} bg-white text-[#008069]`}
      >
        <Bot size={28} />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-80 h-[450px] bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          
          {/* Header */}
          <div className="bg-[#008069] p-3 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full"><Bot size={18} /></div>
              <span className="font-bold text-sm">העוזר של סבן</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-2.5 rounded-xl text-sm shadow-sm ${
                  m.type === 'user' 
                    ? 'bg-[#008069] text-white rounded-tl-none' 
                    : 'bg-white text-gray-800 rounded-tr-none border border-gray-100'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="שאל שאלה..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#008069]"
            />
            <button onClick={handleSend} className="bg-[#008069] text-white p-2 rounded-full shadow-md active:scale-95">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}