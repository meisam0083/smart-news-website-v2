// This function quickly fetches pre-generated news from our archive.
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!global._firebaseApp) {
  global._firebaseApp = initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

exports.handler = async () => {
    try {
        const articlesRef = db.collection('articles');
        // Get the 10 most recent articles
        const snapshot = await articlesRef.orderBy('timestamp', 'desc').limit(10).get();

        if (snapshot.empty) {
            return { statusCode: 200, body: JSON.stringify([]) };
        }

        const articles = [];
        snapshot.forEach(doc => {
            articles.push({ id: doc.id, ...doc.data() });
        });
        
        // Convert Firestore Timestamps to strings so they can be sent
        const serializableArticles = articles.map(article => ({
            ...article,
            timestamp: article.timestamp.toDate().toISOString()
        }));

        return { statusCode: 200, body: JSON.stringify(serializableArticles) };
    } catch (error) {
        console.error("Error fetching articles:", error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Could not fetch articles.' }) };
    }
};
