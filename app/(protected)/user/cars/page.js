'use client';
import { useAuth } from '@/app/lib/firebase/AuthContext';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase/firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const CarsPage = () => {
  const { user: contextUser, loading } = useAuth();
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [cars, setCars] = useState([]); // Lista samochodów
  const [carMake, setCarMake] = useState('');
  const [model, setModel] = useState('');
  const [colour, setColour] = useState('');
  const [yearOfManufacture, setYearOfManufacture] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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

      setFirebaseUser(currentUser);
    } else {
      console.log('Użytkownik niezalogowany, przekierowanie do /user/login');
      router.push('/user/login');
    }
  }, [contextUser, router]);

  useEffect(() => {
    const fetchCars = async () => {
      if (!firebaseUser) return;

      try {
        const q = query(
          collection(db, 'cars'),
          where('userId', '==', firebaseUser.uid)
        );
        const querySnapshot = await getDocs(q);

        const carsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCars(carsData);
      } catch (error) {
        console.error('Błąd podczas pobierania samochodów:', error);
      }
    };

    fetchCars();
  }, [firebaseUser]);

  const handleAddCar = async (e) => {
    e.preventDefault();

    const currentYear = new Date().getFullYear();
    if (
      isNaN(yearOfManufacture) ||
      yearOfManufacture < 1899 ||
      yearOfManufacture > currentYear
    ) {
      setErrorMessage(
        `Rok produkcji musi być liczbą pomiędzy 1899 a ${currentYear}.`
      );
      setSuccessMessage('');
      return;
    }

    try {
      await addDoc(collection(db, 'cars'), {
        userId: firebaseUser.uid,
        carMake,
        model,
        colour,
        yearOfManufacture,
      });

      setSuccessMessage('Samochód został dodany!');
      setErrorMessage('');
      setCarMake('');
      setModel('');
      setColour('');
      setYearOfManufacture('');

      // Odśwież listę samochodów
      const q = query(
        collection(db, 'cars'),
        where('userId', '==', firebaseUser.uid)
      );
      const querySnapshot = await getDocs(q);
      const updatedCars = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCars(updatedCars);
    } catch (error) {
      console.error('Błąd podczas dodawania samochodu:', error);
      setErrorMessage('Nie udało się dodać samochodu.');
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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-var(--text-main) text-center mb-6">
          Twoje samochody
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

        <form onSubmit={handleAddCar} className="space-y-6">
          <div>
            <label
              htmlFor="carMake"
              className="block text-sm font-medium text-var(--text-dark)">
              Marka
            </label>
            <input
              type="text"
              id="carMake"
              value={carMake}
              onChange={(e) => setCarMake(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Wprowadź markę samochodu"
            />
          </div>
          <div>
            <label
              htmlFor="model"
              className="block text-sm font-medium text-var(--text-dark)">
              Model
            </label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Wprowadź model samochodu"
            />
          </div>
          <div>
            <label
              htmlFor="colour"
              className="block text-sm font-medium text-var(--text-dark)">
              Kolor
            </label>
            <input
              type="text"
              id="colour"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Wprowadź kolor"
            />
          </div>
          <div>
            <label
              htmlFor="yearOfManufacture"
              className="block text-sm font-medium text-var(--text-dark)">
              Rok produkcji
            </label>
            <input
              type="number"
              id="yearOfManufacture"
              value={yearOfManufacture}
              onChange={(e) => setYearOfManufacture(e.target.value)}
              className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
              placeholder="Wprowadź rok produkcji"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-var(--primary) text-white py-2 rounded-md hover:bg-var(--primary-dark)">
            Dodaj samochód
          </button>
        </form>

        <h2 className="text-xl font-bold mt-8">Lista samochodów:</h2>
        {/* <ul className="mt-4">
          {cars.map((car) => (
            <li
              key={car.id}
              className="border-b border-gray-300 py-2 cursor-pointer hover:text-blue-600"
              onClick={() => router.push(`/user/cars/${car.id}`)} // Dynamiczna ścieżka
            >
              {car.carMake} {car.model} ({car.yearOfManufacture})
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default CarsPage;
