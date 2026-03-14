const fs = require('fs');
let code = fs.readFileSync('extensions/lumo.ts', 'utf8');

// Replace the right side of the status bar lines
code = code.replace(
  /lines\.push\(`\$\{border\}│\\x1b\[0m  \\x1b\[38;5;250m\$\{menu\}\\x1b\[0m`\);/,
  "const menuPad = ' '.repeat(Math.max(0, W - 4 - [...menu].length));\n\tlines.push(`${border}│\\x1b[0m  \\x1b[38;5;250m${menu}\\x1b[0m${menuPad}${border}│\\x1b[0m`);"
);

code = code.replace(
  /lines\.push\(`\$\{border\}│\\x1b\[0m  \\x1b\[38;5;153m\$\{stateMsg\}\\x1b\[0m`\);/,
  "const statePad = ' '.repeat(Math.max(0, W - 4 - [...stateMsg].length));\n\tlines.push(`${border}│\\x1b[0m  \\x1b[38;5;153m${stateMsg}\\x1b[0m${statePad}${border}│\\x1b[0m`);"
);

fs.writeFileSync('extensions/lumo.ts', code);
console.log("Patched borders correctly");
