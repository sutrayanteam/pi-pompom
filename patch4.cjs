const fs = require('fs');
let code = fs.readFileSync('extensions/lumo.ts', 'utf8');

// Insert string width function
if (!code.includes('function getStringWidth')) {
  code = code.replace(
    /function drawSpeechBubble/,
    "function getStringWidth(str: string): number {\n\tlet w = 0;\n\tfor (const char of str) {\n\t\tw += (char.match(/[\\u2600-\\u26FF\\u2700-\\u27BF\\uE000-\\uF8FF\\u{1F300}-\\u{1F5FF}\\u{1F600}-\\u{1F64F}\\u{1F680}-\\u{1F6FF}\\u{1F900}-\\u{1F9FF}]/u)) ? 2 : 1;\n\t}\n\treturn w;\n}\n\nfunction drawSpeechBubble"
  );
  
  // Update padding calculations
  code = code.replace(
    /const menuPad = ' '\.repeat\(Math\.max\(0, W - 4 - \[\.\.\.menu\]\.length\)\);/,
    "const menuPad = ' '.repeat(Math.max(0, W - 4 - getStringWidth(menu)));"
  );
  code = code.replace(
    /const statePad = ' '\.repeat\(Math\.max\(0, W - 4 - \[\.\.\.stateMsg\]\.length\)\);/,
    "const statePad = ' '.repeat(Math.max(0, W - 4 - getStringWidth(stateMsg)));"
  );
  
  fs.writeFileSync('extensions/lumo.ts', code);
  console.log("Patched string width calculation correctly");
} else {
  console.log("Already patched");
}
