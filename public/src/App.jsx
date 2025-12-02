import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { ShoppingCart, Search, QrCode, Home, ArrowRight, Share2, Plus, Minus, Trash2, CheckCircle, Star } from 'lucide-react';
import { PRODUCTS, CATEGORIES } from './data/seed';
import { WhatsAppService, StorageService } from './lib/utils';
import ChatWidget from './components/ChatWidget';

// --- Components ---

function NavBar({ cartCount }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-2 z-40 pb-safe">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center text-gray-500 hover:text-[#008069] text-xs gap-1">
          <Home size={22} />
          <span>בית</span>
        </Link>
        <Link to="/scan" className="flex flex-col items-center justify-center -mt-6">
          <div className="bg-[#008069] text-white p-3 rounded-full shadow-lg shadow-green-200">
            <QrCode size={24} />
          </div>
          <span className="text-xs font-bold text-[#008069] mt-1">סרוק</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center text-gray-500 hover:text-[#008069] text-xs gap-1 relative">
          <ShoppingCart size={22} />
          {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
          <span>עגלה</span>
        </Link>
      </div>
    </nav>
  );
}

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredProducts = PRODUCTS.filter(p => p.title.includes(searchTerm) || p.sku.includes(searchTerm));

  return (
    <div className="pb-24 pt-4 px-4 min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-800">ח.סבן</h1>
          <p className="text-xs text-gray-500">חומרי בניין לבית ולמקצוען</p>
        </div>
        <img src="https://i.postimg.cc/d0Cxk6rK/lky-RRdh.jpg" className="w-10 h-10 rounded-full border border-gray-200" alt="logo" />
      </header>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute top-3 right-3 text-gray-400" size={20} />
        <input 
          type="text"
          placeholder="חיפוש מוצר, מקט או מותג..."
          className="w-full bg-white p-3 pr-10 rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-[#008069] outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories */}
      {!searchTerm && (
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-3 text-gray-700">מחלקות</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="min-w-[90px] h-24 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm border border-gray-100 shrink-0">
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-xs font-medium text-center px-1">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Grid */}
      <h2 className="font-bold text-lg mb-3 text-gray-700">{searchTerm ? 'תוצאות חיפוש' : 'מוצרים מומלצים'}</h2>
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-50 flex flex-col">
            <div className="bg-gray-100 rounded-xl aspect-square mb-3 overflow-hidden relative">
              <img src={p.image} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold">{p.brand}</div>
            </div>
            <h3 className="font-bold text-sm text-gray-800 leading-tight mb-1">{p.title}</h3>
            <div className="mt-auto flex justify-between items-end">
              <span className="text-lg font-black text-[#008069]">₪{p.price}</span>
              <button className="bg-gray-100 p-1.5 rounded-full text-[#008069]"><Plus size={16} /></button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProductPage({ updateCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) return <div>מוצר לא נמצא</div>;

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Hero */}
      <div className="relative h-80 bg-gray-100">
        <img src={product.image} className="w-full h-full object-cover" />
        <button onClick={() => navigate(-1)} className="absolute top-4 right-4 bg-white/80 backdrop-blur p-2 rounded-full shadow-sm z-10">
          <ArrowRight size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="-mt-8 relative z-10 bg-white rounded-t-3xl p-6 shadow-xl">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 leading-tight mb-1">{product.title}</h1>
            <p className="text-sm text-gray-500">מק"ט: {product.sku} | ספק: {product.supplier}</p>
          </div>
          <div className="text-2xl font-black text-[#008069]">₪{product.price}</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={() => WhatsAppService.shareProduct(product)}
            className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-3 rounded-xl font-bold text-sm border border-green-100"
          >
            <Share2 size={18} /> שתף בווטסאפ
          </button>
          <button 
            className="flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700 py-3 rounded-xl font-bold text-sm border border-yellow-100"
          >
            <Star size={18} /> כתוב ביקורת
          </button>
        </div>

        {/* Specs */}
        <div className="space-y-6">
          <section>
            <h3 className="font-bold text-gray-800 mb-2">תיאור המוצר</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-2">תכונות ויתרונות</h3>
            <ul className="space-y-2">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-[#008069] mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">מפרט טכני</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
              <div>
                <span className="block text-gray-400 text-xs">כיסוי למ"ר</span>
                <span className="font-medium text-gray-700">{product.technicalSpecs.coveragePerM2}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs">זמן ייבוש</span>
                <span className="font-medium text-gray-700">{product.technicalSpecs.dryingTime}</span>
              </div>
              <div>
                <span className="block text-gray-400 text-xs">תקן</span>
                <span className="font-medium text-gray-700">{product.technicalSpecs.standard}</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Floating Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
        <button 
          onClick={() => updateCart(product, 1)}
          className="w-full bg-[#008069] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition text-lg"
        >
          הוסף לעגלה - ₪{product.price}
        </button>
      </div>
    </div>
  );
}

function CartPage({ cart, updateCart, clearCart }) {
  const [customer, setCustomer] = useState({ name: '', phone: '', notes: '' });
  const total = cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
  const navigate = useNavigate();

  const handleSend = () => {
    if(!customer.name || !customer.phone) return alert('חובה למלא שם וטלפון');
    WhatsAppService.sendOrder(cart, customer);
    if(confirm('ההזמנה נשלחה? לנקות עגלה?')) {
      clearCart();
      navigate('/');
    }
  };

  if (cart.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <ShoppingCart size={64} className="text-gray-200 mb-4" />
      <h2 className="text-xl font-bold text-gray-800">העגלה ריקה</h2>
      <p className="text-gray-500 mb-6">התחל לסרוק מוצרים או דפדף בקטלוג</p>
      <Link to="/" className="text-[#008069] font-bold">חזרה לחנות</Link>
    </div>
  );

  return (
    <div className="pt-6 pb-24 px-4 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-black mb-6">ההזמנה שלי</h1>
      
      <div className="space-y-3 mb-8">
        {cart.map((item) => (
          <div key={item.product.id} className="bg-white p-3 rounded-xl shadow-sm flex gap-3">
            <img src={item.product.image} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
            <div className="flex-1">
              <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{item.product.title}</h3>
              <div className="text-[#008069] font-bold text-sm">₪{item.product.price * item.qty}</div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button onClick={() => updateCart(item.product, 0)} className="text-red-400 p-1"><Trash2 size={16} /></button>
              <div className="flex items-center bg-gray-100 rounded-lg h-8">
                <button onClick={() => updateCart(item.product, -1)} className="w-8 flex items-center justify-center">-</button>
                <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                <button onClick={() => updateCart(item.product, 1)} className="w-8 flex items-center justify-center">+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm mb-6">
        <h3 className="font-bold mb-4 flex items-center gap-2"><div className="w-1 h-4 bg-[#008069] rounded-full"></div> פרטי לקוח</h3>
        <div className="space-y-3">
          <input 
            type="text" placeholder="שם מלא *" 
            className="w-full bg-gray-50 p-3 rounded-xl text-sm border-none focus:ring-1 focus:ring-[#008069]"
            value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}
          />
          <input 
            type="tel" placeholder="טלפון נייד *" 
            className="w-full bg-gray-50 p-3 rounded-xl text-sm border-none focus:ring-1 focus:ring-[#008069]"
            value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}
          />
          <textarea 
            placeholder="הערות להזמנה..." 
            className="w-full bg-gray-50 p-3 rounded-xl text-sm border-none focus:ring-1 focus:ring-[#008069] h-20"
            value={customer.notes} onChange={e => setCustomer({...customer, notes: e.target.value})}
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t z-50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-500 text-sm">סה"כ לתשלום:</span>
          <span className="text-xl font-black text-gray-900">₪{total}</span>
        </div>
        <button 
          onClick={handleSend}
          className="w-full bg-[#008069] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition flex items-center justify-center gap-2"
        >
          שלח הזמנה בווטסאפ <Send size={18} />
        </button>
      </div>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    setCart(StorageService.getCart());
  }, []);

  const updateCart = (product, delta) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      let newCart;
      
      if (delta === 0) { // Remove
        newCart = prev.filter(i => i.product.id !== product.id);
      } else if (existing) {
        newCart = prev.map(i => i.product.id === product.id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0);
      } else {
        newCart = [...prev, { product, qty: 1 }];
      }
      
      StorageService.saveCart(newCart);
      return newCart;
    });
  };

  return (
    <Router>
      <div className="font-sans text-gray-900 dir-rtl">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage updateCart={updateCart} />} />
          <Route path="/cart" element={<CartPage cart={cart} updateCart={updateCart} clearCart={() => { setCart([]); StorageService.clearCart(); }} />} />
          <Route path="/scan" element={<div className="h-screen flex items-center justify-center bg-black text-white p-10 text-center">כאן יבוא רכיב סריקת הברקוד (BarcodeDetector API) <br/><Link to="/" className="text-[#008069] mt-4 block">חזרה</Link></div>} />
        </Routes>
        <NavBar cartCount={cart.reduce((a, b) => a + b.qty, 0)} />
        <ChatWidget />
      </div>
    </Router>
  );
}