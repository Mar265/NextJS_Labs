// 'use client';
 
// import { createContext, useContext, useState, useEffect } from 'react';
 
// const AuthContext = createContext();
 
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
 
//   useEffect(() => {
//     // Logika dla onAuthStateChanged lub inna obsługa użytkownika
//   }, []);
 
//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
 
// export const useAuth = () => useContext(AuthContext);
 
 