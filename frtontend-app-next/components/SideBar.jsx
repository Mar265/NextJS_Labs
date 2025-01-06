'use client';
import Link from 'next/link';
import { useAuth } from '@/app/lib/firebase/AuthContext';

function SideBar({ children }) {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Błąd podczas wylogowywania:', error);
    }
  };

  return (
    <div className="drawer drawer-open">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-gradient-to-b from-gray-800 to-gray-900 text-white min-h-full w-64 p-6 space-y-4">
          <li className="text-center text-xl font-bold text-primary mb-6">
            MG_App_2024/25
          </li>
          <li>
            <Link
              href="/"
              className="block py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/user/profile"
              className="block py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300">
              Profile
            </Link>
          </li>
          {user ? (
            <>
              <li>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 px-4 rounded-md hover:bg-red-600 transition duration-300">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/user/login"
                  className="block py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/user/register"
                  className="block py-2 px-4 rounded-md hover:bg-gray-700 transition duration-300">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
