import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        racing: ['Rajdhani', 'Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        neon: {
          blue:   '#00f5ff',
          green:  '#00ff88',
          orange: '#ff6b00',
          pink:   '#ff006e',
          yellow: '#ffee00',
        },
        track: {
          asphalt:  '#1a1a2e',
          grass:    '#1a4731',
          gravel:   '#6b5a3e',
          wall:     '#2c2c3e',
          panel:    'rgba(10,10,20,0.85)',
        }
      },
      animation: {
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-up':   'slideUp 0.4s ease-out',
        'fade-in':    'fadeIn 0.3s ease-out',
        'glow':       'glow 1.5s ease-in-out infinite alternate',
        'shake':      'shake 0.2s ease-in-out',
        'count-down': 'scaleDown 0.8s ease-out forwards',
      },
      keyframes: {
        slideUp:   { from: { transform: 'translateY(20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        glow:      { from: { textShadow: '0 0 5px currentColor' }, to: { textShadow: '0 0 20px currentColor, 0 0 40px currentColor' } },
        shake:     { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-4px)' }, '75%': { transform: 'translateX(4px)' } },
        scaleDown: { '0%': { transform: 'scale(1.5)', opacity: '1' }, '100%': { transform: 'scale(0.5)', opacity: '0' } },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        neon:       '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 40px #00f5ff',
        'neon-green': '0 0 10px #00ff88, 0 0 20px #00ff88',
        'neon-orange': '0 0 10px #ff6b00, 0 0 20px #ff6b00',
        panel:      '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
      }
    },
  },
  plugins: [],
} satisfies Config
