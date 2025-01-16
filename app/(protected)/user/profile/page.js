'use client';

import { useAuth } from '@/app/lib/firebase/AuthContext';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/firebase'; // Import bazy Firestore
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { user: contextUser, loading } = useAuth();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [username, setUsername] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      if (!currentUser.emailVerified) {
        console.log('Użytkownik niezweryfikowany, przekierowanie do /user/verify');
        router.push('/user/verify');
        return;
      }

      console.log('Użytkownik zweryfikowany:', currentUser);
      setFirebaseUser(currentUser);
      setUsername(currentUser.displayName || '');
      setPhotoURL(currentUser.photoURL || '');
    } else {
      console.log('Użytkownik niezalogowany, przekierowanie do /user/login');
      router.push('/user/login');
    }
  }, [contextUser, router]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!firebaseUser) return;

      try {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const { address } = snapshot.data();
          setCity(address?.city || '');
          setStreet(address?.street || '');
          setZipCode(address?.zipCode || '');
        }
      } catch (error) {
        console.error('Błąd podczas pobierania danych adresowych:', error);
      }
    };

    fetchAddress();
  }, [firebaseUser]);

  const handleZipCodeChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Usuń wszystkie znaki niebędące cyframi
    if (value.length <= 5) {
      const formattedValue =
        value.length > 2 ? `${value.slice(0, 2)}-${value.slice(2)}` : value; // Formatowanie XX-XXX
      setZipCode(formattedValue);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (!firebaseUser) throw new Error('Brak użytkownika!');

      await updateProfile(firebaseUser, {
        displayName: username,
        photoURL: photoURL,
      });

      await setDoc(
        doc(db, 'users', firebaseUser.uid),
        {
          address: {
            city,
            street,
            zipCode,
          },
        },
        { merge: true }
      );

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

  if (!firebaseUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-var(--text-main) text-center mb-6">
            Nie jesteś zalogowany
          </h1>
          <button
            onClick={() => router.push('/user/login')}
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
          {photoURL && (
            <div className="flex justify-center mb-4">
              <img
                src={photoURL}
                alt="Zdjęcie profilowe"
                className="w-32 h-32 rounded-full border-4 border-primary shadow-md"
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
              htmlFor="city"
              className="block text-sm font-medium text-var(--text-dark)">
              Miasto
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Wprowadź miasto"
            />
          </div>
          <div>
            <label
              htmlFor="street"
              className="block text-sm font-medium text-var(--text-dark)">
              Ulica
            </label>
            <input
              type="text"
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Wprowadź ulicę"
            />
          </div>
          <div>
            <label
              htmlFor="zipCode"
              className="block text-sm font-medium text-var(--text-dark)">
              Kod pocztowy
            </label>
            <input
              type="text"
              id="zipCode"
              value={zipCode}
              onChange={handleZipCodeChange}
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="32-000"
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
};

export default ProfilePage;
