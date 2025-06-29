'use server';
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

export async function DELETE(req: NextRequest, { params }: { params: { uid: string } }) {
  if (!admin.apps.length) {
    try {
      admin.initializeApp();
    } catch (initError: any) {
      console.error('Firebase Admin initialization error:', initError);
      return NextResponse.json({ error: 'Firebase Admin initialization error.' }, { status: 500 });
    }
  }

  try {
    const adminAuth = admin.auth();
    const adminDb = admin.firestore();

    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
        return NextResponse.json({ error: 'Authentication token is missing.' }, { status: 401 });
    }

    let decodedToken;
    try {
        decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
        return NextResponse.json({ error: 'Authentication token is invalid or expired.' }, { status: 401 });
    }

    const callingUid = decodedToken.uid;
    const userDoc = await adminDb.collection('users').doc(callingUid).get();
    if (!userDoc.exists() || userDoc.data()?.role !== 'Admin') {
        return NextResponse.json({ error: 'Permission denied. Only administrators can delete users.' }, { status: 403 });
    }

    const { uid: targetUid } = params;
    if (!targetUid) {
      return NextResponse.json({ error: 'User UID is missing from the URL.' }, { status: 400 });
    }

    if (callingUid === targetUid) {
      return NextResponse.json({ error: 'Administrators cannot delete their own account.' }, { status: 400 });
    }
    
    await adminDb.collection('users').doc(targetUid).delete();
    await adminAuth.deleteUser(targetUid);
    
    return new NextResponse(null, { status: 204 });

  } catch (error: any) {
    console.error('API Error deleting user:', error);
    if (error.code === 'auth/user-not-found') {
        return new NextResponse(null, { status: 204 });
    }
    const errorMessage = error.message || 'An internal server error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
