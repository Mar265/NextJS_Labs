'use client';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { updateProfile } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { auth } from '@/firebase';

function ProfilePage() {
  const { user, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Funkcja odświeżania danych użytkownika po zapisaniu
  const refreshUserData = async () => {
    try {
      if (auth.currentUser) {
        await auth.currentUser.reload(); // Odświeżenie danych użytkownika
        const updatedUser = auth.currentUser;
        setUsername(updatedUser.displayName || '');
        setPhotoURL(updatedUser.photoURL || '');
      }
    } catch (error) {
      console.error('Błąd odświeżania danych użytkownika:', error);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      setUsername(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user, loading]);

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (!auth.currentUser) throw new Error('Brak użytkownika!');

      // Aktualizacja profilu w Firebase
      await updateProfile(auth.currentUser, {
        displayName: username,
        photoURL: photoURL,
      });

      // Odświeżanie danych użytkownika
      await refreshUserData();

      setSuccessMessage('Profil został zaktualizowany!');
      setErrorMessage('');
    } catch (error) {
      console.error('Błąd podczas aktualizacji profilu:', error);
      setErrorMessage('Nie udało się zaktualizować profilu.');
      setSuccessMessage('');
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
        <h1 className="text-2xl font-bold text-white">Ładowanie danych...</h1>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-var(--text-main) text-center mb-6">
            Nie jesteś zalogowany
          </h1>
          <button
            onClick={() => (window.location.href = '/user/login')}
            className="w-full bg-var(--primary) text-white py-2 rounded-md hover:bg-var(--primary-dark)">
            Przejdź do logowania
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-var(--text-main) text-center mb-6">
          Edytuj Profil
        </h1>

        {errorMessage && (
          <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded-md">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-100 text-green-700 px-4 py-2 rounded-md">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Wyświetlanie zdjęcia profilowego */}
          {photoURL && (
            <div className="flex justify-center mb-4">
              <img
                src={photoURL}
                alt="Zdjęcie profilowe"
                className="w-24 h-24 rounded-full border border-gray-300"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-var(--text-dark)">
              Nazwa użytkownika
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Wprowadź nazwę użytkownika"
            />
          </div>
          <div>
            <label
              htmlFor="photoURL"
              className="block text-sm font-medium text-var(--text-dark)">
              URL zdjęcia profilowego
            </label>
            <input
              type="url"
              id="photoURL"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Wprowadź URL zdjęcia"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-var(--text-dark)">
              E-mail (tylko do odczytu)
            </label>
            <input
              type="email"
              id="email"
              value={user.email}
              readOnly
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark) bg-gray-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-var(--primary) text-white py-2 rounded-md hover:bg-var(--primary-dark)">
            Zapisz zmiany
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
