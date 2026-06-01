# 🏎️ VelocityX — 2D Top-Down Racing Game

A production-ready, portfolio-quality 2D racing game built with React 18, TypeScript, Tailwind CSS, and the HTML5 Canvas API.

## 🚀 Quick Start
```bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # Production build
npm run preview  # Preview production build
```

## 🎮 Controls
| Action | Keys |
|--------|------|
| Accelerate | W / ↑ |
| Brake/Reverse | S / ↓ |
| Steer Left | A / ← |
| Steer Right | D / → |
| Nitro Boost | Spacebar |
| Pause | P |

## 🏁 Game Modes
- **Grand Prix** — Race 3 AI opponents over 3 laps
- **Time Trial** — Solo race against the clock
- **Free Roam** — Practice with no pressure

## ✨ Features
- **Procedural Audio:** Engine sounds and collisions synthesized via Web Audio API.
- **Advanced Physics:** Drifting mechanics, nitro boost, and tile-based friction.
- **Dynamic Environment:** Day/night cycle with headlight effects and rain system.
- **Smart AI:** Pathfinding with obstacle avoidance and rubber-banding.
- **High Performance:** 60 FPS target using offscreen canvas caching and object pooling.

## 🏗️ Architecture
The game follows a decoupled engine architecture:
- **PhysicsEngine:** Handles car dynamics and collision resolution.
- **RenderEngine:** Manages the multi-layered canvas drawing pipeline.
- **AIEngine:** Computes driver logic and path following.
- **ParticleEngine:** Efficiently handles visual effects with object pooling.
- **State Management:** React `useReducer` and `Context` for global game state.

## 📊 Performance
- 60 FPS target on mid-range hardware.
- Object-pooled particle system (600 particles max).
- Offscreen canvas caching for the static track layer.
- Frustum culling for off-screen elements.

# 2D-RACING-GAME
