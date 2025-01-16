'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/app/lib/firebase/firebase'; // Upewnij się, że ścieżka do Firebase jest poprawna

// Tworzenie kontekstu
const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Przechowuje dane użytkownika
  const [loading, setLoading] = useState(true); // Status ładowania

  // Monitorowanie stanu logowania
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || '',
          photoURL: currentUser.photoURL || '',
          emailVerified: currentUser.emailVerified, // Dodanie statusu weryfikacji
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Czyszczenie subskrypcji
  }, []);

  // Funkcja wylogowania
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Wyczyszczenie użytkownika w stanie
      console.log('Pomyślnie wylogowano.');
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };

  // Funkcja ponownego wysyłania e-maila weryfikacyjnego
  const resendVerificationEmail = async () => {
    try {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser);
        console.log('E-mail weryfikacyjny został wysłany ponownie.');
      } else {
        console.log('E-mail już zweryfikowany.');
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania e-maila weryfikacyjnego:', error);
    }
  };

  // Udostępnienie wartości w kontekście
  return (
    <AuthContext.Provider value={{ user, loading, logout, resendVerificationEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook do korzystania z kontekstu
export const useAuth = () => useContext(AuthContext);
