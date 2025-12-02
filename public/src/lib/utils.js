const PHONE_NUMBER = "972508860896";

export const WhatsAppService = {
  shareProduct: (product) => {
    const text = `היי ח.סבן, התעניינתי במוצר: *${product.title}* (מק"ט ${product.sku}). אשמח לפרטים נוספים.`;
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  },

  sendOrder: (cartItems, customerDetails) => {
    let msg = `👋 שלום, אני מעוניין לבצע הזמנה חדשה:\n\n`;
    let total = 0;

    cartItems.forEach((item, idx) => {
      const lineTotal = item.product.price * item.qty;
      total += lineTotal;
      msg += `${idx + 1}. *${item.product.title}*\n`;
      msg += `   כמות: ${item.qty} | מק"ט: ${item.product.sku}\n`;
    });

    msg += `\n💰 *סה"כ לתשלום: ₪${total}*\n`;
    msg += `----------------\n`;
    msg += `👤 *פרטי לקוח:*\n`;
    msg += `שם: ${customerDetails.name}\n`;
    msg += `נייד: ${customerDetails.phone}\n`;
    
    if (customerDetails.notes) msg += `הערות: ${customerDetails.notes}\n`;

    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  },

  sendReview: (reviewData) => {
    const msg = `⭐ *ביקורת חדשה לח.סבן*\nמאת: ${reviewData.name}\nדירוג: ${"⭐".repeat(reviewData.rating)}\n\n"${reviewData.text}"`;
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  }
};

export const StorageService = {
  getCart: () => JSON.parse(localStorage.getItem('saban_cart') || '[]'),
  saveCart: (cart) => localStorage.setItem('saban_cart', JSON.stringify(cart)),
  clearCart: () => localStorage.removeItem('saban_cart')
};