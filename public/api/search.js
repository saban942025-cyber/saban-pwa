export default async function handler(req, res) {
  // 1. קבלת שאילתת החיפוש מהבוט
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    // 2. הגדרת מנוע החיפוש של גוגל (Programmable Search Engine)
    // עדכנתי את המפתחות ששלחת בקוד כדי שזה יעבוד מיד
    const GOOGLE_API_KEY = "AIzaSyBtTsufWhuB7_Xn6TUONpGQ7ydlpmgynUI"; 
    const CX = "3331a7d5c75e14f26"; 

    // 3. ביצוע החיפוש האמיתי בגוגל
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Google API Error: ${response.statusText}`);
    }

    const data = await response.json();

    // 4. החזרת התוצאות לבוט
    res.status(200).json(data);

  } catch (error) {
    console.error("Search Error:", error);
    // במקרה של שגיאה, נחזיר תשובה ריקה כדי שהבוט ידע להתמודד
    res.status(500).json({ error: 'Failed to fetch results', details: error.message });
  }
}
