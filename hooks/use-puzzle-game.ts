import { useState, useEffect, useCallback } from 'react';
import { storage } from '@/lib/storage';

type GameState = {
  tiles: number[];
  moves: number;
  timeElapsed: number;
  isComplete: boolean;
  stars: number;
  history: number[][];
  difficulty: '3x3' | '4x4' | '5x5';
};

export const usePuzzleGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    moves: 0,
    timeElapsed: 0,
    isComplete: false,
    stars: 0,
    history: [],
    difficulty: storage.getSettings().difficulty,
  });
  
  const [isActive, setIsActive] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !gameState.isComplete) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, gameState.isComplete]);

  // Get grid size from difficulty
  const getGridSize = useCallback((difficulty: '3x3' | '4x4' | '5x5') => {
    return parseInt(difficulty.split('x')[0]);
  }, []);

  // Calculate star rating based on moves and time
  const calculateStars = useCallback((moves: number, timeElapsed: number, gridSize: number) => {
    const baseMovesForThreeStars = gridSize === 3 ? 15 : gridSize === 4 ? 25 : 40;
    const baseTimeForThreeStars = gridSize === 3 ? 30 : gridSize === 4 ? 45 : 60;

    if (moves <= baseMovesForThreeStars && timeElapsed <= baseTimeForThreeStars) return 3;
    if (moves <= baseMovesForThreeStars * 1.5 && timeElapsed <= baseTimeForThreeStars * 1.5) return 2;
    return 1;
  }, []);

  // Initialize or shuffle the puzzle
  const initializePuzzle = useCallback(() => {
    const gridSize = getGridSize(gameState.difficulty);
    const cellCount = gridSize * gridSize;
    const newTiles = Array.from({ length: cellCount - 1 }, (_, i) => i + 1);
    newTiles.push(0); // Empty tile

    // Shuffle tiles
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }

    // Reset game state
    setGameState(prev => ({
      ...prev,
      tiles: newTiles,
      moves: 0,
      timeElapsed: 0,
      isComplete: false,
      stars: 0,
      history: [newTiles],
    }));
    setHistoryIndex(0);
    setIsActive(true);
    setCanUndo(false);
  }, [gameState.difficulty, getGridSize]);

  // Check if tiles are adjacent
  const isAdjacent = useCallback((index1: number, index2: number) => {
    const gridSize = getGridSize(gameState.difficulty);
    const row1 = Math.floor(index1 / gridSize);
    const col1 = index1 % gridSize;
    const row2 = Math.floor(index2 / gridSize);
    const col2 = index2 % gridSize;
    
    return (Math.abs(row1 - row2) === 1 && col1 === col2) || 
           (Math.abs(col1 - col2) === 1 && row1 === row2);
  }, [gameState.difficulty, getGridSize]);

  // Check if puzzle is complete
  const checkCompletion = useCallback((tiles: number[]) => {
    return tiles.every((tile, index) => 
      index === tiles.length - 1 ? tile === 0 : tile === index + 1
    );
  }, []);

  // Move tile
  const moveTile = useCallback((index: number) => {
    if (gameState.isComplete) return;

    const emptyIndex = gameState.tiles.indexOf(0);
    if (isAdjacent(index, emptyIndex)) {
      const newTiles = [...gameState.tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];

      const isComplete = checkCompletion(newTiles);
      const moves = gameState.moves + 1;
      const stars = isComplete ? 
        calculateStars(moves, gameState.timeElapsed, getGridSize(gameState.difficulty)) : 
        gameState.stars;

      // Update history
      const newHistory = gameState.history.slice(0, historyIndex + 1);
      newHistory.push(newTiles);

      setGameState(prev => ({
        ...prev,
        tiles: newTiles,
        moves,
        isComplete,
        stars,
        history: newHistory,
      }));
      setHistoryIndex(prev => prev + 1);
      setCanUndo(true);

      if (isComplete) {
        setIsActive(false);
        // Save high score
        storage.saveHighScore({
          difficulty: gameState.difficulty,
          moves,
          timeElapsed: gameState.timeElapsed,
          stars,
          date: new Date().toISOString(),
        });
      }
    }
  }, [gameState, historyIndex, isAdjacent, checkCompletion, calculateStars, getGridSize]);

  // Undo move
  const undoMove = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setGameState(prev => ({
        ...prev,
        tiles: prev.history[newIndex],
        moves: prev.moves + 1,
      }));
      setCanUndo(newIndex > 0);
    }
  }, [historyIndex]);

  // Change difficulty
  const changeDifficulty = useCallback((difficulty: '3x3' | '4x4' | '5x5') => {
    storage.saveSettings({ difficulty });
    setGameState(prev => ({ ...prev, difficulty }));
    initializePuzzle();
  }, [initializePuzzle]);

  return {
    ...gameState,
    isActive,
    canUndo,
    initializePuzzle,
    moveTile,
    undoMove,
    changeDifficulty,
  };
};
