type GameProgress = {
  puzzle: string;
  difficulty: string;
  moves: number;
  timeElapsed: number;
  completed: boolean;
  stars: number;
};

type HighScore = {
  difficulty: string;
  moves: number;
  timeElapsed: number;
  stars: number;
  date: string;
};

type GameSettings = {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  difficulty: '3x3' | '4x4' | '5x5';
};

const STORAGE_KEYS = {
  PROGRESS: 'quest_progress',
  HIGH_SCORES: 'quest_high_scores',
  SETTINGS: 'quest_settings',
} as const;

// Default settings
const DEFAULT_SETTINGS: GameSettings = {
  theme: 'dark',
  soundEnabled: true,
  difficulty: '4x4',
};

// Storage utilities
export const storage = {
  // Game Progress
  saveProgress: (progress: GameProgress) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  },

  getProgress: (): GameProgress | null => {
    try {
      const progress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return progress ? JSON.parse(progress) : null;
    } catch (error) {
      console.error('Error getting progress:', error);
      return null;
    }
  },

  // High Scores
  saveHighScore: (score: HighScore) => {
    try {
      const scores = storage.getHighScores();
      const updatedScores = [...scores, score]
        .sort((a, b) => {
          // Sort by stars first, then moves, then time
          if (b.stars !== a.stars) return b.stars - a.stars;
          if (a.moves !== b.moves) return a.moves - b.moves;
          return a.timeElapsed - b.timeElapsed;
        })
        .slice(0, 10); // Keep only top 10 scores

      localStorage.setItem(STORAGE_KEYS.HIGH_SCORES, JSON.stringify(updatedScores));
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  },

  getHighScores: (): HighScore[] => {
    try {
      const scores = localStorage.getItem(STORAGE_KEYS.HIGH_SCORES);
      return scores ? JSON.parse(scores) : [];
    } catch (error) {
      console.error('Error getting high scores:', error);
      return [];
    }
  },

  // Settings
  saveSettings: (settings: Partial<GameSettings>) => {
    try {
      const currentSettings = storage.getSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  getSettings: (): GameSettings => {
    try {
      const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settings ? { ...DEFAULT_SETTINGS, ...JSON.parse(settings) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  },

  // Clear all data (useful for testing or reset functionality)
  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
