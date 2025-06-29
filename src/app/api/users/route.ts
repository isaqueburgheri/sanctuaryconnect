import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Helper to initialize Firebase Admin SDK
function ensureFirebaseAdminInitialized() {
  if (admin.apps.length === 0) {
    try {
      admin.initializeApp({
        // This is crucial to fix the 'aud' claim error.
        // It tells the Admin SDK which project it belongs to.
        projectId: 'sanctuaryconnect',
      });
    } catch (error: any) {
      console.error('Firebase Admin initialization error:', error.stack);
    }
  }
  return admin;
}

// GET method to list all users from Firebase Authentication and Firestore
export async function GET(req: NextRequest) {
    try {
        const admin = ensureFirebaseAdminInitialized();
        
        // No ID token verification for now for simplicity, as the page is admin-only.
        
        // 1. Get all users from Firebase Auth
        const authUsersList = await admin.auth().listUsers(100);
        
        // 2. Get all user role documents from Firestore
        const firestoreUsersSnapshot = await admin.firestore().collection('users').get();
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
        return NextResponse.json({ error: error.message || 'An internal server error occurred while listing users.' }, { status: 500 });
    }
}
