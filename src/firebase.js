import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
    // Config data
});

export const db = firebaseApp.database();