/**
 * pi-pompom — Pompom Companion Extension for Pi CLI.
 *
 * A 3D raymarched virtual pet that lives above the editor.
 * Hardened against conflicts with other extensions.
 */

import type {
	ExtensionAPI,
	ExtensionContext,
} from "@mariozechner/pi-coding-agent";

import { renderPompom, resetPompom, pompomSetTalking, pompomKeypress, pompomStatus } from "./pompom";

// Namespaced widget ID — prevents collision with any other extension
const WIDGET_ID = "codexstar-pompom-companion";

export default function (pi: ExtensionAPI) {
	let ctx: ExtensionContext | null = null;
	let companionTimer: ReturnType<typeof setInterval> | null = null;
	let companionActive = false;
	let lastRenderTime = Date.now();
	let terminalInputUnsub: (() => void) | null = null;
	let enabled = true;

	// ─── Safe render wrapper — never lets an error crash the TUI ─────────

	function safeRender(width: number): string[] {
		try {
			const now = Date.now();
			const dt = Math.min(0.1, (now - lastRenderTime) / 1000);
			lastRenderTime = now;
			return renderPompom(Math.max(40, width), 0, dt);
		} catch {
			// If rendering fails, return a minimal placeholder so the TUI doesn't crash
			return [" ".repeat(Math.max(1, width))];
		}
	}

	// ─── Widget management ──────────────────────────────────────────────

	function showCompanion() {
		if (companionActive) return;
		if (!ctx?.hasUI) return;
		companionActive = true;
		lastRenderTime = Date.now();

		const setWidget = () => {
			if (!ctx?.hasUI) return;
			try {
				ctx.ui.setWidget(WIDGET_ID, (_tui, _theme) => ({
					invalidate() {},
					render: safeRender,
				}), { placement: "aboveEditor" });
			} catch {
				// Widget slot may be unavailable — don't crash
			}
		};

		setWidget();
		// Re-set widget on interval for animation. Defensive: clear any stale timer first.
		if (companionTimer) clearInterval(companionTimer);
		companionTimer = setInterval(setWidget, 150);
	}

	function hideCompanion() {
		companionActive = false;
		if (companionTimer) {
			clearInterval(companionTimer);
			companionTimer = null;
		}
		pompomSetTalking(false);
		try {
			if (ctx?.hasUI) ctx.ui.setWidget(WIDGET_ID, undefined);
		} catch {
			// Ignore — widget may already be gone
		}
	}

	// ─── Keyboard input ─────────────────────────────────────────────────

	// macOS Option+key Unicode map (only fires when macos-option-as-alt is off)
	const optionUnicodeMap: Record<string, string> = {
		"π": "p", "ƒ": "f", "∫": "b", "µ": "m", "ç": "c",
		"∂": "d", "ß": "s", "∑": "w", "ø": "o",
		"≈": "x", "†": "t", "˙": "h",
	};

	const POMPOM_KEYS = "pfbmcdswoxth";

	function setupKeyHandler() {
		if (!ctx?.hasUI) return;
		// Always clean up previous handler first — prevents double-binding
		if (terminalInputUnsub) { terminalInputUnsub(); terminalInputUnsub = null; }

		try {
			terminalInputUnsub = ctx.ui.onTerminalInput((data: string) => {
				if (!enabled || !companionActive) return undefined;

				try {
					// 1. Ghostty keybind prefix \x1d + letter
					if (data.length === 2 && data[0] === "\x1d" && POMPOM_KEYS.includes(data[1])) {
						pompomKeypress(data[1]);
						return { consume: true };
					}

					// 2. ESC prefix — Alt+key on Windows/Linux, Option-as-Meta on macOS
					if (data.length === 2 && data[0] === "\x1b" && POMPOM_KEYS.includes(data[1])) {
						pompomKeypress(data[1]);
						return { consume: true };
					}

					// 3. macOS Unicode chars
					const mapped = optionUnicodeMap[data];
					if (mapped) {
						pompomKeypress(mapped);
						return { consume: true };
					}

					// 4. Kitty keyboard protocol
					const kittyMatch = data.match(/^\x1b\[(\d+);(\d+)u$/);
					if (kittyMatch) {
						const mod = parseInt(kittyMatch[2]);
						if ((mod - 1) & 2) {
							const char = String.fromCharCode(parseInt(kittyMatch[1]));
							if (POMPOM_KEYS.includes(char)) {
								pompomKeypress(char);
								return { consume: true };
							}
						}
					}
				} catch {
					// Never let a key handler error propagate to the TUI
				}

				return undefined;
			});
		} catch {
			// onTerminalInput may not be available — gracefully degrade (commands still work)
		}
	}

	// ─── Lifecycle — defensive against load-order issues ────────────────

	pi.on("session_start", async (_event, startCtx) => {
		ctx = startCtx;
		if (enabled) {
			showCompanion();
			setupKeyHandler();
		}
	});

	pi.on("session_shutdown", async () => {
		hideCompanion();
		resetPompom();
		if (terminalInputUnsub) { terminalInputUnsub(); terminalInputUnsub = null; }
	});

	pi.on("session_switch", async (_event, switchCtx) => {
		hideCompanion();
		resetPompom();
		ctx = switchCtx;
		if (enabled) {
			showCompanion();
			setupKeyHandler();
		}
	});

	// ─── /pompom command ────────────────────────────────────────────────

	const pompomCommands: Record<string, string> = {
		pet: "p", feed: "f", ball: "b", music: "m", color: "c", theme: "c",
		sleep: "s", wake: "w", flip: "d", hide: "o",
		dance: "x", treat: "t", hug: "h",
	};

	pi.registerCommand("pompom", {
		description: "Pompom companion — /pompom help for commands",
		handler: async (args, cmdCtx) => {
			ctx = cmdCtx;
			const sub = (args || "").trim().toLowerCase();

			if (sub === "on") {
				enabled = true;
				showCompanion();
				setupKeyHandler();
				cmdCtx.ui.notify("Pompom companion enabled 🐾", "info");
				return;
			}

			if (sub === "off") {
				enabled = false;
				hideCompanion();
				resetPompom();
				if (terminalInputUnsub) { terminalInputUnsub(); terminalInputUnsub = null; }
				cmdCtx.ui.notify("Pompom companion hidden.", "info");
				return;
			}

			if (sub === "help" || sub === "?") {
				const m = process.platform === "darwin" ? "⌥" : "Alt+";
				cmdCtx.ui.notify(
					`🐾 Pompom Commands\n` +
					`  /pompom on|off     Toggle companion\n` +
					`  /pompom pet        Pet Pompom          ${m}p\n` +
					`  /pompom feed       Drop food            ${m}f\n` +
					`  /pompom treat      Special treat        ${m}t\n` +
					`  /pompom hug        Give a hug           ${m}h\n` +
					`  /pompom ball       Throw a ball         ${m}b\n` +
					`  /pompom dance      Dance!               ${m}x\n` +
					`  /pompom music      Sing a song          ${m}m\n` +
					`  /pompom flip       Do a flip            ${m}d\n` +
					`  /pompom sleep      Nap time             ${m}s\n` +
					`  /pompom wake       Wake up              ${m}w\n` +
					`  /pompom theme      Cycle color          ${m}c\n` +
					`  /pompom hide       Wander off           ${m}o\n` +
					`  /pompom status     Check mood & stats`, "info"
				);
				return;
			}

			if (sub === "status") {
				if (!companionActive) {
					cmdCtx.ui.notify("Pompom is not active. Use /pompom on first.", "info");
					return;
				}
				const s = pompomStatus();
				const bar = (v: number) => "█".repeat(Math.round(v / 10)) + "░".repeat(10 - Math.round(v / 10));
				cmdCtx.ui.notify(
					`🐾 Pompom Status\n` +
					`  Mood:   ${s.mood}\n` +
					`  Hunger: ${bar(s.hunger)} ${s.hunger}%\n` +
					`  Energy: ${bar(s.energy)} ${s.energy}%\n` +
					`  Theme:  ${s.theme}`, "info"
				);
				return;
			}

			if (pompomCommands[sub]) {
				if (!companionActive) {
					enabled = true;
					showCompanion();
					setupKeyHandler();
				}
				pompomKeypress(pompomCommands[sub]);
				return;
			}

			// No args: toggle. Unknown: error.
			if (sub === "") {
				if (companionActive) {
					enabled = false;
					hideCompanion();
					resetPompom();
					cmdCtx.ui.notify("Pompom companion hidden.", "info");
				} else {
					enabled = true;
					showCompanion();
					setupKeyHandler();
					cmdCtx.ui.notify("Pompom companion enabled 🐾 — /pompom help for commands", "info");
				}
			} else {
				cmdCtx.ui.notify(`Unknown command: ${sub}. Try /pompom help`, "warning");
			}
		},
	});
}
