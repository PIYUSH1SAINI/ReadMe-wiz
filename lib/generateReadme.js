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
       ,    _
      /|   | |
    _/_\\_  >_<
   .-\\-/.   |
  /  | | \\_ |
  \\ \\| |\\__(/ 
  /(\`---')  |
 / /     \\  |
_.'  \\'-'/  |
\`---'\`=-='  '    
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
    3. **Architecture Overview**: Create a Mermaid diagram (in a \`\`\`mermaid code block) to visualize the project's high-level architecture. Use a top-down graph (\\graph TD\\) with 3-6 nodes representing key components (e.g., modules, classes, or functions) and their interactions (e.g., data flow, dependencies). Infer components from code insights (e.g., function/class names) and file structure (e.g., module purposes). Use concise, simplified labels without special characters like (), /, or : (e.g., use "HomePage" instead of "Home Page (app/page.tsx)"). Enclose labels in square brackets or quotes if needed to escape special characters (e.g., A["Home Page"]). Use arrows to show relationships (e.g., "ModuleA -->|processes| ModuleB"). Ensure the diagram follows GitHub's Mermaid syntax rules (see https://docs.github.com/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams#creating-mermaid-diagrams). If subgraphs are used, provide meaningful labels (e.g., subgraph UI) without empty quotes. If insufficient data is available, omit this section with a note (e.g., "Architecture Overview omitted due to limited component data").
    4. **File Structure**: Create a Mermaid diagram (in a \`\`\`mermaid code block) to visualize the project's file hierarchy. Use a tree-like structure (\\graph TD\\) with 5-10 nodes, prioritizing key files (e.g., index.js, package.json) and grouping less critical files (e.g., as "other"). Simplify file names to avoid special characters like / or . (e.g., use "HomePage" instead of "app/page.tsx"). Enclose labels in quotes if needed (e.g., A["Home Page"]). Ensure the diagram follows GitHub's Mermaid syntax rules. If the project has too few files (e.g., <3), omit this section with a note (e.g., "File Structure omitted due to minimal project size").
    5. **Features**: List 4-6 key features in bullet points, inferred from the code insights and file structure. Be specific and avoid generic phrases like "easy to use." Reference the Architecture Overview if applicable.
    6. **Installation**: Provide step-by-step instructions to set up the project (e.g., cloning the repo, installing dependencies). Present all command-line instructions in a \`\`\`bash code block, with each step as a separate command or sequence. Include brief narrative text outside the code block for context (e.g., prerequisites like Node.js version or system dependencies). Assume a Node.js environment if JavaScript/TypeScript files are present, or adapt based on file extensions (e.g., Python, Go).
    7. **Usage**: Include 1-2 concise examples of how to use the project, presented in \`\`\`bash code blocks for CLI commands or \`\`\`javascript/\`\`\`python code blocks for code snippets, depending on the project type. Ensure examples are executable, clear, and relevant to the project’s functionality.
    8. **Scripts**: List available npm scripts (or equivalent for other languages) in bullet points or a code block, if relevant, based on the file structure (e.g., package.json presence).
    9. **Contributing**: Provide brief guidelines for contributing, including how to submit issues or pull requests. Keep it simple and welcoming.
    10. **License**: Specify the license (default to MIT if unknown) and include a brief explanation of what it means.
    11. **Credits**: Acknowledge the author (${user}) and any key dependencies or tools inferred from the file structure (e.g., Node.js, Python libraries).
    
    ---
    
    ### Additional Guidelines
    - **Tone and Style**: Use a professional yet approachable tone. Keep sections concise but informative, avoiding fluff or vague statements.
    - **Use Code Insights**: Leverage the code insights to highlight unique aspects of the project in the Description, Features, and Architecture Overview sections.
    - **Diagram Formatting**: Ensure Mermaid diagrams are properly formatted in \`\`\`mermaid code blocks, using concise labels without special characters like (), /, or :. Enclose labels in quotes if needed to escape characters. Follow GitHub's Mermaid syntax rules (https://docs.github.com/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams#creating-mermaid-diagrams) to ensure diagrams render correctly.
    - **Command Formatting**: Present all command-line instructions and examples in \`\`\`bash code blocks (or \`\`\`javascript/\`\`\`python for code snippets) in the Installation and Usage sections. Use the appropriate language identifier based on the project type (e.g., bash for CLI commands, javascript for Node.js snippets).
    - **Adapt to Project Type**: Based on file extensions (e.g., .js, .py, .go) and code insights, tailor the README, diagrams, and code block languages to the project type (e.g., CLI tool, library, web app).
    - **Avoid Placeholders**: Do not include placeholder text like "[Your description here]" or incomplete sections. Ensure all sections are fully populated or omitted with a reason.
    - **Markdown Best Practices**: Use proper Markdown formatting (e.g., headers, lists, code blocks). Include a table of contents if the README exceeds 300 words.
    - **No External Assumptions**: Base the content and diagrams solely on the provided project name, author, files, code insights, and template. Do not invent details not provided.
    
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
      `  1️⃣  Get your API key from: ${chalk.underline(
        "https://makersuite.google.com/app/apikey"
      )}\n`
    );
    console.log(
      `  2️⃣  Paste it below — we'll validate it and save it in a ${chalk.cyan(
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
