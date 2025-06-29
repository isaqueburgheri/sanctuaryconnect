import {NextRequest, NextResponse} from 'next/server';
import * as admin from 'firebase-admin';

// As credenciais são gerenciadas automaticamente pelo ambiente do App Hosting
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Inicializa o Firebase Admin SDK (apenas uma vez)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${projectId}.firebaseio.com`,
  });
}

const db = admin.firestore();
const auth = admin.auth();

export async function POST(req: NextRequest) {
  try {
    // Pega o token de autenticação do header
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'Token de autenticação ausente.' }, { status: 401 });
    }
    
    // Pega os dados do corpo da requisição
    const body = await req.json();
    const { uid: targetUid, password: newPassword } = body;

    if (!targetUid || !newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: 'Dados inválidos. Forneça o UID do usuário e uma senha com no mínimo 6 caracteres.' }, { status: 400 });
    }

    // 1. Verifica o token do usuário que está fazendo a chamada
    const decodedToken = await auth.verifyIdToken(idToken);
    const callingUid = decodedToken.uid;

    // 2. Verifica se o usuário que chama a função é um 'Admin' no Firestore
    const userDocRef = db.collection('users').doc(callingUid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists || userDoc.data()?.role !== 'Admin') {
      return NextResponse.json({ error: 'Permissão negada. Apenas administradores podem alterar senhas.' }, { status: 403 });
    }

    // 3. Atualiza a senha do usuário alvo
    await auth.updateUser(targetUid, {
      password: newPassword,
    });
    
    return NextResponse.json({ message: 'Senha alterada com sucesso.' }, { status: 200 });

  } catch (error: any) {
    console.error('Erro na API ao alterar senha:', error);
    let message = 'Ocorreu um erro interno ao processar sua solicitação.';
    if (error.code === 'auth/user-not-found') {
        message = 'O usuário alvo para alteração de senha não foi encontrado.';
    } else if (error.code === 'auth/id-token-expired') {
        message = 'Sua sessão expirou. Por favor, faça login novamente.';
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
