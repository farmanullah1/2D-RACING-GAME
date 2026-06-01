export const CAR_WIDTH          = 28
export const CAR_HEIGHT         = 50
export const CAR_COLLISION_RADIUS = 22

export const SHADOW_BLUR        = 14
export const SHADOW_OPACITY     = 0.5
export const SHADOW_OFFSET_X    = 4
export const SHADOW_OFFSET_Y    = 6

export const HEADLIGHT_LENGTH   = 120
export const HEADLIGHT_ANGLE    = 0.42   // radians half-angle

export const VIGNETTE_STRENGTH  = 0.45
export const MOTION_BLUR_ALPHA  = 0.25   // trail alpha for speed blur

export const MINIMAP_SIZE       = 160    // px
export const MINIMAP_SCALE      = 0.045  // world-to-minimap scale factor

export const COLORS = {
  carRed:    { body: '#e63946', accent: '#c1121f', rim: '#f1faee' },
  carBlue:   { body: '#1e6091', accent: '#023e8a', rim: '#90e0ef' },
  carSilver: { body: '#adb5bd', accent: '#6c757d', rim: '#dee2e6' },
  carGold:   { body: '#e9c46a', accent: '#f4a261', rim: '#f1faee' },
  carPurple: { body: '#7b2d8b', accent: '#560bad', rim: '#c77dff' },
  carGreen:  { body: '#2d6a4f', accent: '#1b4332', rim: '#95d5b2' },

  roadDark:   '#1a1a2e',
  roadLight:  '#252540',
  laneMarkWhite: '#e8e8e8',
  laneMarkYellow: '#f4d03f',
  grassDark:  '#1a3a2a',
  grassLight: '#1e5233',
  gravelDark: '#4a3728',
  gravelLight: '#6b5a3e',
  wallColor:  '#2c2c54',
  barrierRed: '#c0392b',
  barrierWhite: '#ecf0f1',
  curb1:      '#e74c3c',
  curb2:      '#f8f9fa',

  sky: {
    day:     ['#87ceeb', '#4a90d9'],
    dusk:    ['#ff7043', '#e91e63'],
    night:   ['#0d1b2a', '#1a1a3e'],
  },

  nitroFlame: ['#ff6b00', '#ff9f1c', '#ffee32', '#00f5ff'],
  spark:      ['#fff176', '#ffca28', '#ff8f00'],
  smoke:      'rgba(180,180,180,',
  dust:       'rgba(180,140,80,',
  confetti:   ['#00f5ff', '#ff006e', '#ffee00', '#00ff88', '#ff6b00'],
}
