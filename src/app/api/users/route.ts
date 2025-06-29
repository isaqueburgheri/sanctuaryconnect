import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Helper function to ensure Firebase Admin is initialized
function ensureFirebaseAdminInitialized() {
  if (admin.apps.length === 0) {
    try {
      admin.initializeApp({
        projectId: 'sanctuaryconnect',
      });
    } catch (error: any) {
      console.error('Firebase Admin initialization error:', error.stack);
      // This error will be caught by the calling function's try...catch
      throw new Error('Firebase Admin initialization error.');
    }
  }
  return admin;
}

// GET method to list all users from the Firestore 'users' collection
export async function GET(req: NextRequest) {
    try {
        const admin = ensureFirebaseAdminInitialized();
        const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ error: 'Authentication token is missing.' }, { status: 401 });
        }
        await admin.auth().verifyIdToken(idToken);

        const usersSnapshot = await admin.firestore().collection('users').orderBy('createdAt', 'desc').get();
        const users = usersSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                email: data.email,
                role: data.role,
                createdAt: data.createdAt.toDate().toISOString()
            };
        });

        return NextResponse.json(users, { status: 200 });

    } catch (error: any) {
        console.error('API Error listing users:', error);
        const errorMessage = error.message || 'An internal server error occurred while listing users.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}


// POST method to create a new user
export async function POST(req: NextRequest) {
  try {
    const admin = ensureFirebaseAdminInitialized();
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'Authentication token is missing.' }, { status: 401 });
    }
    
    let decodedToken;
    try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
        return NextResponse.json({ error: 'Authentication token is invalid or expired.' }, { status: 401 });
    }
    
    const userDocCheck = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    if (!userDocCheck.exists() || userDocCheck.data()?.role !== 'Admin') {
      return NextResponse.json({ error: 'Permission denied. Only administrators can create users.' }, { status: 403 });
    }

    const { email, password } = await req.json();
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: 'Email and a password of at least 6 characters are required.' }, { status: 400 });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    const newUserDoc = {
      email: userRecord.email!,
      role: 'Recepção',
      createdAt: admin.firestore.Timestamp.now(),
    };
    await admin.firestore().collection('users').doc(userRecord.uid).set(newUserDoc);

    const newUser = {
        id: userRecord.uid,
        email: newUserDoc.email,
        role: newUserDoc.role,
        createdAt: newUserDoc.createdAt.toDate().toISOString(),
    };

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });

  } catch (error: any) {
    console.error('API Error creating user:', error);
    const errorMessage = error.message || 'An internal server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
