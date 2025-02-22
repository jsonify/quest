"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, Star, Clock, RotateCcw } from "lucide-react"
import { storage } from "@/lib/storage"

type GroupedScores = {
  [key: string]: Array<{
    difficulty: string
    moves: number
    timeElapsed: number
    stars: number
    date: string
  }>
}

export default function AchievementsPage() {
  const [groupedScores, setGroupedScores] = useState<GroupedScores>({})
  const [totalStars, setTotalStars] = useState(0)

  useEffect(() => {
    const scores = storage.getHighScores()
    const grouped = scores.reduce((acc, score) => {
      if (!acc[score.difficulty]) {
        acc[score.difficulty] = []
      }
      acc[score.difficulty].push(score)
      return acc
    }, {} as GroupedScores)

    // Sort each difficulty group by stars (desc), then moves (asc), then time (asc)
    Object.keys(grouped).forEach(difficulty => {
      grouped[difficulty].sort((a, b) => {
        if (b.stars !== a.stars) return b.stars - a.stars
        if (a.moves !== b.moves) return a.moves - b.moves
        return a.timeElapsed - b.timeElapsed
      })
    })

    setGroupedScores(grouped)
    setTotalStars(scores.reduce((total, score) => total + score.stars, 0))
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <main className="min-h-screen bg-[#1E1F25] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button variant="ghost" className="text-gray-400 hover:text-[#2D9CDB]">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">High Scores</h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>

          {/* Total Stars Banner */}
          <div className="bg-[#252731] rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8 text-[#2D9CDB]" />
              <div className="text-2xl font-bold">
                {totalStars} <span className="text-sm text-gray-400">Total Stars</span>
              </div>
            </div>
          </div>

          {/* High Scores by Difficulty */}
          <div className="space-y-6">
            {(['3x3', '4x4', '5x5'] as const).map(difficulty => (
              <div key={difficulty} className="bg-[#252731] rounded-xl p-4">
                <h2 className="text-lg font-bold mb-4">{difficulty} Puzzle</h2>
                {groupedScores[difficulty]?.length ? (
                  <div className="space-y-3">
                    {groupedScores[difficulty].map((score, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-[#1E1F25] rounded-lg"
                      >
                        <div>
                          <div className="flex gap-1 mb-1">
                            {[...Array(3)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < score.stars ? "text-yellow-400" : "text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-400">{formatDate(score.date)}</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <RotateCcw className="h-4 w-4" />
                            {score.moves} moves
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="h-4 w-4" />
                            {formatTime(score.timeElapsed)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-4">
                    No scores yet. Keep playing!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
