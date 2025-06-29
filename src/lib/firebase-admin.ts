import * as admin from 'firebase-admin';

// Isso garante que o app seja inicializado apenas uma vez,
// mesmo que este arquivo seja importado várias vezes no lado do servidor.
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error) {
    console.error('Falha na inicialização do Firebase Admin SDK', error);
  }
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
const adminFirestore = admin.firestore;

export { adminAuth, adminDb, adminFirestore };
