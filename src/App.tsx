import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  BirdSkin,
  BIRD_SKINS,
  DifficultyMode,
  DIFFICULTY_CONFIGS,
  GAME_CONSTANTS,
} from './constants/flappy';
import {
  BirdState,
  GameStatus,
  ParticleItem,
  PipeItem,
  FlappyStats,
  AdModalState,
} from './types';
import { flappyAudio } from './utils/flappyAudio';
import { initGoogleAds } from './services/googleAds';
import {
  LanguageCode,
  getTranslation,
  SUPPORTED_LANGUAGES,
} from './utils/i18n';
import { FlappyCanvas } from './components/FlappyCanvas';
import { FlappyHeader } from './components/FlappyHeader';
import { FlappyStartOverlay } from './components/FlappyStartOverlay';
import { FlappyScoreboard } from './components/FlappyScoreboard';
import { SkinSelectModal } from './components/SkinSelectModal';
import { FlappySettingsModal } from './components/FlappySettingsModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { GoogleAdBanner } from './components/GoogleAdBanner';

const STATS_STORAGE_KEY = 'cute_birds_stats_v1';
const SKIN_STORAGE_KEY = 'cute_birds_active_skin_id';
const DIFFICULTY_STORAGE_KEY = 'cute_birds_difficulty_mode';
const NIGHT_STORAGE_KEY = 'cute_birds_night_mode';
const LANG_STORAGE_KEY = 'cute_birds_language_code';

const INITIAL_STATS: FlappyStats = {
  bestScore: 0,
  totalGames: 0,
  totalFlaps: 0,
  totalScore: 0,
  unlockedSkinIds: ['yellow'],
};

export default function App() {
  // Language & Internationalization State
  const [language, setLanguage] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY) as LanguageCode;
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
      // Check browser navigator language
      if (typeof navigator !== 'undefined' && navigator.language) {
        const prefix = navigator.language.split('-')[0].toLowerCase() as LanguageCode;
        if (SUPPORTED_LANGUAGES.some((l) => l.code === prefix)) {
          return prefix;
        }
      }
    } catch {
      // Ignore
    }
    return 'vi';
  });

  const t = getTranslation(language);

  // Saved user preferences & stats
  const [stats, setStats] = useState<FlappyStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
      // Fallback check old key
      const old = localStorage.getItem('flappy_bird_stats_v1');
      if (old) return JSON.parse(old);
    } catch {
      // Ignore
    }
    return INITIAL_STATS;
  });

  const [activeSkin, setActiveSkin] = useState<BirdSkin>(() => {
    try {
      const savedSkinId =
        localStorage.getItem(SKIN_STORAGE_KEY) ||
        localStorage.getItem('flappy_active_skin_id');
      if (savedSkinId) {
        const found = BIRD_SKINS.find((s) => s.id === savedSkinId);
        if (found) return found;
      }
    } catch {
      // Ignore
    }
    return BIRD_SKINS[0];
  });

  const [difficulty, setDifficulty] = useState<DifficultyMode>(() => {
    try {
      const saved = (localStorage.getItem(DIFFICULTY_STORAGE_KEY) ||
        localStorage.getItem('flappy_difficulty_mode')) as DifficultyMode;
      if (saved && DIFFICULTY_CONFIGS[saved]) return saved;
    } catch {
      // Ignore
    }
    return 'normal';
  });

  const [isNight, setIsNight] = useState<boolean>(() => {
    try {
      const saved =
        localStorage.getItem(NIGHT_STORAGE_KEY) ||
        localStorage.getItem('flappy_night_mode');
      if (saved !== null) return saved === 'true';
    } catch {
      // Ignore
    }
    return false;
  });

  const [isMuted, setIsMuted] = useState<boolean>(flappyAudio.isMuted);

  // Active Game State
  const [status, setStatus] = useState<GameStatus>('READY');
  const [score, setScore] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [canRevive, setCanRevive] = useState<boolean>(true);

  // Bird position and physics
  const [bird, setBird] = useState<BirdState>(() => ({
    x: GAME_CONSTANTS.BIRD_START_X,
    y: GAME_CONSTANTS.BIRD_START_Y,
    vy: 0,
    rotation: 0,
    wingFrame: 1,
    skin: activeSkin,
    invincibleUntil: 0,
  }));

  // Pipes and particles
  const [pipes, setPipes] = useState<PipeItem[]>([]);
  const [particles, setParticles] = useState<ParticleItem[]>([]);
  const [flashOpacity, setFlashOpacity] = useState<number>(0);

  // Parallax offsets
  const [groundOffset, setGroundOffset] = useState<number>(0);
  const [cloudsOffset, setCloudsOffset] = useState<number>(0);
  const [cityOffset, setCityOffset] = useState<number>(0);

  // Modals state
  const [isSkinsOpen, setIsSkinsOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [adModalState, setAdModalState] = useState<AdModalState>({
    isOpen: false,
    purpose: 'revive',
    durationSeconds: 4,
  });

  // Animation Frame and Timing Refs
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const wingTimerRef = useRef<number>(0);
  const idleTimerRef = useRef<number>(0);

  // State refs to prevent closure stale issues in high frequency game loop
  const statusRef = useRef<GameStatus>(status);
  statusRef.current = status;

  const birdRef = useRef<BirdState>(bird);
  birdRef.current = bird;

  const pipesRef = useRef<PipeItem[]>(pipes);
  pipesRef.current = pipes;

  const scoreRef = useRef<number>(score);
  scoreRef.current = score;

  const difficultyRef = useRef<DifficultyMode>(difficulty);
  difficultyRef.current = difficulty;

  const statsRef = useRef<FlappyStats>(stats);
  statsRef.current = stats;

  const activeSkinRef = useRef<BirdSkin>(activeSkin);
  activeSkinRef.current = activeSkin;

  // Initialize Google Ads SDK on mount
  useEffect(() => {
    initGoogleAds();
  }, []);

  // Sync active skin to bird state
  useEffect(() => {
    setBird((prev) => ({ ...prev, skin: activeSkin }));
  }, [activeSkin]);

  // Persist language
  const handleSelectLanguage = (newLang: LanguageCode) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {
      // Ignore
    }
  };

  // Persist stats whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // Ignore
    }
  }, [stats]);

  // Handle bird crash & transition to Game Over
  const handleCrash = useCallback(() => {
    if (statusRef.current !== 'PLAYING') return;

    setStatus('DYING');
    flappyAudio.playHit();

    // Trigger white screen flash
    setFlashOpacity(0.85);
    const flashInterval = setInterval(() => {
      setFlashOpacity((prev) => {
        if (prev <= 0.1) {
          clearInterval(flashInterval);
          return 0;
        }
        return prev - 0.15;
      });
    }, 20);

    // Spawn burst of feather particles
    const currentBird = birdRef.current;
    const burstParticles: ParticleItem[] = [];
    const colors = [
      currentBird.skin.bodyColor,
      currentBird.skin.wingColor,
      currentBird.skin.accentColor,
      '#ffffff',
    ];

    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      burstParticles.push({
        x: currentBird.x,
        y: currentBird.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 4,
        alpha: 1.0,
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
      });
    }
    setParticles((prev) => [...prev, ...burstParticles]);

    // Play falling thud after short delay
    setTimeout(() => {
      flappyAudio.playDie();
    }, 120);

    // Record stats
    const currentScore = scoreRef.current;
    const prevBest = statsRef.current.bestScore;
    const isNew = currentScore > prevBest;
    setIsNewRecord(isNew);

    if (isNew && currentScore > 0) {
      setTimeout(() => {
        flappyAudio.playMedal();
      }, 500);
    }

    setStats((prev) => ({
      ...prev,
      bestScore: Math.max(prev.bestScore, currentScore),
      totalGames: prev.totalGames + 1,
      totalScore: prev.totalScore + currentScore,
    }));
  }, []);

  // Handle flap jump
  const handleFlap = useCallback(() => {
    // If currently on ready screen, start game immediately with initial flap
    if (statusRef.current === 'READY') {
      setStatus('PLAYING');
      setScore(0);
      setIsNewRecord(false);
      setPipes([]);
      setCanRevive(true);
      setParticles([]);

      const config = DIFFICULTY_CONFIGS[difficultyRef.current];
      setBird({
        x: GAME_CONSTANTS.BIRD_START_X,
        y: GAME_CONSTANTS.BIRD_START_Y,
        vy: config.jumpForce,
        rotation: -24,
        wingFrame: 2,
        skin: activeSkinRef.current,
        invincibleUntil: 0,
      });

      flappyAudio.playFlap();

      setStats((prev) => ({
        ...prev,
        totalFlaps: prev.totalFlaps + 1,
      }));
      return;
    }

    if (statusRef.current !== 'PLAYING') return;

    // In-flight flap
    const config = DIFFICULTY_CONFIGS[difficultyRef.current];
    setBird((prev) => ({
      ...prev,
      vy: config.jumpForce,
      rotation: -24,
      wingFrame: 2,
    }));

    flappyAudio.playFlap();

    setStats((prev) => ({
      ...prev,
      totalFlaps: prev.totalFlaps + 1,
    }));
  }, []);

  // Keyboard controls listener (Spacebar, Up Arrow, W)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        handleFlap();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlap]);

  // Restart / Play Again from Game Over
  const handleRestart = () => {
    setStatus('READY');
    setScore(0);
    setIsNewRecord(false);
    setPipes([]);
    setCanRevive(true);
    setParticles([]);
    setBird({
      x: GAME_CONSTANTS.BIRD_START_X,
      y: GAME_CONSTANTS.BIRD_START_Y,
      vy: 0,
      rotation: 0,
      wingFrame: 1,
      skin: activeSkin,
      invincibleUntil: 0,
    });
  };

  // Revive via Rewarded Ad
  const handleWatchAdRevive = () => {
    setAdModalState({
      isOpen: true,
      purpose: 'revive',
      durationSeconds: 4,
    });
  };

  // Rewarded Ad claim completed
  const handleRewardClaimed = (
    purpose: 'revive' | 'unlockSkin' | 'reward',
    targetId?: string
  ) => {
    setAdModalState((prev) => ({ ...prev, isOpen: false }));

    if (purpose === 'revive') {
      // Clear nearby pipes in front of bird
      setPipes((prev) => prev.filter((p) => p.x < 50 || p.x > 260));

      // Reset bird with 3.2 seconds of invincibility shield
      setBird((prev) => ({
        ...prev,
        y: 280,
        vy: -3.5,
        rotation: -10,
        invincibleUntil: Date.now() + 3200,
      }));

      setCanRevive(false);
      setStatus('PLAYING');
      flappyAudio.playRevive();
    } else if (purpose === 'unlockSkin' && targetId) {
      setStats((prev) => ({
        ...prev,
        unlockedSkinIds: Array.from(new Set([...prev.unlockedSkinIds, targetId])),
      }));
      const foundSkin = BIRD_SKINS.find((s) => s.id === targetId);
      if (foundSkin) {
        setActiveSkin(foundSkin);
      }
      flappyAudio.playMedal();
    }
  };

  // Main High-Performance Game Loop
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min(2.0, (timestamp - lastTimeRef.current) / 16.667);
      lastTimeRef.current = timestamp;

      const currentStatus = statusRef.current;
      const config = DIFFICULTY_CONFIGS[difficultyRef.current];
      const groundY = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

      // 1. UPDATE PARALLAX BACKGROUNDS
      if (currentStatus === 'READY' || currentStatus === 'PLAYING') {
        setGroundOffset((prev) => prev + config.pipeSpeed * dt);
        setCloudsOffset((prev) => prev + config.pipeSpeed * 0.35 * dt);
        setCityOffset((prev) => prev + config.pipeSpeed * 0.7 * dt);
      }

      // 2. IDLE FLOATING ON READY SCREEN
      if (currentStatus === 'READY') {
        idleTimerRef.current += dt * 0.08;
        wingTimerRef.current += dt * 0.15;
        const hoverY = GAME_CONSTANTS.BIRD_START_Y + Math.sin(idleTimerRef.current) * 8;
        const wing = Math.floor(wingTimerRef.current) % 3;

        setBird((prev) => ({
          ...prev,
          y: hoverY,
          vy: 0,
          rotation: 0,
          wingFrame: wing,
        }));
      }

      // 3. ACTIVE PLAYING PHYSICS & COLLISIONS
      if (currentStatus === 'PLAYING') {
        // Wing flapping cycle
        wingTimerRef.current += dt * 0.22;
        const currentWing = Math.floor(wingTimerRef.current) % 3;

        // Update Bird
        setBird((prev) => {
          const newVy = Math.min(10.5, prev.vy + config.gravity * dt);
          const newY = prev.y + newVy * dt;

          // Rotation angle calculation
          let targetRot = prev.rotation;
          if (newVy < 0) {
            targetRot = Math.max(-25, prev.rotation - 12 * dt);
          } else {
            targetRot = Math.min(85, prev.rotation + 4.5 * dt);
          }

          return {
            ...prev,
            y: newY,
            vy: newVy,
            rotation: targetRot,
            wingFrame: newVy < 1.0 ? currentWing : 1, // Glide wing when falling
          };
        });

        const currentBird = birdRef.current;
        const isInvincible = currentBird.invincibleUntil > Date.now();

        // Check Ground Collision
        if (currentBird.y + GAME_CONSTANTS.BIRD_HEIGHT / 2 >= groundY) {
          handleCrash();
          setBird((prev) => ({
            ...prev,
            y: groundY - GAME_CONSTANTS.BIRD_HEIGHT / 2,
            vy: 0,
            rotation: 80,
          }));
        }

        // Check Ceiling Collision
        if (currentBird.y - GAME_CONSTANTS.BIRD_HEIGHT / 2 <= 0) {
          setBird((prev) => ({ ...prev, y: GAME_CONSTANTS.BIRD_HEIGHT / 2, vy: 0 }));
        }

        // Update Pipes Movement & Spawning
        setPipes((prevPipes) => {
          let updated = prevPipes.map((pipe) => {
            const nextX = pipe.x - config.pipeSpeed * dt;

            // Score point detection when bird safely passes pipe center
            if (!pipe.scored && nextX + GAME_CONSTANTS.PIPE_WIDTH / 2 < currentBird.x) {
              setScore((s) => s + 1);
              flappyAudio.playScore();
              return { ...pipe, x: nextX, scored: true };
            }

            return { ...pipe, x: nextX };
          });

          // Filter out offscreen pipes
          updated = updated.filter((p) => p.x > -GAME_CONSTANTS.PIPE_WIDTH - 20);

          // Spawn new pipe pair if needed
          const lastPipe = updated[updated.length - 1];
          if (!lastPipe || lastPipe.x <= GAME_CONSTANTS.CANVAS_WIDTH - GAME_CONSTANTS.PIPE_SPAWN_DIST) {
            const minHeight = GAME_CONSTANTS.MIN_PIPE_HEIGHT;
            const availableSpace = groundY - config.gapSize - minHeight * 2;
            const topHeight = minHeight + Math.random() * Math.max(20, availableSpace);
            const bottomY = topHeight + config.gapSize;

            updated.push({
              id: `pipe-${Date.now()}-${Math.random()}`,
              x: GAME_CONSTANTS.CANVAS_WIDTH + 10,
              topHeight,
              bottomY,
              scored: false,
            });
          }

          return updated;
        });

        // Check Pipe Collisions (unless invincible from revive)
        if (!isInvincible) {
          const bx = currentBird.x;
          const by = currentBird.y;
          const br = 12; // Bird collision radius with slight padding for fairness

          for (const pipe of pipesRef.current) {
            const px = pipe.x;
            const pw = GAME_CONSTANTS.PIPE_WIDTH;

            // Check if bird is horizontally aligned with pipe
            if (bx + br > px && bx - br < px + pw) {
              // Hit top pipe?
              if (by - br < pipe.topHeight) {
                handleCrash();
                break;
              }
              // Hit bottom pipe?
              if (by + br > pipe.bottomY) {
                handleCrash();
                break;
              }
            }
          }
        }
      }

      // 4. DYING ANIMATION (Bird drops to ground before game over)
      if (currentStatus === 'DYING') {
        setBird((prev) => {
          const newVy = Math.min(12, prev.vy + 0.6 * dt);
          const newY = prev.y + newVy * dt;
          const newRot = Math.min(90, prev.rotation + 8 * dt);

          if (newY + GAME_CONSTANTS.BIRD_HEIGHT / 2 >= groundY) {
            setStatus('OVER');
            return {
              ...prev,
              y: groundY - GAME_CONSTANTS.BIRD_HEIGHT / 2,
              vy: 0,
              rotation: 90,
            };
          }

          return {
            ...prev,
            y: newY,
            vy: newVy,
            rotation: newRot,
            wingFrame: 1,
          };
        });
      }

      // 5. UPDATE PARTICLES
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            vy: p.vy + 0.15 * dt,
            alpha: p.alpha - 0.025 * dt,
            rotation: p.rotation + p.rotationSpeed * dt,
          }))
          .filter((p) => p.alpha > 0)
      );

      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [handleCrash]);

  return (
    <div className="relative w-screen h-screen bg-slate-950 flex flex-col items-center justify-between overflow-hidden touch-none select-none font-['Outfit',sans-serif]">
      {/* Background Ambience Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black pointer-events-none opacity-80" />

      {/* Top Header Bar */}
      <div className="w-full z-20 pt-2 px-2">
        <FlappyHeader
          score={score}
          bestScore={stats.bestScore}
          isMuted={isMuted}
          isNight={isNight}
          activeSkin={activeSkin}
          currentLanguage={language}
          t={t}
          onToggleSound={() => {
            const nextMuted = flappyAudio.toggleMute();
            setIsMuted(nextMuted);
          }}
          onToggleNight={() => {
            setIsNight((prev) => {
              const next = !prev;
              try {
                localStorage.setItem(NIGHT_STORAGE_KEY, String(next));
              } catch {
                // Ignore
              }
              return next;
            });
          }}
          onOpenSkins={() => setIsSkinsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      {/* Main Game Stage Container */}
      <main className="relative flex-1 w-full max-w-[420px] flex items-center justify-center p-2 z-10">
        <FlappyCanvas
          status={status}
          bird={bird}
          pipes={pipes}
          score={score}
          particles={particles}
          isNight={isNight}
          groundOffset={groundOffset}
          cloudsOffset={cloudsOffset}
          cityOffset={cityOffset}
          flashOpacity={flashOpacity}
          onAction={handleFlap}
        />

        {/* Start / Get Ready Overlay */}
        <FlappyStartOverlay
          isOpen={status === 'READY'}
          activeSkin={activeSkin}
          difficulty={difficulty}
          t={t}
          onStartGame={handleFlap}
          onOpenSkins={() => setIsSkinsOpen(true)}
        />

        {/* Game Over Scoreboard Overlay */}
        <FlappyScoreboard
          isOpen={status === 'OVER'}
          score={score}
          bestScore={stats.bestScore}
          isNewRecord={isNewRecord}
          canRevive={canRevive}
          t={t}
          onRestart={handleRestart}
          onWatchAdRevive={handleWatchAdRevive}
          onOpenSkins={() => setIsSkinsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </main>

      {/* Bottom Ad Banner Bar */}
      <div className="w-full max-w-[420px] mx-auto px-3 pb-2 z-20">
        <GoogleAdBanner slotId="1122334455" format="horizontal" />
      </div>

      {/* Skins Modal */}
      <SkinSelectModal
        isOpen={isSkinsOpen}
        activeSkinId={activeSkin.id}
        bestScore={stats.bestScore}
        unlockedSkinIds={stats.unlockedSkinIds}
        t={t}
        onClose={() => setIsSkinsOpen(false)}
        onSelectSkin={(skin) => {
          setActiveSkin(skin);
          try {
            localStorage.setItem(SKIN_STORAGE_KEY, skin.id);
          } catch {
            // Ignore
          }
          setIsSkinsOpen(false);
          flappyAudio.playFlap();
        }}
        onWatchAdUnlockSkin={(skinId) => {
          setAdModalState({
            isOpen: true,
            purpose: 'unlockSkin',
            skinId,
            durationSeconds: 4,
          });
        }}
      />

      {/* Settings & Multi-language Modal */}
      <FlappySettingsModal
        isOpen={isSettingsOpen}
        t={t}
        currentLanguage={language}
        isMuted={isMuted}
        isNight={isNight}
        difficulty={difficulty}
        stats={stats}
        onClose={() => setIsSettingsOpen(false)}
        onSelectLanguage={handleSelectLanguage}
        onToggleSound={() => {
          const nextMuted = flappyAudio.toggleMute();
          setIsMuted(nextMuted);
        }}
        onToggleNight={() => {
          setIsNight((prev) => {
            const next = !prev;
            try {
              localStorage.setItem(NIGHT_STORAGE_KEY, String(next));
            } catch {
              // Ignore
            }
            return next;
          });
        }}
        onChangeDifficulty={(mode) => {
          setDifficulty(mode);
          try {
            localStorage.setItem(DIFFICULTY_STORAGE_KEY, mode);
          } catch {
            // Ignore
          }
        }}
        onResetStats={() => {
          setStats(INITIAL_STATS);
          try {
            localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(INITIAL_STATS));
          } catch {
            // Ignore
          }
        }}
      />

      {/* Google Rewarded Ad Modal (for Revive or Skin Unlock) */}
      <RewardedAdModal
        adState={adModalState}
        t={t}
        onClose={() => setAdModalState((prev) => ({ ...prev, isOpen: false }))}
        onRewardClaimed={handleRewardClaimed}
      />
    </div>
  );
}
