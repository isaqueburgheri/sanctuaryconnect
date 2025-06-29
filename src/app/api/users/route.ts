'use server';
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

function initializeAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  return { auth: admin.auth(), db: admin.firestore() };
}

export async function POST(req: NextRequest) {
  try {
    const { auth, db } = initializeAdmin();

    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'Authentication token is missing.' }, { status: 401 });
    }
    const decodedToken = await auth.verifyIdToken(idToken);
    const userDocCheck = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDocCheck.exists() || userDocCheck.data()?.role !== 'Admin') {
      return NextResponse.json({ error: 'Permission denied. Only administrators can create users.' }, { status: 403 });
    }

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
    };

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });

  } catch (error: any) {
    console.error('API Error creating user:', error);
    if (error.code === 'auth/email-already-exists') {
        return NextResponse.json({ error: 'This email is already in use by another account.' }, { status: 409 });
    }
     if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
      return NextResponse.json({ error: 'Authentication token is invalid or expired.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}