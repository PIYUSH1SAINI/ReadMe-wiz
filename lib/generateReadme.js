const fs = require("fs");
const path = require("path");
const globby = require("globby");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Parser = require("tree-sitter");
const JavaScript = require("tree-sitter-javascript");
const simpleGit = require("simple-git");

require("dotenv").config();

const TEMPLATE_PATH = path.join(__dirname, "../templates/readme-example.md");
const MODEL = "models/gemini-1.5-flash";

async function getGitInfo() {
  const git = simpleGit();
  try {
    const config = await git.listConfig();
    const user = config.all["user.name"] || "Unknown Author";
    const remote = config.all["remote.origin.url"] || "";
    return { user, repo: remote.split("/").pop().replace(".git", "") };
  } catch {
    return { user: "Unknown Author", repo: "Project" };
  }
}

async function getProjectFiles() {
  const entries = await globby([
    "**/*.{js,ts,jsx,tsx,py,go,rb}",
    "!node_modules",
  ]);
  return entries;
}

function parseCode(filePath) {
  try {
    const code = fs.readFileSync(filePath, "utf8");
    const parser = new Parser();
    parser.setLanguage(JavaScript);
    const tree = parser.parse(code);
    return summarizeTree(tree.rootNode, code);
  } catch {
    return null;
  }
}

function summarizeTree(root, code) {
  const summaries = [];
  root
    .descendantsOfType(["function_declaration", "class_declaration"])
    .forEach((node) => {
      const nameNode = node.childForFieldName("name");
      if (nameNode) {
        const name = code.slice(nameNode.startIndex, nameNode.endIndex);
        summaries.push(
          `${
            node.type === "function_declaration" ? "Function" : "Class"
          }: ${name}`
        );
      }
    });
  return summaries;
}

async function buildPrompt() {
  const { user, repo } = await getGitInfo();
  const files = await getProjectFiles();

  let codeInsights = [];
  for (const file of files.slice(0, 20)) {
    const summary = parseCode(file);
    if (summary && summary.length) {
      codeInsights.push(
        `📄 ${file}\n${summary.map((s) => `  - ${s}`).join("\n")}`
      );
    }
  }

  const template = fs.existsSync(TEMPLATE_PATH)
    ? fs.readFileSync(TEMPLATE_PATH, "utf8")
    : "";

  const prompt = `
You're an expert developer tasked with generating a comprehensive and professional README.md file.

📁 Project Name: ${repo}
👤 Author: ${user}

📦 Project Files:
${files.map((f) => `- ${f}`).join("\n")}

🔍 Code Insights:
${codeInsights.join("\n\n")}

📝 README Template to Follow:
${template}

Please fill in all standard sections such as: Title, Description, Features, Installation, Usage, Scripts, Contributing, License, and Credits.
Use markdown format.
`;

  return prompt;
}

async function generateReadme() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = await buildPrompt();

  console.log("🤖 Calling Gemini API...");

  const result = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const writeStream = fs.createWriteStream("README.md");

  // // ✨ Inject the badge at the top
  // const customBadge = `[![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/yourusername/readme-wizard)\n\n`;
  // writeStream.write(customBadge);
  // process.stdout.write(customBadge);

  // Stream Gemini's content
  for await (const chunk of result.stream) {
    const text = chunk.text?.(); // Safely invoke text as a function
    if (typeof text === "string") {
      writeStream.write(text);
      process.stdout.write(text);
    }
  }

  // ✅ Append the custom image badge at the end
  // const badgeImage = "\n\n![ReadMe Wizard Logo](./ReadMe-wizard-logo.png)\n";
  const badgeImage = `
\n\n<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
  <img src="https://raw.githubusercontent.com/PIYUSH1SAINI/ReadMe-wizard/refs/heads/main/ReadMe-wizard-logo.png?token=GHSAT0AAAAAADGBCSQUKPBLZKUOCIKDW27C2EDQ4FA" alt="ReadMe Wizard Logo" width="300"/>
</a>\n
`;

  writeStream.write(badgeImage);
  process.stdout.write(badgeImage);

  writeStream.end();
  console.log("\n✅ README.md generated!");
}

module.exports = generateReadme;
