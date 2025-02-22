"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Sun, Moon, Volume2, VolumeX, RefreshCw } from "lucide-react"
import { storage } from "@/lib/storage"

export default function SettingsPage() {
  const [settings, setSettings] = useState(storage.getSettings())
  
  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light'
    setSettings(prev => ({ ...prev, theme: newTheme }))
    storage.saveSettings({ theme: newTheme })
  }

  const toggleSound = () => {
    const newSoundEnabled = !settings.soundEnabled
    setSettings(prev => ({ ...prev, soundEnabled: newSoundEnabled }))
    storage.saveSettings({ soundEnabled: newSoundEnabled })
  }

  const resetProgress = () => {
    if (confirm("Are you sure you want to reset all progress? This action cannot be undone.")) {
      storage.clearAll()
      setSettings(storage.getSettings()) // Reset to defaults
    }
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
            <h1 className="text-xl font-bold">Settings</h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>

          <div className="space-y-6">
            {/* Theme Toggle */}
            <div className="bg-[#252731] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.theme === 'light' ? (
                    <Sun className="h-5 w-5 text-[#2D9CDB]" />
                  ) : (
                    <Moon className="h-5 w-5 text-[#2D9CDB]" />
                  )}
                  <span>Theme</span>
                </div>
                <Switch
                  checked={settings.theme === 'light'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </div>

            {/* Sound Toggle */}
            <div className="bg-[#252731] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? (
                    <Volume2 className="h-5 w-5 text-[#2D9CDB]" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-gray-400" />
                  )}
                  <span>Sound Effects</span>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={toggleSound}
                />
              </div>
            </div>

            {/* Reset Progress */}
            <div className="bg-[#252731] rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-red-500" />
                  <span>Reset Progress</span>
                </div>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                  onClick={resetProgress}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
