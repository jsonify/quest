"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shuffle, Trophy, Star, Gem, RotateCcw, Clock } from "lucide-react"
import { usePuzzleGame } from "@/hooks/use-puzzle-game"
import { storage } from "@/lib/storage"

export default function SlidingPuzzle() {
  const {
    tiles,
    moves,
    timeElapsed,
    isComplete,
    stars,
    canUndo,
    difficulty,
    initializePuzzle,
    moveTile,
    undoMove,
    changeDifficulty
  } = usePuzzleGame()

  const [showReward, setShowReward] = useState(false)
  const gridSize = useMemo(() => parseInt(difficulty.split('x')[0]), [difficulty])
  const bestScore = useMemo(() => {
    const scores = storage.getHighScores()
      .filter(score => score.difficulty === difficulty);
    return scores.length > 0 ? Math.max(...scores.map(s => s.stars)) : 0
  }, [difficulty])

  useEffect(() => {
    initializePuzzle()
  }, [initializePuzzle])

  useEffect(() => {
    if (isComplete && !showReward) {
      setShowReward(true)
    }
  }, [isComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-[#2D9CDB]">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-white">
              <span className="text-gray-400">Time: </span>
              {formatTime(timeElapsed)}
            </div>
            <div className="text-white">
              <span className="text-gray-400">Moves: </span>
              {moves}
            </div>
            <div className="flex items-center gap-1 bg-[#2D2E3A] rounded-full px-3 py-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium">Best: {bestScore}</span>
            </div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(['3x3', '4x4', '5x5'] as const).map((size) => (
            <button
              key={size}
              className={`p-2 rounded-xl text-center transition-all ${
                difficulty === size
                  ? "bg-[#2D9CDB] text-white"
                  : "bg-[#252731] text-gray-400 hover:bg-[#2D2E3A]"
              }`}
              onClick={() => changeDifficulty(size)}
            >
              {size}
            </button>
          ))}
        </div>

        <div className="bg-[#252731] rounded-2xl p-6 shadow-lg mb-6">
          <div className={`grid grid-cols-${gridSize} gap-2`}>
            {tiles.map((tile, index) => (
              <button
                key={index}
                className={`w-full aspect-square text-xl font-bold rounded-xl transition-all duration-300 ${
                  tile === 0 ? "bg-[#1E1F25]" : "bg-[#2D9CDB] text-white hover:bg-[#2D9CDB]/90"
                }`}
                onClick={() => moveTile(index)}
                disabled={tile === 0}
              >
                {tile !== 0 && tile}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={undoMove} 
            disabled={!canUndo}
            className="bg-[#252731] hover:bg-[#2D2E3A] text-white rounded-xl h-14 disabled:opacity-50"
          >
            <RotateCcw className="mr-2 h-5 w-5" /> Undo
          </Button>
          <Button 
            onClick={initializePuzzle} 
            className="bg-[#252731] hover:bg-[#2D2E3A] text-white rounded-xl h-14"
          >
            <Shuffle className="mr-2 h-5 w-5" /> New Game
          </Button>
        </div>

        {showReward && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#252731] rounded-2xl p-8 max-w-sm mx-4 text-center">
              <Trophy className="h-16 w-16 text-[#2D9CDB] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Puzzle Complete!</h2>
              <div className="flex justify-center gap-2 mb-4">
                {[...Array(3)].map((_, i) => (
                  <Star key={i} className={`h-8 w-8 ${i < stars ? "text-yellow-400" : "text-gray-600"}`} />
                ))}
              </div>
              <div className="text-gray-400 mb-4">
                <div>Time: {formatTime(timeElapsed)}</div>
                <div>Moves: {moves}</div>
              </div>
              <div className="flex justify-center items-center gap-2 mb-6">
                <Gem className="h-5 w-5 text-[#2D9CDB]" />
                <span className="text-xl font-bold">+{stars * 10}</span>
              </div>
              <Button
                onClick={() => {
                  setShowReward(false)
                  initializePuzzle()
                }}
                className="w-full bg-[#2D9CDB] hover:bg-[#2D9CDB]/90 text-white"
              >
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
