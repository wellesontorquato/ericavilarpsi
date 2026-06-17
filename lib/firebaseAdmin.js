import admin from "firebase-admin";

function formatPrivateKey(key) {
  if (!key) return undefined;

  return key
    .replace(/^"|"$/g, "") // remove aspas extras no começo/fim, se existirem
    .replace(/\\n/g, "\n"); // transforma \n em quebra de linha real
}

export function getFirebaseAdmin() {
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID não configurado.");
  }

  if (!clientEmail) {
    throw new Error("FIREBASE_CLIENT_EMAIL não configurado.");
  }

  if (!privateKey) {
    throw new Error("FIREBASE_PRIVATE_KEY não configurada.");
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return {
    admin,
    adminDb: admin.firestore(),
  };
}