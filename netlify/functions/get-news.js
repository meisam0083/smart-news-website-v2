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

exports.handler = async () => {
    const db = getDb();
    if (!db) return { statusCode: 500, body: JSON.stringify({error: "DB connection failed."}) };
    
    try {
        const snapshot = await db.collection('articles').orderBy('timestamp', 'desc').limit(10).get();
        if (snapshot.empty) return { statusCode: 200, body: JSON.stringify([]) };
        
        const articles = snapshot.docs.map(doc => ({
            id: doc.id, ...doc.data(), timestamp: doc.data().timestamp.toDate().toISOString()
        }));
        
        return { statusCode: 200, body: JSON.stringify(articles) };
    } catch (error) {
        console.error("Error:", error);
        return { statusCode: 500, body: JSON.stringify({error: error.toString()}) };
    }
};
