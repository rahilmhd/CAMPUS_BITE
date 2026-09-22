import React, { useState, useRef, useEffect } from 'react';
import { Flame, Star, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export const HeroBurgerShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 3D Tilt Coordinates
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Handle smooth 3D tilt tracking mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-14 to +14 deg)
    const rotateX = -((y - centerY) / centerY) * 14;
    const rotateY = ((x - centerX) / centerX) * 14;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[540px] mx-auto select-none py-6 perspective-1000"
      style={{ perspective: '1200px' }}
    >
      {/* 1. Atmospheric Ambient Background Fire & Glow */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10">
        {/* Intense Center Flame Core */}
        <div className="w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] bg-gradient-to-tr from-brand-600/40 via-brand-500/25 to-amber-500/10 rounded-full blur-[90px] animate-pulse-glow" />

        {/* Outer Warm Atmosphere */}
        <div className="absolute w-[520px] h-[520px] bg-brand-500/[0.12] rounded-full blur-[140px]" />

        {/* Decorative Orbital Rotating Dashed Rings */}
        <div className="absolute w-[440px] h-[440px] sm:w-[480px] sm:h-[480px] rounded-full border border-dashed border-brand-500/20 animate-spin-slow opacity-60" />
        <div className="absolute w-[360px] h-[360px] sm:w-[400px] sm:h-[400px] rounded-full border border-dotted border-brand-400/25 animate-reverse-spin-slow opacity-50" />
      </div>

      {/* Floating Ember Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-5">
        {[
          { top: '20%', left: '15%', delay: '0s', size: 'w-2 h-2' },
          { top: '35%', left: '82%', delay: '1.5s', size: 'w-1.5 h-1.5' },
          { top: '75%', left: '20%', delay: '0.8s', size: 'w-2 h-2' },
          { top: '65%', left: '88%', delay: '2.2s', size: 'w-2.5 h-2.5' },
          { top: '15%', left: '70%', delay: '3s', size: 'w-1.5 h-1.5' },
        ].map((ember, i) => (
          <div
            key={i}
            style={{
              top: ember.top,
              left: ember.left,
              animationDelay: ember.delay,
            }}
            className={`absolute ${ember.size} rounded-full bg-brand-400 shadow-glow-orange animate-pulse`}
          />
        ))}
      </div>

      {/* 2. Interactive 3D Tilting Stage */}
      <div
        className="relative transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.04, 1.04, 1.04)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Floating Graphic Badge 1: Top-Left "Double Smash Patty" */}
        <div
          className="absolute -top-3 -left-2 sm:-left-6 z-30 transition-all duration-300 pointer-events-none"
          style={{ transform: 'translateZ(55px)' }}
        >
          <div className="glass-card px-4 py-2.5 rounded-2xl border border-brand-500/30 shadow-2xl backdrop-blur-md flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center shadow-glow-orange-sm flex-shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-400">Master Grill</span>
              </div>
              <p className="text-xs font-black text-white whitespace-nowrap">Double Smash Patty</p>
              <p className="text-[10px] text-slate-400 font-medium">100% Chargrilled • Fresh</p>
            </div>
          </div>
        </div>

        {/* Floating Graphic Badge 2: Top-Right "Fresh Off The Grill Steam" */}
        <div
          className="absolute top-8 -right-2 sm:-right-6 z-30 transition-all duration-300 pointer-events-none"
          style={{ transform: 'translateZ(45px)' }}
        >
          <div className="glass-card px-3.5 py-2 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">Sizzling Hot</span>
          </div>
        </div>

        {/* The Centerpiece Reference Burger with Seamless Edge Masking */}
        <div
          className="relative mx-auto flex items-center justify-center animate-hero-float"
          style={{ transform: 'translateZ(30px)' }}
        >
          <div className="relative w-full max-w-[420px] sm:max-w-[460px]">
            {/* Blended High-Resolution Burger Image */}
            <img
              src="/hero_burger.jpg"
              alt="CampusBite Signature Double Melt Burger"
              className="w-full h-auto object-contain mx-auto transition-all duration-500 select-none filter contrast-[1.04] brightness-[1.02]"
              style={{
                // Radial & linear gradient feathering for flawless blend into #08090D
                maskImage:
                  'radial-gradient(ellipse 90% 88% at 50% 50%, rgba(0,0,0,1) 65%, rgba(0,0,0,0.8) 82%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 90% 88% at 50% 50%, rgba(0,0,0,1) 65%, rgba(0,0,0,0.8) 82%, rgba(0,0,0,0) 100%)',
                filter: 'drop-shadow(0 25px 35px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 40px rgba(255, 107, 0, 0.22))',
              }}
            />

            {/* Dynamic Mouse Glare Sheen Overlay */}
            {isHovered && (
              <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 rounded-full transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle at ${50 + tilt.y * 2}% ${50 - tilt.x * 2}%, rgba(255, 255, 255, 0.8) 0%, transparent 60%)`,
                }}
              />
            )}
          </div>
        </div>

        {/* Floating Graphic Badge 3: Bottom-Right "4.9 Rating & Live Pickup" */}
        <div
          className="absolute -bottom-2 -right-2 sm:-right-4 z-30 transition-all duration-300 pointer-events-none"
          style={{ transform: 'translateZ(65px)' }}
        >
          <div className="glass-card p-3.5 rounded-2xl border border-brand-500/30 shadow-2xl backdrop-blur-md space-y-1">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-black text-white ml-1">4.9</span>
            </div>
            <p className="text-xs font-black text-white">Campus #1 Best Seller</p>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
              <Clock className="w-3 h-3" />
              <span>Ready in 8-10 mins</span>
            </div>
          </div>
        </div>

        {/* Floating Graphic Badge 4: Bottom-Left Price Pill */}
        <div
          className="absolute -bottom-4 left-4 sm:left-0 z-30 transition-all duration-300 pointer-events-none"
          style={{ transform: 'translateZ(50px)' }}
        >
          <div className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 text-white font-black text-xs shadow-glow-orange flex items-center gap-1.5 border border-brand-400/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>₹180 • Double Melt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
