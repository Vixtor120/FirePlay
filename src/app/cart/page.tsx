'use client';

import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useToast } from '@/components/GlobalToast';
import { getPopularGames } from '@/lib/requests';
import { Game } from '@/types/game.types';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const { user } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const { showToast } = useToast();
  const [recommendedGames, setRecommendedGames] = useState<Game[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (cartItems.length === 0) return;

      setLoadingRecommendations(true);
      try {
        // Remove unused variable and just get genres without storing them
        cartItems
          .flatMap(item => item.genres?.map(g => g.id) || [])
          .filter((value, index, self) => self.indexOf(value) === index);

        const recommendedItems = await getPopularGames(1, 4);

        const filteredRecommendations = recommendedItems.filter(
          game => !cartItems.some(item => item.id === game.id)
        );

        setRecommendedGames(filteredRecommendations);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    loadRecommendations();
  }, [cartItems]);

  const handleCoupon = () => {
    if (couponApplied) {
      setCouponApplied(false);
      setDiscountAmount(0);
      setDiscountPercent(0);
      showToast('Cupón eliminado', 'info');
      return;
    }

    const couponCodeUpper = couponCode.toUpperCase();

    if (couponCodeUpper === 'FIREPLAY10') {
      setCouponApplied(true);
      setDiscountPercent(10);
      setDiscountAmount(totalPrice * 0.1);
      showToast('¡Cupón aplicado con éxito! 10% de descuento', 'success');
    } else if (couponCodeUpper === 'OFERTAMAYO') {
      setCouponApplied(true);
      setDiscountPercent(15);
      setDiscountAmount(totalPrice * 0.15);
      showToast('¡OFERTA ESPECIAL DE MAYO! 15% de descuento aplicado', 'success');
    } else {
      showToast('Cupón no válido', 'error');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      showToast('Debes iniciar sesión para completar la compra', 'error');
      return;
    }

    setIsCheckingOut(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    clearCart();
    setCheckoutComplete(true);
    setIsCheckingOut(false);
    showToast('¡Compra realizada con éxito!', 'success');
  };

  const handleRemoveFromCart = (itemId: number, itemName: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId));

    setTimeout(() => {
      removeFromCart(itemId);

      if (isMounted.current) {
        setRemovingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });

        showToast(`${itemName} eliminado del carrito`, 'info');
      }
    }, 100);
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    // Asegurar que la cantidad esté entre 1 y 10
    const limitedQuantity = Math.max(1, Math.min(10, newQuantity));
    updateQuantity(itemId, limitedQuantity);
    
    // Mostrar feedback si se intenta exceder el límite
    if (newQuantity > 10) {
      showToast('Máximo 10 unidades por producto', 'info');
    }
  };

  if (checkoutComplete) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-slate-800 rounded-2xl p-8 text-center border border-slate-700 shadow-lg">
          <div className="bg-green-900/20 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">¡Compra Completada!</h1>
          <p className="text-slate-300 mb-8 max-w-md mx-auto">
            Gracias por tu compra. Hemos enviado los detalles de tu pedido a tu correo electrónico.
          </p>

          <div className="mb-8 bg-slate-900 rounded-lg p-6 max-w-sm mx-auto">
            <h3 className="font-medium text-violet-400 mb-3 text-left">Resumen de tu pedido:</h3>
            <div className="text-left space-y-2 text-sm text-slate-300">
              <div className="flex justify-between">
                <span>Número de pedido:</span>
                <span className="font-medium">FP-{Math.floor(Math.random() * 1000000)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-medium">€{(totalPrice - discountAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/home" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg transition-colors">
              Volver a la tienda
            </Link>
            <Link href="#" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg transition-colors">
              Ver mis compras
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8 text-white">Mi Carrito</h1>

        <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
          <div className="text-6xl mb-4 opacity-75">🛒</div>
          <h2 className="text-xl font-semibold mb-3 text-white">Tu carrito está vacío</h2>
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            Aún no has añadido ningún juego a tu carrito. Explora nuestro catálogo y encuentra algo que te guste.
          </p>
          <Link href="/search" className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg transition-colors inline-block">
            Explorar Tienda
          </Link>
        </div>
      </div>
    );
  }

  const finalTotal = totalPrice - discountAmount;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8 text-white">Mi Carrito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-2">
          <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg divide-y divide-slate-700">
            <div className="bg-slate-900/80 p-4 md:hidden">
              <h2 className="text-lg font-medium text-white">Artículos ({totalItems})</h2>
            </div>

            <div className="hidden md:grid md:grid-cols-12 bg-slate-900/80 p-4 text-sm font-medium text-slate-400">
              <div className="col-span-6">Producto</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-center">Total</div>
            </div>

            <div className="divide-y divide-slate-700/80">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center ${
                    removingItems.has(item.id) ? 'opacity-50 transition-opacity' : ''
                  }`}
                >
                  <div className="md:col-span-6 flex gap-3">
                    <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden rounded bg-slate-700/40">
                      <Link href={`/game/${item.slug}`} className="block relative w-full h-full">
                        <Image
                          src={item.background_image || '/placeholder-game.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </Link>
                    </div>

                    <div className="flex-grow">
                      <Link href={`/game/${item.slug}`} className="text-lg font-medium text-white hover:text-violet-400 transition-colors line-clamp-1">
                        {item.name}
                      </Link>

                      <div className="md:hidden mt-1 flex justify-between">
                        <p className="text-violet-400 font-medium">${item.price.toFixed(2)}</p>
                        <p className="text-slate-300">x{item.quantity}</p>
                      </div>

                      <button
                        onClick={() => handleRemoveFromCart(item.id, item.name)}
                        disabled={removingItems.has(item.id)}
                        className={`mt-2 text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 ${
                          removingItems.has(item.id) ? 'cursor-not-allowed' : ''
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="hidden md:block md:col-span-2 md:text-center">
                    <p className="text-violet-400 font-medium">${item.price.toFixed(2)}</p>
                  </div>

                  <div className="hidden md:flex md:col-span-2 items-center justify-center">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={removingItems.has(item.id)}
                        className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-l text-white disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="w-10 text-center px-2 py-1 bg-slate-900 text-white border-y border-slate-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={removingItems.has(item.id) || item.quantity >= 10}
                        className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-r text-white disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="md:hidden flex justify-between items-center mt-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={removingItems.has(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                        </svg>
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={removingItems.has(item.id) || item.quantity >= 10}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-700 disabled:opacity-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                      </button>
                    </div>

                    <p className="font-medium text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-white">Recomendados para ti</h2>
              <Link href="/search" className="text-sm text-violet-400 hover:text-violet-300 flex items-center">
                Ver más
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {loadingRecommendations ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(item => (
                  <div key={item} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                    <div className="aspect-[3/4] relative">
                      <div className="absolute inset-0 bg-slate-700 animate-pulse"></div>
                    </div>
                    <div className="p-3">
                      <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                      <div className="h-4 w-1/2 mt-2 bg-slate-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendedGames.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recommendedGames.map(game => (
                  <Link
                    key={game.id}
                    href={`/game/${game.slug}`}
                    className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-violet-600 transition-all duration-300 group"
                  >
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <Image
                        src={game.background_image || '/placeholder-game.jpg'}
                        alt={game.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 text-xs bg-violet-600 text-white px-1.5 py-0.5 rounded">
                        ${game.price?.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="text-white font-medium text-sm line-clamp-1 group-hover:text-violet-400 transition-colors">
                        {game.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center text-xs text-amber-500">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 mr-0.5">
                            <path
                              fillRule="evenodd"
                              d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {game.rating.toFixed(1)}
                        </div>
                        <span className="text-slate-400 text-xs">{new Date(game.released).getFullYear()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No hay recomendaciones disponibles.</p>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-lg sticky top-24">
            <div className="p-5 border-b border-slate-700">
              <h2 className="text-lg font-medium text-white mb-1">Resumen de compra</h2>
              <p className="text-sm text-slate-400">{totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}</p>
            </div>

            <div className="p-5 border-b border-slate-700">
              <div className="flex justify-between mb-3">
                <span className="text-slate-300">Subtotal</span>
                <span className="text-white font-medium">${totalPrice.toFixed(2)}</span>
              </div>

              <div className="mt-4 mb-3">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {couponApplied ? 'Cupón aplicado' : 'Cupón de descuento'}
                </label>
                <div className="flex">
                  <input
                    type="text"
                    disabled={couponApplied}
                    placeholder={couponApplied ? couponCode.toUpperCase() : 'Ingresa tu cupón'}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow rounded-l-lg bg-slate-900 border border-slate-700 p-2 text-sm text-white"
                  />
                  <button
                    onClick={handleCoupon}
                    className={`px-4 py-2 rounded-r-lg font-medium ${
                      couponApplied
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {couponApplied ? 'Quitar' : 'Aplicar'}
                  </button>
                </div>
                {couponApplied && (
                  <div className="mt-2 text-green-400 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Descuento del {discountPercent}% aplicado
                  </div>
                )}
              </div>

              {couponApplied && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">Descuento</span>
                  <span className="text-green-400">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex justify-between mb-5">
                <span className="text-white font-medium">Total</span>
                <span className="text-xl font-bold text-violet-400">${finalTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 px-4 rounded-lg font-medium disabled:bg-violet-800 disabled:text-violet-200 transition-colors"
              >
                {isCheckingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  "Finalizar compra"
                )}
              </button>

              <button
                onClick={clearCart}
                disabled={isCheckingOut}
                className="w-full mt-3 bg-transparent hover:bg-slate-700 text-slate-300 py-2 px-4 border border-slate-600 rounded-lg text-sm transition-colors"
              >
                Vaciar carrito
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pago seguro garantizado
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
