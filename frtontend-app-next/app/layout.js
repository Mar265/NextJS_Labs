import localFont from 'next/font/local';
import './globals.css';
import SideBar from '@/components/SideBar';
import Footer from '@/components/Footer';
import { AuthProvider } from './lib/firebase/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-var(--bg-main) text-var(--text-main)">
        <AuthProvider>
          {/* Wrapper do rozciągania głównej zawartości */}
          <div className="flex flex-1 flex-col">
            {/* SideBar i główna zawartość */}
            <div className="flex flex-1">
              <SideBar>{children}</SideBar>
            </div>
          </div>
          {/* Footer na dole */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
