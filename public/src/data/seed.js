export const PRODUCTS = [
  {
    id: 'p_quartzite_001',
    sku: 'QRTZ-25KG',
    title: 'שק קוורצית (גרנוליט) דק',
    brand: 'בטון עטרות',
    supplier: 'ח.סבן אספקה',
    image: 'https://betonatarot.co.il/wp-content/uploads/2020/06/%D7%A9%D7%A7-%D7%A7%D7%95%D7%95%D7%A8%D7%A6%D7%99%D7%AA-17.5.2020-s-.jpg',
    description: 'אגרגט קוורץ טבעי בגוון לבן/קרם, משמש ליציקות דקורטיביות, חיפוי גרנוליט וגינון. החומר עובר שטיפה וניפוי קפדני להבטחת איכות וגודל גרגר אחיד.',
    features: [
      'גודל גרגר: 1.2-2.5 מ"מ (דק)',
      'משקל שק: 25 ק"ג',
      'עמידות גבוהה לשחיקה ותנאי חוץ',
      'גוון טבעי שאינו דוהה בשמש',
      'מתאים לערבוב עם מלט לבן ליציקות'
    ],
    technicalSpecs: {
      coveragePerM2: 'כ-50 ק"ג למ"ר (בעובי 2 ס"מ)',
      dryingTime: '24 שעות לייבוש ראשוני, 7 ימים לאשפרה מלאה',
      standard: 'ת"י 118 (אגרגטים לבטון)',
      applicationTemp: '5°C עד 35°C'
    },
    price: 45,
    stock: 150,
    category: 'aggr'
  },
  {
    id: 'p_cement_001',
    sku: 'CMT-GRY',
    title: 'מלט אפור 50 ק"ג',
    brand: 'נשר',
    supplier: 'נשר מפעלי מלט',
    image: 'https://placehold.co/400x400/e2e8f0/1e293b?text=Cement',
    description: 'מלט פורטלנד איכותי לבנייה כללית, טיח ויציקות בטון.',
    features: ['חוזק בטון גבוה (B-30)', 'התקשות מהירה', 'עבידות מעולה'],
    technicalSpecs: {
      coveragePerM2: 'משתנה לפי יחס התערובת',
      dryingTime: '10 שעות',
      standard: 'ת"י 1',
    },
    price: 28,
    stock: 500,
    category: 'cement'
  }
];

export const CATEGORIES = [
  { id: 'aggr', name: 'אגרגטים וחצץ', icon: '🪨' },
  { id: 'cement', name: 'מלט ומליטה', icon: '🧱' },
  { id: 'tools', name: 'כלי עבודה', icon: '🔨' },
  { id: 'paint', name: 'צבע ואיטום', icon: '🎨' }
];