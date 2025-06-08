const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

function getDb() {
    if (!global._firebaseApp) {
         const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        global._firebaseApp = initializeApp({
            credential: cert(serviceAccount)
        });
    }
    return getFirestore();
}

exports.handler = async () => {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        console.error("CRITICAL ERROR: Firebase service account key is not set.");
        return { statusCode: 500, body: "Server configuration error." };
    }

    const db = getDb();
    
    try {
        const articlesRef = db.collection('articles');
        const snapshot = await articlesRef.orderBy('timestamp', 'desc').limit(10).get();

        if (snapshot.empty) {
            return { statusCode: 200, body: JSON.stringify([]) };
        }

        const articles = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate().toISOString()
        }));

        return { statusCode: 200, body: JSON.stringify(articles) };
    } catch (error) {
        console.error("Detailed Error fetching articles:", error);
        return { statusCode: 500, body: JSON.stringify({ error: `Could not fetch articles: ${error.message}` }) };
    }
};
