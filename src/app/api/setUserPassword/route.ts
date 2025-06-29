import {NextRequest, NextResponse} from 'next/server';
import * as admin from 'firebase-admin';

// Inicializa o Firebase Admin SDK (apenas uma vez)
// Em um ambiente gerenciado como o App Hosting, initializeApp() infere as credenciais.
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();

export async function POST(req: NextRequest) {
  try {
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return new NextResponse(JSON.stringify({ error: 'Token de autenticação ausente.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    
    const body = await req.json();
    const { uid: targetUid, password: newPassword } = body;

    if (!targetUid || !newPassword || newPassword.length < 6) {
        return new NextResponse(JSON.stringify({ error: 'Dados inválidos. Forneça o UID do usuário e uma senha com no mínimo 6 caracteres.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const callingUid = decodedToken.uid;

    const userDocRef = db.collection('users').doc(callingUid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists() || userDoc.data()?.role !== 'Admin') {
      return new NextResponse(JSON.stringify({ error: 'Permissão negada. Apenas administradores podem alterar senhas.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    await auth.updateUser(targetUid, {
      password: newPassword,
    });
    
    return new NextResponse(JSON.stringify({ message: 'Senha alterada com sucesso.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error('Erro na API ao alterar senha:', error);
    let message = 'Ocorreu um erro interno ao processar sua solicitação.';
    if (error.code === 'auth/user-not-found') {
        message = 'O usuário alvo para alteração de senha não foi encontrado.';
    } else if (error.code === 'auth/id-token-expired') {
        message = 'Sua sessão expirou. Por favor, faça login novamente.';
    }
    return new NextResponse(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
