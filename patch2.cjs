const fs = require('fs');
let code = fs.readFileSync('extensions/lumo.ts', 'utf8');

code = code.replace(
  /if \(ballX < -1\.5\) \{ ballX = -1\.5; ballVx \*= -0\.8; \}\n\t\tif \(ballX > 1\.5\) \{ ballX = 1\.5; ballVx \*= -0\.8; \}/g,
  "if (ballX < -getScreenEdgeX() + 0.1) { ballX = -getScreenEdgeX() + 0.1; ballVx *= -0.8; }\n\t\tif (ballX > getScreenEdgeX() - 0.1) { ballX = getScreenEdgeX() - 0.1; ballVx *= -0.8; }"
);

fs.writeFileSync('extensions/lumo.ts', code);
console.log("Patched ball bounce correctly");
