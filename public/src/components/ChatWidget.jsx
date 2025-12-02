import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Bot, Sparkles, Globe, ExternalLink, Search } from 'lucide-react';
import { PRODUCTS } from '../data/seed';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'אהלן! אני הבוט של סבן. חפש מוצר (למשל "תרמוקיר 603") ואבדוק אם יש במלאי או אמצא לך מפרט מהרשת.' }
  ]);
  const [input, setInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const endRef = useRef(null);
  
  // גלילה אוטומטית להודעה האחרונה
  useEffect(() => {
    if (isOpen && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isSearching]);

  // פונקציה לחיפוש ברשת (Google API)
  const searchWeb = async (query) => {
    setIsSearching(true);
    try {
      // קריאה ל-Serverless Function שיצרנו
      const res = await fetch(`/api/product-search?query=${encodeURIComponent(query)}`);
      const data = await res.json();

      setIsSearching(false);

      if (data.items && data.items.length > 0) {
        const item = data.items[0]; // התוצאה הראשונה והכי רלוונטית
        // ניסיון לחלץ תמונה מתוך המטא-דאטה של גוגל
        const img = item.pagemap?.cse_image?.[0]?.src || item.pagemap?.og_image?.[0]?.src;

        return {
          type: 'bot',
          text: `לא מצאתי במלאי המקומי, אבל הנה מה שמצאתי ברשת על "${query}":`,
          isWebCard: true,
          data: {
            title: item.title,
            desc: item.snippet,
            link: item.link,
            img: img
          }
        };
      } else {
        return { type: 'bot', text: 'חיפשתי בכל הרשת ולא מצאתי מידע מדויק. כדאי לנסות שם מוצר אחר או לשאול נציג.' };
      }
    } catch (e) {
      console.error(e);
      setIsSearching(false);
      return { type: 'bot', text: 'נתקלתי בבעיה בחיבור לאינטרנט. נסה שוב מאוחר יותר.' };
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userText = input;
    // הוספת הודעת המשתמש
    setMessages(prev => [...prev, { type: 'user', text: userText }]);
    setInput('');

    // שלב 1: בדיקה במאגר המקומי (seed.js)
    const localProduct = PRODUCTS.find(p => p.title.includes(userText) || p.sku.includes(userText));

    if (localProduct) {
       setTimeout(() => {
           setMessages(prev => [...prev, { 
               type: 'bot', 
               text: `מצאתי את המוצר במלאי שלנו:`,
               isProductCard: true,
               product: localProduct
           }]);
       }, 500);
    } else {
       // שלב 2: אם לא מצאנו - הולכים לגוגל
       setIsSearching(true); // מציג אינדיקטור טעינה
       
       const webResult = await searchWeb(userText);
       
       setMessages(prev => [...prev, webResult]);
    }
  };

  return (
    <>
      {/* כפתור פתיחה צף */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 left-4 z-40 p-3 rounded-full shadow-xl transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'} bg-white text-[#008069]`}
      >
        <Bot size={28} />
      </button>

      {/* חלון הצ'אט */}
      {isOpen && (
        <div className="fixed bottom-4 left-4 right-4 md:left-4 md:right-auto md:w-80 h-[500px] bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
          
          {/* כותרת */}
          <div className="bg-[#008069] p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full"><Bot size={20} /></div>
              <span className="font-bold text-sm">העוזר של סבן (AI)</span>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>

          {/* איזור ההודעות */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/80">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-2xl text-sm shadow-sm ${
                  m.type === 'user' ? 'bg-[#008069] text-white rounded-tl-none' : 'bg-white text-gray-800 rounded-tr-none border border-gray-100'
                }`}>
                  {m.text}
                  
                  {/* כרטיס מוצר מקומי (מהמלאי) */}
                  {m.isProductCard && (
                      <div className="mt-3 bg-gray-50 rounded-xl p-2 border border-gray-100">
                          <img src={m.product.image} className="w-full h-24 object-cover rounded-lg mb-2 bg-white" />
                          <div className="font-bold">{m.product.title}</div>
                          <div className="text-[#008069] font-black">₪{m.product.price}</div>
                      </div>
                  )}

                  {/* כרטיס מוצר מהרשת (גוגל) */}
                  {m.isWebCard && (
                      <div className="mt-3 bg-blue-50 rounded-xl p-2 border border-blue-100 text-left" dir="ltr">
                          {m.data.img && <img src={m.data.img} className="w-full h-32 object-cover rounded-lg mb-2 bg-white" />}
                          <div className="font-bold text-blue-900 mb-1 text-right" dir="rtl">{m.data.title}</div>
                          <div className="text-xs text-gray-600 mb-2 line-clamp-3 text-right" dir="rtl">{m.data.desc}</div>
                          <a href={m.data.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-white p-2 rounded border border-blue-200 justify-center">
                              <Globe size={14}/> קרא עוד באתר הספק <ExternalLink size={12}/>
                          </a>
                      </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* אינדיקטור טעינה בזמן חיפוש */}
            {isSearching && (
                <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-tr-none border border-gray-100 flex gap-2 items-center text-xs text-gray-500">
                        <Sparkles size={16} className="animate-spin text-yellow-500"/> מחפש בגוגל...
                    </div>
                </div>
            )}
            <div ref={endRef} />
          </div>

          {/* שורת הקלדה */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="חפש מוצר (למשל: תרמוקיר 603)..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#008069] transition"
            />
            <button onClick={handleSend} className="bg-[#008069] text-white p-2.5 rounded-full shadow-lg active:scale-95 transition">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
