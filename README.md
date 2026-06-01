# 🏎️ VelocityX — High-Performance 2D Top-Down Racing & Combat Simulator

A production-ready, portfolio-quality, high-fidelity 2D racing and demolition combat game built using **React 18, TypeScript, Tailwind CSS, and Vite**. The core rendering engine is built from scratch utilizing the HTML5 Canvas API to ensure a locked 60 FPS performance, featuring advanced custom physics, realistic drift mechanics, dynamic time/weather systems, and full procedural audio synthesis.

---

## 🏁 Dynamic Game Modes

VelocityX offers five distinct gameplay modes engineered to test your reflexes, precision, and strategy:

1. **🏁 GRAND PRIX**
   * **Format:** Race against 3 adaptive AI opponents over 3 laps.
   * **Key Mechanic:** Strategic drafting, precise cornering, and rubber-banding AI adaptation that pushes back when you lead.
   * **End State:** Implements a dynamic post-race leaderboard and podium reward overlay.

2. **⏱️ TIME TRIAL**
   * **Format:** Solo speed challenges against your own limits.
   * **Key Mechanic:** An interactive **Ghost Car System** that records and overlays your personal best lap in real-time, complete with frame-by-frame linear interpolation.

3. **🚗 FREE ROAM**
   * **Format:** Open-world sandbox drift simulator.
   * **Key Mechanic:** No lap counters, timer pressure, or opponents. Safely practice donuts, drift arcs, countersteering, and nitro boosts in any environment.

4. **💀 CAR FIGHTS (Demolition Combat)**
   * **Format:** Destruction arena combat against 3 hostile AI units.
   * **Key Mechanic:** Elastic collision physics are translated into kinetic damage vectors based on speed, mass, and ramming angles. Vehicles feature floating active health bars.
   * **Power-Ups:** Strategic spawn nodes of **Repair Wrenches** (+35% Health) and **Nitro Canisters** (+100% Boost) respawn dynamically.
   * **AI Behaviors:** Swaps into pursuit AI vectors targeting the closest weak opponent or breaking off to harvest healing items when structurally critical.

5. **⚡ MEGA GRID (Massive 16-Car Race)**
   * **Format:** Grand Prix scaled up to a massive 16-car grid (Player + 15 custom AI opponents).
   * **Key Mechanic:** Employs F1-style staggered starts, dividing cars into 8 rows of staggered coordinates. Steer carefully to survive the first turn's multi-car pileup!

---

## 🎨 High-Fidelity Graphics & Visual Synthetics

VelocityX leverages dynamic procedural rendering to build visually immersive landscapes without the overhead of heavy static image files:

*   **☁️ Drifting Cloud Parallax:** Renders large, translucent ellipses drifting dynamically across map coordinates to simulate rolling overhead cloud shadows.
*   **💨 Rotating Wind Turbines:** Renders detailed 3D white wind turbine masts on grassy terrain, complete with spinning aerodynamic blades and projected lighting offsets.
*   **❄️ Glacier Run (Arctic Theme):** Features icy slate road rendering, cracked snowy snowfields, falling snowflakes, and specialized low-grip friction physics (increased sliding factor).
*   **🌋 Volcano Arena (Basalt & Magma):** Procedurally tiles cracked cooling basalt lanes, bubbling magma boundaries, and intense red thermal atmospheric lighting.
*   **🏜️ Desert Safari:** Implements sandy dunes and desert scrub vegetation with subtle wind swaying.
*   **🌆 Neon Grid:** Retro-futuristic cyberpunk grids with glowing borders and synthetic visual waves.
*   **🛣️ Pro Circuit:** Pristine asphalt, textured red-and-white rumble curbs, and dynamic tire marks.

---

## 📊 12 Car Color Palette & 8 Performance Classes

Vehicles are not just visual swaps; they represent 8 fine-tuned performance archetypes.

| Class Name | Colors | Top Speed | Launch Accel | Road Grip | Key Characteristics |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **HYPERCLASS** | 🔴 Red, 🩵 Cyan | **Extreme** | Low | Standard (1.0) | High speed runner, takes longer to reach max velocity. |
| **INTERCEPTOR** | 🟡 Gold, 🟠 Orange | Moderate | **Extreme** | Standard (1.0) | Incredible launch speed. Best for recovery after collisions. |
| **DRIFT KING** | 🔵 Blue, 💗 Pink | Lower | High | **Low (0.85)** | Designed for sustained power slides and rapid Nitro recharging. |
| **LIGHTNING** | 🟢 Green, 💛 Yellow | High | High | Standard (1.0) | Highly agile, supreme performance balanced profile. |
| **SUPREME** | 🟣 Purple | Balanced | Balanced | Standard (1.0) | Premium hybrid cruiser offering linear power curves. |
| **GLACIER FROST** | ⚪ White | Balanced | Very High | **Super (1.15)** | Ice-gripping studded winter tires. Dominates slippery curves. |
| **SHADOW STEALTH** | ⚫ Black | Very High | High | Good (0.95) | Dark stealth chassis, massive high-end overtaking speed. |
| **JUGGERNAUT** | 🩶 Silver | Standard | High | **Heavy (1.05)** | High mass chassis. Exceptional ramming damage, low sliding. |

---

## 🎧 Procedural Web Audio Engine

VelocityX features an audio pipeline synthesized entirely in real-time using the **Web Audio API**—eliminating external static file sizes completely:

*   **Dynamic Sawtooth Revs:** Oscillator frequencies and output gain are modulated fluidly based on the car's current RPM and engine load.
*   **Drift Screech Friction:** Active bandpass-filtered triangle waves engage when the tires exceed their lateral slip threshold.
*   **Nitro Jet Flame Whoosh:** Generates lowpass-filtered white noise and dynamic sweeping oscillator frequencies for that intense exhaust rush.
*   **Mechanical Crash Impact:** Triggers a dual-tone crash envelope (square wave + white noise sweep) that cracks dynamically based on collision velocity.
*   **Ambient Laser Sweep Transitions:** Frequencies sweep up and down to indicate UI transition confirmations.

---

## 🎮 Game Controls

All primary actions are accessible via desktop keyboard inputs:

| Input | Key Binding | Action Description |
| :---: | :---: | :--- |
| **Accelerate** | `W` / `↑` | Increase forward engine throttle |
| **Brake / Reverse** | `S` / `↓` | Apply braking force / reverse engine gear when stationary |
| **Steer Left** | `A` / `←` | Angle front wheels to the left |
| **Steer Right** | `D` / `→` | Angle front wheels to the right |
| **Nitro Boost** | `Spacebar` | Inject nitrous oxide (requires dynamic drift energy charging) |
| **Pause Game** | `P` | Freeze active physics loop / view setup overlay |
| **Toggle Ambient** | `T` | Cycle between Day, Golden Hour, and Night-Vision modes |
| **Weather Rain** | `Y` | Trigger screen-space raindrops and circular ground ripples |

---

## 🏗️ Architectural Overview

The code separating game layers is structured cleanly to optimize scale and performance:

*   **`PhysicsEngine.ts`:** Resolves vector-based car dynamics, steering wheel slip thresholds, tire friction coefficients, elastic momentum exchanges on car-to-car hits, and damage logic in combat.
*   **`RenderEngine.ts`:** Manages viewport-culled coordinates to draw multilayered canvas grids. Renders dynamic headlights, day/night cycles, rotating wind turbines, and cloud shadows.
*   **`AIEngine.ts`:** Implements look-ahead pathfinding using waypoint vectors. Integrates combat vectors (seeking repair pickups / ram targets) and rubber-banding controls.
*   **`ParticleEngine.ts`:** Employs pre-allocated object pools of 600 particles (dust, sparks, nitro flame, rain) to completely eliminate garbage collection spikes during chaotic races.
*   **`GhostEngine.ts`:** Records player coordinates frame-by-frame, storing them in local storage. Replays ghost runs during solo time trials using linear frame interpolation.

---

## 🚀 Installation & Local Development

Run VelocityX locally on your computer with simple package commands:

```bash
# Clone the repository
git clone https://github.com/farmanullah1/2D-RACING-GAME.git
cd 2D-RACING-GAME

# Install dependencies
npm install

# Start Vite hot-reload development server
npm run dev

# Compile TypeScript checks & build optimized production bundle
npm run build

# Preview the production-built files locally
npm run preview
```

---
*Created and maintained with love by Antigravity under Advanced Agentic Coding.*
