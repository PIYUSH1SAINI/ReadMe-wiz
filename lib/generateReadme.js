const fs = require("fs");
const path = require("path");
const globby = require("globby");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Parser = require("tree-sitter");
const JavaScript = require("tree-sitter-javascript");
const Java = require("tree-sitter-java");
const Python = require("tree-sitter-python");
const HTML = require("tree-sitter-html");
const CSS = require("tree-sitter-css");
const Ruby = require("tree-sitter-ruby");
const PHP = require("tree-sitter-php");
const Go = require("tree-sitter-go");
const CSharp = require("tree-sitter-c-sharp");
const Rust = require("tree-sitter-rust");
const simpleGit = require("simple-git");
const prompts = require("prompts");
const figlet = require("figlet");
const chalk = require("chalk");
const ora = require("ora").default;
const dotenv = require("dotenv");
const { execSync } = require("child_process");

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
       ,      _
      /|     | |
    _/_\\_    >_<
   .-\\-/.     |
  /  | | \\_   |
  \\ \\| |\\__(/ 
  /(\`---')    |
 / /     \\    |
_.'  \\'-'/    |
\`---'\`=-='   '  
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

function extractGitHubUsername(email) {
  const match = email.match(/^.*\+(.+)@users\.noreply\.github\.com$/);
  return match ? match[1] : null;
}

function getContributorCounts() {
  try {
    const output = execSync('git log --format="%aN|%aE"', { encoding: "utf8" });
    const userMap = new Map();
    output
      .trim()
      .split("\n")
      .forEach((line) => {
        const [name, email] = line.split("|");
        const key = `${name}|${email}`;
        const usernameFromEmail = extractGitHubUsername(email);
        const isNameValidGitHubHandle = /^[a-zA-Z0-9-]+$/.test(name.trim());
        const likelyUsername = isNameValidGitHubHandle ? name.trim() : null;
        const username = usernameFromEmail || likelyUsername;
        if (!username) return;
        if (!userMap.has(username)) {
          userMap.set(username, {
            name,
            email,
            count: 1,
            username,
            isReliable: !!usernameFromEmail,
          });
        } else {
          userMap.get(username).count++;
        }
      });
    return Array.from(userMap.values());
  } catch (err) {
    console.warn("⚠️ Could not retrieve Git contributors:", err.message);
    return [];
  }
}

// function generateContributorsImages(contributors) {
//   if (!contributors.length) {
//     return "Contributors section omitted due to no Git contributors found.";
//   }
//   return (
//     "## Contributors\n\n" +
//     contributors
//       .map(
//         (
//           c
//         ) => `<a href="https://github.com/${c.username}" target="_blank"><div style="display: inline-block; width: 60px; height: 60px; border-radius: 50%; overflow: hidden; margin-right: 10px;">
// <img src="https://avatars.githubusercontent.com/${c.username}?s=60&v=4" width="60" height="60" alt="@${c.username}" title="@${c.username}" style="border-radius: 50%;" onerror="this.src='https://github.com/identicons/${c.username}.png'" />
// </div></a>`
//       )
//       .join(" ") +
//     "\n"
//   );
// }

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
    "**/*.{js,ts,jsx,tsx,py,java,html,css,rb,php,go,cs,rs,cpp,vue}",
    "!node_modules",
  ]);
  return entries;
}

function parseCode(filePath) {
  try {
    const code = fs.readFileSync(filePath, "utf8");
    const parser = new Parser();
    const ext = path.extname(filePath).toLowerCase();
    if ([".js", ".ts", ".jsx", ".tsx"].includes(ext)) {
      parser.setLanguage(JavaScript);
    } else if (ext === ".java") {
      parser.setLanguage(Java);
    } else if (ext === ".py") {
      parser.setLanguage(Python);
    } else if (ext === ".html") {
      parser.setLanguage(HTML);
    } else if (ext === ".css") {
      parser.setLanguage(CSS);
    } else if (ext === ".rb") {
      parser.setLanguage(Ruby);
    } else if (ext === ".php") {
      parser.setLanguage(PHP);
    } else if (ext === ".go") {
      parser.setLanguage(Go);
    } else if (ext === ".cs") {
      parser.setLanguage(CSharp);
    } else if (ext === ".rs") {
      parser.setLanguage(Rust);
    } else if (ext === ".cpp") {
      parser.setLanguage(require("tree-sitter-cpp"));
    } else if (ext === ".vue") {
      parser.setLanguage(JavaScript);
    } else {
      return null;
    }
    const tree = parser.parse(code);
    return summarizeTree(tree.rootNode, code, ext);
  } catch {
    return null;
  }
}

function summarizeTree(root, code, ext) {
  const summaries = [];
  if ([".js", ".ts", ".jsx", ".tsx", ".vue"].includes(ext)) {
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
  } else if (ext === ".java") {
    root
      .descendantsOfType(["method_declaration", "class_declaration"])
      .forEach((node) => {
        const nameNode = node.childForFieldName("name");
        if (nameNode) {
          const name = code.slice(nameNode.startIndex, nameNode.endIndex);
          summaries.push(
            `${
              node.type === "method_declaration" ? "Method" : "Class"
            }: ${name}`
          );
        }
      });
  } else if (ext === ".py") {
    root
      .descendantsOfType(["function_definition", "class_definition"])
      .forEach((node) => {
        const nameNode = node.childForFieldName("name");
        if (nameNode) {
          const name = code.slice(nameNode.startIndex, nameNode.endIndex);
          summaries.push(
            `${
              node.type === "function_definition" ? "Function" : "Class"
            }: ${name}`
          );
        }
      });
  } else if (ext === ".html") {
    root.descendantsOfType(["element"]).forEach((node) => {
      const startTag = node.childForFieldName("start_tag");
      const tagNameNode = startTag?.childForFieldName("tag_name");
      if (tagNameNode) {
        const tagName = code.slice(
          tagNameNode.startIndex,
          tagNameNode.endIndex
        );
        summaries.push(`HTML Tag: ${tagName}`);
      }
    });
  } else if (ext === ".css") {
    root.descendantsOfType(["rule_set"]).forEach((node) => {
      const selectors = node.childForFieldName("selectors");
      if (selectors) {
        const selectorText = code.slice(
          selectors.startIndex,
          selectors.endIndex
        );
        summaries.push(`CSS Selector: ${selectorText}`);
      }
    });
  } else if (ext === ".rb") {
    root.descendantsOfType(["method", "class"]).forEach((node) => {
      const nameNode = node.childForFieldName("name");
      if (nameNode) {
        const name = code.slice(nameNode.startIndex, nameNode.endIndex);
        summaries.push(
          `${node.type === "method" ? "Method" : "Class"}: ${name}`
        );
      }
    });
  } else if (ext === ".php") {
    root
      .descendantsOfType(["function_definition", "class_declaration"])
      .forEach((node) => {
        const nameNode = node.childForFieldName("name");
        if (nameNode) {
          const name = code.slice(nameNode.startIndex, nameNode.endIndex);
          summaries.push(
            `${
              node.type === "function_definition" ? "Function" : "Class"
            }: ${name}`
          );
        }
      });
  } else if (ext === ".go") {
    root
      .descendantsOfType(["function_declaration", "type_declaration"])
      .forEach((node) => {
        const nameNode = node.childForFieldName("name");
        if (nameNode) {
          const name = code.slice(nameNode.startIndex, nameNode.endIndex);
          summaries.push(
            `${
              node.type === "function_declaration" ? "Function" : "Type"
            }: ${name}`
          );
        }
      });
  } else if (ext === ".cs") {
    root
      .descendantsOfType(["method_declaration", "class_declaration"])
      .forEach((node) => {
        const nameNode = node.childForFieldName("name");
        if (nameNode) {
          const name = code.slice(nameNode.startIndex, nameNode.endIndex);
          summaries.push(
            `${
              node.type === "method_declaration" ? "Method" : "Class"
            }: ${name}`
          );
        }
      });
  } else if (ext === ".rs") {
    root.descendantsOfType(["function_item", "struct_item"]).forEach((node) => {
      const nameNode = node.childForFieldName("name");
      if (nameNode) {
        const name = code.slice(nameNode.startIndex, nameNode.endIndex);
        summaries.push(
          `${node.type === "function_item" ? "Function" : "Struct"}: ${name}`
        );
      }
    });
  } else if (ext === ".cpp") {
    root
      .descendantsOfType(["function_definition", "class_specifier"])
      .forEach((node) => {
        const nameNode = node.childForFieldName("name");
        if (nameNode) {
          const name = code.slice(nameNode.startIndex, nameNode.endIndex);
          summaries.push(
            `${
              node.type === "function_definition" ? "Function" : "Class"
            }: ${name}`
          );
        }
      });
  }
  return summaries;
}

async function buildPrompt() {
  const { user, repo, remote } = await getGitInfo();
  const files = await getProjectFiles();
  const contributors = getContributorCounts();
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

  // Filter out uninformative scripts
  const meaningfulScripts = {};
  for (const [key, value] of Object.entries(packageInfo.scripts)) {
    if (!value.includes('echo "Error: no test specified"')) {
      meaningfulScripts[key] = value;
    }
  }

  const template = fs.existsSync(TEMPLATE_PATH)
    ? fs.readFileSync(TEMPLATE_PATH, "utf8")
    : "";

  const contributorsData =
    contributors
      .map(
        (c) =>
          `- ${c.username} (${c.name}, ${c.count} commit${
            c.count > 1 ? "s" : ""
          })`
      )
      .join("\n") || "No contributors found.";

  const prompt = `
You are an expert developer with extensive experience in creating professional, user-friendly documentation for software projects. Your task is to generate a comprehensive and polished README.md file in Markdown format for the project described below. Use the provided information, including package.json details, code insights, and contributor data, to craft a README that is clear, concise, and tailored to the project's context, whether it is a backend project (e.g., Node.js, Java, Python, Ruby, PHP, Go, C#, Rust) or a frontend project (e.g., React, Next.js, Vue.js, HTML/CSS). The README should be professional yet approachable, suitable for both developers and non-technical users.

---

### Project Context

- **Project Name**: ${repo}
- **Author**: ${user}
- **Git Remote URL**: ${remote || "none"}
- **Project Files**:
${files.map((f) => `- ${f}`).join("\n")}
- **Code Insights** (key functions, classes, methods, HTML tags, CSS selectors, or other language-specific constructs in the codebase):
${codeInsights.join("\n\n") || "No significant code insights available."}
- **Package.json Details**:
  - Name: ${packageInfo.name}
  - Bin: ${JSON.stringify(packageInfo.bin) || "none"}
  - Scripts: ${JSON.stringify(meaningfulScripts) || "{}"}
  - Dependencies: ${JSON.stringify(packageInfo.dependencies) || "{}"}
  - DevDependencies: ${JSON.stringify(packageInfo.devDependencies) || "{}"}
  - Main: ${packageInfo.main}
  - Engines: ${JSON.stringify(packageInfo.engines) || "{}"}
  - PublishConfig: ${JSON.stringify(packageInfo.publishConfig) || "none"}
  - Repository: ${JSON.stringify(packageInfo.repository) || "none"}
- **Contributors** (GitHub usernames, names, and commit counts):
${contributorsData}

---

### README Template

The following template is a stylistic and structural guide to show what a high-quality README.md looks like. Use it to inform the Markdown structure, tone, and clarity, but do not copy it verbatim. Adapt the content to reflect the specific project details provided above, ensuring accuracy and specificity.

${template}

---

### Task Instructions

Generate a README.md file in Markdown format with the following sections, tailored to the project. Omit any section that lacks meaningful or useful information, including a brief note explaining why it was omitted (e.g., "Scripts section omitted due to no meaningful scripts defined in package.json"). For example, exclude the **Scripts** section if package.json.scripts is empty or contains only uninformative commands.

1. **Title**: Use the project name (# ${repo}) as the main heading. Include a brief tagline (1-2 sentences) summarizing the project's purpose, inferred from package.json (e.g., name, bin, dependencies like react, express, django, laravel) and code insights (e.g., CLI functionality for backend, UI components for frontend).

2. **Table of Contents**: Include a table of contents with links to all included sections (e.g., - [Description](#description)), placed immediately after the Title. Only list sections that are included in the final README, including Contributors if contributor data is available.

3. **Description**: Write a 3-5 sentence overview, detailing the project's specific functionality (e.g., REST API for Node.js/Java/Go, web application for React/Next.js/Vue.js, static site with HTML/CSS, CLI for Python/Ruby/PHP). Identify whether it’s a backend or frontend project based on file extensions (e.g., .js, .java, .py, .rb, .php, .go, .cs, .rs, .html, .css, .vue) and dependencies (e.g., express for backend, react/next/vue for frontend). Highlight primary use case (e.g., automating tasks, rendering UI) and unique value (e.g., API key validation, interactive UI components). Incorporate code insights (e.g., validateGeminiApiKey for Node.js, Flask routes for Python, React components for frontend) and package.json details (e.g., CLI command from bin). Avoid generic phrases like "powerful" or "saves time."

4. **Tech Stack**: Add a section after Description listing badges for the project's tech stack, inferred from package.json dependencies and devDependencies (e.g., Node.js, Express, React, Next.js, Vue.js, Python, Java, Ruby, PHP, Go, C#, Rust) and file extensions (e.g., .html, .css, .vue for frontend; .java, .py, .rb, .php, .go, .cs, .rs for backend). Use Shields.io badges (style: for-the-badge) with appropriate logos and colors (e.g., green for Node.js, blue for React, red for Java, purple for Vue.js). Include the custom badge: [![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git). Map dependency names to user-friendly labels (e.g., express → Express.js, react → React, flask → Flask, rails → Ruby on Rails, laravel → Laravel). For projects with .java, .py, .rb, .php, .go, .cs, .rs, .cpp files, include respective language badges (e.g., Java, Python, Ruby, PHP, Go, C#, Rust, C++). For .html/.css/.vue files, include HTML5, CSS3, or Vue.js badges. Place badges on a single line, separated by spaces. Omit if no dependencies or devDependencies are defined and no relevant file extensions are detected, with a note (e.g., "Tech Stack section omitted due to no dependencies or recognized languages specified").

5. **Architecture Overview**: Create a Mermaid diagram (in a \`\`\`mermaid code block) to visualize the project's high-level architecture. Use a top-down graph (\`\`\`graph TD\`\`\`) with 3-5 nodes representing key components (e.g., backend modules, frontend components, API routes, UI elements) and their interactions (e.g., data flow, HTTP requests, rendering). Infer components from code insights (e.g., getGitInfo for Node.js, Flask routes for Python, React/Vue components for frontend, Rails controllers for Ruby) and file structure. Use concise labels without special characters (e.g., A[getGitInfo], B[AppComponent]). Enclose labels in square brackets or quotes if needed (e.g., A["Home Page"]). Use arrows to show relationships (e.g., "ModuleA -->|processes| ModuleB", "ComponentA -->|renders| ComponentB"). Ensure the diagram follows GitHub's Mermaid syntax rules (https://docs.github.com/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams#creating-mermaid-diagrams). Use subgraphs with meaningful labels (e.g., subgraph Backend, subgraph Frontend) to group related components for clarity. Omit with a note (e.g., "Architecture Overview omitted due to limited component data") if fewer than 3 significant components are identified from code insights.

6. **File Structure**: Create a Mermaid diagram (in a \`\`\`mermaid code block) to visualize the project's file hierarchy. Use a tree-like structure (\`\`\`graph TD\`\`\`) with 5-10 nodes, prioritizing key files (e.g., ${
    packageInfo.main
  }, package.json, main.py, App.java, index.html, app.vue) and grouping others (e.g., as "other"). Simplify file names without special characters (e.g., use "HomePage" instead of "app/page.tsx"). Enclose labels in quotes if needed (e.g., A["Home Page"]). Ensure GitHub Mermaid syntax compliance. Omit with a note (e.g., "File Structure omitted due to minimal project size") if fewer than 3 files are detected.

7. **Features**: List 4-6 specific features in bullet points, inferred from code insights (e.g., API key validation for Node.js, Flask routes for Python, Rails controllers for Ruby, React/Vue components for frontend, styled layouts for HTML/CSS), file structure, and package.json (e.g., make-readme CLI from bin, React/Next.js/Vue.js rendering). Highlight unique aspects like API key validation, interactive prompts, or UI rendering. For backend projects, focus on server-side functionality (e.g., API endpoints, database integration). For frontend projects, emphasize UI/UX features (e.g., component rendering, styling). Avoid generic phrases like "easy to use" or "customizable." Reference the Architecture Overview if applicable. Omit if fewer than 2 features can be inferred, with a note (e.g., "Features section omitted due to insufficient project details").

8. **Installation**: Provide step-by-step instructions to set up the project, tailored to package.json data, file extensions, or other build files (e.g., requirements.txt, Gemfile, composer.json, go.mod, csproj), organized into subsections:
   - ### Prerequisites: List requirements based on project type (e.g., Node.js version from package.json engines, Java JDK for .java files, Python version for .py files, Ruby for .rb files, PHP for .php files, Go for .go files, .NET for .cs files, Rust for .rs files, no prerequisites for HTML/CSS/Vue.js) in a \`\`\`bash code block or narrative text.
   - ### Setup: Provide mandatory steps in \`\`\`bash code blocks with narrative text for context. For cloning, use the Git Remote URL from Project Context if available (e.g., git clone ${remote}). If no remote URL is provided, include a generic instruction (e.g., "Clone the repository from your project’s Git hosting service using: git clone <your-repo-url>"). For Node.js projects, include navigation (cd ${repo}) and dependency installation (npm install). For Python projects, include pip install (e.g., pip install -r requirements.txt). For Java projects, include Maven/Gradle setup if detected (e.g., pom.xml, build.gradle). For Ruby, include bundle install (e.g., bundle install for Gemfile). For PHP, include composer install (e.g., composer install for composer.json). For Go, include go mod download (e.g., go mod download for go.mod). For C#, include dotnet restore (e.g., dotnet restore for .csproj). For Rust, include cargo build (e.g., cargo build for Cargo.toml). For HTML/CSS/Vue.js, note that no installation is typically needed.
   - ### Installation Options: Offer choices for installation with sub-subsections:
     - #### Production (Global): Instructions for global installation (e.g., npm install -g . for Node.js, pip install . for Python, gem install for Ruby, composer global require for PHP) if bin is present or applicable, in a \`\`\`bash code block.
     - #### Development (Local): Instructions for linking (e.g., npm link for Node.js, pip install -e . for Python, bundle exec for Ruby) for development, in a \`\`\`bash code block, marked as optional.
   Use narrative text to clarify mandatory vs. optional steps (e.g., "Complete Setup steps first, then choose one installation option"). Omit if no installation steps are applicable, with a note (e.g., "Installation section omitted due to insufficient setup details").

9. **Usage**: Provide 2-3 executable examples of how to use the project, organized into a subsection:
   - ### Execution Options: List usage options with sub-subsections:
     - #### Run Locally: Local run command (e.g., node ${
       packageInfo.main
     } or npm run start for Node.js, python main.py for Python, java -jar app.jar for Java, bundle exec rails server for Ruby, php artisan serve for PHP, go run . for Go, dotnet run for C#, cargo run for Rust, open index.html for HTML, npm run dev for Vue.js) in a \`\`\`bash code block, with context (e.g., "For testing without global installation").
     - #### Run Globally: Global CLI command (e.g., ${
       Object.keys(packageInfo.bin || {})[0]
     } for Node.js, python -m ${
    packageInfo.name
  } for Python, bundle exec <command> for Ruby) in a \`\`\`bash code block, noting it requires global installation.
     - #### Run via npx: npx command (e.g., npx ${
       packageInfo.name
     }) in a \`\`\`bash code block, only if package.json has publishConfig or repository fields, with a note (e.g., "For published Node.js packages"). Omit for non-Node.js projects.
   Use narrative text to clarify that users should choose one option based on their setup (e.g., "Select one of the following based on your installation"). Omit if no usage options are available, with a note (e.g., "Usage section omitted due to insufficient execution details").

10. **Scripts**: List meaningful scripts from package.json.scripts in a \`\`\`bash code block or Markdown table, including their purpose (e.g., npm run start: "Runs the project locally"). Omit the section entirely if no scripts are defined or if scripts only contain uninformative commands (e.g., empty object or scripts filtered out in Project Context). If omitted, include a note (e.g., "Scripts section omitted due to no meaningful scripts defined in package.json; consider adding scripts like 'start' or 'build'"). For non-Node.js projects (e.g., Java, Python, Ruby, PHP, Go, C#, Rust, HTML/CSS, Vue.js), omit this section unless a package.json is present, with a note (e.g., "Scripts section omitted as no package.json is defined").

11. **Contributing**: Provide brief guidelines for contributing, including how to submit issues or pull requests. Keep it simple and welcoming. Omit if no repository information is available, with a note (e.g., "Contributing section omitted due to missing repository details").

12. **Contributors**: Include a section displaying GitHub profile images (60x60 pixels) for contributors in a horizontal line, linked to their GitHub profiles, using the format: \`<a href="https://github.com/{username}" target="_blank"><img src="https://avatars.githubusercontent.com/{username}?s=60&v=4" width="60" height="60" alt="@{username}" title="@{username}" style="border-radius: 50%;" onerror="this.src='https://github.com/identicons/{username}.png'" /></a>\`. Use the contributor data provided in Project Context (usernames, names, commit counts). Images should be displayed on a single line with 10px spacing (margin-right). Omit if no contributors are found, with a note (e.g., "Contributors section omitted due to no Git contributors found").

13. **License**: Specify the license from package.json (default to MIT if unknown) or infer from project context (e.g., MIT for Node.js, Apache for Java, GPL for Rust). Include a brief explanation of what it means.

14. **Credits**: Acknowledge the author (${user}) and list only the exact dependencies and devDependencies from package.json (e.g., Node.js, Express, React, Flask, Rails, Laravel) or languages detected from file extensions (e.g., Java, Python, Ruby, PHP, Go, C#, Rust, HTML5, CSS3, Vue.js). Do not include unlisted dependencies. Omit if no dependencies or author information is available, with a note (e.g., "Credits section omitted due to missing dependency or author information").

---

### Additional Guidelines

- **Tone and Style**: Use a professional yet approachable tone. Keep sections concise, specific, and informative, avoiding fluff or vague statements.
- **Use Code Insights, Package.json, and Contributors**: Leverage code insights (e.g., Java methods, Python functions, Ruby methods, PHP functions, Go functions, C# methods, Rust functions, React/Vue components, HTML tags, CSS selectors), package.json data, and contributor data to highlight unique aspects in Description, Features, Installation, Usage, Scripts, and Contributors. Tailor commands to project type (e.g., npm for Node.js, pip for Python, mvn for Java, bundle for Ruby, composer for PHP, go for Go, dotnet for C#, cargo for Rust, none for HTML/CSS/Vue.js).
- **Diagram Formatting**: Ensure Mermaid diagrams are formatted in \`\`\`mermaid code blocks with concise labels free of special characters (e.g., (), /, :). Enclose labels in quotes if needed. Follow GitHub's Mermaid syntax rules (https://docs.github.com/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams#creating-mermaid-diagrams).
- **Command Formatting**: Present all command-line instructions and examples in \`\`\`bash code blocks (or \`\`\`javascript/\`\`\`python/\`\`\`java/\`\`\`ruby/\`\`\`php/\`\`\`go/\`\`\`csharp/\`\`\`rust for snippets) in Installation, Usage, and Scripts. Use appropriate language identifiers based on project type (e.g., bash for CLI, python for Python scripts).
- **Adapt to Project Type**: Tailor the README, diagrams, and code block languages to the project type (e.g., backend API for Node.js/Java/Python/Ruby/PHP/Go/C#/Rust, frontend app for React/Next.js/Vue.js/HTML/CSS) based on file extensions (e.g., .js, .java, .py, .rb, .php, .go, .cs, .rs, .html, .css, .vue) and package.json (e.g., bin for CLI, react/next/vue for frontend).
- **Badge Link**: Use the Git remote URL provided in Project Context (remote) for the badge hyperlink, ensuring it points to the project’s actual repository (e.g., https://github.com/<user>/<repo>). Include the ReadMe Wizard badge only in the Tech Stack section, not elsewhere in the README.
- **Avoid Placeholders**: Do not include placeholder text (e.g., "[Your description here]") or incomplete sections. Ensure all sections are populated or omitted with a reason.
- **Markdown Best Practices**: Use proper Markdown formatting (e.g., headers, lists, code blocks). Always include a table of contents with links to each included section, placed after the Title.
- **No External Assumptions**: Base content and diagrams solely on provided project name, author, files, code insights, package.json, template, and contributor data. Do not invent unprovided details.
- **Omission Handling**: When omitting a section due to lack of meaningful data (e.g., empty scripts, insufficient files, no contributors, or missing repository details), include a brief note in the README explaining the omission (e.g., "Contributors section omitted due to no Git contributors found"). Ensure the table of contents only includes sections that are present in the final README.

---

Generate the README.md content in pure Markdown format, ready to be written to a file. Ensure it is complete, polished, and aligned with the template’s structure and style, reflecting whether the project is backend (e.g., Node.js, Java, Python, Ruby, PHP, Go, C#, Rust) or frontend (e.g., React, Next.js, Vue.js, HTML/CSS) based on file extensions and dependencies. Include the Contributors section with circular GitHub profile images, followed by the ReadMe Wizard badge on a new line.
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
