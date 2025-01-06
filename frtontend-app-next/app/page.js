'use client';

import Link from 'next/link';
import { useAuth } from '@/app/lib/firebase/AuthContext';

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
      {user ? (
        // Zawartość strony dla zalogowanego użytkownika
        <>
          <h1 className="text-4xl font-bold text-white mb-6">
            Witaj ponownie, {user.displayName || 'Użytkowniku'}!
          </h1>
          <p className="text-lg mb-8 text-center text-gray-200">
            Jesteś zalogowany. Możesz teraz korzystać z dodatkowych funkcji aplikacji.
          </p>
          <div className="flex space-x-4">
            <Link href="/user/profile" legacyBehavior>
              <a className="py-2 px-6 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-300 shadow-lg">
                Przejdź do profilu
              </a>
            </Link>
            <Link href="/some-feature" legacyBehavior>
              <a className="py-2 px-6 rounded-lg text-white bg-green-500 hover:bg-green-600 transition duration-300 shadow-lg">
                Odkryj funkcje
              </a>
            </Link>
          </div>
        </>
      ) : (
        // Zawartość strony dla niezalogowanego użytkownika
        <>
          <h1 className="text-4xl font-bold text-white mb-6">
            Witaj w aplikacji!
          </h1>
          <p className="text-lg mb-8 text-center text-gray-200">
            To jest strona główna aplikacji. Możesz się zalogować lub zarejestrować,
            aby uzyskać więcej funkcji.
          </p>
          <div className="flex space-x-4">
            <Link href="/user/login" legacyBehavior>
              <a className="py-2 px-6 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-300 shadow-lg">
                Zaloguj się
              </a>
            </Link>
            <Link href="/user/register" legacyBehavior>
              <a className="py-2 px-6 rounded-lg text-white bg-green-500 hover:bg-green-600 transition duration-300 shadow-lg">
                Zarejestruj się
              </a>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
