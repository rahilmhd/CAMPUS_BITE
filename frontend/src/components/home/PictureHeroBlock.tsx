import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';

export const PictureHeroBlock: React.FC = () => {
  const { user } = useAuth();
  const burgerRef = useRef<HTMLDivElement | null>(null);

  // 3D Tilt Coordinates applied STRICTLY to the burger picture only
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleBurgerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!burgerRef.current) return;
    const rect = burgerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth subtle tilt (-8 to +8 degrees)
    const rotateX = -((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleBurgerMouseEnter = () => {
    setIsHovered(true);
  };

  const handleBurgerMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const getDashboardLink = () => {
    if (!user) return '/student/menu';
    if (user.role === 'STUDENT') return '/student/menu';
    if (user.role === 'KITCHEN_STAFF') return '/kitchen/dashboard';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/student/menu';
  };

  return (
    <div className="picture-hero-block relative w-full min-h-[540px] lg:min-h-[580px] xl:min-h-[620px] flex items-center overflow-hidden">
      {/* Atmosphere Background Glow Layers */}
      <div className="absolute top-1/2 right-[18%] -translate-y-1/2 w-[380px] h-[380px] bg-brand-500/[0.18] rounded-full blur-[100px] pointer-events-none -z-0" />
      <div className="absolute -bottom-10 left-10 w-[300px] h-[300px] bg-brand-500/[0.06] rounded-full blur-[120px] pointer-events-none -z-0" />

      {/* Rustic Slate Base Glow along bottom */}
      <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#06070a] via-[#06070a]/80 to-transparent pointer-events-none z-10" />

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center relative z-20 min-h-[540px] lg:min-h-[580px] xl:min-h-[620px]">
        {/* Left Side: Writings Written in the Interface of the Picture on Extended Black Background */}
        <div className="lg:col-span-7 p-7 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-center space-y-6 text-center lg:text-left relative z-20">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.14] drop-shadow-md">
            First we eat, then we do everything else.{' '}
            <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-400 bg-clip-text text-transparent">
              Easy & Tasty.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl leading-relaxed font-normal drop-shadow">
            Experience handcrafted double smash patties, Wisconsin cheddar melt, and fresh culinary specials prepared to order. Skip counter queues with instant student mobile checkout.
          </p>

          {/* 3D Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              to={getDashboardLink()}
              className="btn-primary py-3.5 px-8 text-sm sm:text-base flex items-center gap-2.5 shadow-glow-orange"
            >
              <UtensilsCrossed className="w-5 h-5" />
              {user ? 'View Dining Menu' : 'Explore Menu'}
            </Link>

            {!user && (
              <Link
                to="/login"
                className="btn-secondary py-3.5 px-7 text-sm flex items-center gap-2"
              >
                Sign In <ArrowRight className="w-4 h-4 text-brand-400" />
              </Link>
            )}
          </div>
        </div>

        {/* Right Side: Burger Picture Portrayed Correctly Inside the Same Block */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end relative z-10 p-4 sm:p-6 lg:p-0 lg:pr-8 xl:pr-12">
          <div
            ref={burgerRef}
            onMouseMove={handleBurgerMouseMove}
            onMouseEnter={handleBurgerMouseEnter}
            onMouseLeave={handleBurgerMouseLeave}
            className="relative w-full max-w-[380px] sm:max-w-[420px] lg:max-w-[460px] xl:max-w-[500px] flex items-center justify-center select-none"
            style={{ perspective: '1200px' }}
          >
            {/* The Tilting Burger Image with Feathered Left Edge to Blend Flawlessly into Extended Black Background */}
            <div
              className="relative w-full will-change-transform"
              style={{
                transform: isHovered
                  ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03, 1.03, 1.03)`
                  : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
                transition: isHovered
                  ? 'transform 0.12s ease-out'
                  : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="relative animate-hero-float">
                <img
                  src="/hero_burger.jpg"
                  alt="CampusBite Signature Gourmet Smash Burger"
                  className="w-full h-auto object-contain mx-auto select-none pointer-events-none filter contrast-[1.04] brightness-[1.02]"
                  style={{
                    // Feathered horizontal blend: the left side melts seamlessly into the extended black background
                    maskImage:
                      'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 6%, rgba(0,0,0,0.85) 16%, #000 30%), linear-gradient(to bottom, transparent 0%, #000 5%, #000 95%, transparent 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 6%, rgba(0,0,0,0.85) 16%, #000 30%), linear-gradient(to bottom, transparent 0%, #000 5%, #000 95%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'destination-in',
                    filter:
                      'drop-shadow(0 25px 35px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 40px rgba(255, 107, 0, 0.22))',
                  }}
                />

                {/* Dynamic Specular Sheen on Hover */}
                {isHovered && (
                  <div
                    className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 rounded-full transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle at ${50 + tilt.y * 2.5}% ${
                        50 - tilt.x * 2.5
                      }%, rgba(255, 255, 255, 0.9) 0%, transparent 65%)`,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
