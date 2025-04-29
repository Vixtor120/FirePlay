'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function ContactPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    orderReference: '',
    subject: 'support', // Default value for subject dropdown
    message: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    
    if (!formData.subject) newErrors.subject = 'Selecciona un asunto';
    if (!formData.message.trim()) newErrors.message = 'El mensaje es requerido';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send the form data to your backend
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      
      // if (!response.ok) throw new Error('Error al enviar el formulario');
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: user?.email || '',
        orderReference: '',
        subject: 'support',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        if (document.body.contains(document.getElementById('contactForm'))) {
          setSubmitSuccess(false);
        }
      }, 5000);
    } catch (error) {
      setSubmitError('Ha ocurrido un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
      console.error('Contact form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white mb-2">Contacto y Soporte Técnico</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Estamos aquí para ayudarte con cualquier duda o problema relacionado con tus compras o el uso de la plataforma.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form Section - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Envíanos un mensaje</h2>
              
              {submitSuccess && (
                <div className="mb-6 bg-green-900/30 border border-green-900/50 text-green-400 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Mensaje enviado correctamente. Te responderemos lo antes posible.
                  </div>
                </div>
              )}
              
              {submitError && (
                <div className="mb-6 bg-red-900/30 border border-red-900/50 text-red-400 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {submitError}
                  </div>
                </div>
              )}
              
              <form id="contactForm" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-slate-700'} bg-slate-900 p-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500`}
                    placeholder="Escribe tu nombre"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-700'} bg-slate-900 p-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="orderReference" className="block text-sm font-medium text-slate-300 mb-1">
                    Referencia de pedido (opcional)
                  </label>
                  <input
                    type="text"
                    id="orderReference"
                    name="orderReference"
                    value={formData.orderReference}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500"
                    placeholder="Ej. FP-12345"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-1">
                    Asunto
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full rounded-lg border ${errors.subject ? 'border-red-500' : 'border-slate-700'} bg-slate-900 p-2.5 text-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500`}
                  >
                    <option value="support">Soporte técnico</option>
                    <option value="purchase">Problema con una compra</option>
                    <option value="refund">Solicitud de reembolso</option>
                    <option value="account">Problemas con la cuenta</option>
                    <option value="other">Otro</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full rounded-lg border ${errors.message ? 'border-red-500' : 'border-slate-700'} bg-slate-900 p-2.5 text-white placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500`}
                    placeholder="Describe tu problema o consulta con el mayor detalle posible..."
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="privacy"
                    className="rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-violet-500 mt-1"
                    required
                  />
                  <label htmlFor="privacy" className="ml-2 text-sm text-slate-400">
                    Acepto la <Link href="#" className="text-violet-400 hover:text-violet-300">política de privacidad</Link> y el tratamiento de mis datos para gestionar mi consulta.
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:bg-violet-800 disabled:text-violet-200 flex justify-center items-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    'Enviar mensaje'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Contact Info Sidebar - 1/3 width on large screens */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Información de contacto</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-violet-600/20 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-300">Email</h3>
                    <p className="text-violet-400">soporte@fireplay.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-violet-600/20 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-300">Horario de atención</h3>
                    <p className="text-slate-400">Lunes a Viernes: 9:00 - 18:00</p>
                    <p className="text-slate-400">Sábados: 10:00 - 14:00</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-violet-600/20 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-300">Chat en vivo</h3>
                    <p className="text-slate-400">Disponible durante el horario de atención</p>
                    <button className="mt-2 bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Iniciar chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Response Times */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-white mb-3">Tiempos de respuesta</h2>
              <ul className="space-y-2">
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Soporte técnico</span>
                  <span className="text-green-400 font-medium">24-48h</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Problemas de compras</span>
                  <span className="text-green-400 font-medium">24h</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Reembolsos</span>
                  <span className="text-orange-400 font-medium">2-5 días</span>
                </li>
                <li className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Chat en vivo</span>
                  <span className="text-green-400 font-medium">Inmediato</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQs Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Preguntas frecuentes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-5">
            <h3 className="text-lg font-medium text-white mb-2">¿Cómo puedo descargar mi juego?</h3>
            <p className="text-slate-400">
              Tras completar tu compra, recibirás un correo electrónico con las instrucciones de descarga y el código de activación. También puedes acceder a tu biblioteca de juegos desde tu perfil.
            </p>
          </div>
          
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-5">
            <h3 className="text-lg font-medium text-white mb-2">¿Cuál es la política de reembolsos?</h3>
            <p className="text-slate-400">
              Ofrecemos reembolsos para juegos adquiridos en los últimos 14 días y con menos de 2 horas de juego. Para solicitar un reembolso, completa el formulario de contacto seleccionando &quot;Solicitud de reembolso&quot;.
            </p>
          </div>
          
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-5">
            <h3 className="text-lg font-medium text-white mb-2">¿Mi código de activación no funciona, qué hago?</h3>
            <p className="text-slate-400">
              Si tienes problemas con tu código de activación, asegúrate de introducirlo exactamente como aparece, respetando mayúsculas y minúsculas. Si sigue sin funcionar, contacta con nosotros con el número de referencia de tu pedido.
            </p>
          </div>
          
          <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-5">
            <h3 className="text-lg font-medium text-white mb-2">¿Cómo actualizo mi método de pago?</h3>
            <p className="text-slate-400">
              Puedes actualizar tus métodos de pago desde la sección &quot;Ajustes de cuenta&quot; en tu perfil. Admitimos tarjetas de crédito/débito, PayPal y diversas opciones de monedero electrónico.
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/faq" className="text-violet-400 hover:text-violet-300 flex items-center justify-center">
            Ver todas las preguntas frecuentes
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
