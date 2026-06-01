import { GameSettings, RaceResult } from "../types/game.types"

const KEY_LEADERBOARD = 'velocityx_leaderboard'
const KEY_SETTINGS = 'velocityx_settings'
const KEY_BEST_LAP_PREFIX = 'velocityx_bestlap_'

export const saveLeaderboard = (results: RaceResult[]): void => {
  localStorage.setItem(KEY_LEADERBOARD, JSON.stringify(results))
}

export const loadLeaderboard = (): RaceResult[] => {
  const data = localStorage.getItem(KEY_LEADERBOARD)
  return data ? JSON.parse(data) : []
}

export const saveBestLap = (mode: string, time: number): void => {
  localStorage.setItem(KEY_BEST_LAP_PREFIX + mode, time.toString())
}

export const loadBestLap = (mode: string): number | null => {
  const data = localStorage.getItem(KEY_BEST_LAP_PREFIX + mode)
  return data ? parseFloat(data) : null
}

export const saveSettings = (settings: GameSettings): void => {
  localStorage.setItem(KEY_SETTINGS, JSON.stringify(settings))
}

export const loadSettings = (): GameSettings => {
  const data = localStorage.getItem(KEY_SETTINGS)
  const defaults: GameSettings = {
    sfxVolume: 0.7,
    musicVolume: 0.5,
    showMinimap: true,
    showFPS: false,
    weatherEffect: 'none',
    graphicsQuality: 'high',
    dayNightCycle: true,
    screenShake: true,
    playerName: 'PLAYER 1',
  }
  return data ? { ...defaults, ...JSON.parse(data) } : defaults
}

export const clearAllData = (): void => {
  localStorage.removeItem(KEY_LEADERBOARD)
  localStorage.removeItem(KEY_SETTINGS)
  // Clear all best laps
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(KEY_BEST_LAP_PREFIX)) {
      localStorage.removeItem(key)
    }
  })
}
