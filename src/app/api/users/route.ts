'use server';

import {NextRequest, NextResponse} from 'next/server';
import * as admin from 'firebase-admin';
import {z} from 'zod';

// Initialize Firebase Admin SDK if not already initialized
// This module-level initialization is more stable for serverless environments.
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error);
  }
}

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['Admin', 'Recepção']),
});

export async function POST(req: NextRequest) {
  // Check if SDK is initialized
  if (!admin.apps.length) {
    console.error('CRITICAL: Firebase Admin SDK is not initialized.');
    return NextResponse.json(
      {error: 'Internal server configuration error.'},
      {status: 500}
    );
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
            'Erro de permissão no servidor. A aplicação não conseguiu se autenticar com o Google. Verifique se a Conta de Serviço do App Hosting tem o papel "Administrador do Firebase Authentication" no console do Google Cloud (IAM).',
        },
        {status: 500}
      );
    }

    // Handle other known errors
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
