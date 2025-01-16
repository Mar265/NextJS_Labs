// 'use client';

// import { createContext, useContext, useState, useEffect } from 'react';
// import { onAuthStateChanged, signOut } from 'firebase/auth';
// import { auth } from '@/app/lib/firebase/firebase'; // Upewnij się, że ta ścieżka jest poprawna

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // Przechowywanie informacji o użytkowniku
//   const [loading, setLoading] = useState(true); // Śledzenie statusu ładowania

//   useEffect(() => {
//     // Subskrypcja zmiany stanu użytkownika
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         setUser({
//           uid: currentUser.uid,
//           email: currentUser.email,
//           displayName: currentUser.displayName || '',
//           photoURL: currentUser.photoURL || '',
//         });
//       } else {
//         setUser(null);
//       }
//       setLoading(false); // Zakończ ładowanie po określeniu stanu
//     });

//     // Cleanup: usuń subskrypcję, gdy komponent zostanie odmontowany
//     return () => unsubscribe();
//   }, []);

//   const logout = async () => {
//     try {
//       await signOut(auth); // Wylogowanie użytkownika za pomocą Firebase
//       setUser(null); // Czyszczenie stanu użytkownika
//     } catch (error) {
//       console.error('Błąd podczas wylogowywania:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
