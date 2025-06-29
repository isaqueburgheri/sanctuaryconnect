import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Helper to initialize Firebase Admin SDK.
// It ensures that initialization happens only once.
function ensureFirebaseAdminInitialized() {
  // Check if the default app is already initialized
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin;
  }
  
  try {
    // On Google Cloud infrastructure (like App Hosting), initializeApp() with
    // applicationDefault credentials automatically discovers the project
    // configuration and credentials from the environment.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error);
    // Throw a clearer error to be caught by the route handler
    throw new Error('Firebase Admin SDK initialization failed: ' + error.message);
  }
  
  return admin;
}

// GET method to list all users from Firebase Authentication and Firestore
export async function GET(req: NextRequest) {
    try {
        const admin = ensureFirebaseAdminInitialized();
        
        // 1. Get all users from Firebase Auth
        const authUsersList = await admin.auth().listUsers(100);
        
        // 2. Get all user role documents from Firestore
        const firestore = admin.firestore();
        const firestoreUsersSnapshot = await firestore.collection('users').get();
        const rolesMap = new Map<string, 'Admin' | 'Recepção'>();
        firestoreUsersSnapshot.forEach(doc => {
            rolesMap.set(doc.id, doc.data().role);
        });

        // 3. Combine Auth data with Firestore roles
        const users = authUsersList.users.map(authUser => ({
            id: authUser.uid,
            email: authUser.email,
            role: rolesMap.get(authUser.uid) || 'Unknown', // Assign role from map, or 'Unknown'
            createdAt: authUser.metadata.creationTime,
            lastLogin: authUser.metadata.lastSignInTime,
        }));

        // Sort by creation date, newest first
        users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json(users, { status: 200 });

    } catch (error: any) {
        console.error('API Error listing users:', error);
        // Ensure a clear error message is sent back to the client
        const errorMessage = error.message || 'An internal server error occurred while listing users.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
