const fs = require("fs");
const path = require("path");
const { parseCode } = require("./lib/codeParser");

const samplesDir = path.join(__dirname, "test");
const files = fs.readdirSync(samplesDir);

console.log("🔍 Testing language parsing:\n");

for (const file of files) {
  const filePath = path.join(samplesDir, file);
  const code = fs.readFileSync(filePath, "utf8");
  try {
    const result = parseCode(filePath, code);
    if (result && result.length > 0) {
      console.log(
        `✅ ${file} → Parsed successfully. Extracted: ${result.length} item(s).`
      );
    } else {
      console.log(`⚠️ ${file} → No extractable items found.`);
    }
  } catch (e) {
    console.log(`❌ ${file} → Error: ${e.message}`);
  }
}
