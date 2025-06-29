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

export async function DELETE(req: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const { uid: targetUid } = params;
    if (!targetUid) {
        return NextResponse.json({ error: 'User UID is missing from the URL.' }, { status: 400 });
    }

    const callingUid = await verifyAdmin(req);

    if (callingUid === targetUid) {
        return NextResponse.json({ error: 'Administrators cannot delete their own account.' }, { status: 400 });
    }
    
    await db.collection('users').doc(targetUid).delete();

    await auth.deleteUser(targetUid);
    
    return new NextResponse(null, { status: 204 });

  } catch (error: any) {
    console.error('API Error deleting user:', error);
    let message = 'An internal server error occurred.';
    let status = 500;
     if (error.message.includes('No auth token')) {
        message = 'Authentication token is missing.';
        status = 401;
    } else if (error.message.includes('Not an admin')) {
        message = 'Permission denied. Only administrators can delete users.';
        status = 403;
    } else if (error.code === 'auth/user-not-found') {
        return new NextResponse(null, { status: 204 });
    }
    
    return NextResponse.json({ error: message }, { status });
  }
}
