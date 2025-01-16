'use client';

import { useRouter } from 'next/navigation';
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { auth } from '@/app/lib/firebase/firebase';
import { useState } from 'react';

function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginError, setLoginError] = useState('');

  const onSubmit = async (data) => {
    try {
      // Walidacja danych wejściowych
      const email = data.email.trim();
      const password = data.password;

      if (!email || !password) {
        setLoginError('E-mail i hasło są wymagane.');
        return;
      }

      // Ustawienie sesji użytkownika
      await setPersistence(auth, browserSessionPersistence);

      // Próba zalogowania
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Sprawdzenie, czy email został zweryfikowany
      if (!user.emailVerified) {
        setLoginError('Twój adres e-mail nie został jeszcze zweryfikowany.');
        router.push('/user/verify'); // Przekierowanie na stronę weryfikacji
        return;
      }

      // Przekierowanie na stronę profilu po zalogowaniu
      router.push('/user/profile');
    } catch (error) {
      console.error('Błąd logowania:', error);

      // Obsługa błędów Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          setLoginError('Użytkownik o podanym adresie e-mail nie istnieje.');
          break;
        case 'auth/wrong-password':
          setLoginError('Podane hasło jest nieprawidłowe.');
          break;
        case 'auth/too-many-requests':
          setLoginError(
            'Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.'
          );
          break;
        case 'auth/network-request-failed':
          setLoginError('Wystąpił problem z połączeniem sieciowym.');
          break;
        case 'auth/invalid-email':
          setLoginError('Podany adres e-mail jest nieprawidłowy.');
          break;
        case 'auth/invalid-credential':
          setLoginError('Podane dane logowania są nieprawidłowe. Sprawdź swój e-mail i hasło.');
          break;
        default:
          setLoginError('Wystąpił nieznany błąd. Spróbuj ponownie.');
          break;
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-var(--text-main) text-center mb-6">
          Welcome Back
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {loginError && (
            <div className="text-red-500 text-sm font-medium">{loginError}</div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-var(--text-dark)">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email jest wymagany!',
                maxLength: { value: 40, message: 'Email jest za długi!' },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Niepoprawny adres email!',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-var(--text-dark)">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Enter your password"
              {...register('password', { required: 'Hasło jest wymagane!' })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-var(--primary) text-white py-2 rounded-md hover:bg-var(--primary-dark)">
            Login
          </button>
          <div className="mt-4 flex flex-col items-center space-y-2">
            <button
              onClick={() => router.push('/user/reset_password')} // Przeniesienie na stronę resetowania hasła
              type="button"
              className="text-sm text-blue-500 underline hover:text-blue-700">
              Zapomniałeś hasła? Zresetuj je
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
