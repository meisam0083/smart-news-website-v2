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
        console.error("Error fetching articles:", error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Could not fetch articles.' }) };
    }
};
