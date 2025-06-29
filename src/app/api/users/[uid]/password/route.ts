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

export async function PUT(req: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const { uid: targetUid } = params;
    if (!targetUid) {
        return NextResponse.json({ error: 'User UID is missing from the URL.' }, { status: 400 });
    }

    await verifyAdmin(req);
    
    const { password: newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: 'A new password with at least 6 characters is required.' }, { status: 400 });
    }
    
    await auth.updateUser(targetUid, {
      password: newPassword,
    });
    
    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('API Error updating password:', error);
    let message = 'An internal server error occurred.';
    let status = 500;
    if (error.message.includes('No auth token')) {
        message = 'Authentication token is missing.';
        status = 401;
    } else if (error.message.includes('Not an admin')) {
        message = 'Permission denied. Only administrators can change passwords.';
        status = 403;
    } else if (error.code === 'auth/user-not-found') {
        message = 'The target user to update was not found.';
        status = 404;
    }
    
    return NextResponse.json({ error: message }, { status });
  }
}
