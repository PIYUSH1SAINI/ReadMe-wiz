//lib/promptBuilder.js
const fs = require("fs");
const path = require("path");
// const globby = require("globby");

const TEMPLATE_PATH = path.join(__dirname, "../templates/readme-example.md");
const MODEL = "models/gemini-1.5-flash";

async function buildPrompt(
  gitInfo,
  contributors,
  files,
  codeInsights,
  userCustomPrompt = ""
) {
  // Destructure gitInfo to get repo, user, and remote
  const {
    repo = "unknown",
    user = "Unknown Author",
    remote = "",
  } = gitInfo || {};

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
    name: packageJson.name || repo,
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

  // Detect project type (frontend, backend, or both) based on file extensions and dependencies
  const frontendExtensions = [".html", ".css", ".jsx", ".tsx", ".vue"];
  const backendExtensions = [
    ".js",
    ".ts",
    ".py",
    ".java",
    ".rb",
    ".php",
    ".go",
    ".cs",
    ".rs",
    ".cpp",
  ];
  const hasFrontendFiles = files.some((f) =>
    frontendExtensions.includes(path.extname(f).toLowerCase())
  );
  const hasBackendFiles = files.some((f) =>
    backendExtensions.includes(path.extname(f).toLowerCase())
  );
  const frontendDeps = ["react", "next", "vue", "@vue/cli", "vite", "webpack"];
  const backendDeps = [
    "express",
    "flask",
    "django",
    "rails",
    "laravel",
    "fastapi",
  ];
  const hasFrontendDeps = Object.keys(packageInfo.dependencies).some((dep) =>
    frontendDeps.includes(dep.toLowerCase())
  );
  const hasBackendDeps = Object.keys(packageInfo.dependencies).some((dep) =>
    backendDeps.includes(dep.toLowerCase())
  );
  const projectType =
    hasFrontendFiles || hasFrontendDeps
      ? hasBackendFiles || hasBackendDeps
        ? "fullstack"
        : "frontend"
      : "backend";

  return `
    You are an expert developer with extensive experience in creating professional, user-friendly documentation for software projects. Your task is to generate a comprehensive and polished README.md file in Markdown format for the project described below. Use the provided information, including package.json details, code insights, and contributor data, to craft a README that is clear, concise, and tailored to the project's context(${projectType} project), whether it is a backend project (e.g., Node.js, Java, Python, Ruby, PHP, Go, C#, Rust) or a frontend project (e.g., React, Next.js, Vue.js, HTML/CSS). The README should be professional yet approachable, suitable for both developers and non-technical users.
    **Custom User Request**: ${
      userCustomPrompt || "No custom request provided."
    }
    Analyze the custom user request to determine its intent and context. Integrate the requested content seamlessly into the most appropriate section of the README to maintain a natural flow (e.g., a request for a "Supported Languages" section should appear after "Description" or "Tech Stack," not appended at the end). If the custom request warrants a new section, add it in a logical position and update the table of contents accordingly. Ensure the custom content aligns with the project's context and enhances the README's clarity.
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
2. **Table of Contents**: Place after the Title. Use nested Markdown lists for subsections (e.g., Installation → Prerequisites, Setup). Only include sections and subsections present in the final README. Example:
   - [Description](#description)
   - [Tech Stack](#tech-stack)
   - [Installation](#installation)
     - [Prerequisites](#prerequisites)
     - [Setup](#setup)
     - [Installation Options](#installation-options)
       - [Frontend Installation](#frontend-installation)
       - [Backend Installation](#backend-installation)
   Ensure links are lowercase and hyphenated.
3. **Description**: Write a 3-5 sentence overview, detailing the project's specific functionality (e.g., REST API for Node.js/Java/Go, web application for React/Next.js/Vue.js, static site with HTML/CSS, CLI for Python/Ruby/PHP). Identify whether it’s a backend or frontend project based on file extensions (e.g., .js, .java, .py, .rb, .php, .go, .cs, .rs, .html, .css, .vue) and dependencies (e.g., express for backend, react/next/vue for frontend). Highlight primary use case (e.g., automating tasks, rendering UI) and unique value (e.g., API key validation, interactive UI components). Incorporate code insights (e.g., validateGeminiApiKey for Node.js, Flask routes for Python, React components for frontend) and package.json details (e.g., CLI command from bin). Avoid generic phrases like "powerful" or "saves time."
4. **Tech Stack**: Add a section after Description listing badges for the project's tech stack, inferred from package.json dependencies and devDependencies (e.g., Node.js, Express, React, Next.js, Vue.js, Python, Java, Ruby, PHP, Go, C#, Rust) and file extensions (e.g., .html, .css, .vue for frontend; .java, .py, .rb, .php, .go, .cs, .rs for backend). Use Shields.io badges (style: for-the-badge) with appropriate logos and colors (e.g., green for Node.js, blue for React, red for Java, purple for Vue.js). Include the custom badge: [![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git). Map dependency names to user-friendly labels (e.g., express → Express.js, react → React, flask → Flask, rails → Ruby on Rails, laravel → Laravel). For projects with .java, .py, .rb, .php, .go, .cs, .rs, .cpp files, include respective language badges (e.g., Java, Python, Ruby, PHP, Go, C#, Rust, C++). For .html/.css/.vue files, include HTML5, CSS3, or Vue.js badges. Place badges on a single line, separated by spaces. Omit if no dependencies or devDependencies are defined and no relevant file extensions are detected, with a note (e.g., "Tech Stack section omitted due to no dependencies or recognized languages specified").
5. **Architecture Overview**: Create a Mermaid diagram (\`mermaid code block, graph TD) with 3-5 nodes representing key components (e.g., backend modules, frontend components, API routes). Use subgraphs to group Frontend and Backend components for fullstack projects. Ensure no node overlaps by using clear spacing and directional arrows (e.g., A --> B). Infer components from code insights (e.g., getGitInfo, AppComponent) and files. Use concise labels without special characters (e.g., A[HomePage]). Example:
   \`\`\`mermaid
   graph TD
     subgraph Frontend
       A[AppComponent] -->|renders| B[HomePage]
     end
     subgraph Backend
       C[APIController] -->|serves| D[Database]
     end
     A -->|fetches| C
   \`\`\`
   Omit with a note if fewer than 3 components are identified.
   If the project is purely frontend (e.g., React, Next.js, Vue.js), focus on UI components. For backend projects (e.g., Node.js, Java, Python, Ruby, PHP, Go, C#, Rust), focus on server-side functionality (e.g., API endpoints, database integration). Omit if no meaningful architecture can be inferred, with a note (e.g., "Architecture Overview omitted due to insufficient component details").
6. **File Structure**: Create a Mermaid diagram (in a \`\`\`mermaid code block) to visualize the project's file hierarchy. Use a tree-like structure (\`\`\`graph TD\`\`\`) with 5-10 nodes, prioritizing key files (e.g., ${
    packageInfo.main
  }, package.json, main.py, App.java, index.html, app.vue) and grouping others (e.g., as "other"). Simplify file names without special characters (e.g., use "HomePage" instead of "app/page.tsx"). Enclose labels in quotes if needed (e.g., A["Home Page"]). Ensure GitHub Mermaid syntax compliance. Omit with a note (e.g., "File Structure omitted due to minimal project size") if fewer than 3 files are detected.
7. **Features**: List 4-6 specific features in bullet points, inferred from code insights (e.g., API key validation for Node.js, Flask routes for Python, Rails controllers for Ruby, React/Vue components for frontend, styled layouts for HTML/CSS), file structure, and package.json (e.g., make-readme CLI from bin, React/Next.js/Vue.js rendering). Highlight unique aspects like API key validation, interactive prompts, or UI rendering. For backend projects, focus on server-side functionality (e.g., API endpoints, database integration). For frontend projects, emphasize UI/UX features (e.g., component rendering, styling). Avoid generic phrases like "easy to use" or "customizable." Reference the Architecture Overview if applicable. Omit if fewer than 2 features can be inferred, with a note (e.g., "Features section omitted due to insufficient project details").
8. **Installation**: Provide step-by-step instructions, tailored to project type (${projectType}). Use nested subsections:
   - ### Prerequisites: List requirements (e.g., Node.js ${
     packageInfo.engines.node || ">=14"
   } for backend, none for HTML/CSS). Use \`bash code blocks or narrative text.
   - ### Setup: Include cloning (git clone ${
     remote || "<your-repo-url>"
   }) and dependency installation (e.g., npm install, pip install -r requirements.txt). For fullstack projects, split into:
     - #### Frontend Setup: Commands for frontend (e.g., npm install, npm run dev for Vue.js).
     - #### Backend Setup: Commands for backend (e.g., npm install, node server.js).
   - ### Installation Options: Provide options with sub-subsections:
     - #### Frontend Installation: Global/local commands for frontend (e.g., npm install -g .).
     - #### Backend Installation: Global/local commands for backend (e.g., npm link).
   Use narrative text to clarify mandatory vs. optional steps. Omit if no steps are applicable, with a note.
9. **Usage**: Provide 2-3 executable examples in a subsection:
   - ### Execution Options: List options with sub-subsections:
     - #### Frontend Execution: Commands for frontend (e.g., npm run dev, open index.html).
     - #### Backend Execution: Commands for backend (e.g., node ${
       packageInfo.main
     }, npm run start).
     - #### Global CLI: Global command (e.g., ${
       Object.keys(packageInfo.bin || {})[0] || packageInfo.name
     }) if bin is present.
   Include only the relevant option if only one execution method exists (e.g., only Backend Execution for backend-only projects). Do not list inapplicable options or note "Not applicable." Use narrative text to guide users. Omit if no options, with a note.
10. **Scripts**: List meaningful scripts from package.json.scripts in a \`\`\`bash code block or Markdown table, including their purpose (e.g., npm run start: "Runs the project locally"). Omit the section entirely if no scripts are defined or if scripts only contain uninformative commands (e.g., empty object or scripts filtered out in Project Context). If omitted, include a note (e.g., "Scripts section omitted due to no meaningful scripts defined in package.json; consider adding scripts like 'start' or 'build'"). For non-Node.js projects (e.g., Java, Python, Ruby, PHP, Go, C#, Rust, HTML/CSS, Vue.js), omit this section unless a package.json is present, with a note (e.g., "Scripts section omitted as no package.json is defined").
11. **Contributing**: Provide brief guidelines for contributing, including how to submit issues or pull requests. Keep it simple and welcoming. Omit if no repository information is available, with a note (e.g., "Contributing section omitted due to missing repository details").
12. **Contributors**: Include a section displaying GitHub profile images (60x60 pixels) for contributors in a horizontal line, linked to their GitHub profiles, using the format: <a href="https://github.com/{username}" target="_blank"><img src="https://avatars.githubusercontent.com/{username}?s=60&v=4" width="60" height="60" alt="@{username}" title="@{username}" style="border-radius: 50%;" onerror="this.src='https://github.com/identicons/{username}.png'" /></a>. Use the contributor data provided in Project Context (usernames, names, commit counts). Images should be displayed on a single line with 10px spacing (margin-right). Omit if no contributors are found, with a note (e.g., "Contributors section omitted due to no Git contributors found").
13. **License**: Specify the license from package.json (default to MIT if unknown) or infer from project context (e.g., MIT for Node.js, Apache for Java, GPL for Rust). Include a brief explanation of what it means.
14. **Credits**: Acknowledge the author (${user}) and list only the exact dependencies and devDependencies from package.json (e.g., Node.js, Express, React, Flask, Rails, Laravel) or languages detected from file extensions (e.g., Java, Python, Ruby, PHP, Go, C#, Rust, HTML5, CSS3, Vue.js). Do not include unlisted dependencies. Omit if no dependencies or author information is available, with a note (e.g., "Credits section omitted due to missing dependency or author information").

---

### Additional Guidelines

- **Sample Outputs**: For the custom user request and other relevant sections (e.g., Usage, Features, or new sections created by the custom request), include sample outputs in Markdown code blocks when they would clarify the functionality or usage. Use appropriate language identifiers (e.g., \`\`\`bash, \`\`\`javascript, \`\`\`python) based on the project type and context. Ensure sample outputs are realistic, concise, and directly relevant to the section's content. For example, if the custom request is "add a section listing supported languages," include a sample code snippet demonstrating usage in one of those languages.
- **Project Type**: Tailor content to ${projectType} project. For fullstack, clearly separate frontend/backend in Installation, Usage, Features, and diagrams.
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
}

module.exports = buildPrompt;
