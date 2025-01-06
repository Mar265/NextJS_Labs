'use client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { auth } from '@/firebase';
import { useState } from 'react';

function RegistrationForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [registrationError, setRegistrationError] = useState('');

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setRegistrationError('Hasła muszą być zgodne!');
      return;
    }

    try {
      // Rejestracja użytkownika
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log('Zarejestrowano użytkownika:', userCredential.user);

      // Wysłanie e-maila weryfikacyjnego
      await sendEmailVerification(auth.currentUser);
      console.log('Wysłano e-mail weryfikacyjny.');

      // Automatyczne wylogowanie
      await signOut(auth);
      console.log('Wylogowano użytkownika.');

      // Przekierowanie na stronę logowania lub weryfikacji
      router.push('/user/verify');
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      setRegistrationError(
        error.message || 'Wystąpił problem podczas rejestracji. Spróbuj ponownie.'
      );
    }
  };

  const password = watch('password', '');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-var(--text-main) text-center mb-6">
          Zarejestruj się
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {registrationError && (
            <div className="text-red-500 text-sm font-medium">
              {registrationError}
            </div>
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
              placeholder="Wprowadź email"
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
              Hasło
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Wprowadź hasło"
              {...register('password', {
                required: 'Hasło jest wymagane!',
                minLength: {
                  value: 6,
                  message: 'Hasło musi mieć co najmniej 6 znaków!',
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-var(--text-dark)">
              Potwierdź hasło
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Potwierdź hasło"
              {...register('confirmPassword', {
                required: 'Potwierdzenie hasła jest wymagane!',
                validate: (value) =>
                  value === password || 'Hasła muszą być zgodne!',
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs italic">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-var(--primary) text-white py-2 rounded-md hover:bg-var(--primary-dark)">
            Zarejestruj się
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationForm;
