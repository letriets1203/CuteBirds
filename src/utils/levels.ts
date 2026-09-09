import { ColorId, LevelConfig, RollerSegment, SpoolItem, SpoolStack } from '../types';

interface LevelPreset {
  levelNumber: number;
  title: string;
  colors: ColorId[];
  spoolsPerColor: number;
  batchCapacity: number;
  lockedSegmentIndices: number[];
  stackCount: number;
}

const PRESET_LEVELS: LevelPreset[] = [
  {
    levelNumber: 1,
    title: 'LEVEL 1 - BẮT ĐẦU',
    colors: ['mint', 'pink'],
    spoolsPerColor: 8, // 2 colors x 8 = 16 spools total
    batchCapacity: 4,
    lockedSegmentIndices: [1], // 1st unlocked (mint), 2nd locked (pink)
    stackCount: 4, // 4 spools per stack
  },
  {
    levelNumber: 2,
    title: 'LEVEL 2 - BỘ BA SẮC MÀU',
    colors: ['mint', 'pink', 'blue'],
    spoolsPerColor: 8, // 3 colors x 8 = 24 spools total
    batchCapacity: 4,
    lockedSegmentIndices: [1, 2], // 1 unlocked, 2 locked
    stackCount: 6, // 4 spools per stack
  },
  {
    levelNumber: 3,
    title: 'LEVEL 3 - SẮC VÀNG RỰC RỠ',
    colors: ['mint', 'pink', 'blue', 'yellow'],
    spoolsPerColor: 8, // 4 colors x 8 = 32 spools total
    batchCapacity: 4,
    lockedSegmentIndices: [2, 3], // 2 unlocked, 2 locked
    stackCount: 8, // 4 spools per stack
  },
  {
    levelNumber: 4,
    title: 'LEVEL 4 - ĐAN XEN TẦNG TẦNG',
    colors: ['mint', 'pink', 'blue', 'orange'],
    spoolsPerColor: 10, // 4 colors x 10 = 40 spools total
    batchCapacity: 5,
    lockedSegmentIndices: [2, 3],
    stackCount: 8, // 5 spools per stack
  },
  {
    levelNumber: 5,
    title: 'LEVEL 5 - TÍM HUYỀN ẢO',
    colors: ['mint', 'pink', 'blue', 'yellow', 'purple'],
    spoolsPerColor: 8, // 5 colors x 8 = 40 spools total
    batchCapacity: 4,
    lockedSegmentIndices: [2, 3, 4], // 2 unlocked, 3 locked
    stackCount: 8,
  },
  {
    levelNumber: 6,
    title: 'LEVEL 6 - CAM ĐÀO THỬ THÁCH',
    colors: ['pink', 'blue', 'yellow', 'purple', 'orange'],
    spoolsPerColor: 10, // 5 colors x 10 = 50 spools total
    batchCapacity: 5,
    lockedSegmentIndices: [2, 3, 4],
    stackCount: 10, // 5 spools per stack
  },
  {
    levelNumber: 7,
    title: 'LEVEL 7 - CẦU VỒNG 6 MÀU',
    colors: ['mint', 'pink', 'blue', 'yellow', 'purple', 'orange'],
    spoolsPerColor: 8, // 6 colors x 8 = 48 spools total
    batchCapacity: 4,
    lockedSegmentIndices: [2, 3, 4, 5], // 2 unlocked, 4 locked
    stackCount: 9, // 5-6 spools per stack
  },
  {
    levelNumber: 8,
    title: 'LEVEL 8 - TẦNG THÁP CHỈ',
    colors: ['mint', 'pink', 'blue', 'yellow', 'purple', 'orange'],
    spoolsPerColor: 10, // 6 colors x 10 = 60 spools total
    batchCapacity: 5,
    lockedSegmentIndices: [2, 3, 4, 5],
    stackCount: 10, // 6 spools per stack
  },
  {
    levelNumber: 9,
    title: 'LEVEL 9 - NGỌC TRAI TRẮNG',
    colors: ['mint', 'pink', 'blue', 'yellow', 'purple', 'orange', 'white'],
    spoolsPerColor: 8, // 7 colors x 8 = 56 spools total
    batchCapacity: 4,
    lockedSegmentIndices: [3, 4, 5, 6], // 3 unlocked, 4 locked
    stackCount: 9,
  },
  {
    levelNumber: 10,
    title: 'LEVEL 10 - MA TRẬN CUỘN CHỈ',
    colors: ['mint', 'pink', 'blue', 'yellow', 'purple', 'orange', 'white'],
    spoolsPerColor: 10, // 7 colors x 10 = 70 spools total
    batchCapacity: 5,
    lockedSegmentIndices: [3, 4, 5, 6],
    stackCount: 10, // 7 spools per stack
  },
  {
    levelNumber: 11,
    title: 'LEVEL 11 - THỬ THÁCH BẬC THẦY',
    colors: ['mint', 'pink', 'blue', 'yellow', 'purple', 'orange', 'white'],
    spoolsPerColor: 12, // 7 colors x 12 = 84 spools total
    batchCapacity: 4,
    lockedSegmentIndices: [3, 4, 5, 6],
    stackCount: 12, // 7 spools per stack
  },
  {
    levelNumber: 12,
    title: 'LEVEL 12 - THREAD MASTER ĐỈNH CAO',
    colors: ['mint', 'pink', 'blue', 'yellow', 'purple', 'orange', 'white'],
    spoolsPerColor: 12, // 7 colors x 12 = 84 spools total
    batchCapacity: 4,
    lockedSegmentIndices: [4, 5, 6],
    stackCount: 12,
  },
];

const ALL_AVAILABLE_COLORS: ColorId[] = [
  'mint',
  'pink',
  'blue',
  'yellow',
  'purple',
  'orange',
  'white',
];

export function generateLevel(levelNum: number): LevelConfig {
  const preset = PRESET_LEVELS.find((l) => l.levelNumber === levelNum);

  let colors: ColorId[];
  let spoolsPerColor: number;
  let batchCapacity: number;
  let lockedIndices: number[];
  let stackCount: number;
  let title: string;

  if (preset) {
    colors = [...preset.colors];
    spoolsPerColor = preset.spoolsPerColor;
    batchCapacity = preset.batchCapacity;
    lockedIndices = [...preset.lockedSegmentIndices];
    stackCount = preset.stackCount;
    title = preset.title;
  } else {
    // Procedural generation for higher levels (> 12)
    const numColors = Math.min(7, 4 + Math.floor((levelNum - 12) / 3));
    colors = ALL_AVAILABLE_COLORS.slice(0, numColors);
    batchCapacity = levelNum % 2 === 0 ? 5 : 4;
    spoolsPerColor = batchCapacity * (2 + Math.min(2, Math.floor((levelNum - 12) / 4)));
    
    // Always leave at least 2 unlocked initially
    const lockedCount = Math.max(1, numColors - 2);
    lockedIndices = colors.map((_, idx) => idx).slice(numColors - lockedCount);
    stackCount = Math.min(12, 8 + Math.floor((levelNum - 12) / 2));
    title = `LEVEL ${levelNum} - ĐỈNH CAO`;
  }

  // Create roller segments
  const segments: RollerSegment[] = colors.map((color, idx) => ({
    id: `seg-${levelNum}-${idx}-${color}`,
    color,
    capacity: batchCapacity,
    currentCount: 0,
    totalRequired: spoolsPerColor,
    totalCollected: 0,
    isLocked: lockedIndices.includes(idx),
    isCompleted: false,
    order: idx,
  }));

  // Create total pool of spools for this level
  const unlockedColors = segments.filter((s) => !s.isLocked).map((s) => s.color);
  const lockedColors = segments.filter((s) => s.isLocked).map((s) => s.color);

  let itemCounter = 0;
  const unlockedSpools: SpoolItem[] = [];
  const lockedSpools: SpoolItem[] = [];

  colors.forEach((color) => {
    const isInitiallyUnlocked = unlockedColors.includes(color);
    for (let i = 0; i < spoolsPerColor; i++) {
      const spool: SpoolItem = {
        id: `spool-${levelNum}-${color}-${itemCounter++}`,
        color,
      };
      if (isInitiallyUnlocked) {
        unlockedSpools.push(spool);
      } else {
        lockedSpools.push(spool);
      }
    }
  });

  const totalSpools = unlockedSpools.length + lockedSpools.length;

  // Shuffle utility
  const shuffle = <T>(arr: T[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };

  shuffle(unlockedSpools);
  shuffle(lockedSpools);

  // Initialize stacks
  const stacks: SpoolStack[] = [];
  const cols = stackCount <= 4 ? 2 : stackCount <= 8 ? 4 : 4;
  
  for (let i = 0; i < stackCount; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const x = Math.round((col / (cols - 1 || 1)) * 70 + 15);
    const y = 20 + row * 32;

    stacks.push({
      id: `stack-${levelNum}-${i}`,
      x,
      y,
      spools: [],
    });
  }

  // Solvability Guarantee & Layering Strategy:
  // 1. Bottom layers: Distribute locked spools so they stay deeper down.
  // 2. Middle layers: Mix some locked spools with some unlocked spools for puzzle depth.
  // 3. Top layer (the open tops of stacks): MUST guarantee sufficient spools of unlocked colors
  //    so the player can always start making progress immediately and fill up the first segments!
  
  // Distribute locked spools first across stacks
  let stackIdx = 0;
  while (lockedSpools.length > 0) {
    const spool = lockedSpools.pop()!;
    stacks[stackIdx % stackCount].spools.unshift(spool); // at bottom
    stackIdx++;
  }

  // Distribute unlocked spools on top
  stackIdx = 0;
  while (unlockedSpools.length > 0) {
    const spool = unlockedSpools.pop()!;
    stacks[stackIdx % stackCount].spools.push(spool); // at top
    stackIdx++;
  }

  return {
    levelNumber: levelNum,
    title,
    stacks,
    segments,
    totalSpools,
  };
}
