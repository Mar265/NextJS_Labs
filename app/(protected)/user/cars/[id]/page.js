// // Dynamiczne komponenty 
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db } from '@/app/lib/firebase/firebase';

// const CarDetailsPage = ({ params }) => {
//   const router = useRouter();
//   const [id, setId] = useState(''); // Przechowujemy ID samochodu
//   const [car, setCar] = useState(null);
//   const [photoURL, setPhotoURL] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   // Użycie React.use() do odczytu params
//   useEffect(() => {
//     async function loadParams() {
//       const resolvedParams = await params;
//       setId(resolvedParams.id);
//     }
//     loadParams();
//   }, [params]);

//   useEffect(() => {
//     const fetchCarDetails = async () => {
//       if (!id) return; // Poczekaj, aż ID zostanie załadowane

//       try {
//         const carRef = doc(db, 'cars', id);
//         const carDoc = await getDoc(carRef);

//         if (carDoc.exists()) {
//           const carData = carDoc.data();
//           setCar({ id: carDoc.id, ...carData });
//           setPhotoURL(carData.photoURL || '');
//         } else {
//           console.error('Samochód nie istnieje.');
//           router.push('/user/cars');
//         }
//       } catch (error) {
//         console.error('Błąd podczas pobierania danych samochodu:', error);
//         setErrorMessage('Nie udało się załadować szczegółów samochodu.');
//       }
//     };

//     fetchCarDetails();
//   }, [id, router]);

//   const handleUpdatePhotoURL = async () => {
//     try {
//       const carRef = doc(db, 'cars', id);
//       await updateDoc(carRef, { photoURL });
//       setSuccessMessage('URL zdjęcia został zaktualizowany!');
//       setErrorMessage('');
//     } catch (error) {
//       console.error('Błąd podczas aktualizacji URL-a zdjęcia:', error);
//       setErrorMessage('Nie udało się zaktualizować URL-a zdjęcia.');
//       setSuccessMessage('');
//     }
//   };

//   if (!car && !errorMessage) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
//         <h1 className="text-2xl font-bold text-white">Ładowanie szczegółów samochodu...</h1>
//       </div>
//     );
//   }

//   if (errorMessage) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
//         <h1 className="text-2xl font-bold text-red-500">{errorMessage}</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
//       <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
//         <h1 className="text-2xl font-bold text-var(--text-main) text-center mb-6">
//           Szczegóły samochodu
//         </h1>
//         <p>
//           <strong>Marka:</strong> {car.carMake}
//         </p>
//         <p>
//           <strong>Model:</strong> {car.model}
//         </p>
//         <p>
//           <strong>Kolor:</strong> {car.colour}
//         </p>
//         <p>
//           <strong>Rok produkcji:</strong> {car.yearOfManufacture}
//         </p>

//         {car.photoURL && (
//           <div className="mt-6">
//             <img
//               src={car.photoURL}
//               alt="Zdjęcie samochodu"
//               className="w-full rounded-md shadow-md"
//             />
//           </div>
//         )}

//         <div className="mt-6">
//           <label
//             htmlFor="photoURL"
//             className="block text-sm font-medium text-var(--text-dark)">
//             URL Zdjęcia
//           </label>
//           <input
//             type="url"
//             id="photoURL"
//             value={photoURL}
//             onChange={(e) => setPhotoURL(e.target.value)}
//             className="w-full px-4 py-2 mt-1 rounded-md border border-gray-300 focus:ring-2 focus:ring-var(--primary-dark)"
//             placeholder="Wprowadź URL zdjęcia"
//           />
//           <button
//             onClick={handleUpdatePhotoURL}
//             className="mt-4 w-full bg-var(--primary) text-white py-2 rounded-md hover:bg-var(--primary-dark)">
//             Zapisz URL zdjęcia
//           </button>
//         </div>

//         {successMessage && (
//           <div className="mt-4 text-green-500 text-sm font-medium">
//             {successMessage}
//           </div>
//         )}

//         <button
//           onClick={() => router.push('/user/cars')}
//           className="mt-6 w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500">
//           Powrót do listy
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CarDetailsPage;

// // statyczne generowanie stron'use client';

import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase/firebase';

const CarDetailsPage = ({ params }) => {
  const router = useRouter();
  const [car, setCar] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const carRef = doc(db, 'cars', params.id); // Pobieranie ID samochodu z `params`
        const carDoc = await getDoc(carRef);

        if (carDoc.exists()) {
          setCar(carDoc.data());
        } else {
          setErrorMessage('Samochód nie istnieje.');
        }
      } catch (error) {
        console.error('Błąd podczas pobierania danych samochodu:', error);
        setErrorMessage('Nie udało się załadować szczegółów samochodu.');
      }
    };

    fetchCarDetails();
  }, [params.id]);

  if (errorMessage) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
        <h1 className="text-2xl font-bold text-red-500">{errorMessage}</h1>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
        <h1 className="text-2xl font-bold text-white">Ładowanie szczegółów samochodu...</h1>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-var(--primary-dark) to-var(--primary)">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-var(--text-main) text-center mb-6">
          Szczegóły samochodu
        </h1>
        <p>
          <strong>Marka:</strong> {car.carMake}
        </p>
        <p>
          <strong>Model:</strong> {car.model}
        </p>
        <p>
          <strong>Kolor:</strong> {car.colour}
        </p>
        <p>
          <strong>Rok produkcji:</strong> {car.yearOfManufacture}
        </p>

        {car.photoURL && (
          <div className="mt-6">
            <img
              src={car.photoURL}
              alt="Zdjęcie samochodu"
              className="w-full rounded-md shadow-md"
            />
          </div>
        )}

        <button
          onClick={() => router.push('/user/cars')}
          className="mt-6 w-full bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500">
          Powrót do listy
        </button>
      </div>
    </div>
  );
};

export default CarDetailsPage;
