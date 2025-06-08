const fetch = require('node-fetch');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!global._firebaseApp) {
  global._firebaseApp = initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

const topics = [
    { topic: "آخرین تحولات بازار بورس و فرابورس ایران", category: "اقتصادی" },
    { topic: "رونمایی از جدیدترین دستاوردهای استارتاپ‌های دانش‌بنیان", category: "فناوری" },
    { topic: "عملکرد تیم ملی فوتبال ایران در رقابت‌های مقدماتی", category: "ورزشی" },
    { topic: "چالش‌های مدیریت منابع آبی در فلات مرکزی ایران", category: "محیط زیست" },
    { topic: "جدیدترین رویدادهای هنری و فرهنگی تهران", category: "فرهنگی" }
];

exports.handler = async () => {
    console.log("Journalist robot is waking up...");
    const topicData = topics[Math.floor(Math.random() * topics.length)];
    const prompt = `به عنوان یک خبرنگار حرفه‌ای و بی‌طرف، یک مقاله خبری جذاب و دقیق در دو پاراگراف در مورد موضوع زیر بنویس. فقط متن مقاله را برگردان، بدون هیچ عنوان یا مقدمه‌ای. موضوع: "${topicData.topic}"`;

    try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash/generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });
        
        const geminiData = await geminiResponse.json();
        const content = geminiData.candidates[0].content.parts[0].text;

        const newArticle = {
            title: topicData.topic,
            content: content,
            summary: content.substring(0, 120) + '...',
            category: topicData.category,
            timestamp: new Date()
        };

        await db.collection('articles').add(newArticle);
        
        console.log(`Successfully generated an article about: ${topicData.topic}`);
        return { statusCode: 200, body: "Article generated successfully." };

    } catch (error) {
        console.error("Error generating article:", error);
        return { statusCode: 500, body: "Error generating article." };
    }
};
