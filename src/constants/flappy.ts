export interface BirdSkin {
  id: string;
  name: string;
  badge: string;
  requiredScore: number;
  bodyColor: string;
  bellyColor: string;
  wingColor: string;
  beakColor: string;
  eyeColor: string;
  pupilColor: string;
  accentColor: string;
  glowColor: string;
}

export const BIRD_SKINS: BirdSkin[] = [
  {
    id: 'yellow',
    name: 'Vàng Kinh Điển',
    badge: 'Mặc định',
    requiredScore: 0,
    bodyColor: '#FACC15',
    bellyColor: '#FEF08A',
    wingColor: '#EAB308',
    beakColor: '#F97316',
    eyeColor: '#FFFFFF',
    pupilColor: '#000000',
    accentColor: '#CA8A04',
    glowColor: 'rgba(250, 204, 21, 0.4)',
  },
  {
    id: 'red',
    name: 'Hỏa Phượng',
    badge: 'Đạt 5 điểm',
    requiredScore: 5,
    bodyColor: '#EF4444',
    bellyColor: '#FECACA',
    wingColor: '#DC2626',
    beakColor: '#F59E0B',
    eyeColor: '#FFFFFF',
    pupilColor: '#1E1B4B',
    accentColor: '#B91C1C',
    glowColor: 'rgba(239, 68, 68, 0.4)',
  },
  {
    id: 'blue',
    name: 'Lam Thiên',
    badge: 'Đạt 10 điểm',
    requiredScore: 10,
    bodyColor: '#0EA5E9',
    bellyColor: '#E0F2FE',
    wingColor: '#0284C7',
    beakColor: '#F97316',
    eyeColor: '#FFFFFF',
    pupilColor: '#0F172A',
    accentColor: '#0369A1',
    glowColor: 'rgba(14, 165, 233, 0.4)',
  },
  {
    id: 'emerald',
    name: 'Ngọc Bích',
    badge: 'Đạt 20 điểm',
    requiredScore: 20,
    bodyColor: '#10B981',
    bellyColor: '#D1FAE5',
    wingColor: '#059669',
    beakColor: '#F59E0B',
    eyeColor: '#FFFFFF',
    pupilColor: '#064E3B',
    accentColor: '#047857',
    glowColor: 'rgba(16, 185, 129, 0.4)',
  },
  {
    id: 'pink',
    name: 'Hồng Hạc',
    badge: 'Đạt 30 điểm',
    requiredScore: 30,
    bodyColor: '#F43F5E',
    bellyColor: '#FFE4E6',
    wingColor: '#E11D48',
    beakColor: '#FBBF24',
    eyeColor: '#FFFFFF',
    pupilColor: '#4C0519',
    accentColor: '#BE123C',
    glowColor: 'rgba(244, 63, 94, 0.4)',
  },
  {
    id: 'shadow',
    name: 'Hắc Điểu',
    badge: 'Đạt 40 điểm',
    requiredScore: 40,
    bodyColor: '#334155',
    bellyColor: '#64748B',
    wingColor: '#1E293B',
    beakColor: '#FACC15',
    eyeColor: '#FACC15',
    pupilColor: '#000000',
    accentColor: '#0F172A',
    glowColor: 'rgba(250, 204, 21, 0.5)',
  },
];

export type DifficultyMode = 'easy' | 'normal' | 'hard';

export interface DifficultyConfig {
  name: string;
  description: string;
  gapSize: number;
  pipeSpeed: number;
  gravity: number;
  jumpForce: number;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyMode, DifficultyConfig> = {
  easy: {
    name: 'Dễ (Tập bay)',
    description: 'Khoảng cách cống rộng hơn, tốc độ chậm vừa phải.',
    gapSize: 142,
    pipeSpeed: 2.1,
    gravity: 0.35,
    jumpForce: -6.4,
  },
  normal: {
    name: 'Kinh điển',
    description: 'Vật lý nguyên bản của trò chơi Flappy Bird cổ điển.',
    gapSize: 118,
    pipeSpeed: 2.45,
    gravity: 0.38,
    jumpForce: -6.7,
  },
  hard: {
    name: 'Thử thách',
    description: 'Khe hẹp, tốc độ cao dành cho game thủ điêu luyện.',
    gapSize: 100,
    pipeSpeed: 2.85,
    gravity: 0.42,
    jumpForce: -7.0,
  },
};

export const GAME_CONSTANTS = {
  CANVAS_WIDTH: 360,
  CANVAS_HEIGHT: 640,
  GROUND_HEIGHT: 112,
  BIRD_START_X: 95,
  BIRD_START_Y: 260,
  BIRD_WIDTH: 34,
  BIRD_HEIGHT: 24,
  PIPE_WIDTH: 52,
  PIPE_SPAWN_DIST: 185,
  MIN_PIPE_HEIGHT: 60,
};
