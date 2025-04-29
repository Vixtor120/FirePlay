'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Detectar scroll para cambiar la apariencia del encabezado
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/home');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ${
      scrolled 
        ? 'bg-slate-900/90 backdrop-blur-lg border-b border-slate-800/50 py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo simplificado */}
        <Link href="/home" className="flex items-center space-x-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-700 shadow-lg">
            <span className="text-lg">🎮</span>
            <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-30 blur"></div>
          </div>
          <span className="text-xl font-bold text-white">FirePlay</span>
        </Link>
        
        {/* Navegación de escritorio - Mejorada */}
        <div className="hidden md:flex items-center space-x-1">
          <nav className="flex space-x-1 mr-2">
            {[
              { name: 'Inicio', href: '/home' },
              { name: 'Explorar', href: '/search' },
              { name: 'Información', href: '/info' },
              { name: 'Contacto', href: '/contact' },
            ].map(item => (
              <Link 
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm ${
                  isActive(item.href) 
                    ? 'bg-slate-800 text-violet-400' 
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          
          {/* Acciones de usuario */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/favorites" 
                className={`p-2 rounded-md ${isActive('/favorites') ? 'text-violet-400 bg-slate-800' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'}`}
                aria-label="Favoritos"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill={isActive('/favorites') ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </Link>
              
              <Link 
                href="/cart" 
                className={`p-2 rounded-md relative ${isActive('/cart') ? 'text-violet-400 bg-slate-800' : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'}`}
                aria-label="Carrito"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              {/* Botón de cerrar sesión - Ahora es un botón directo para más fácil acceso */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 ml-1 rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
                title="Cerrar sesión"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="sr-only md:not-sr-only text-sm">Salir</span>
              </button>
              
              {/* Perfil de usuario - Ya no tiene menú desplegable */}
              <div className="text-sm flex items-center px-3 py-1 rounded-lg bg-slate-800 text-slate-200 ml-1">
                <div className="w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">
                  {user.email?.split('@')[0]}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                href="/login" 
                className="px-3 py-1.5 text-sm text-slate-300 hover:text-white transition-colors"
              >
                Acceder
              </Link>
              <Link 
                href="/register" 
                className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-3 py-1.5 rounded-md transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
        
        {/* Botón de menú para móvil - Con cambios en el menú móvil */}
        <button 
          className="md:hidden z-50 p-2 rounded-md bg-slate-800/80 text-slate-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Menú móvil mejorado - Ahora el botón de cerrar sesión es más accesible */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/95 md:hidden">
          <div className="flex flex-col h-full items-center justify-center text-center p-6">
            <nav className="flex flex-col space-y-6 mb-8 w-full">
              {[
                { name: 'Inicio', href: '/home' },
                { name: 'Explorar', href: '/search' },
                { name: 'Información', href: '/info' },
                { name: 'Contacto', href: '/contact' },
                { name: 'Favoritos', href: '/favorites' },
                { name: 'Carrito', href: '/cart', badge: totalItems > 0 ? totalItems.toString() : null },
              ].map(item => (
                <Link 
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-xl relative ${
                    isActive(item.href) 
                      ? 'text-violet-400' 
                      : 'text-white'
                  }`}
                >
                  {item.name}
                  {item.badge && (
                    <span className="absolute -top-2 -right-6 bg-violet-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
              
            {user ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="bg-slate-800 rounded-lg p-4 text-center w-full">
                  <div className="mx-auto mb-2 w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-white text-sm mb-1">{user.email}</p>
                </div>
                
                {/* Botón de cerrar sesión destacado */}
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 py-3 px-6 rounded-lg w-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 w-full">
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-transparent border border-white text-white py-3 px-6 rounded-lg w-full"
                >
                  Iniciar sesión
                </Link>
                <Link 
                  href="/register" 
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-violet-600 text-white py-3 px-6 rounded-lg w-full"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
