'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function InfoPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'technologies' | 'architecture' | 'features'>('overview');

  // Lista de tecnologías con sus descripciones
  const technologies = [
    {
      name: "Next.js 14",
      description: "Framework de React para renderizado híbrido, rutas API y optimización",
      url: "https://nextjs.org/"
    },
    {
      name: "React 18",
      description: "Biblioteca JavaScript para crear interfaces de usuario",
      url: "https://reactjs.org/"
    },
    {
      name: "TypeScript",
      description: "Superset tipado de JavaScript que compila a JavaScript puro",
      url: "https://www.typescriptlang.org/"
    },
    {
      name: "Tailwind CSS",
      description: "Framework CSS de utilidad para diseñar rápidamente sin salir del HTML",
      url: "https://tailwindcss.com/"
    },
    {
      name: "Firebase",
      description: "Plataforma de desarrollo móvil y web para autenticación, base de datos y almacenamiento",
      url: "https://firebase.google.com/"
    },
    {
      name: "RAWG API",
      description: "API para obtener información sobre videojuegos",
      url: "https://rawg.io/apidocs"
    }
  ];

  // Lista de características principales
  const features = [
    {
      name: "Autenticación de usuarios",
      description: "Sistema completo de registro e inicio de sesión con Firebase Authentication",
      icon: "🔐"
    },
    {
      name: "Catálogo de juegos",
      description: "Exploración y búsqueda de videojuegos con filtrado y paginación",
      icon: "🎮"
    },
    {
      name: "Gestión de favoritos",
      description: "Almacenamiento y sincronización de juegos favoritos con Firestore",
      icon: "❤️"
    },
    {
      name: "Carrito de compras",
      description: "Funcionalidad completa de carrito con persistencia local",
      icon: "🛒"
    },
    {
      name: "Procesamiento de pagos",
      description: "Simulación de procesamiento de pagos y finalización de compras",
      icon: "💳"
    },
    {
      name: "Diseño responsive",
      description: "Experiencia óptima en dispositivos móviles, tablets y escritorio",
      icon: "📱"
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 text-slate-300">
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Visión general del proyecto</h3>
              <p className="mb-4">
                FirePlay es una tienda online de videojuegos desarrollada utilizando las tecnologías web más modernas.
                La plataforma permite a los usuarios explorar un extenso catálogo de juegos, guardar favoritos, añadir productos al carrito y simular el proceso de compra.
              </p>
              <p>
                El objetivo principal es demostrar la implementación de una aplicación web completa y funcional con características clave como autenticación de usuarios,
                integración con APIs externas, almacenamiento de datos en la nube y una experiencia de usuario fluida y responsive.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-800/40 p-6 rounded-xl border border-slate-700">
              <h3 className="text-2xl font-bold text-white mb-3">Objetivos del proyecto</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Crear una aplicación web moderna con Next.js y React</li>
                <li>Implementar autenticación segura de usuarios con Firebase</li>
                <li>Desarrollar una interfaz de usuario atractiva y responsive utilizando Tailwind CSS</li>
                <li>Integrar y consumir datos de APIs externas (RAWG API para información de juegos)</li>
                <li>Gestionar el estado de la aplicación con React Context</li>
                <li>Practicar TypeScript para un desarrollo más robusto y tipado</li>
                <li>Demostrar buenas prácticas de desarrollo web moderno</li>
              </ul>
            </div>
          </div>
        );
      case 'technologies':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Tecnologías utilizadas</h3>
            <p className="text-slate-300 mb-6">
              FirePlay utiliza un stack moderno de tecnologías front-end y back-end para proporcionar una experiencia de usuario rápida, 
              segura y escalable. A continuación se detallan las principales tecnologías empleadas:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technologies.map((tech) => (
                <a 
                  href={tech.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  key={tech.name}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700 hover:border-violet-500 hover:from-slate-800/90 hover:to-slate-900/90 transition-all duration-300"
                >
                  <h4 className="text-lg font-semibold text-white mb-2">{tech.name}</h4>
                  <p className="text-slate-400 text-sm">{tech.description}</p>
                </a>
              ))}
            </div>
            
            <div className="mt-8 bg-gradient-to-br from-slate-800/80 to-slate-800/20 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4">Otras tecnologías y herramientas</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {["ESLint", "Prettier", "Git", "GitHub", "Vercel", "npm", "React Context API"].map((tool) => (
                  <div key={tool} className="bg-slate-800/50 backdrop-blur px-3 py-2 rounded-lg border border-slate-700 text-center text-slate-300 text-sm transition-all duration-300 hover:border-violet-500 hover:bg-slate-800">
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'architecture':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Arquitectura del proyecto</h3>
            <p className="text-slate-300">
              FirePlay está construido siguiendo una arquitectura moderna de aplicación web basada en componentes,
              con separación clara de responsabilidades y patrones escalables.
            </p>
            
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/20 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h4 className="text-lg font-semibold text-white mb-4">Estructura de directorios</h4>
              <div className="font-mono text-sm text-slate-300 bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <pre className="whitespace-pre-wrap">
{`src/
├── app/               # Rutas y páginas de la aplicación (Next.js App Router)
│   ├── cart/         # Página de carrito de compras
│   ├── contact/      # Página de contacto
│   ├── favorites/    # Página de favoritos del usuario
│   ├── game/         # Página de detalle de juego
│   ├── home/         # Página de inicio
│   ├── info/         # Página de información (esta página)
│   ├── login/        # Página de inicio de sesión
│   ├── register/     # Página de registro
│   ├── search/       # Página de búsqueda y exploración
│   └── layout.tsx    # Diseño principal de la aplicación
│
├── components/        # Componentes reutilizables
│   ├── CartButton.tsx
│   ├── FavoriteButton.tsx
│   ├── Footer.tsx
│   ├── GameCard.tsx
│   ├── GlobalToast.tsx
│   └── Header.tsx
│
├── context/          # Contextos de React para gestión de estado
│   ├── AuthContext.tsx
│   └── CartContext.tsx
│
├── firebase/         # Configuración y utilidades de Firebase
│
├── lib/              # Funciones y utilidades
│   └── requests.ts   # Funciones para llamadas a API
│
├── styles/           # Estilos globales y configuración de Tailwind
│
└── types/            # Definiciones de tipos TypeScript
    ├── favorite.types.ts
    └── game.types.ts`}
                </pre>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gradient-to-br from-violet-900/20 to-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700 hover:border-violet-600/50 transition-all duration-300">
                <h4 className="text-lg font-semibold text-white mb-4">Gestión de estado</h4>
                <p className="text-slate-300 text-sm">
                  FirePlay utiliza React Context para manejar el estado global de la aplicación:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-sm text-slate-300">
                  <li><strong className="text-violet-400">AuthContext:</strong> Gestiona el estado de autenticación del usuario</li>
                  <li><strong className="text-violet-400">CartContext:</strong> Maneja el carrito de compras y su persistencia</li>
                  <li><strong className="text-violet-400">ToastContext:</strong> Proporciona notificaciones globales</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-900/20 to-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700 hover:border-indigo-600/50 transition-all duration-300">
                <h4 className="text-lg font-semibold text-white mb-4">Modelo de datos</h4>
                <p className="text-slate-300 text-sm">
                  La aplicación trabaja con varios tipos de datos principales:
                </p>
                <ul className="list-disc pl-6 mt-3 space-y-2 text-sm text-slate-300">
                  <li><strong className="text-indigo-400">User:</strong> Información de usuario autenticado</li>
                  <li><strong className="text-indigo-400">Game:</strong> Datos de juegos del catálogo</li>
                  <li><strong className="text-indigo-400">CartItem:</strong> Elementos en el carrito de compras</li>
                  <li><strong className="text-indigo-400">FavoriteItem:</strong> Juegos marcados como favoritos</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 'features':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">Funcionalidades principales</h3>
            <p className="text-slate-300 mb-6">
              FirePlay ofrece una variedad de características diseñadas para proporcionar una experiencia de compra completa y fluida:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div 
                  key={feature.name}
                  className="bg-gradient-to-br from-slate-800 to-slate-800/40 rounded-xl p-5 border border-slate-700 hover:border-violet-500 hover:from-slate-800/90 hover:to-slate-900 transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="text-3xl mr-4">{feature.icon}</div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">{feature.name}</h4>
                      <p className="text-slate-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-br from-violet-900/30 to-indigo-900/10 border border-violet-800/30 rounded-xl p-6 mt-6">
              <h4 className="text-xl font-semibold text-white mb-3">Procesos clave implementados</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-violet-400 font-semibold mb-2">Proceso de autenticación</h5>
                  <ol className="list-decimal pl-6 text-sm text-slate-300 space-y-1">
                    <li>Registro de usuario con email y contraseña</li>
                    <li>Validación de credenciales</li>
                    <li>Inicio de sesión seguro con Firebase Auth</li>
                    <li>Persistencia de sesión en dispositivo</li>
                    <li>Cierre de sesión y gestión de estados</li>
                  </ol>
                </div>
                <div>
                  <h5 className="text-violet-400 font-semibold mb-2">Proceso de compra</h5>
                  <ol className="list-decimal pl-6 text-sm text-slate-300 space-y-1">
                    <li>Añadir productos al carrito</li>
                    <li>Gestión de cantidades y productos</li>
                    <li>Aplicación de cupones de descuento</li>
                    <li>Revisión y confirmación del pedido</li>
                    <li>Simulación de procesamiento de pago</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Cabecera de la página con efecto de gradiente más moderno */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4 p-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg">
          <div className="bg-slate-900 px-6 py-2 rounded-md">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-500">
              FirePlay: Proyecto y Tecnologías
            </h1>
          </div>
        </div>
        <p className="text-slate-300 text-xl max-w-3xl mx-auto">
          Una visión detallada sobre cómo se construyó esta tienda de videojuegos, las tecnologías utilizadas y su arquitectura.
        </p>
      </div>

      {/* Tarjeta principal con pestañas - Diseño modernizado con gradientes y glassmorphism */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/30 backdrop-blur rounded-xl border border-slate-700 shadow-xl overflow-hidden">
        {/* Navegación por pestañas - Ahora con indicador de pestañas más moderno */}
        <div className="flex overflow-x-auto border-b border-slate-700/70">
          {[
            { id: 'overview', label: 'Visión general' },
            { id: 'technologies', label: 'Tecnologías' },
            { id: 'architecture', label: 'Arquitectura' },
            { id: 'features', label: 'Funcionalidades' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`relative px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setActiveTab(tab.id as any)}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-violet-500 to-indigo-500"></span>
              )}
            </button>
          ))}
        </div>

        {/* Contenido de la pestaña actual */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
      
      {/* Sección de Equipo - Actualizada y modernizada */}
      <div className="mt-12 bg-gradient-to-br from-slate-800/30 via-slate-900/20 to-slate-800/10 backdrop-blur rounded-xl border border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-500">
            Desarrollado por
          </span>
        </h2>
        <div className="flex flex-wrap justify-center gap-10">
          {/* Victor Hidalgo */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-3xl mb-3 shadow-lg">
              VH
            </div>
            <h3 className="text-lg font-medium text-white">Víctor Hidalgo</h3>
            <p className="text-sm text-slate-400">Developer</p>
          </div>
          
          {/* Alejandro Gómez */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center text-white text-3xl mb-3 shadow-lg">
              AG
            </div>
            <h3 className="text-lg font-medium text-white">Alejandro Gómez</h3>
            <p className="text-sm text-slate-400">Developer</p>
          </div>
        </div>
      </div>

      {/* Sección final de llamado a la acción - Con diseño más moderno */}
      <div className="mt-12 text-center bg-gradient-to-br from-slate-800/40 to-slate-900/10 backdrop-blur-sm rounded-xl p-8 border border-slate-700 shadow-lg">
        <p className="text-slate-400 mb-6 text-lg">
          ¿Quieres ver cómo funciona esta aplicación?
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/search" className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-violet-900/20">
            Explorar tienda
          </Link>
          <Link href="/home" className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg transition-colors shadow">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
