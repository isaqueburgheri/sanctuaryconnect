'use server';

import * as admin from 'firebase-admin';

// Esta verificação impede a reinicialização do aplicativo em cada recarregamento a quente.
// Em um ambiente sem servidor, isso garantirá que uma única instância do aplicativo seja inicializada.
if (!admin.apps.length) {
  admin.initializeApp();
}

const adminAuth = admin.auth();
const adminDb = admin.firestore();
// Exportar o namespace do firestore é útil para acessar tipos como o Timestamp.
const adminFirestore = admin.firestore; 

export { adminAuth, adminDb, adminFirestore };
