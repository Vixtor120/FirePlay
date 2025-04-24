# 🎮 FirePlay

FirePlay es una plataforma web moderna para la compra y descubrimiento de videojuegos digitales, desarrollada con Next.js, React, TypeScript y Firebase. Ofrece una experiencia de usuario fluida con una interfaz oscura elegante, optimizada para los amantes de los videojuegos.

![FirePlay Banner](./public/screenshots/banner.png)

## 🚀 Características principales

- 🔐 **Sistema de autenticación completo** con Firebase Auth
- 💾 **Persistencia de datos** en Firestore Database
- 🛒 **Carrito de compras** funcional con persistencia
- ❤️ **Sistema de favoritos** para guardar juegos de interés
- 🔍 **Búsqueda avanzada** y filtrado de juegos
- 📱 **Diseño responsivo** para todos los dispositivos
- 🌙 **Interfaz oscura** moderna y atractiva
- 🔄 **Actualizaciones en tiempo real** de datos
- 💳 **Proceso de checkout** simulado

## 🛠️ Tecnologías utilizadas

- **Next.js 13**: Framework React con App Router
- **TypeScript**: Tipado estático para mejor mantenibilidad
- **Firebase**: Autenticación y base de datos
- **TailwindCSS**: Utilidades CSS para diseño moderno
- **Context API**: Gestión de estado global (carrito, autenticación)
- **API de Juegos**: Integración con RAWG API para catálogo de juegos

## 📋 Estructura del proyecto

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
