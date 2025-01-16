'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { auth } from '@/app/lib/firebase/firebase'; // Upewnij się, że ścieżka jest poprawna
import { sendPasswordResetEmail } from 'firebase/auth';

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email);
      setMessage(
        'Jeśli adress e-mail znajduje sie w bazie. Wysłano e-mail z linkiem do zresetowania hasła. Sprawdź swoją skrzynkę pocztową.'
      );
      setErrorMessage('');
    } catch (error) {
      console.error('Błąd resetowania hasła:', error);
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('Nie znaleziono użytkownika z tym adresem e-mail.');
      } else {
        setErrorMessage('Wystąpił problem. Spróbuj ponownie.');
      }
      setMessage('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-var(--text-main) text-center mb-6">
          Zresetuj hasło
        </h1>
        {message && (
          <div className="text-green-500 text-sm font-medium mb-4">
            {message}
          </div>
        )}
        {errorMessage && (
          <div className="text-red-500 text-sm font-medium mb-4">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-var(--text-dark)">
              Adres e-mail
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Wprowadź swój e-mail"
              {...register('email', {
                required: 'E-mail jest wymagany!',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: 'Niepoprawny adres e-mail!',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-var(--primary) text-white py-2 rounded-md hover:bg-var(--primary-dark)">
            Wyślij link do resetowania
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
