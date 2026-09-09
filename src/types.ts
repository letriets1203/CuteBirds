import { BirdSkin, DifficultyMode } from './constants/flappy';

// --- Flappy Bird Types ---
export type GameStatus = 'READY' | 'PLAYING' | 'DYING' | 'OVER';

export interface BirdState {
  x: number;
  y: number;
  vy: number;
  rotation: number;
  wingFrame: number; // 0: down, 1: middle, 2: up
  skin: BirdSkin;
  invincibleUntil: number; // for revive shield
}

export interface PipeItem {
  id: string;
  x: number;
  topHeight: number;
  bottomY: number;
  scored: boolean;
}

export interface ParticleItem {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
}

export type MedalType = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

export interface FlappyStats {
  bestScore: number;
  totalGames: number;
  totalFlaps: number;
  totalScore: number;
  unlockedSkinIds: string[];
}

export interface AdModalState {
  isOpen: boolean;
  purpose: 'revive' | 'unlockSkin' | 'reward';
  durationSeconds: number;
  skinId?: string;
  segmentId?: string;
}

// --- Legacy Types (preserved for backwards compatibility) ---
export type ColorId = 'mint' | 'pink' | 'blue' | 'yellow' | 'purple' | 'orange' | 'white';

export interface SpoolColorInfo {
  id: ColorId;
  nameVi: string;
  nameEn: string;
  mainColor: string;
  lightColor: string;
  darkColor: string;
  borderColor: string;
  glowColor: string;
  stripes: string;
  badgeBg: string;
  textLight: boolean;
}

export interface SpoolItem {
  id: string;
  color: ColorId;
}

export interface SpoolStack {
  id: string;
  x: number;
  y: number;
  spools: SpoolItem[];
  isLocked?: boolean;
}

export interface RollerSegment {
  id: string;
  color: ColorId;
  capacity: number;
  currentCount: number;
  totalRequired: number;
  totalCollected: number;
  isLocked: boolean;
  isCompleted?: boolean;
  order: number;
}

export interface TempSlot {
  id: string;
  spool: SpoolItem | null;
  isUnlocked: boolean;
}

export interface FlyingSpool {
  id: string;
  color: ColorId;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  startTime: number;
  duration: number;
  targetSegmentId?: string;
  targetTempSlotId?: string;
}

export type PowerUpType = 'addSlot' | 'broom' | 'hammer';

export interface LevelConfig {
  levelNumber: number;
  title: string;
  stacks: SpoolStack[];
  segments: RollerSegment[];
  totalSpools: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticEnabled: boolean;
  language: 'vi' | 'en';
}
