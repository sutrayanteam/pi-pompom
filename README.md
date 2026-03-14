# pi-lumo

A 3D raymarched virtual pet companion for [Pi CLI](https://github.com/mariozechner/pi-coding-agent).

Lumo is an interactive terminal creature that lives above your editor — it walks, sleeps, chases fireflies, plays fetch, and reacts to your commands.

## Install

```bash
pi install @codexstar/pi-lumo
```

## Usage

Lumo appears automatically above the editor. Interact with single-key commands when the editor is empty:

| Key | Action |
|-----|--------|
| `⌥p` | Pet |
| `⌥f` | Feed |
| `⌥b` | Ball |
| `⌥m` | Music |
| `⌥c` | Color |
| `⌥s` | Sleep |
| `⌥w` | Wake |
| `⌥d` | Flip |
| `⌥o` | Hide |

Or use the `/lumo` command:

```
/lumo on       — show companion
/lumo off      — hide companion
/lumo pet      — pet Lumo
/lumo feed     — drop food
/lumo ball     — throw a ball
/lumo music    — sing a song
/lumo color    — cycle color theme
/lumo sleep    — take a nap
/lumo wake     — wake up
/lumo flip     — do a flip
/lumo hide     — wander offscreen
```

## Features

- Full 3D raymarched creature with physics and lighting
- Natural blinking, breathing, and idle animations
- Day/night sky cycle based on system time
- Particle effects (sparkles, music notes, rain, sleep Zs)
- Speech bubbles with contextual messages
- Firefly companion that Lumo chases
- Hunger and energy needs system
- 4 color themes (Cloud, Cotton Candy, Mint Drop, Sunset Gold)

## License

MIT
