'use client';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { sendEmailVerification, getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function VerifyEmail() {
  const { user } = useAuth();
  const [verificationSent, setVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const auth = getAuth();

  const resendVerificationEmail = async () => {
    try {
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        await sendEmailVerification(auth.currentUser); // Poprawne wywołanie funkcji
        setVerificationSent(true);
        console.log('E-mail weryfikacyjny został wysłany ponownie.');
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania e-maila weryfikacyjnego:', error);
    }
  };

  const checkVerificationStatus = async () => {
    try {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        setEmailVerified(true);
        console.log('E-mail został zweryfikowany.');
      } else {
        console.log('E-mail nie jest jeszcze zweryfikowany.');
      }
    } catch (error) {
      console.error('Błąd podczas sprawdzania weryfikacji e-maila:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-var(--text-main) mb-6">
          Weryfikacja e-maila
        </h1>
        {!emailVerified ? (
          <>
            <p className="text-lg text-var(--text-dark) mb-4">
              Proszę potwierdź swój adres e-mail, klikając w link wysłany na adres: <br />
              <span className="font-bold">{user?.email || 'Twój e-mail'}</span>
            </p>
            {!verificationSent ? (
              <button
                onClick={resendVerificationEmail}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                Wyślij ponownie e-mail weryfikacyjny
              </button>
            ) : (
              <p className="text-green-500 mt-4">
                E-mail weryfikacyjny został ponownie wysłany!
              </p>
            )}
            <p className="mt-4 text-sm text-gray-500">
              Jeśli już zweryfikowałeś swój e-mail, kliknij poniższy przycisk, aby sprawdzić status:
            </p>
            <button
              onClick={checkVerificationStatus}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              Sprawdź status
            </button>
          </>
        ) : (
          <p className="text-lg text-green-600">
            Twój e-mail został zweryfikowany! Możesz się teraz zalogować.
          </p>
        )}
      </div>
    </div>
  );
}
