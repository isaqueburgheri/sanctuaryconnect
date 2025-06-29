import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import type { CreateUserInput } from '@/types/user';

// Initialize Firebase Admin SDK
try {
  if (!admin.apps.length) {
    // Using initializeApp() without arguments is the recommended way for Cloud environments
    admin.initializeApp();
  }
} catch (error: any) {
  console.error('Firebase Admin Initialization Error:', error);
}

export async function POST(request: Request) {
  // Check if SDK initialized properly
  if (!admin.apps.length) {
    return NextResponse.json(
      { error: 'Falha na inicialização do servidor. Não foi possível conectar ao Firebase.' },
      { status: 500 }
    );
  }

  try {
    const { email, password, role } = (await request.json()) as CreateUserInput;

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, senha e cargo são obrigatórios.' }, { status: 400 });
    }

    if (role !== 'Admin' && role !== 'Recepção') {
      return NextResponse.json({ error: 'Cargo inválido. Deve ser "Admin" ou "Recepção".' }, { status: 400 });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: true,
    });

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email: userRecord.email,
      role: role,
    });

    return NextResponse.json({
      message: 'Usuário criado com sucesso!',
      uid: userRecord.uid,
    });

  } catch (error: any) {
    console.error('Error creating user:', error);

    // Provide a more specific error message back to the client
    let errorMessage = 'Ocorreu um erro desconhecido ao criar o usuário.';
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-exists':
          errorMessage = 'Este email já está em uso por outro usuário.';
          break;
        case 'auth/invalid-password':
          errorMessage = 'A senha é inválida. Ela deve ter pelo menos 6 caracteres.';
          break;
        // This is the most likely error given the context of App Hosting permissions
        case 'auth/internal-error':
        case 'permission-denied':
            errorMessage = 'O servidor não tem permissão para criar usuários. Verifique as permissões do IAM para a Conta de Serviço do App Hosting. Ela precisa do papel "Administrador do Firebase Authentication".';
            break;
        default:
          errorMessage = `Ocorreu um erro no servidor (${error.code}).`;
          break;
      }
    } else if (error.message) {
        errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
