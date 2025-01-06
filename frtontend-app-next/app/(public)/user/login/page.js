'use client';
import { useRouter } from 'next/navigation';
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { auth } from '@/firebase';
import { useState } from 'react';

function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Stan do przechowywania błędów logowania
  const [loginError, setLoginError] = useState('');

  const onSubmit = async (data) => {
    try {
      // Ustawienie sesji użytkownika
      await setPersistence(auth, browserSessionPersistence);

      // Próba zalogowania
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      console.log('Użytkownik zalogowany:', userCredential.user);

      // Sprawdzenie, czy email został zweryfikowany
      if (!userCredential.user.emailVerified) {
        setLoginError('Twój email nie został jeszcze zweryfikowany.');
        return;
      }

      // Przekierowanie na stronę profilu po zalogowaniu
      router.push('/user/profile');
    } catch (error) {
      console.error('Błąd logowania:', error);

      // Mapowanie kodów błędów Firebase
      const errorMessage = {
        'auth/user-not-found': 'Użytkownik o podanym adresie e-mail nie istnieje.',
        'auth/wrong-password': 'Podane hasło jest nieprawidłowe.',
        'auth/too-many-requests': 'Zbyt wiele nieudanych prób logowania. Spróbuj ponownie później.',
        'auth/network-request-failed': 'Wystąpił problem z połączeniem sieciowym.',
        'auth/invalid-email': 'Podany adres e-mail jest nieprawidłowy.',
        'auth/invalid-credential': 'Podane dane logowania są nieprawidłowe.',
      };

      setLoginError(errorMessage[error.code] || 'Wystąpił nieznany błąd. Spróbuj ponownie.');
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
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
