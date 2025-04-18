import "../styles/globals.css";
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ToastProvider } from '@/components/GlobalToast'; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'FirePlay - Tienda de Videojuegos',
  description: 'Descubre los mejores juegos al mejor precio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#111827" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen bg-slate-900">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8 pt-24">
                  {children}
                </main>
                <Footer />
              </div>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
