'use server';

import {NextRequest, NextResponse} from 'next/server';
import * as admin from 'firebase-admin';
import {z} from 'zod';

function ensureFirebaseAdminInitialized() {
  if (admin.apps.length > 0 && admin.apps[0]) {
    return;
  }
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error);
    throw new Error(
      'Firebase Admin SDK initialization failed: ' + error.message
    );
  }
}

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['Admin', 'Recepção']),
});

export async function POST(req: NextRequest) {
  try {
    ensureFirebaseAdminInitialized();
    const body = await req.json();
    const {email, password, role} = createUserSchema.parse(body);

    const auth = admin.auth();
    const firestore = admin.firestore();

    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });

    await firestore.collection('users').doc(userRecord.uid).set({
      email: email,
      role: role,
    });

    return NextResponse.json(
      {message: 'User created successfully', uid: userRecord.uid},
      {status: 201}
    );
  } catch (error: any) {
    console.error('API Error creating user:', error);
    let errorMessage = 'An internal server error occurred.';
    if (error instanceof z.ZodError) {
      errorMessage = error.errors.map(e => e.message).join(', ');
      return NextResponse.json({error: errorMessage}, {status: 400});
    }
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Este email já está em uso por outro usuário.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}

export async function GET(req: NextRequest) {
  try {
    ensureFirebaseAdminInitialized();
    const adminAuth = admin.auth();
    const firestore = admin.firestore();

    const listUsersResult = await adminAuth.listUsers(100);
    const firestoreUsersSnapshot = await firestore.collection('users').get();
    const rolesMap = new Map<string, 'Admin' | 'Recepção'>();
    firestoreUsersSnapshot.forEach(doc => {
      rolesMap.set(doc.id, doc.data().role);
    });

    const users = listUsersResult.users.map(userRecord => {
      return {
        id: userRecord.uid,
        email: userRecord.email,
        role: rolesMap.get(userRecord.uid) || 'Unknown',
        createdAt: userRecord.metadata.creationTime,
        lastLogin: userRecord.metadata.lastSignInTime,
      };
    });

    users.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(users, {status: 200});
  } catch (error: any) {
    console.error('API Error listing users:', error);
    const errorMessage =
      error.message || 'An internal server error occurred while listing users.';
    return NextResponse.json({error: errorMessage}, {status: 500});
  }
}
