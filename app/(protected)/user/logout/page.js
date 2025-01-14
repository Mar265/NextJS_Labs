'use client';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';
 
function LogoutPage() {
  const { logout } = useAuth();
  const router = useRouter();
 
  const handleLogout = async () => {
    try {
      await logout(); // Wywołanie funkcji wylogowania
      router.replace('/'); // Przekierowanie na stronę główną
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };
  return (
    <div className="h-screen flex items-center justify-center bg-var(--bg-main)">
      <button
        onClick={handleLogout}
        className="rounded-md bg-var(--primary) px-12 py-3 text-lg font-medium text-white shadow-lg transition hover:bg-var(--primary-dark) focus:outline-none focus:ring-4 focus:ring-var(--primary-dark)">
        Logout
      </button>
    </div>
  );
}

export default LogoutPage;
