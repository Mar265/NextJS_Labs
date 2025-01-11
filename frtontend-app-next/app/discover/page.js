'use client';

import { useAuth } from '@/app/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function DiscoverPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/user/login'); // Przekierowanie do logowania, jeśli użytkownik nie jest zalogowany
    }
  }, [user, router]);

  if (!user) {
    return null; // Opcjonalnie: Można zwrócić spinner lub inny placeholder na czas przekierowania
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
      <h1 className="text-4xl font-bold text-white mb-6">
        Witaj w sekcji Odkryj Więcej!
      </h1>
      <p className="text-lg text-gray-200 text-center mb-8">
        Tutaj znajdziesz nowe funkcje i możliwości aplikacji.
      </p>
      <button
        onClick={() => router.push('/')}
        className="py-2 px-6 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-300 shadow-lg">
        Powrót do strony głównej
      </button>
    </div>
  );
}

export default DiscoverPage;
