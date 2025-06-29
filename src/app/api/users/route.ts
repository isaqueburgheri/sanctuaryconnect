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
      // App Hosting service account.
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
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

    // Check for the specific credential error message and return a helpful diagnostic.
    if (
      error.message &&
      (error.message.includes('Credential implementation') ||
        error.message.includes('access token'))
    ) {
      return NextResponse.json(
        {
          error:
            'Erro de permissão no servidor. A aplicação não conseguiu se autenticar. Verifique no console do Google Cloud (IAM) se a conta de serviço do App Hosting tem o papel "Administrador do Firebase Authentication".',
        },
        {status: 500}
      );
    }
    
    // Handle other known errors
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      return NextResponse.json({error: errorMessage}, {status: 400});
    }

    if (error.code === 'auth/email-already-exists') {
        return NextResponse.json({error: 'Este email já está em uso por outro usuário.'}, {status: 409});
    }

    return NextResponse.json({error: error.message || 'An internal server error occurred.'}, {status: 500});
  }
}
