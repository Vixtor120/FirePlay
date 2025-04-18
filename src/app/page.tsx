import { redirect } from 'next/navigation';

// Esta función se ejecuta en el servidor durante la renderización
export default function Page() {
  // Redirige al usuario a la ruta '/home'
  redirect('/home');
}
