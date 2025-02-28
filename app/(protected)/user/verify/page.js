'use client';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { sendEmailVerification, getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const { user } = useAuth();
  const [verificationSent, setVerificationSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      console.log('Brak zalogowanego użytkownika. Przekierowanie na logowanie...');
      router.push('/user/login'); // Użytkownik niezalogowany
    } else if (auth.currentUser?.emailVerified) {
      console.log('E-mail już zweryfikowany. Przekierowanie na stronę główną.');
      setEmailVerified(true);
      router.push('/'); // E-mail zweryfikowany
    }
  }, [user, auth.currentUser, router]);

  const resendVerificationEmail = async () => {
    try {
      if (!auth.currentUser) {
        setErrorMessage('Brak zalogowanego użytkownika.');
        return;
      }
      await sendEmailVerification(auth.currentUser);
      setVerificationSent(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Błąd podczas wysyłania e-maila weryfikacyjnego:', error);
      setErrorMessage('Nie udało się wysłać e-maila weryfikacyjnego.');
    }
  };

  const checkVerificationStatus = async () => {
    try {
      if (!auth.currentUser) {
        setErrorMessage('Brak zalogowanego użytkownika.');
        return;
      }
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        setEmailVerified(true);
        router.push('/');
      } else {
        setErrorMessage('E-mail nie jest jeszcze zweryfikowany.');
      }
    } catch (error) {
      console.error('Błąd podczas sprawdzania weryfikacji e-maila:', error);
      setErrorMessage('Nie udało się sprawdzić statusu weryfikacji.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-var(--text-main) mb-6">
          Weryfikacja e-maila
        </h1>
        {errorMessage && (
          <p className="text-red-500 mb-4">{errorMessage}</p>
        )}
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
