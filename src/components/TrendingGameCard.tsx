'use client';

import Link from 'next/link';
import { useToast } from './GlobalToast';

interface TrendingGameCardProps {
  title: string;
  icon: React.ReactNode;
  genre: string;
  gradient: string;
  accentColor: string;
}

export default function TrendingGameCard({
  title,
  icon,
  genre,
  gradient,
  accentColor
}: TrendingGameCardProps) {
  const { showToast } = useToast();
  
  const handleClick = () => {
    // Show toast notification when trending card is clicked
    showToast(`Explorando ${title}`, 'info');
    // Navigation happens through the Link component
  }
  
  return (
    <Link
      href={`/search?q=${encodeURIComponent(title)}`}
      className="group relative h-auto p-6 rounded-xl overflow-hidden flex flex-col cursor-pointer"
      style={{ background: gradient }}
      onClick={handleClick}
    >
      {/* Contenido principal con icono */}
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
        {/* Icono grande */}
        <div className={`mb-4 text-white text-5xl sm:text-6xl opacity-90 ${accentColor}`}>
          {icon}
        </div>
        
        {/* Géneros */}
        <div className={`inline-block px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs rounded-full mb-2 font-medium`}>
          {genre}
        </div>
        
        {/* Título */}
        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:underline decoration-2 underline-offset-4">
          {title}
        </h3>
      </div>
      
      {/* Flecha de navegación */}
      <div className="mt-auto pt-4 flex justify-end">
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
      
      {/* Efecto de brillo al pasar el mouse */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Círculos decorativos de fondo */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10"></div>
      <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-white/5"></div>
    </Link>
  );
}
