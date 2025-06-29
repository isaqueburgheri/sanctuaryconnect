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
    // Pega o token de autenticação do header
    const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'Token de autenticação ausente.' }, { status: 401 });
    }
    
    // Pega os dados do corpo da requisição
    const body = await req.json();
    targetUid = body.uid;

    if (!targetUid) {
        return NextResponse.json({ error: 'UID do usuário não fornecido.' }, { status: 400 });
    }

    // 1. Verifica o token do usuário que está fazendo a chamada
    const decodedToken = await auth.verifyIdToken(idToken);
    const callingUid = decodedToken.uid;

    if (callingUid === targetUid) {
        return NextResponse.json({ error: 'Você não pode excluir sua própria conta.' }, { status: 400 });
    }

    // 2. Verifica se o usuário que chama a função é um 'Admin' no Firestore
    const userDocRef = db.collection('users').doc(callingUid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists || userDoc.data()?.role !== 'Admin') {
      return NextResponse.json({ error: 'Permissão negada. Apenas administradores podem excluir usuários.' }, { status: 403 });
    }

    // 3. Exclui o usuário do Firebase Authentication
    await auth.deleteUser(targetUid);
    
    // 4. Exclui o documento do usuário do Firestore
    await db.collection('users').doc(targetUid).delete();
    
    return NextResponse.json({ message: 'Usuário excluído com sucesso.' }, { status: 200 });

  } catch (error: any)
    {
    console.error('Erro na API ao excluir usuário:', error);
    let message = 'Ocorreu um erro interno ao processar sua solicitação.';
     if (error.code === 'auth/user-not-found') {
        // Se o usuário não existe no Auth, tenta deletar do Firestore mesmo assim.
        if (targetUid) {
            try {
                await db.collection('users').doc(targetUid).delete();
                return NextResponse.json({ message: 'Usuário não encontrado na autenticação, registro do Firestore removido.' }, { status: 200 });
            } catch (dbError) {
                message = 'Usuário não encontrado na autenticação e falha ao remover do Firestore.';
            }
        } else {
            message = "UID do usuário não estava disponível para limpeza do Firestore.";
        }
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
