'use server';

import {NextRequest, NextResponse} from 'next/server';
import * as admin from 'firebase-admin';
import {z} from 'zod';

// Helper function to initialize Firebase Admin SDK safely.
// This ensures that initialization only happens once.
function initializeFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      // Reverting to the simplest initialization. On App Hosting, this should
      // automatically detect the correct project and credentials without explicit projectId.
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
    
    // Handle known errors
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => e.message).join(', ');
      return NextResponse.json({error: errorMessage}, {status: 400});
    }

    if (error.code === 'auth/email-already-exists') {
        return NextResponse.json({error: 'Este email já está em uso por outro usuário.'}, {status: 409});
    }

    const detailedMessage = error.message || 'Ocorreu um erro desconhecido.';
    // This is a special handler for the persistent credential issue.
    // It provides a more helpful error message to the user.
    if (detailedMessage.includes('failed to fetch a valid Google OAuth2 access token')) {
        return NextResponse.json({
            error: 'Erro de Autenticação do Servidor. O aplicativo não consegue se conectar ao Firebase de forma segura. Isso geralmente é um problema de configuração do ambiente na nuvem, não do código. Se o problema persistir, contate o suporte do Firebase.'
        }, {status: 500});
    }

    return NextResponse.json({error: `Falha na autenticação do servidor: ${detailedMessage}`}, {status: 500});
  }
}
