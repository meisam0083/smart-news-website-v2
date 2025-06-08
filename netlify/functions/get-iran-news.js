const fetch = require('node-fetch');

// لیست موضوعات داغ ایران
const topics = [
    "آخرین تحولات بازار بورس و فرابورس ایران",
    "رونمایی از جدیدترین دستاوردهای استارتاپ‌های دانش‌بنیان",
    "عملکرد تیم ملی فوتبال ایران در رقابت‌های مقدماتی",
    "چالش‌های مدیریت منابع آبی در فلات مرکزی ایران",
    "جدیدترین رویدادهای هنری و فرهنگی تهران"
];

exports.handler = async () => {
    // خواندن کلید مخفی جیمنی از گاوصندوق
    const { GEMINI_API_KEY } = process.env;

    if (!GEMINI_API_KEY) {
        return { statusCode: 500, body: "کلید API هوش مصنوعی تنظیم نشده است." };
    }

    try {
        // تبدیل هر موضوع به یک مقاله کامل توسط هوش مصنوعی
        const generatedArticles = await Promise.all(
            topics.map(async (topic) => {
                const prompt = `به عنوان یک خبرنگار حرفه‌ای، یک مقاله خبری جذاب در دو پاراگراف در مورد موضوع زیر بنویس: "${topic}"`;
                
                const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash/generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
                });

                if (!geminiResponse.ok) return null;

                const geminiData = await geminiResponse.json();
                const content = geminiData.candidates[0].content.parts[0].text;

                return {
                    id: topic, // از خود موضوع به عنوان شناسه استفاده می کنیم
                    title: topic,
                    summary: content.substring(0, 120) + '...',
                    category: "عمومی",
                    timestamp: new Date().toISOString(),
                };
            })
        );
        
        const validArticles = generatedArticles.filter(Boolean);

        return {
            statusCode: 200,
            body: JSON.stringify(validArticles)
        };

    } catch (error) {
        console.error("Error in function:", error);
        return { statusCode: 500, body: `خطای داخلی سرور: ${error.message}` };
    }
};
