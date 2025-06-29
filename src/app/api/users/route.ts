'use server';

import {NextRequest, NextResponse} from 'next/server';
import * as admin from 'firebase-admin';
import {z} from 'zod';

// Helper function to initialize Firebase Admin SDK safely.
// This ensures that initialization only happens once.
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      // When deployed to App Hosting, applicationDefault() will use the
      // App Hosting service account. Explicitly adding the projectId can
      // resolve potential environment configuration issues.
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
      console.error('Firebase Admin initialization error:', error);
      // We throw an error here to be caught by the API route handler
      throw new Error('Internal server configuration error during initialization.');
    }
  }
}

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['Admin', 'Recepção']),
});

export async function POST(req: NextRequest) {
  try {
    initializeFirebaseAdmin();
  } catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500});
  }

  try {
    const body = await req.json();
    const {email, password, role} = createUserSchema.parse(body);

    const auth = admin.auth();
    const firestore = admin.firestore();

    // 1. Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: email,
      password: password,
    });

    // 2. Create user document in Firestore to store role and other data
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
    
    // Handle known errors
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      return NextResponse.json({error: errorMessage}, {status: 400});
    }

    if (error.code === 'auth/email-already-exists') {
        return NextResponse.json({error: 'Este email já está em uso por outro usuário.'}, {status: 409});
    }

    const detailedMessage = error.message || 'Ocorreu um erro desconhecido.';
    // The previous custom error was pointing to an IAM role that the user has already configured.
    // Return a more generic message but include the original error for diagnostics.
    return NextResponse.json({error: `Falha na autenticação do servidor: ${detailedMessage}`}, {status: 500});
  }
}
