'use server';
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Self-contained initialization to ensure robustness in a serverless environment
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error: any) {
    console.error('Firebase Admin initialization error', error.stack);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { uid: string } }) {
  try {
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
    
    const callingUid = decodedToken.uid;
    const userDoc = await admin.firestore().collection('users').doc(callingUid).get();
    if (!userDoc.exists() || userDoc.data()?.role !== 'Admin') {
      return NextResponse.json({ error: 'Permission denied. Only administrators can change passwords.' }, { status: 403 });
    }

    const { uid: targetUid } = params;
    if (!targetUid) {
      return NextResponse.json({ error: 'User UID is missing from the URL.' }, { status: 400 });
    }
    
    const { password: newPassword } = await req.json();
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'A new password with at least 6 characters is required.' }, { status: 400 });
    }
    
    await admin.auth().updateUser(targetUid, {
      password: newPassword,
    });
    
    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('API Error updating password:', error);
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json({ error: 'The target user to update was not found.' }, { status: 404 });
    }
    const errorMessage = error.message || 'An internal server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
