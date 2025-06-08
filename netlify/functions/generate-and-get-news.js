const fetch = require('node-fetch');

// لیست ثابت موضوعات داغ ایران
const topics = [
    { id: 'stock', topic: "آخرین تحولات بازار بورس و فرابورس ایران", category: "اقتصادی" },
    { id: 'startup', topic: "رونمایی از جدیدترین دستاوردهای استارتاپ‌های دانش‌بنیان", category: "فناوری" },
    { id: 'football', topic: "عملکرد تیم ملی فوتبال ایران در رقابت‌های مقدماتی", category: "ورزشی" }
];

exports.handler = async () => {
    const { GEMINI_API_KEY } = process.env;
    if (!GEMINI_API_KEY) {
        return { statusCode: 500, body: JSON.stringify({ error: "API key not configured." }) };
    }

    try {
        // برای هر موضوع، یک درخواست به هوش مصنوعی می‌زنیم تا مقاله تولید کند
        const articlePromises = topics.map(async (topicData) => {
            const prompt = `به عنوان یک سردبیر خبری حرفه‌ای، یک مقاله کامل، دقیق و جذاب در سه پاراگراف در مورد موضوع زیر بنویس. یک عنوان اصلی و جذاب برای مقاله در خط اول قرار بده و سپس در خطوط بعدی، متن مقاله را بنویس.
            موضوع: "${topicData.topic}"`;

            const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash/generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
            });

            if (!geminiResponse.ok) return null;

            const geminiData = await geminiResponse.json();
            const fullText = geminiData.candidates[0].content.parts[0].text;
            
            const lines = fullText.split('\n');
            const title = lines[0].replace(/#| \*/g, '').trim(); // حذف کاراکترهای اضافی از عنوان
            const content = lines.slice(1).join('\n').trim();

            return {
                id: topicData.id,
                title: title,
                summary: content.substring(0, 150) + '...', // خلاصه کوتاه برای کارت
                content: content, // متن کامل برای صفحه جزئیات
                category: topicData.category,
                timestamp: new Date().toISOString()
            };
        });

        // منتظر می‌مانیم تا تمام مقاله‌ها تولید شوند
        const generatedArticles = await Promise.all(articlePromises);
        const validArticles = generatedArticles.filter(Boolean); // حذف موارد ناموفق

        return {
            statusCode: 200,
            body: JSON.stringify(validArticles)
        };

    } catch (error) {
        console.error("Error in function:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
