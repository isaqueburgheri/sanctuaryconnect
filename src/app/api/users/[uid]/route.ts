'use server';
import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

function initializeAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  return { auth: admin.auth(), db: admin.firestore() };
}

export async function DELETE(req: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const { auth, db } = initializeAdmin();

    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
        return NextResponse.json({ error: 'Authentication token is missing.' }, { status: 401 });
    }
    const decodedToken = await auth.verifyIdToken(idToken);
    const callingUid = decodedToken.uid;
    const userDoc = await db.collection('users').doc(callingUid).get();
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
    
    await db.collection('users').doc(targetUid).delete();
    await auth.deleteUser(targetUid);
    
    return new NextResponse(null, { status: 204 });

  } catch (error: any) {
    console.error('API Error deleting user:', error);
    if (error.code === 'auth/user-not-found') {
        return new NextResponse(null, { status: 204 });
    }
    if (error.code === 'auth/id-token-expired' || error.code === 'auth/argument-error') {
      return NextResponse.json({ error: 'Authentication token is invalid or expired.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}