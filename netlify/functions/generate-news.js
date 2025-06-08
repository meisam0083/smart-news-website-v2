const fetch = require('node-fetch');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

function getDb() {
    if (global._firebaseApp) return getFirestore();
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        global._firebaseApp = initializeApp({ credential: cert(serviceAccount) });
        return getFirestore();
    } catch (e) {
        console.error("Firebase Admin SDK initialization error:", e);
        return null;
    }
}

const topics = [
    { topic: "آخرین تحولات بازار بورس و فرابورس ایران", category: "اقتصادی" },
    { topic: "رونمایی از جدیدترین دستاوردهای استارتاپ‌های دانش‌بنیان", category: "فناوری" },
    { topic: "عملکرد تیم ملی فوتبال ایران در رقابت‌های مقدماتی", category: "ورزشی" }
];

exports.handler = async () => {
    console.log("Journalist robot starting...");
    const db = getDb();
    if (!db) return { statusCode: 500, body: "Database connection failed." };

    const topicData = topics[Math.floor(Math.random() * topics.length)];
    const prompt = `به عنوان یک خبرنگار حرفه‌ای، یک مقاله خبری جذاب در دو پاراگراف در مورد این موضوع بنویس: "${topicData.topic}"`;

    try {
        const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash/generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST', body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });
        
        if (!geminiResponse.ok) throw new Error("Gemini API call failed");
        
        const geminiData = await geminiResponse.json();
        const content = geminiData.candidates[0].content.parts[0].text;

        const newArticle = {
            title: topicData.topic,
            summary: content.substring(0, 150) + '...',
            category: topicData.category,
            timestamp: new Date()
        };

        await db.collection('articles').add(newArticle);
        return { statusCode: 200, body: "OK" };
    } catch (error) {
        console.error("Error:", error);
        return { statusCode: 500, body: error.toString() };
    }
};
