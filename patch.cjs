const fs = require('fs');
let code = fs.readFileSync('extensions/lumo.ts', 'utf8');

if (!code.includes('function getScreenEdgeX')) {
  // Insert getScreenEdgeX just above updatePhysics
  code = code.replace(
    /function updatePhysics\(dt: number\) {/,
    "function getScreenEdgeX(): number {\n\tconst effectDim = Math.max(50, Math.min(W, H * 2.0));\n\tconst scale = 2.0 / effectDim;\n\treturn (W / 2.0) * scale;\n}\n\nfunction updatePhysics(dt: number) {"
  );
  
  // Replace targetX magic numbers
  code = code.replace(
    /targetX = \(Math\.random\(\) > 0\.5 \? 1 : -1\) \* 2\.5; \/\/ occasional offscreen walk/,
    "targetX = (Math.random() > 0.5 ? 1 : -1) * (getScreenEdgeX() + 1.5); // occasional offscreen walk"
  );
  
  code = code.replace(
    /else targetX = \(Math\.random\(\) - 0\.5\) \* 1\.0;/,
    "else targetX = (Math.random() - 0.5) * (getScreenEdgeX() * 0.6);" // originally 1.0 (edge is 1.0 for W=50), so maybe edge * 0.8 or Math.min(1.0, edge * 0.8)
  );
  
  code = code.replace(
    /if \(Math\.abs\(posX\) >= 2\.0\) \{ currentState = "offscreen";/,
    "if (Math.abs(posX) >= getScreenEdgeX() + 0.5) { currentState = \"offscreen\";"
  );
  
  code = code.replace(
    /targetX = Math\.sign\(posX\) \* 1\.35; isWalking = true; \}/,
    "targetX = Math.sign(posX) * (getScreenEdgeX() + 0.35); isWalking = true; }"
  );
  
  code = code.replace(
    /else if \(key === "o"\) \{ isSleeping = false; currentState = "walk"; targetX = \(Math\.random\(\) > 0\.5 \? 1 : -1\) \* 2\.5; isWalking = true; \}/,
    "else if (key === \"o\") { isSleeping = false; currentState = \"walk\"; targetX = (Math.random() > 0.5 ? 1 : -1) * (getScreenEdgeX() + 1.5); isWalking = true; }"
  );
  
  fs.writeFileSync('extensions/lumo.ts', code);
  console.log("Patched targetX correctly");
} else {
  console.log("Already patched");
}
