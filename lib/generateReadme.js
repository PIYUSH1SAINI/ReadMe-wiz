const fs = require("fs");
const path = require("path");
const globby = require("globby");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Parser = require("tree-sitter");
const JavaScript = require("tree-sitter-javascript");
const simpleGit = require("simple-git");
const prompts = require("prompts");
const figlet = require("figlet");
const chalk = require("chalk");
const ora = require("ora").default;
const dotenv = require("dotenv");

const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

// Color helpers
const purple = chalk.hex("#9b59b6");
const boldPurple = purple.bold;
const success = chalk.green.bold;
const error = chalk.red.bold;
const info = chalk.cyan;
const highlight = chalk.yellowBright;

// Wizard head ASCII (styled)
const wizardAscii = chalk.magentaBright(`
, _
/| | |
_|_|_|_ >_< /
.-\\-/. |
/ | | | \\_ |
\\ \\| |\\__(__)
 \ |\
/ | |
 | | | |
/\\.-' \\'-' |
---'\=-=' '
`);

const TEMPLATE_PATH = path.join(__dirname, "../templates/readme-example.md");
const MODEL = "models/gemini-1.5-flash";

// Validate key before saving it
async function validateGeminiApiKey(apiKey) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL });
    await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "ping" }] }],
    });
    return true;
  } catch {
    return false;
  }
}

async function getGitInfo() {
  const git = simpleGit();
  try {
    const config = await git.listConfig();
    const user = config.all["user.name"] || "Unknown Author";
    const remote = config.all["remote.origin.url"] || "";
    return { user, repo: remote.split("/").pop().replace(".git", ""), remote };
  } catch {
    return { user: "Unknown Author", repo: "unknown", remote: "" };
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
  const { user, repo, remote } = await getGitInfo();
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

  // Parse package.json if it exists
  let packageJson = {};
  const packageJsonPath = path.join(process.cwd(), "package.json");
  if (fs.existsSync(packageJsonPath)) {
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    } catch {
      console.warn("⚠️ Could not parse package.json");
    }
  }

  const packageInfo = {
    name: packageJson.name || "unknown",
    bin: packageJson.bin || null,
    scripts: packageJson.scripts || {},
    dependencies: packageJson.dependencies || {},
    devDependencies: packageJson.devDependencies || {},
    main: packageJson.main || "index.js",
    engines: packageJson.engines || { node: ">=14" },
    publishConfig: packageJson.publishConfig || null,
    repository: packageJson.repository || null,
  };

  const template = fs.existsSync(TEMPLATE_PATH)
    ? fs.readFileSync(TEMPLATE_PATH, "utf8")
    : "";
  const prompt = `
You are an expert developer with extensive experience in creating professional, user-friendly documentation for software projects. Your task is to generate a comprehensive and polished README.md file in Markdown format for the project described below. Use the provided information, including package.json details, to craft a README that is clear, concise, and tailored to the project's context. The README should be professional yet approachable, suitable for both developers and non-technical users.

---

### Project Context
- **Project Name**: ${repo}
- **Author**: ${user}
- **Git Remote URL**: ${remote || "none"}
- **Project Files**:
${files.map((f) => `  - ${f}`).join("\n")}
- **Code Insights** (key functions and classes in the codebase):
${codeInsights.join("\n\n")}
- **Package.json Details**:
  - Name: ${packageInfo.name}
  - Bin: ${JSON.stringify(packageInfo.bin) || "none"}
  - Scripts: ${JSON.stringify(packageInfo.scripts) || "{}"}
  - Dependencies: ${JSON.stringify(packageInfo.dependencies) || "{}"}
  - DevDependencies: ${JSON.stringify(packageInfo.devDependencies) || "{}"}
  - Main: ${packageInfo.main}
  - Engines: ${JSON.stringify(packageInfo.engines) || "{}"}
  - PublishConfig: ${JSON.stringify(packageInfo.publishConfig) || "none"}
  - Repository: ${JSON.stringify(packageInfo.repository) || "none"}

---

### README Template
The following template is a stylistic and structural guide to show what a high-quality README.md looks like. Use it to inform the Markdown structure, tone, and clarity, but do not copy it verbatim. Adapt the content to reflect the specific project details provided above, ensuring accuracy and specificity.

${template}

---

### Task Instructions
Generate a README.md file in Markdown format with the following sections, tailored to the project:

1. **Title**: Use the project name (# ${repo}) as the main heading. Include a brief tagline (1-2 sentences) summarizing the project's purpose, inferred from package.json (e.g., name, bin) and code insights (e.g., CLI functionality).
2. **Table of Contents**: Include a table of contents with links to all sections (e.g., - [Description](#description)), placed immediately after the Title.
3. **Description**: Write a 3-5 sentence overview, detailing the project's specific functionality (e.g., CLI for README generation with AI), primary use case (e.g., automating documentation), and unique value (e.g., interactive setup with ASCII art via figlet, real-time feedback via ora). Incorporate code insights (e.g., validateGeminiApiKey, buildPrompt) and package.json details (e.g., CLI command from bin). Avoid generic phrases like "powerful" or "saves time."
4. **Tech Stack**: Add a section after Description listing badges for the project's tech stack, inferred from package.json dependencies and devDependencies (e.g., Node.js, @google/generative-ai, simple-git). Use Shields.io badges (style: for-the-badge) with appropriate logos and colors (e.g., green for Node.js, blue for Google Generative AI). Include the custom badge: [![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git). Map dependency names to user-friendly labels (e.g., simple-git → Simple Git, tree-sitter → Tree Sitter). Place badges on a single line, separated by spaces.
5. **Architecture Overview**: Create a Mermaid diagram (in a \`\`\`mermaid code block) to visualize the project's high-level architecture. Use a top-down graph (\\graph TD\\) with 3-5 nodes representing key components (e.g., modules, functions) and their interactions (e.g., data flow). Infer components from code insights (e.g., getGitInfo, parseCode) and file structure. Use concise labels without special characters (e.g., A[getGitInfo]). Enclose labels in square brackets or quotes if needed (e.g., A["Home Page"]). Use arrows to show relationships (e.g., "ModuleA -->|processes| ModuleB"). Ensure the diagram follows GitHub's Mermaid syntax rules (https://docs.github.com/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams#creating-mermaid-diagrams). Use subgraphs with meaningful labels (e.g., subgraph Core) only when grouping related components. If insufficient data, omit with a note (e.g., "Architecture Overview omitted due to limited component data").
6. **File Structure**: Create a Mermaid diagram (in a \`\`\`mermaid code block) to visualize the project's file hierarchy. Use a tree-like structure (\\graph TD\\) with 5-10 nodes, prioritizing key files (e.g., ${
    packageInfo.main
  }, package.json) and grouping others (e.g., as "other"). Simplify file names without special characters (e.g., use "HomePage" instead of "app/page.tsx"). Enclose labels in quotes if needed (e.g., A["Home Page"]). Ensure GitHub Mermaid syntax compliance. If too few files (<3), omit with a note (e.g., "File Structure omitted due to minimal project size").
7. **Features**: List 4-6 specific features in bullet points, inferred from code insights (e.g., ASCII art via figlet, spinner via ora, code parsing via tree-sitter-javascript, Git integration via simple-git), file structure, and package.json (e.g., make-readme CLI from bin). Highlight unique aspects like API key validation or interactive prompts. Avoid generic phrases like "easy to use" or "customizable." Reference the Architecture Overview if applicable.
8. **Installation**: Provide step-by-step instructions to set up the project, tailored to package.json data, organized into subsections:
   - ### Prerequisites: List requirements (e.g., Node.js version from package.json engines, system dependencies like tree-sitter) in a \`\`\`bash code block or narrative text.
   - ### Setup: Provide mandatory steps in \`\`\`bash code blocks with narrative text for context. For cloning, use the Git Remote URL from Project Context if available (e.g., git clone ${remote}). If no remote URL is provided, include a generic instruction (e.g., "Clone the repository from your project’s Git hosting service using: git clone <your-repo-url>"). Follow with navigation (cd ${repo}) and dependency installation (npm install).
   - ### Installation Options: Offer choices for installation with sub-subsections:
     - #### Production (Global): Instructions for global installation (e.g., npm install -g .) if bin is present, in a \`\`\`bash code block.
     - #### Development (Local): Instructions for linking (e.g., npm link) for development, in a \`\`\`bash code block, marked as optional.
   Use narrative text to clarify mandatory vs. optional steps (e.g., "Complete Setup steps first, then choose one installation option").
9. **Usage**: Provide 2-3 executable examples of how to use the project, organized into a subsection:
   - ### Execution Options: List usage options with sub-subsections:
     - #### Run Locally: Local run command (e.g., node ${
       packageInfo.main
     } or npm run start if scripts.start exists) in a \`\`\`bash code block, with context (e.g., "For testing without global installation").
     - #### Run Globally: Global CLI command (e.g., ${
       Object.keys(packageInfo.bin || {})[0]
     }) in a \`\`\`bash code block, noting it requires global installation.
     - #### Run via npx: npx command (e.g., npx ${
       packageInfo.name
     }) in a \`\`\`bash code block, only if package.json has publishConfig or repository fields, with a note (e.g., "For published packages").
   Use narrative text to clarify that users should choose one option based on their setup (e.g., "Select one of the following based on your installation").
10. **Scripts**: List meaningful scripts from package.json.scripts in a \`\`\`bash code block or Markdown table, including their purpose (e.g., npm run start: "Runs the project locally"). Omit scripts with default error messages (e.g., "echo \"Error: no test specified\""). If no meaningful scripts exist, omit with a note (e.g., "No meaningful scripts defined in package.json; consider adding scripts like 'start' or 'build'").
11. **Contributing**: Provide brief guidelines for contributing, including how to submit issues or pull requests. Keep it simple and welcoming.
12. **License**: Specify the license from package.json (default to MIT if unknown) and include a brief explanation of what it means.
13. **Credits**: Acknowledge the author (${user}) and list only the exact dependencies and devDependencies from package.json (e.g., Node.js, ${Object.keys(
    packageInfo.dependencies
  ).join(", ")}, ${Object.keys(packageInfo.devDependencies).join(
    ", "
  )}). Do not include unlisted dependencies.

---

### Additional Guidelines
- **Tone and Style**: Use a professional yet approachable tone. Keep sections concise, specific, and informative, avoiding fluff or vague statements.
- **Use Code Insights and Package.json**: Leverage code insights and package.json data to highlight unique aspects in Description, Features, Installation, Usage, and Scripts. Tailor commands to package.json details (e.g., bin, scripts, name) and avoid generic instructions.
- **Diagram Formatting**: Ensure Mermaid diagrams are formatted in \`\`\`mermaid code blocks with concise labels free of special characters (e.g., (), /, :). Enclose labels in quotes if needed. Follow GitHub's Mermaid syntax rules (https://docs.github.com/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams#creating-mermaid-diagrams).
- **Command Formatting**: Present all command-line instructions and examples in \`\`\`bash code blocks (or \`\`\`javascript/\`\`\`python for snippets) in Installation, Usage, and Scripts. Use appropriate language identifiers based on project type (e.g., bash for CLI).
- **Adapt to Project Type**: Tailor the README, diagrams, and code block languages to the project type (e.g., CLI tool, library) based on file extensions (e.g., .js, .py), code insights, and package.json (e.g., bin for CLI).
- **Badge Link**: Use the Git remote URL provided in Project Context (remote) for the badge hyperlink, ensuring it points to the project’s actual repository (e.g., https://github.com/<user>/<repo>).
- **Avoid Placeholders**: Do not include placeholder text (e.g., "[Your description here]") or incomplete sections. Ensure all sections are populated or omitted with a reason.
- **Markdown Best Practices**: Use proper Markdown formatting (e.g., headers, lists, code blocks). Always include a table of contents with links to each section, placed after the Title.
- **No External Assumptions**: Base content and diagrams solely on provided project name, author, files, code insights, package.json, and template. Do not invent unprovided details.

---

Generate the README.md content in pure Markdown format, ready to be written to a file. Ensure it is complete, polished, and aligned with the template’s structure and style.
`;
  return prompt;
}

async function generateReadme() {
  // Step 1: Ask for API key if missing or invalid
  if (!fs.existsSync(envPath) || !process.env.GEMINI_API_KEY) {
    const asciiArt = figlet.textSync("ReadMe Wizard", {
      font: "Standard",
      horizontalLayout: "default",
      verticalLayout: "default",
    });

    console.clear();
    console.log(purple(asciiArt));
    console.log(wizardAscii);
    console.log(purple("━".repeat(79)));
    console.log(
      `${highlight("✨ Welcome to")} ${boldPurple("ReadMe Wizard")} ${highlight(
        "Setup!"
      )} ✨`
    );
    console.log(
      info(
        "\nTo generate awesome READMEs, we need your Google Generative AI API key.\n"
      )
    );
    console.log(`\n🔮 ${boldPurple("Steps to Get Started:")}\n`);
    console.log(
      ` 1️⃣ Get your API key from: ${chalk.underline(
        "https://makersuite.google.com/app/apikey"
      )}\n`
    );
    console.log(
      ` 2️⃣ Paste it below — we'll validate it and save it in a ${chalk.cyan(
        ".env"
      )} file.\n`
    );

    let valid = false;
    let apiKey = "";
    while (!valid) {
      const response = await prompts({
        type: "text",
        name: "apiKey",
        message: "🔑 Paste your Gemini API key here:",
        validate: (value) =>
          value.trim() ? true : "API key cannot be empty. Please try again.",
      });

      if (!response.apiKey) {
        console.log(error("\n❌ No API key provided. Exiting...\n"));
        process.exit(1);
      }

      apiKey = response.apiKey.trim();
      valid = await validateGeminiApiKey(apiKey);
      if (!valid) {
        console.log(error("❌ Invalid API key. Please try again.\n"));
        console.log(info("🔍 Possible reasons:"));
        console.log(" • The key you entered is incorrect or expired.");
        console.log(
          " • You haven't enabled Generative AI access in your Google account."
        );
        console.log(" • Your account may not have billing or quota enabled.\n");
        console.log(success("✅ Solution:"));
        console.log(" • Go to https://makersuite.google.com/app/apikey");
        console.log(
          " • Ensure you're logged in and have access to the Gemini API."
        );
        console.log(" • Generate a new API key and paste it below.\n");
      }
    }

    fs.writeFileSync(envPath, `GEMINI_API_KEY=${apiKey}\n`, {
      encoding: "utf8",
    });
    console.log(success("✅ .env file created with your API key!"));
    require("dotenv").config({ path: envPath });
  }

  // Step 2: Proceed with generation
  const prompt = await buildPrompt();
  const spinner = ora({
    text: "🧙‍♂️✨ Generating your README...",
    color: "magenta",
  }).start();

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const writeStream = fs.createWriteStream("README.md");
    writeStream.on("error", (err) => {
      spinner.fail("❌ Failed to write README.md");
      console.error(err);
      process.exit(1);
    });

    for await (const chunk of result.stream) {
      const text = chunk.text?.();
      if (typeof text === "string") {
        writeStream.write(text);
      }
    }

    // Add badge at the end
    const badgeImage = `
    \n\n<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
    <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1753459910/ReadMe-wizard-logo_ouhi2h.png" alt="ReadMe Wizard Logo" width="300"/>
    </a>\n`;

    writeStream.write(badgeImage);
    writeStream.end(() => {
      spinner.succeed("✅ README.md generated successfully!");
    });
  } catch (err) {
    spinner.fail("❌ An error occurred during README generation.");
    console.error(err.message || err);
    process.exit(1);
  }
}

module.exports = generateReadme;
