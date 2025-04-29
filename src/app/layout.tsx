import "../styles/globals.css";
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/GlobalToast'; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Configure Inter font properly
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'FirePlay - Tienda de Videojuegos',
  description: 'Descubre los mejores juegos al mejor precio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`dark ${inter.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#111827" />
      </head>
      <body className="antialiased">
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen bg-slate-900">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 pt-24">
                  {children}
                </main>
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
