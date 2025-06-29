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
  let targetUid: string | undefined;

  try {
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return new NextResponse(JSON.stringify({ error: 'Token de autenticação ausente.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    
    const body = await req.json();
    targetUid = body.uid;

    if (!targetUid) {
        return new NextResponse(JSON.stringify({ error: 'UID do usuário não fornecido.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    const callingUid = decodedToken.uid;

    if (callingUid === targetUid) {
        return new NextResponse(JSON.stringify({ error: 'Você não pode excluir sua própria conta.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const userDocRef = db.collection('users').doc(callingUid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists() || userDoc.data()?.role !== 'Admin') {
      return new NextResponse(JSON.stringify({ error: 'Permissão negada. Apenas administradores podem excluir usuários.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // Tenta excluir do Auth primeiro, mas não falha se o usuário não for encontrado
    try {
      await auth.deleteUser(targetUid);
    } catch (authError: any) {
      if (authError.code !== 'auth/user-not-found') {
        throw authError; // Lança outros erros do Auth para o catch principal
      }
      // Se o usuário não existe no Auth, ignora o erro e continua para excluir do Firestore
    }
    
    // Exclui do Firestore
    await db.collection('users').doc(targetUid).delete();
    
    return new NextResponse(JSON.stringify({ message: 'Usuário excluído com sucesso.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (error: any) {
    console.error(`Erro na API ao excluir usuário ${targetUid}:`, error);
    const message = 'Ocorreu um erro interno ao processar sua solicitação.';
    return new NextResponse(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
