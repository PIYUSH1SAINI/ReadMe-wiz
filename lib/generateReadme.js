const fs = require("fs");
const path = require("path");
const globby = require("globby");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Parser = require("tree-sitter");
const JavaScript = require("tree-sitter-javascript");
const simpleGit = require("simple-git");
const prompts = require("prompts");
const figlet = require("figlet");
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
        `📄 ${file}\n${summary.map((s) => `- ${s}`).join("\n")}`
      );
    }
  }
  const template = fs.existsSync(TEMPLATE_PATH)
    ? fs.readFileSync(TEMPLATE_PATH, "utf8")
    : "";
  const prompt = `
You are an expert developer with extensive experience in creating professional, user-friendly documentation for software projects. Your task is to generate a comprehensive and polished README.md file in Markdown format for the project described below. Use the provided information to craft a README that is clear, concise, and tailored to the project's context. The README should be professional yet approachable, suitable for both developers and non-technical users.

---

### Project Context
- **Project Name**: ${repo}
- **Author**: ${user}
- **Project Files**:
${files.map((f) => `  - ${f}`).join("\n")}
- **Code Insights** (key functions and classes in the codebase):
${codeInsights.join("\n\n")}

---

### README Template
The following template is a stylistic and structural guide to show what a high-quality README looks like. Use it to inform the tone, structure, and level of detail, but do not copy it verbatim. Adapt the content to reflect the specific project details provided above.

${template}

---

### Task Instructions
Generate a README.md file in Markdown format with the following sections, tailored to the project:

1. **Title**: Use the project name (${repo}) as the main heading (#). Include a brief tagline (1-2 sentences) summarizing the project's purpose.
2. **Description**: Write a 3-5 sentence overview of the project, explaining what it does, its primary use case, and why it’s useful. Incorporate relevant code insights (e.g., key functions or classes) to highlight core functionality.
3. **Architecture Overview**: Create a Mermaid diagram (in a \`\`\`mermaid code block) to visualize the project's high-level architecture. Use a top-down graph (\\graph TD\\) with 3-6 nodes representing key components (e.g., modules, classes, or functions) and their interactions (e.g., data flow, dependencies). Infer components from code insights (e.g., function/class names) and file structure (e.g., module purposes). Use concise labels and arrows to show relationships (e.g., "ModuleA -->|processes| ModuleB"). If insufficient data is available to create a meaningful diagram, omit this section with a note explaining why (e.g., "Architecture Overview omitted due to limited component data").
4. **File Structure**: Create a Mermaid diagram (in a \`\`\`mermaid code block) to visualize the project's file hierarchy. Use a tree-like structure (\\graph TD\\) to show key directories and files, grouping less critical files (e.g., under "other") to keep it concise. Base the diagram on the provided file list, prioritizing files like entry points (e.g., index.js) or configuration files (e.g., package.json). Limit to 5-10 nodes for readability. If the project has too few files (e.g., <3), omit this section with a note (e.g., "File Structure omitted due to minimal project size").
5. **Features**: List 4-6 key features in bullet points, inferred from the code insights and file structure. Be specific and avoid generic phrases like "easy to use." Reference the Architecture Overview if applicable.
6. **Installation**: Provide step-by-step instructions to set up the project (e.g., cloning the repo, installing dependencies). Assume a Node.js environment if JavaScript/TypeScript files are present, or adapt based on file extensions (e.g., Python, Go).
7. **Usage**: Include 1-2 concise examples of how to use the project (e.g., CLI commands, code snippets). Make examples clear and relevant to the project’s functionality.
8. **Scripts**: List available npm scripts (or equivalent for other languages) if relevant, based on the file structure (e.g., package.json presence).
9. **Contributing**: Provide brief guidelines for contributing, including how to submit issues or pull requests. Keep it simple and welcoming.
10. **License**: Specify the license (default to MIT if unknown) and include a brief explanation of what it means.
11. **Credits**: Acknowledge the author (${user}) and any key dependencies or tools inferred from the file structure (e.g., Node.js, Python libraries).

---

### Additional Guidelines
- **Tone and Style**: Use a professional yet approachable tone. Keep sections concise but informative, avoiding fluff or vague statements.
- **Use Code Insights**: Leverage the code insights to highlight unique aspects of the project in the Description, Features, and Architecture Overview sections.
- **Diagram Formatting**: Ensure Mermaid diagrams are properly formatted in \`\`\`mermaid code blocks, using concise labels and clear relationships. Follow the style of the template’s Architecture Overview (e.g., "ModuleA -->|action| ModuleB").
- **Adapt to Project Type**: Based on file extensions (e.g., .js, .py, .go) and code insights, tailor the README and diagrams to the project type (e.g., CLI tool, library, web app).
- **Avoid Placeholders**: Do not include placeholder text like "[Your description here]" or incomplete sections. Ensure all sections are fully populated or omitted with a reason.
- **Markdown Best Practices**: Use proper Markdown formatting (e.g., headers, lists, code blocks). Include a table of contents if the README exceeds 300 words.
- **No External Assumptions**: Base the content and diagrams solely on the provided project name, author, files, code insights, and template. Do not invent details not provided.

---

Generate the README.md content in pure Markdown format, ready to be written to a file. Ensure it is complete, polished, and aligned with the template’s structure and style.
`;
  return prompt;
}

async function generateReadme() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath) || !process.env.GEMINI_API_KEY) {
    const asciiArt = figlet.textSync("ReadMe Wizard", {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
    });

    console.log(`
${asciiArt}
----------------------------------------
✨ Welcome to ReadMe Wizard Setup! ✨
To generate awesome READMEs, we need a Google Generative AI API key.
Let's set it up in two quick steps:

1️⃣ Get your API key:
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in and generate a new API key.

2️⃣ Enter your API key below:
   - We'll create a .env file for you automatically.
   - This only needs to be done once!

💡 Need help? Check the README or visit: https://github.com/PIYUSH1SAINI/ReadMe-wizard
----------------------------------------
    `);

    const response = await prompts({
      type: "text",
      name: "apiKey",
      message: "🔑 Paste your Gemini API key here:",
      validate: (value) =>
        value.trim() ? true : "API key cannot be empty. Please try again.",
    });

    if (!response.apiKey) {
      console.log(`
❌ No API key provided. Don't worry!
- You can run \`make-readme\` again to retry.
- For more details, see: https://github.com/PIYUSH1SAINI/ReadMe-wizard
      `);
      process.exit(1);
    }

    fs.writeFileSync(envPath, `GEMINI_API_KEY=${response.apiKey.trim()}\n`, {
      encoding: "utf8",
    });
    console.log(
      "✅ .env file created with your API key! Let's generate that README..."
    );

    require("dotenv").config({ path: envPath });
  }

  if (!process.env.GEMINI_API_KEY) {
    console.log(`
❌ Something went wrong loading the API key.
- Please check your .env file in the project root.
- Ensure it contains: GEMINI_API_KEY=your-api-key-here
- For help, visit: https://github.com/PIYUSH1SAINI/ReadMe-wizard
    `);
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL });
  const prompt = await buildPrompt();
  console.log("🤖 Calling Gemini API...");
  const result = await model.generateContentStream({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const writeStream = fs.createWriteStream("README.md");
  for await (const chunk of result.stream) {
    const text = chunk.text?.();
    if (typeof text === "string") {
      writeStream.write(text);
      process.stdout.write(text);
    }
  }

  const badgeImage = `
  \n\n<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
  <img src="https://raw.githubusercontent.com/PIYUSH1SAINI/ReadMe-wizard/refs/heads/main/ReadMe-wizard-logo.png?token=GHSAT0AAAAAADGBCSQVLUQDFAU2S4TWUFHS2EDTIPA" alt="ReadMe Wizard Logo" width="300"/>
  </a>\n
  `;
  writeStream.write(badgeImage);
  process.stdout.write(badgeImage);
  writeStream.end();
  console.log("\n✅ README.md generated!");
}

module.exports = generateReadme;
