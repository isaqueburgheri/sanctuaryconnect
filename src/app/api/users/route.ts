import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';
import type { CreateUserInput } from '@/types/user';

try {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
} catch (error) {
  console.error('Firebase Admin Initialization Error:', error);
}

export async function POST(request: Request) {
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

    let errorMessage = 'Ocorreu um erro ao criar o usuário.';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Este email já está em uso.';
    } else if (error.code === 'auth/invalid-password') {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
    } else if (error.code === 'permission-denied' || error.message.includes('permission-denied')) {
        errorMessage = 'Erro de permissão no servidor. Verifique se a Conta de Serviço do App Hosting possui o papel "Administrador do Firebase Authentication" no IAM.';
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
