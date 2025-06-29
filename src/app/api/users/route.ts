'use server';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, adminFirestore } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'Authentication token is missing.' }, { status: 401 });
    }
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const userDocCheck = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (!userDocCheck.exists() || userDocCheck.data()?.role !== 'Admin') {
      return NextResponse.json({ error: 'Permission denied. Only administrators can create users.' }, { status: 403 });
    }

    const { email, password } = await req.json();
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: 'Email and a password of at least 6 characters are required.' }, { status: 400 });
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    const newUserDoc = {
      email: userRecord.email!,
      role: 'Recepção',
      createdAt: adminFirestore.Timestamp.now(),
    };
    await adminDb.collection('users').doc(userRecord.uid).set(newUserDoc);

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
