import React, { useState, useRef } from 'react';

interface HeroBurgerShowcaseProps {
  className?: string;
  size?: 'hero' | 'compact';
}

export const HeroBurgerShowcase: React.FC<HeroBurgerShowcaseProps> = ({
  className = '',
  size = 'hero',
}) => {
  const imageContainerRef = useRef<HTMLDivElement | null>(null);

  // 3D Tilt Coordinates applied STRICTLY to the burger image only
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth subtle tilt (-10 to +10 degrees)
    const rotateX = -((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const maxW = size === 'hero' ? 'max-w-[440px] lg:max-w-[500px]' : 'max-w-[340px] lg:max-w-[380px]';

  return (
    <div
      ref={imageContainerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full ${maxW} mx-auto flex items-center justify-center select-none py-2 ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Subtle Warm Amber Glow Behind Burger Only */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] bg-brand-500/[0.18] rounded-full blur-[90px] animate-pulse-glow" />
      </div>

      {/* ONLY The Burger Picture Moves / Tilts */}
      <div
        className="relative w-full will-change-transform"
        style={{
          transform: isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.03, 1.03, 1.03)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="relative animate-hero-float">
          {/* Reference Burger with Feathered Edge Mask to Flawlessly Blend into Division Bar */}
          <img
            src="/hero_burger.jpg"
            alt="CampusBite Signature Double Melt Smash Burger"
            className="w-full h-auto object-contain mx-auto select-none pointer-events-none filter contrast-[1.05] brightness-[1.02]"
            style={{
              // Multi-directional gradient mask: eliminates any box boundary, blending smoke & base into the background
              maskImage:
                'radial-gradient(ellipse 88% 86% at 50% 50%, rgba(0,0,0,1) 58%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 88% 86% at 50% 50%, rgba(0,0,0,1) 58%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0) 100%)',
              filter:
                'drop-shadow(0 25px 35px rgba(0, 0, 0, 0.95)) drop-shadow(0 0 35px rgba(255, 107, 0, 0.2))',
            }}
          />

          {/* Dynamic Light Sheen Overlay on Hover */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25 rounded-full transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${50 + tilt.y * 2.5}% ${50 - tilt.x * 2.5}%, rgba(255, 255, 255, 0.9) 0%, transparent 65%)`,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
