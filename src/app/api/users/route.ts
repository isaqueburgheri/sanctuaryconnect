'use server';
import {NextRequest, NextResponse} from 'next/server';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}
const auth = admin.auth();
const db = admin.firestore();

async function verifyAdmin(req: NextRequest): Promise<string> {
  const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
  if (!idToken) {
    throw new Error('No auth token provided');
  }
  const decodedToken = await auth.verifyIdToken(idToken);
  const callingUid = decodedToken.uid;

  const userDoc = await db.collection('users').doc(callingUid).get();
  if (!userDoc.exists() || userDoc.data()?.role !== 'Admin') {
    throw new Error('Permission denied. Not an admin.');
  }
  return callingUid;
}

export async function POST(req: NextRequest) {
  try {
    await verifyAdmin(req);

    const { email, password } = await req.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: 'Email and a password of at least 6 characters are required.' }, { status: 400 });
    }

    const userRecord = await auth.createUser({
      email,
      password,
    });

    const newUserDoc = {
      email: userRecord.email!,
      role: 'Recepção',
      createdAt: admin.firestore.Timestamp.now(),
    };

    await db.collection('users').doc(userRecord.uid).set(newUserDoc);

    const newUser = {
        id: userRecord.uid,
        email: newUserDoc.email,
        role: newUserDoc.role,
        createdAt: newUserDoc.createdAt.toDate().toISOString(),
    }

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });

  } catch (error: any) {
    console.error('API Error creating user:', error);
    let message = 'An internal server error occurred.';
    let status = 500;
    if (error.message.includes('No auth token')) {
        message = 'Authentication token is missing.';
        status = 401;
    } else if (error.message.includes('Not an admin')) {
        message = 'Permission denied. Only administrators can create users.';
        status = 403;
    } else if (error.code === 'auth/email-already-exists') {
        message = 'This email is already in use by another account.';
        status = 409;
    }
    
    return NextResponse.json({ error: message }, { status });
  }
}
