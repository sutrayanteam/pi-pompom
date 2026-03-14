<p align="center">
  <img src="docs/images/hero.png" alt="pi-pompom" width="720">
</p>

<h1 align="center">pi-pompom</h1>
<p align="center"><strong>A 3D raymarched virtual pet that lives in your terminal.</strong></p>
<p align="center">
  <!-- BADGES:START -->
  <a href="https://www.npmjs.com/package/@codexstar/pi-pompom"><img src="https://img.shields.io/npm/v/@codexstar/pi-pompom.svg" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/@codexstar/pi-pompom"><img src="https://img.shields.io/npm/dm/@codexstar/pi-pompom.svg" alt="npm downloads"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue.svg" alt="TypeScript">
  <img src="https://img.shields.io/badge/platform-macOS%20%7C%20Windows%20%7C%20Linux-lightgrey.svg" alt="Platform">
  <!-- BADGES:END -->
</p>
<p align="center">
  <a href="#install">Install</a> ·
  <a href="#quick-start">Quick Start</a> ·
  <a href="#commands">Commands</a> ·
  <a href="#keyboard-shortcuts">Shortcuts</a> ·
  <a href="#features">Features</a> ·
  <a href="#mini-game">Mini-Game</a>
</p>

---

Pompom is an interactive companion for [Pi CLI](https://github.com/mariozechner/pi-coding-agent). It renders a real-time 3D raymarched creature above your editor using hybrid Unicode quadrant/half-block characters. Pompom walks, sleeps, chases fireflies, plays fetch, dances, catches stars, wears weather accessories, and reacts to your voice.

## Install

```bash
pi install @codexstar/pi-pompom
```

## Quick Start

Pompom appears automatically when you start Pi. Toggle it with:

```
/pompom on
/pompom off
```

## Commands

| Command | What it does |
|---------|-------------|
| `/pompom` | Toggle companion on/off |
| `/pompom help` | Show all commands and shortcuts |
| `/pompom status` | Check mood, hunger, energy, theme |
| `/pompom pet` | Pet Pompom |
| `/pompom feed` | Drop food |
| `/pompom treat` | Special treat (extra hunger boost) |
| `/pompom hug` | Give a hug (restores energy) |
| `/pompom ball` | Throw a ball |
| `/pompom dance` | Dance with sparkle particles |
| `/pompom music` | Sing a song |
| `/pompom game` | Catch the stars! (20s mini-game) |
| `/pompom theme` | Cycle color theme |
| `/pompom sleep` | Nap on a pillow |
| `/pompom wake` | Wake up |
| `/pompom flip` | Do a backflip |
| `/pompom hide` | Wander offscreen |
| `/pompom give <item>` | Give an accessory (umbrella, scarf, sunglasses, hat) |
| `/pompom inventory` | See Pompom's bag |

## Keyboard Shortcuts

| macOS | Windows/Linux | Action |
|-------|--------------|--------|
| `⌥p` | `Alt+p` | Pet |
| `⌥f` | `Alt+f` | Feed |
| `⌥t` | `Alt+t` | Treat |
| `⌥h` | `Alt+h` | Hug |
| `⌥b` | `Alt+b` | Ball |
| `⌥x` | `Alt+x` | Dance |
| `⌥g` | `Alt+g` | Game |
| `⌥m` | `Alt+m` | Music |
| `⌥c` | `Alt+c` | Theme |
| `⌥s` | `Alt+s` | Sleep |
| `⌥w` | `Alt+w` | Wake |
| `⌥d` | `Alt+d` | Flip |
| `⌥o` | `Alt+o` | Hide |

Four input methods supported: Ghostty keybinds, ESC prefix, macOS Unicode, Kitty keyboard protocol.

## Features

### Rendering
- 3D raymarched body with real-time lighting, shadows, and floor reflections
- Hybrid renderer: Unicode quadrant blocks at edges (2x detail), half-blocks in smooth areas
- Kawaii face design: white sclera eyes with brown iris, layered pupil/highlights, bright face plate
- Dark body outline (skipped on face for contrast)
- 4 color themes: Cloud, Cotton Candy, Mint Drop, Sunset Gold

### Scene
- Smooth sky color transitions via keyframe interpolation (gradual dawn to dusk, no hard jumps)
- Sun disk with halo during daytime, crescent moon with glow at night
- Twinkling colored stars (blue-white, yellow, orange-red)
- Rolling distant hills on the horizon
- Swaying grass blades with small flowers above the ground
- Drifting cloud wisps (subtle even in clear weather)

### Weather System
- 5 weather types: clear, cloudy, rain, storm, snow
- Weather starts clear, transitions naturally every 45-90 seconds
- Smooth 7-second color blend between weather states
- Rain streaks and splash particles, storm lightning flashes, gentle snowfall with wind drift
- Speech bubble announcements: "Clouds rolling in...", "It's starting to rain!", "Snowflakes!"

### Weather Accessories
- Pompom asks for accessories when weather changes ("I wish I had an umbrella...")
- `/pompom give umbrella` — red striped umbrella during rain/storm
- `/pompom give scarf` — warm striped scarf during snow
- `/pompom give sunglasses` — dark reflective shades during sunny days
- `/pompom give hat` — hat accessory
- Accessories persist across sessions (saved to `~/.pi/pompom/accessories.json`)
- Only asks once per item type (no nagging)

### Mini-Game
- `/pompom game` starts a 20-second star-catching challenge
- Golden stars fall from the sky
- Pompom auto-chases the nearest star
- Catching a star scores a point with sparkle effect
- Final score announced when timer ends

### Voice Integration
- Works with [@codexstar/pi-listen](https://www.npmjs.com/package/@codexstar/pi-listen)
- When recording voice, Pompom rushes to center and faces you
- Mouth opens in sync with audio level (louder = wider)
- Ears wiggle with your voice
- Bounces with audio amplitude

### Personality
- 12 random idle speech lines
- Natural blinking, breathing, ear wiggling, tail wagging
- Hunger and energy needs with visual status bars
- Firefly companion that Pompom chases
- Ball physics with bouncing and fetch behavior
- Walk, peek, flip, dance, sing animations
- Descriptive state messages in status bar

## How It Works

The renderer is a software raymarcher running in your terminal. Each frame:

1. Physics simulation updates position, particles, and state machines (60fps sub-stepping)
2. Scene objects (body, ears, paws, tail, antenna, ball, food, accessories) are built with rotation and oscillation
3. For each cell, 4 quadrant samples are taken. Edge cells use quadrant characters for 2x horizontal detail. Smooth cells use half-blocks.
4. Object hits are shaded with diffuse + wrap lighting, ambient occlusion, specular highlights, and firefly point light
5. The shaded pixels are encoded as ANSI true-color escape sequences
6. Speech bubbles and particle overlays are composited on top

The widget re-renders at ~7 FPS via a 150ms `setInterval`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## Security

See [SECURITY.md](SECURITY.md) for reporting vulnerabilities.

## License

MIT. See [LICENSE](LICENSE).
