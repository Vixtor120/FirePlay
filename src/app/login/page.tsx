'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

// Extract the component that uses useSearchParams
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || 'home';
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      router.push(`/${redirectPath}`);
    } catch (error: unknown) {
      console.error('Error de autenticación:', error);
      
      if (error && typeof error === 'object' && 'code' in error) {
        const errorWithCode = error as { code: string };
        
        if (errorWithCode.code === 'auth/user-not-found' || errorWithCode.code === 'auth/wrong-password') {
          setError('Email o contraseña incorrectos');
        } else if (errorWithCode.code === 'auth/too-many-requests') {
          setError('Demasiados intentos fallidos. Prueba más tarde');
        } else {
          setError('Error al iniciar sesión. Por favor, inténtalo de nuevo');
        }
      } else {
        setError('Error al iniciar sesión. Por favor, inténtalo de nuevo');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Iniciar Sesión</h1>
          <p className="mt-2 text-sm text-slate-400">Bienvenido a FirePlay, ingresa tus datos para continuar</p>
        </div>
        
        {/* Formulario */}
        <div className="overflow-hidden rounded-xl bg-slate-800/60 shadow-xl backdrop-blur-sm">
          {/* Mensaje de error */}
          {error && (
            <div className="bg-red-500/20 p-4 text-sm text-red-300">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="mr-2 h-5 w-5">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                  placeholder="nombre@correo.com"
                  required
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-300">
                    Contraseña
                  </label>
                  <Link href="#" className="text-xs text-violet-400 hover:text-violet-300">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-600 accent-violet-600"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-slate-400">
                  Recordarme
                </label>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-center font-medium text-white shadow-lg hover:from-violet-700 hover:to-indigo-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Accediendo...
                  </span>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>
            </form>
          </div>
          
          <div className="border-t border-slate-700 bg-slate-800/80 p-4 text-center text-sm text-slate-400">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="font-medium text-violet-400 hover:text-violet-300">
              Regístrate ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-violet-400 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-slate-400">Cargando...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
