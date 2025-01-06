import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "myappfront-baee4.firebaseapp.com",
    projectId: "myappfront-baee4",
    storageBucket: "myappfront-baee4.firebasestorage.app",
    messagingSenderId: "393811731877",
    appId: "1:393811731877:web:9fe423b0b66309e9b7f44c",
    measurementId: "G-XWYY0W89KS"
  };
  
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export default app;
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);