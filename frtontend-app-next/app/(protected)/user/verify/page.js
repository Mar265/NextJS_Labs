'use client';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useEffect } from 'react';

export default function VerifyEmail() {
  const { user } = useAuth();

  useEffect(() => {
    // Automatyczne wylogowanie po załadowaniu strony
    signOut(auth).then(() => {
      console.log('Użytkownik został wylogowany.');
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-var(--text-main) mb-6">
          Weryfikacja e-maila
        </h1>
        <p className="text-lg text-var(--text-dark) mb-4">
          Proszę potwierdź swój adres e-mail, klikając w link wysłany na adres: <br />
          <span className="font-bold">{user?.email || 'Twój e-mail'}</span>
        </p>
        <p className="text-sm text-gray-500">
          Po weryfikacji możesz zalogować się ponownie.
        </p>
      </div>
    </div>
  );
}
