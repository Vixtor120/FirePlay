<div align="center">
  <img src="./public/logo.png" alt="FirePlay Logo" width="200" />
  <h1>FirePlay</h1>
  <p>Una Moderna Plataforma de Tienda Digital de Videojuegos</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
  ![React](https://img.shields.io/badge/React-18-blue?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
  ![Firebase](https://img.shields.io/badge/Firebase-10-orange?logo=firebase)
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?logo=tailwind-css)
</div>

## 📋 Descripción General

FirePlay es una plataforma de tienda digital de videojuegos rica en funcionalidades construida con tecnologías web modernas. Muestra la implementación de una experiencia completa de comercio electrónico centrada en videojuegos, incluyendo autenticación de usuarios, funcionalidad de carrito de compras, sistema de favoritos y un proceso de compra fluido.

La plataforma ofrece a los usuarios la capacidad de navegar por un extenso catálogo de juegos, buscar con filtros avanzados, gestionar sus favoritos y completar compras con una experiencia de checkout optimizada. El proyecto enfatiza el rendimiento, la experiencia de usuario y el atractivo visual con su diseño responsivo de tema oscuro.

![FirePlay Banner](./public/logo.png)

## ✨ Características Principales

- 🔐 **Sistema completo de autenticación** con Firebase Auth
- 💾 **Persistencia de datos en la nube** con Firestore Database
- 🛒 **Sistema de carrito de compras** con persistencia local
- ❤️ **Gestión de favoritos** sincronizada entre dispositivos
- 🎮 **Extenso catálogo de juegos** integrado con la API de RAWG
- 🔍 **Búsqueda avanzada y capacidades de filtrado**
- 📱 **Diseño totalmente responsivo** optimizado para todos los dispositivos
- 🌙 **Interfaz oscura moderna** con diseño elegante
- 💳 **Proceso de checkout simulado** con resumen de pedido

## 🛠️ Tecnologías

FirePlay aprovecha un stack tecnológico moderno para ofrecer una experiencia eficiente y amigable:

- **Framework Frontend**: Next.js 14 con App Router
- **Biblioteca UI**: React 18 con componentes funcionales y hooks
- **Lenguaje de Programación**: TypeScript para seguridad de tipos
- **Estilos**: TailwindCSS para estilos basados en utilidades
- **Backend & Autenticación**: Firebase (Authentication, Firestore, Storage)
- **Gestión de Estado**: React Context API para estado global
- **Fuente de Datos**: Integración con la API de RAWG para videojuegos
- **Despliegue**: Optimizado para la plataforma Vercel

## 📦 Estructura del Proyecto

```
fireplay/
├── app/                # Rutas de aplicación de Next.js
│   ├── cart/           # Página de carrito de compras
│   ├── contact/        # Formulario de contacto e información
│   ├── favorites/      # Página de favoritos del usuario
│   ├── game/[slug]/    # Página dinámica de detalles del juego
│   ├── home/           # Página de inicio
│   ├── info/           # Página de información del proyecto
│   ├── login/          # Página de autenticación de usuario
│   ├── register/       # Página de registro de usuario
│   ├── search/         # Página de catálogo y búsqueda
│   └── layout.tsx      # Layout principal con providers
├── components/         # Componentes UI reutilizables
├── context/            # Providers de contexto React
├── firebase/           # Configuración y helpers de Firebase
├── lib/                # Funciones de utilidad y peticiones API
├── public/             # Assets estáticos
├── styles/             # Estilos globales y configuración de Tailwind
└── types/              # Definiciones de tipos TypeScript
```

## 🚀 Primeros Pasos

### Prerrequisitos

- Node.js 18.x o más reciente
- Gestor de paquetes npm o yarn
- Proyecto Firebase con Authentication y Firestore habilitados
- Clave API de RAWG

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/fireplay.git
   cd fireplay
   ```

2. Instala las dependencias:
   ```bash
   npm install
   # o
   yarn install
   ```

3. Crea un archivo `.env.local` en la raíz del proyecto con tus variables de entorno:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=tu_clave_api_firebase
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_dominio_auth_firebase
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id_firebase
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket_firebase
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id_firebase
   NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id_firebase
   NEXT_PUBLIC_RAWG_API_KEY=tu_clave_api_rawg
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   yarn dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## 🖥️ Uso

- **Explorar Juegos**: Navega por el catálogo en la página de inicio o búsqueda
- **Búsqueda**: Utiliza la funcionalidad de búsqueda para encontrar juegos específicos
- **Cuenta de Usuario**: Regístrate e inicia sesión para acceder a características personalizadas
- **Favoritos**: Guarda juegos en tu lista de favoritos para consultarlos más tarde
- **Carrito de Compras**: Añade juegos a tu carrito y procede al checkout
- **Detalles del Juego**: Visualiza información completa sobre cada juego

## 👨‍💻 Equipo de Desarrollo

FirePlay fue desarrollado por:

- **Victor Hidalgo** - Desarrollador Frontend & Backend
- **Alejandro Gómez** - Desarrollador Frontend & Backend

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.

## 🙏 Agradecimientos

- [API RAWG](https://rawg.io/apidocs) por proporcionar los datos de los juegos
- [Firebase](https://firebase.google.com) por los servicios de autenticación y base de datos
- [Next.js](https://nextjs.org/) por el framework React
- [TailwindCSS](https://tailwindcss.com/) por el CSS basado en utilidades
- [Vercel](https://vercel.com) por el hosting y despliegue
