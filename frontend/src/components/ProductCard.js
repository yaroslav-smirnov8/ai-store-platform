import React, { useEffect, useRef } from 'react';
// Removed Telegram dependencies - now pure web app
import { useAnime, storeAnimations } from '../utils/useAnime';

const ProductCard = ({ product, onBuyClick, showInstallment = true }) => {
  const cardRef = useAnime(storeAnimations.cardEntrance);
  const priceRef = useRef(null);
  const iconRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    // Animate price on mount
    if (priceRef.current && window.anime) {
      window.anime({
        targets: priceRef.current,
        ...storeAnimations.fadeInUpBounce,
        delay: 400
      });
    }

    // Animate icon
    if (iconRef.current && window.anime) {
      window.anime({
        targets: iconRef.current,
        ...storeAnimations.iconBounce,
        delay: 600
      });
    }
  }, []);

  const handleBuyClick = (paymentType) => {
    // Animate button press
    if (buttonsRef.current && window.anime) {
      window.anime({
        targets: buttonsRef.current,
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeOutQuad'
      });
    }
    
    onBuyClick(product, paymentType);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getProductIcon = (type) => {
    // implement logic to get product icon based on type
    // for now, just return a default icon
    return '📦';
  };

  return (
    <div ref={cardRef} className="relative card-futuristic overflow-hidden group hover:scale-105 transition-all duration-300 border border-gray-200">
      {/* AI Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
          AI-POWERED
        </div>
      </div>
      
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%239C92AC%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%2230%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div ref={iconRef} className="w-12 h-12 bg-gradient-to-r from-blue-400 to-slate-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <span className="text-white text-xl">🧠</span>
              </div>
              <div className="text-xs uppercase tracking-wider text-blue-300 font-semibold">
                {product.type === 'course' ? 'Course' : 'Intensive'} • AI for Teachers
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">
              {product.name}
            </h3>
            <p className="text-blue-100 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">

        {/* AI Features with tech styling */}
        {product.features && product.features.length > 0 && (
          <div className="mb-6">
            <h4 className="flex items-center font-semibold text-gray-900 mb-4">
              <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-md flex items-center justify-center mr-2">
                <span className="text-white text-xs">⚡</span>
              </span>
              Includes:
            </h4>
            <div className="grid gap-3">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-slate-100 rounded-lg border border-blue-100">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced AI-styled Pricing */}
        <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-slate-700/10"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs uppercase tracking-wider text-blue-300 mb-2 font-semibold">Course Price</div>
                <div ref={priceRef} className="text-3xl font-bold text-white mb-2">
                  {formatPrice(product.price)}
                </div>
                {showInstallment && product.installment_price && product.installment_months && (
                  <div className="bg-gradient-to-r from-blue-500/20 to-slate-600/20 backdrop-blur rounded-lg p-2 border border-blue-500/30">
                    <div className="text-sm text-emerald-300">
                      💳 Installment: <span className="font-semibold text-white">{formatPrice(product.installment_price)}</span> × {product.installment_months} mo.
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="text-xs text-yellow-300 mt-1 font-medium">Premium</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Enhanced Action Buttons */}
        <div ref={buttonsRef} className="space-y-4">
          {/* Primary AI-styled button */}
          <button
            onClick={() => handleBuyClick('full')}
            className="relative w-full group overflow-hidden rounded-xl"
            onMouseEnter={(event) => {
              if (window.anime) {
                window.anime({
                  targets: event.target,
                  ...storeAnimations.buttonHover
                });
              }
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-slate-700 to-slate-800 opacity-100"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center py-4 px-6">
              <span className="text-2xl mr-3">🤖</span>
              <div className="text-center">
                <div className="text-white font-bold text-lg">Start Learning</div>
                <div className="text-blue-100 text-xs">Full Access Forever</div>
              </div>
            </div>
          </button>
          
          {/* Secondary installment button */}
          {showInstallment && product.installment_price && product.installment_months && (
            <button
              onClick={() => handleBuyClick('installment')}
              className="relative w-full group overflow-hidden rounded-xl border-2 border-gray-300 hover:border-blue-400 transition-all duration-300"
              onMouseEnter={(event) => {
                if (window.anime) {
                  window.anime({
                    targets: event.target,
                    ...storeAnimations.buttonHover
                  });
                }
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-blue-50 group-hover:from-blue-50 group-hover:to-slate-600 transition-all duration-300"></div>
              <div className="relative flex items-center justify-center py-4 px-6">
                <span className="text-xl mr-3">💎</span>
                <div className="text-center">
                  <div className="text-gray-900 font-bold text-base">Installment</div>
                  <div className="text-gray-600 text-xs">No Extra Fees or Interest</div>
                </div>
              </div>
            </button>
          )}

          {/* Progress/Stats bar */}
          <div className="bg-gradient-to-r from-slate-100 to-gray-100 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                Available Online
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-1">👥</span>
                500+ students
              </div>
              <div className="flex items-center text-gray-600">
                <span className="mr-1">⭐</span>
                4.9/5
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
