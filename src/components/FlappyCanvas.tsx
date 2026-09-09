import React, { useEffect, useRef } from 'react';
import { BirdState, GameStatus, ParticleItem, PipeItem } from '../types';
import { GAME_CONSTANTS } from '../constants/flappy';

interface FlappyCanvasProps {
  status: GameStatus;
  bird: BirdState;
  pipes: PipeItem[];
  score: number;
  particles: ParticleItem[];
  isNight: boolean;
  groundOffset: number;
  cloudsOffset: number;
  cityOffset: number;
  flashOpacity: number;
  onAction: () => void;
}

export const FlappyCanvas: React.FC<FlappyCanvasProps> = ({
  status,
  bird,
  pipes,
  score,
  particles,
  isNight,
  groundOffset,
  cloudsOffset,
  cityOffset,
  flashOpacity,
  onAction,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = GAME_CONSTANTS.CANVAS_WIDTH;
    const height = GAME_CONSTANTS.CANVAS_HEIGHT;
    const groundY = height - GAME_CONSTANTS.GROUND_HEIGHT;

    // 1. Clear canvas
    ctx.clearRect(0, 0, width, height);

    // 2. Draw Sky Background (Day vs Night)
    if (isNight) {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, '#090d16');
      skyGrad.addColorStop(0.6, '#151d30');
      skyGrad.addColorStop(1, '#232b45');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, groundY);

      // Stars
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 28; i++) {
        const starX = (i * 47 + 13) % width;
        const starY = (i * 29 + 17) % (groundY - 120);
        const sz = (i % 3 === 0) ? 2 : 1.2;
        ctx.globalAlpha = 0.5 + 0.4 * Math.sin(Date.now() / 300 + i);
        ctx.beginPath();
        ctx.arc(starX, starY, sz, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Crescent Moon
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(width - 55, 65, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(width - 63, 60, 18, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Daytime sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(0.5, '#7dd3fc');
      skyGrad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, groundY);

      // Sun
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(width - 55, 65, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
      ctx.beginPath();
      ctx.arc(width - 55, 65, 34, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Draw Background Cityscape / Silhouette (Parallax)
    ctx.fillStyle = isNight ? '#1e293b' : '#93c5fd';
    const buildingWidth = 36;
    const bShift = cityOffset % buildingWidth;
    for (let bx = -buildingWidth - bShift; bx < width + buildingWidth; bx += buildingWidth) {
      const bHeight = 45 + ((Math.sin(bx * 0.05) + 1) * 35);
      ctx.fillRect(bx, groundY - bHeight, buildingWidth - 2, bHeight);
      // Windows
      ctx.fillStyle = isNight ? '#fbbf24' : '#ffffff';
      ctx.globalAlpha = isNight ? 0.6 : 0.4;
      for (let wy = groundY - bHeight + 8; wy < groundY - 12; wy += 14) {
        ctx.fillRect(bx + 6, wy, 8, 6);
        ctx.fillRect(bx + 18, wy, 8, 6);
      }
      ctx.globalAlpha = 1.0;
      ctx.fillStyle = isNight ? '#1e293b' : '#93c5fd';
    }

    // 4. Draw Clouds (Parallax)
    ctx.fillStyle = isNight ? 'rgba(51, 65, 85, 0.45)' : 'rgba(255, 255, 255, 0.85)';
    const cloudShift = cloudsOffset % 260;
    for (let cx = -cloudShift - 100; cx < width + 100; cx += 180) {
      const cy = 110 + 20 * Math.sin(cx * 0.02);
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.arc(cx + 25, cy - 8, 30, 0, Math.PI * 2);
      ctx.arc(cx + 55, cy, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Draw Pipes
    pipes.forEach((pipe) => {
      const px = pipe.x;
      const pw = GAME_CONSTANTS.PIPE_WIDTH;
      const lipHeight = 22;
      const lipOverlap = 3;

      // Pipe Color Scheme (Retro Green)
      const pipeBodyColor = isNight ? '#15803d' : '#22c55e';
      const pipeHighlight = isNight ? '#22c55e' : '#86efac';
      const pipeShadow = isNight ? '#14532d' : '#166534';
      const pipeBorder = '#0f172a';

      // --- TOP PIPE ---
      if (pipe.topHeight > 0) {
        // Main body
        ctx.fillStyle = pipeBodyColor;
        ctx.fillRect(px, 0, pw, pipe.topHeight - lipHeight);

        // Highlight stripe
        ctx.fillStyle = pipeHighlight;
        ctx.fillRect(px + 4, 0, 7, pipe.topHeight - lipHeight);

        // Shadow stripe
        ctx.fillStyle = pipeShadow;
        ctx.fillRect(px + pw - 9, 0, 9, pipe.topHeight - lipHeight);

        // Border outline
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = pipeBorder;
        ctx.strokeRect(px, -2, pw, pipe.topHeight - lipHeight + 2);

        // Top Pipe Lip (Cap)
        const capX = px - lipOverlap;
        const capW = pw + lipOverlap * 2;
        const capY = pipe.topHeight - lipHeight;

        ctx.fillStyle = pipeBodyColor;
        ctx.fillRect(capX, capY, capW, lipHeight);

        ctx.fillStyle = pipeHighlight;
        ctx.fillRect(capX + 4, capY, 7, lipHeight);

        ctx.fillStyle = pipeShadow;
        ctx.fillRect(capX + capW - 9, capY, 9, lipHeight);

        ctx.strokeRect(capX, capY, capW, lipHeight);
      }

      // --- BOTTOM PIPE ---
      const bottomY = pipe.bottomY;
      const bottomHeight = groundY - bottomY;

      if (bottomHeight > 0) {
        // Bottom Pipe Lip (Cap)
        const capX = px - lipOverlap;
        const capW = pw + lipOverlap * 2;
        const capY = bottomY;

        ctx.fillStyle = pipeBodyColor;
        ctx.fillRect(capX, capY, capW, lipHeight);

        ctx.fillStyle = pipeHighlight;
        ctx.fillRect(capX + 4, capY, 7, lipHeight);

        ctx.fillStyle = pipeShadow;
        ctx.fillRect(capX + capW - 9, capY, 9, lipHeight);

        ctx.lineWidth = 2.5;
        ctx.strokeStyle = pipeBorder;
        ctx.strokeRect(capX, capY, capW, lipHeight);

        // Main body below cap
        const bodyY = bottomY + lipHeight;
        const bodyHeight = groundY - bodyY;

        ctx.fillStyle = pipeBodyColor;
        ctx.fillRect(px, bodyY, pw, bodyHeight);

        ctx.fillStyle = pipeHighlight;
        ctx.fillRect(px + 4, bodyY, 7, bodyHeight);

        ctx.fillStyle = pipeShadow;
        ctx.fillRect(px + pw - 9, bodyY, 9, bodyHeight);

        ctx.strokeRect(px, bodyY, pw, bodyHeight + 4);
      }
    });

    // 6. Draw Foreground Ground & Conveyor Dirt Stripes
    // Top Grass Border
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, groundY, width, 14);

    ctx.fillStyle = '#16a34a';
    ctx.fillRect(0, groundY + 14, width, 4);

    // Main Earth / Dirt
    ctx.fillStyle = '#eab308';
    ctx.fillRect(0, groundY + 18, width, GAME_CONSTANTS.GROUND_HEIGHT - 18);

    // Conveyor Stripes on Dirt
    ctx.fillStyle = '#ca8a04';
    const stripeWidth = 16;
    const gShift = groundOffset % (stripeWidth * 2);
    for (let gx = -stripeWidth * 2 - gShift; gx < width + stripeWidth * 2; gx += stripeWidth * 2) {
      ctx.beginPath();
      ctx.moveTo(gx + 10, groundY + 18);
      ctx.lineTo(gx + 22, groundY + 18);
      ctx.lineTo(gx + 12, height);
      ctx.lineTo(gx, height);
      ctx.closePath();
      ctx.fill();
    }

    // Top ground line
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(width, groundY);
    ctx.stroke();

    // 7. Draw Particles (Feather burst on collision or score)
    particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    ctx.globalAlpha = 1.0;

    // 8. Draw Flappy Bird
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate((bird.rotation * Math.PI) / 180);

    const skin = bird.skin;
    const isInvincible = bird.invincibleUntil > Date.now();

    // Revive Aura / Shield
    if (isInvincible) {
      const auraPulse = Math.sin(Date.now() / 100) * 4;
      ctx.beginPath();
      ctx.arc(0, 0, 24 + auraPulse, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Outline / Shadow
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#0f172a';

    // Tail Feather
    ctx.fillStyle = skin.accentColor;
    ctx.beginPath();
    ctx.moveTo(-14, -2);
    ctx.lineTo(-21, -6);
    ctx.lineTo(-19, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Main Oval Body
    ctx.fillStyle = skin.bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Belly (lighter patch)
    ctx.fillStyle = skin.bellyColor;
    ctx.beginPath();
    ctx.ellipse(-2, 4, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Beak (Upper & Lower)
    ctx.fillStyle = skin.beakColor;
    ctx.beginPath();
    ctx.moveTo(11, -2);
    ctx.lineTo(21, 2);
    ctx.lineTo(11, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Mouth divider line
    ctx.beginPath();
    ctx.moveTo(12, 2);
    ctx.lineTo(19, 2);
    ctx.stroke();

    // Big Cartoon Eye
    ctx.fillStyle = skin.eyeColor;
    ctx.beginPath();
    ctx.ellipse(7, -5, 6, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pupil
    ctx.fillStyle = skin.pupilColor;
    ctx.beginPath();
    ctx.arc(9, -5, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlight gleam
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(8, -6.5, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Flappable Wing (3 animation frames: 0: down, 1: middle, 2: up)
    ctx.fillStyle = skin.wingColor;
    ctx.beginPath();
    if (bird.wingFrame === 0) {
      // Wing down
      ctx.ellipse(-6, 2, 7, 4, -0.3, 0, Math.PI * 2);
    } else if (bird.wingFrame === 2) {
      // Wing up
      ctx.ellipse(-6, -4, 7, 4, 0.4, 0, Math.PI * 2);
    } else {
      // Wing level
      ctx.ellipse(-6, 0, 7, 4.5, 0, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // 9. Floating Score (during active play)
    if (status === 'PLAYING') {
      ctx.save();
      ctx.font = '900 42px "Outfit", "Press Start 2P", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // Thick black stroke
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#0f172a';
      ctx.strokeText(String(score), width / 2, 60);

      // White fill
      ctx.fillStyle = '#ffffff';
      ctx.fillText(String(score), width / 2, 60);
      ctx.restore();
    }

    // 10. White Screen Flash on impact
    if (flashOpacity > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, flashOpacity)})`;
      ctx.fillRect(0, 0, width, height);
    }
  }, [
    status,
    bird,
    pipes,
    score,
    particles,
    isNight,
    groundOffset,
    cloudsOffset,
    cityOffset,
    flashOpacity,
  ]);

  return (
    <div
      className="relative flex items-center justify-center w-full h-full max-w-[420px] max-h-[720px] mx-auto select-none touch-none"
      onClick={onAction}
    >
      <canvas
        ref={canvasRef}
        width={GAME_CONSTANTS.CANVAS_WIDTH}
        height={GAME_CONSTANTS.CANVAS_HEIGHT}
        className="w-full h-full object-contain drop-shadow-2xl rounded-2xl md:rounded-3xl border-4 border-slate-900 overflow-hidden cursor-pointer"
        style={{ aspectRatio: '360 / 640' }}
      />
    </div>
  );
};
