export default async function handler(req, res) {
  // 1. קבלת שאילתת החיפוש מהבוט
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing query' });
  }

  try {
    // 2. הגדרת מנוע החיפוש של גוגל (Programmable Search Engine)
    // הערה: נדרש מפתח API חינמי (הסבר למטה)
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const CX = process.env.GOOGLE_CX; // מזהה מנוע החיפוש

    if (!GOOGLE_API_KEY || !CX) {
      // מצב דמה (Mock) למקרה שאין עדיין מפתחות - כדי שהאפליקציה תעבוד בבדיקה
      return res.status(200).json({
        items: [
          {
            title: `תוצאה מהרשת: ${query}`,
            link: "https://www.thermokir.co.il/product/plastomer-603/",
            snippet: "פלסטומר 603 - דבק אקרילי להדבקת אריחים. מתאים לשימוש פנים וחוץ. בעל גמישות ותכונות הידבקות מעולות.",
            pagemap: {
              cse_image: [{ src: "https://www.thermokir.co.il/wp-content/uploads/2020/05/603-new.jpg" }]
            }
          }
        ]
      });
    }

    // 3. ביצוע החיפוש האמיתי בגוגל
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url);
    const data = await response.json();

    // 4. החזרת התוצאות לבוט
    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
}
