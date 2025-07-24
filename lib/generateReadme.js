const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");

const generateReadme = async () => {
  const cwd = process.cwd();
  const pkgPath = path.join(cwd, "package.json");
  let pkg = {};

  if (fs.existsSync(pkgPath)) {
    pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  }

  const { title, description, usage, install, license, author } =
    await inquirer.prompt([
      {
        name: "title",
        message: "Project Title:",
        default: pkg.name || "My Project",
      },
      {
        name: "description",
        message: "Project Description:",
        default: pkg.description || "",
      },
      {
        name: "install",
        message: "Installation Command:",
        default: "npm install",
      },
      { name: "usage", message: "Usage Instructions:", default: "npm start" },
      { name: "license", message: "License:", default: pkg.license || "MIT" },
      { name: "author", message: "Author Name:", default: pkg.author || "" },
    ]);

  const content = `# ${title}

## 📖 Description
${description}

## 🚀 Installation
\`\`\`bash
${install}
\`\`\`

## 💻 Usage
\`\`\`bash
${usage}
\`\`\`

## 📦 Scripts
${
  pkg.scripts
    ? Object.entries(pkg.scripts)
        .map(([key, value]) => `- \`${key}\`: \`${value}\``)
        .join("\n")
    : "No scripts defined."
}

## 📁 Project Structure
\`\`\`bash
${getFileTree(cwd)}
\`\`\`

## 🧾 License
${license}

## 👤 Author
${author}
`;

  fs.writeFileSync(path.join(cwd, "README.md"), content);
  console.log(chalk.green("\n✅ README.md generated successfully!"));
};

function getFileTree(dir, indent = "") {
  const entries = fs.readdirSync(dir);
  return entries
    .filter((entry) => !["node_modules", ".git"].includes(entry))
    .map((entry) => {
      const fullPath = path.join(dir, entry);
      const isDir = fs.statSync(fullPath).isDirectory();
      return isDir
        ? `${indent}├── ${entry}/\n${getFileTree(fullPath, indent + "│   ")}`
        : `${indent}├── ${entry}`;
    })
    .join("\n");
}

module.exports = generateReadme;
