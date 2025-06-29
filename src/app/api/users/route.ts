import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Helper to initialize Firebase Admin SDK.
// It ensures that initialization happens only once.
function ensureFirebaseAdminInitialized() {
  // This function is kept for potential future use if the environment issue is resolved,
  // but it is currently NOT CALLED by any part of the application.
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin;
  }
  
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error);
    throw new Error('Firebase Admin SDK initialization failed: ' + error.message);
  }
  
  return admin;
}

// GET method is no longer used by the frontend but is kept for reference.
export async function GET(req: NextRequest) {
    try {
        // NOTE: This code is not currently active. The frontend now fetches directly from Firestore.
        const admin = ensureFirebaseAdminInitialized();
        
        const authUsersList = await admin.auth().listUsers(100);
        const firestore = admin.firestore();
        const firestoreUsersSnapshot = await firestore.collection('users').get();
        const rolesMap = new Map<string, 'Admin' | 'Recepção'>();
        firestoreUsersSnapshot.forEach(doc => {
            rolesMap.set(doc.id, doc.data().role);
        });

        const users = authUsersList.users.map(authUser => ({
            id: authUser.uid,
            email: authUser.email,
            role: rolesMap.get(authUser.uid) || 'Unknown',
            createdAt: authUser.metadata.creationTime,
            lastLogin: authUser.metadata.lastSignInTime,
        }));

        users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(users, { status: 200 });

    } catch (error: any) {
        console.error('API Error listing users:', error);
        const errorMessage = error.message || 'An internal server error occurred while listing users.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
