'use client';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';

function ProtectedLayout({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-var(--text-main) mb-4">
            Musisz się zalogować
          </h1>
          <p className="text-gray-600 mb-6">
            Aby uzyskać dostęp do tej strony, prosimy o zalogowanie się.
          </p>
          <button
            onClick={() => router.push('/user/login')}
            className="bg-var(--primary) text-white py-2 px-6 rounded-lg hover:bg-var(--primary-dark) transition duration-300">
            Przejdź do logowania
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedLayout;
