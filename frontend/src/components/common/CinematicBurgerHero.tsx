import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Sparkles, Flame, Volume2, VolumeX, Eye } from 'lucide-react';

interface CinematicBurgerHeroProps {
  variant?: 'hero' | 'split' | 'compact';
  className?: string;
  autoPlay?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

interface FallingItem {
  type: 'fry' | 'chili';
  x: number;
  y: number;
  vy: number;
  rotation: number;
  vRot: number;
  scale: number;
  opacity: number;
}

export const CinematicBurgerHero: React.FC<CinematicBurgerHeroProps> = ({
  variant = 'hero',
  className = '',
  autoPlay = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentStage, setCurrentStage] = useState<string>('Igniting Grill...');
  const [activeLayerIndex, setActiveLayerIndex] = useState<number>(-1);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'animated' | 'completed'>('animated');

  // Audio Context for synthesized cinematic sizzle/whoosh
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playLayerSound = useCallback((frequency: number, type: 'whoosh' | 'thud') => {
    if (!isSoundOn) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'whoosh') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // Audio policy fallback
    }
  }, [isSoundOn]);

  const layerNames = [
    'Toasted Brioche Base',
    'Sizzling Chargrilled Patty',
    'Melted Cheddar Cheese',
    'Pickles & Red Onions',
    'Juicy Tomato Slices',
    'Crisp Farm Lettuce',
    'Toasted Sesame Crown',
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 560);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Preload Images
    const fireBgImg = new Image();
    fireBgImg.src = '/cinematic_fire_bg.jpg';

    const explodedImg = new Image();
    explodedImg.src = '/burger_exploded_layers.jpg';

    const refBurgerImg = new Image();
    refBurgerImg.src = '/burger_reference.jpg';

    // Embers Particle System
    const embers: Particle[] = [];
    for (let i = 0; i < 45; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(Math.random() * 2 + 1),
        size: Math.random() * 3.5 + 1.2,
        alpha: Math.random() * 0.8 + 0.2,
        color: Math.random() > 0.4 ? '#FF6B00' : '#FFB700',
        life: Math.random() * 100,
        maxLife: 80 + Math.random() * 60,
      });
    }

    // Falling Fries & Chillies System
    const fallingBgItems: FallingItem[] = [];
    for (let i = 0; i < 14; i++) {
      fallingBgItems.push({
        type: i % 2 === 0 ? 'fry' : 'chili',
        x: Math.random() * width,
        y: Math.random() * height - height,
        vy: Math.random() * 1.5 + 1.2,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.03,
        scale: Math.random() * 0.45 + 0.55,
        opacity: Math.random() * 0.4 + 0.45,
      });
    }

    // Burger Layers Configuration
    const layerDefs = [
      { name: 'Toasted Brioche Base', sy: 1060, sh: 270, targetYOffset: 120, delaySec: 0.8 },
      { name: 'Sizzling Chargrilled Patty', sy: 820, sh: 260, targetYOffset: 70, delaySec: 1.7 },
      { name: 'Melted Cheddar Cheese', sy: 670, sh: 180, targetYOffset: 45, delaySec: 2.6 },
      { name: 'Pickles & Red Onions', sy: 570, sh: 130, targetYOffset: 20, delaySec: 3.5 },
      { name: 'Juicy Tomato Slices', sy: 430, sh: 155, targetYOffset: -10, delaySec: 4.4 },
      { name: 'Crisp Farm Lettuce', sy: 285, sh: 180, targetYOffset: -45, delaySec: 5.3 },
      { name: 'Toasted Sesame Crown', sy: 40, sh: 245, targetYOffset: -95, delaySec: 6.2 },
    ];

    let shockwaves: { x: number; y: number; r: number; maxR: number; alpha: number }[] = [];

    let startTime = performance.now();
    const cycleDuration = 11.5;
    let lastPlayedLayer = -1;

    // Render loop
    const render = (time: number) => {
      animFrameId.current = requestAnimationFrame(render);

      const elapsed = isPlaying ? (time - startTime) / 1000 : 7.5;
      const t = elapsed % cycleDuration;

      // 1. Draw Background: Fire with Dark Vignette
      ctx.clearRect(0, 0, width, height);

      if (fireBgImg.complete && fireBgImg.naturalWidth > 0) {
        ctx.globalAlpha = 0.55;
        ctx.drawImage(fireBgImg, 0, 0, width, height);
      } else {
        const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
        bgGrad.addColorStop(0, '#1a0b02');
        bgGrad.addColorStop(0.5, '#0e0b12');
        bgGrad.addColorStop(1, '#08090d');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Dark moody vignette overlay
      const vignette = ctx.createRadialGradient(width / 2, height / 2, width * 0.2, width / 2, height / 2, width * 0.7);
      vignette.addColorStop(0, 'rgba(8, 9, 13, 0.25)');
      vignette.addColorStop(0.7, 'rgba(8, 9, 13, 0.75)');
      vignette.addColorStop(1, 'rgba(8, 9, 13, 0.96)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Falling French Fries & Chillies in Background
      ctx.save();
      for (const item of fallingBgItems) {
        if (isPlaying) {
          item.y += item.vy;
          item.rotation += item.vRot;
          if (item.y > height + 80) {
            item.y = -60 - Math.random() * 80;
            item.x = Math.random() * width;
          }
        }

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);
        ctx.scale(item.scale, item.scale);
        ctx.globalAlpha = item.opacity;

        if (item.type === 'fry') {
          const fryGrad = ctx.createLinearGradient(-35, 0, 35, 0);
          fryGrad.addColorStop(0, '#E68A00');
          fryGrad.addColorStop(0.3, '#FFB733');
          fryGrad.addColorStop(0.7, '#FFD166');
          fryGrad.addColorStop(1, '#C26900');
          ctx.fillStyle = fryGrad;
          ctx.shadowColor = 'rgba(255, 107, 0, 0.5)';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.roundRect(-35, -7, 70, 14, 4);
          ctx.fill();

          ctx.fillStyle = '#7A3800';
          ctx.fillRect(-15, -4, 3, 2);
          ctx.fillRect(10, 1, 3, 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(-5, 0, 2, 2);
        } else {
          ctx.shadowColor = 'rgba(255, 30, 0, 0.6)';
          ctx.shadowBlur = 12;

          const chiliGrad = ctx.createLinearGradient(-25, 0, 25, 0);
          chiliGrad.addColorStop(0, '#8B0000');
          chiliGrad.addColorStop(0.4, '#FF1A1A');
          chiliGrad.addColorStop(0.8, '#FF4D4D');
          chiliGrad.addColorStop(1, '#990000');

          ctx.fillStyle = chiliGrad;
          ctx.beginPath();
          ctx.moveTo(-25, 0);
          ctx.quadraticCurveTo(0, -12, 24, -3);
          ctx.quadraticCurveTo(15, 8, -25, 0);
          ctx.fill();

          ctx.fillStyle = '#38B000';
          ctx.beginPath();
          ctx.moveTo(-25, 0);
          ctx.lineTo(-32, -5);
          ctx.lineTo(-30, 2);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
      ctx.restore();

      // 3. Draw Swirling Flame Embers
      ctx.save();
      for (const e of embers) {
        if (isPlaying) {
          e.x += e.vx;
          e.y += e.vy;
          e.life += 1;
          if (e.y < -10 || e.life > e.maxLife) {
            e.y = height + 10;
            e.x = Math.random() * width;
            e.life = 0;
          }
        }
        const alpha = Math.sin((e.life / e.maxLife) * Math.PI) * e.alpha;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillStyle = e.color;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Center Stage: The Cinematic Falling Burger Layers
      const centerX = width / 2;
      const centerY = height / 2 + 10;
      const burgerWidth = Math.min(width * 0.58, 380);
      const burgerScale = burgerWidth / 680;

      // Draw Shockwaves
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.r += 6;
        sw.alpha *= 0.9;
        ctx.save();
        ctx.strokeStyle = `rgba(255, 120, 0, ${sw.alpha})`;
        ctx.lineWidth = 3;
        ctx.shadowColor = '#FF6B00';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.ellipse(sw.x, sw.y, sw.r * 1.6, sw.r * 0.65, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        if (sw.alpha < 0.02) shockwaves.splice(i, 1);
      }

      // If in final completed showcase phase (t > 7.2s or completed viewMode)
      if (t > 7.2 || viewMode === 'completed') {
        setCurrentStage('Signature Master Cheeseburger • Ready to Savor');
        setActiveLayerIndex(6);

        ctx.save();
        // Golden Backlight Flare
        const auraGrad = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, burgerWidth * 0.85);
        auraGrad.addColorStop(0, 'rgba(255, 107, 0, 0.35)');
        auraGrad.addColorStop(0.5, 'rgba(255, 140, 0, 0.15)');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(centerX, centerY, burgerWidth * 0.85, 0, Math.PI * 2);
        ctx.fill();

        // Draw Complete Master Burger from Reference Image
        if (refBurgerImg.complete && refBurgerImg.naturalWidth > 0) {
          const drawW = burgerWidth * 1.08;
          const drawH = (drawW / refBurgerImg.naturalWidth) * refBurgerImg.naturalHeight;

          const breath = Math.sin(time * 0.003) * 4;

          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowBlur = 35;
          ctx.shadowOffsetY = 20;

          ctx.drawImage(
            refBurgerImg,
            centerX - drawW / 2,
            centerY - drawH / 2 + breath,
            drawW,
            drawH
          );

          // Steam wisps rising
          ctx.save();
          ctx.globalAlpha = 0.25;
          for (let s = 0; s < 3; s++) {
            const steamX = centerX - 60 + s * 60 + Math.sin(time * 0.002 + s) * 15;
            const steamY = centerY - drawH / 2 - 20 - ((time * 0.04 + s * 30) % 60);
            ctx.fillStyle = 'rgba(255, 230, 200, 0.4)';
            ctx.beginPath();
            ctx.arc(steamX, steamY, 14 + s * 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        ctx.restore();
      } else {
        // Active Falling Layer by Layer Assembly Animation
        if (explodedImg.complete && explodedImg.naturalWidth > 0) {
          layerDefs.forEach((layer, idx) => {
            const progress = (t - layer.delaySec) / 0.8;

            if (progress >= 1 && lastPlayedLayer < idx) {
              lastPlayedLayer = idx;
              setActiveLayerIndex(idx);
              setCurrentStage(`Adding: ${layer.name}`);
              playLayerSound(idx === 6 ? 120 : 180 - idx * 10, idx === 6 ? 'thud' : 'whoosh');

              shockwaves.push({
                x: centerX,
                y: centerY + layer.targetYOffset * burgerScale,
                r: 10,
                maxR: burgerWidth * 0.65,
                alpha: 0.85,
              });
            }

            if (progress < 0) return;

            let currentY: number;
            let currentScale = 1;
            let currentRotation = 0;
            let currentAlpha = 1;

            if (progress >= 1) {
              currentY = centerY + layer.targetYOffset * burgerScale;
            } else {
              const startY = -120;
              const targetY = centerY + layer.targetYOffset * burgerScale;

              const p = progress;
              let bounce: number;
              if (p < 0.6) {
                bounce = (p / 0.6) * (p / 0.6);
              } else if (p < 0.85) {
                const sub = (p - 0.6) / 0.25;
                bounce = 1 + Math.sin(sub * Math.PI) * 0.08;
              } else {
                const sub = (p - 0.85) / 0.15;
                bounce = 1 + Math.sin(sub * Math.PI) * 0.03;
              }

              currentY = startY + (targetY - startY) * bounce;
              currentScale = 1 + (1 - progress) * 0.18;
              currentRotation = Math.sin(progress * Math.PI) * (idx % 2 === 0 ? 0.04 : -0.04);
              currentAlpha = Math.min(1, progress * 2.5);
            }

            ctx.save();
            ctx.translate(centerX, currentY);
            ctx.rotate(currentRotation);
            ctx.scale(currentScale, currentScale);
            ctx.globalAlpha = currentAlpha;

            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 18;
            ctx.shadowOffsetY = 10;

            const targetLayerWidth = burgerWidth;
            const targetLayerHeight = (layer.sh / explodedImg.naturalWidth) * targetLayerWidth;

            ctx.drawImage(
              explodedImg,
              0,
              layer.sy,
              explodedImg.naturalWidth,
              layer.sh,
              -targetLayerWidth / 2,
              -targetLayerHeight / 2,
              targetLayerWidth,
              targetLayerHeight
            );

            ctx.restore();
          });
        }
      }

      if (t < 0.2) {
        lastPlayedLayer = -1;
      }
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, viewMode, playLayerSound]);

  const handleRestart = () => {
    setViewMode('animated');
    setIsPlaying(true);
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden card-3d border border-brand-500/25 shadow-2xl group ${
        variant === 'split' ? 'min-h-[480px] lg:min-h-[580px]' : 'h-[440px] sm:h-[520px]'
      } ${className}`}
    >
      {/* HTML5 Master 60fps Canvas Screen */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-pointer" onClick={() => setIsPlaying(!isPlaying)} />

      {/* Top Reel Badge */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-bg/85 backdrop-blur-md border border-brand-500/30 text-white shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping"></span>
          <span className="text-[11px] font-black tracking-wider uppercase text-brand-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-brand-500" />
            Live 4K Grill Cinema
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Sound Toggle */}
          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="p-2 rounded-xl bg-dark-bg/80 hover:bg-dark-card text-slate-300 hover:text-brand-400 border border-white/10 backdrop-blur-md transition-all shadow-md"
            title={isSoundOn ? 'Mute Sizzle FX' : 'Enable Grill Audio FX'}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-brand-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Completed / Animated Switch */}
          <button
            onClick={() => setViewMode(viewMode === 'animated' ? 'completed' : 'animated')}
            className="px-3 py-1.5 rounded-xl bg-dark-bg/80 hover:bg-dark-card text-xs font-bold text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all flex items-center gap-1.5 shadow-md"
          >
            <Eye className="w-3.5 h-3.5 text-brand-400" />
            <span>{viewMode === 'animated' ? 'Full Burger' : 'Explode Fall'}</span>
          </button>
        </div>
      </div>

      {/* Floating Bottom Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
        <div className="p-3.5 rounded-2xl bg-dark-bg/90 backdrop-blur-md border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-auto">
          {/* Current Ingredient Falling Pill */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cinematic Assembly</p>
              <h4 className="text-xs sm:text-sm font-black text-white truncate max-w-[200px] sm:max-w-[280px]">
                {currentStage}
              </h4>
            </div>
          </div>

          {/* Video Control Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-dark-elevated hover:bg-white/10 text-white border border-white/10 transition-all"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-brand-400 fill-brand-400" />}
            </button>
            <button
              onClick={handleRestart}
              className="px-3 py-2 rounded-xl btn-primary text-xs font-bold flex items-center gap-1.5 shadow-glow-orange-sm"
              title="Replay Falling Animation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Replay</span>
            </button>
          </div>
        </div>

        {/* 7 Ingredient Stage Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-2.5">
          {layerNames.map((name, i) => (
            <div
              key={name}
              title={name}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= activeLayerIndex
                  ? 'w-6 bg-gradient-to-r from-brand-500 to-amber-400 shadow-glow-orange-sm'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
