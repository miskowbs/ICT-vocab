import { initializeApp } from 'firebase';

const app = initializeApp({
    apiKey: "AIzaSyBLg11jwPhQW1OtvASTBWTzJFZCj5AInwI",
    authDomain: "ict-vocab.firebaseapp.com",
    databaseURL: "https://ict-vocab.firebaseio.com",
    projectId: "ict-vocab",
    storageBucket: "ict-vocab.appspot.com",
    messagingSenderId: "667672592486"
});

export const db = app.database();
export const NamesRef = db.ref('names');