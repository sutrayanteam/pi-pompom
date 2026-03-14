const fs = require('fs');
let code = fs.readFileSync('extensions/lumo.ts', 'utf8');

code = code.replace(
  /if \(menu\.length > Math\.max\(0, W - 6\)\) menu = menu\.substring\(0, Math\.max\(0, W - 9\)\) \+ "\.\.\.";/,
  "if (getStringWidth(menu) > Math.max(0, W - 6)) { let res = ''; let w = 0; for (const char of menu) { const cw = (char.match(/[\\u2600-\\u26FF\\u2700-\\u27BF\\uE000-\\uF8FF\\u{1F300}-\\u{1F5FF}\\u{1F600}-\\u{1F64F}\\u{1F680}-\\u{1F6FF}\\u{1F900}-\\u{1F9FF}]/u)) ? 2 : 1; if (w + cw > W - 9) break; res += char; w += cw; } menu = res + '...'; }"
);
code = code.replace(
  /if \(stateMsg\.length > Math\.max\(0, W - 6\)\) stateMsg = stateMsg\.substring\(0, Math\.max\(0, W - 9\)\) \+ "\.\.\.";/,
  "if (getStringWidth(stateMsg) > Math.max(0, W - 6)) { let res = ''; let w = 0; for (const char of stateMsg) { const cw = (char.match(/[\\u2600-\\u26FF\\u2700-\\u27BF\\uE000-\\uF8FF\\u{1F300}-\\u{1F5FF}\\u{1F600}-\\u{1F64F}\\u{1F680}-\\u{1F6FF}\\u{1F900}-\\u{1F9FF}]/u)) ? 2 : 1; if (w + cw > W - 9) break; res += char; w += cw; } stateMsg = res + '...'; }"
);

fs.writeFileSync('extensions/lumo.ts', code);
console.log("Patched substring calculations correctly");
