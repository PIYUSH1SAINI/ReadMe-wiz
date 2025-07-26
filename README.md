# ReadMe-wizard

> A CLI tool for generating professional READMEs using AI, powered by Google Generative AI.  Easily create comprehensive documentation with interactive prompts and code analysis.

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)


## Description

ReadMe-wizard is a command-line interface (CLI) tool designed to streamline the process of creating high-quality README files for software projects. It leverages Google Generative AI to generate comprehensive documentation based on your project's codebase and interactive prompts.  The tool offers an interactive setup experience enhanced with ASCII art and real-time feedback, ensuring a user-friendly and efficient workflow. Key features include automatic extraction of project information via `getGitInfo` and code parsing with `parseCode`, followed by the creation of a compelling prompt using `buildPrompt` for the AI model, and ultimately, generating the README using `generateReadme`. The `validateGeminiApiKey` function ensures proper authentication with the Gemini AI API.  The `make-readme` command, defined in the `package.json` file, provides convenient access to the CLI functionality.

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-Green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![Google Generative AI](https://img.shields.io/badge/Google%20Generative%20AI-Blue?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/generative-ai) [![Simple Git](https://img.shields.io/badge/Simple%20Git-Blue?style=for-the-badge)](https://www.npmjs.com/package/simple-git) [![Tree Sitter](https://img.shields.io/badge/Tree%20Sitter-Blue?style=for-the-badge)](https://github.com/tree-sitter/tree-sitter) [![Chalk](https://img.shields.io/badge/Chalk-Green?style=for-the-badge)](https://github.com/chalk/chalk) [![Figlet](https://img.shields.io/badge/Figlet-Blue?style=for-the-badge)](https://www.npmjs.com/package/figlet) [![Inquirer](https://img.shields.io/badge/Inquirer-Blue?style=for-the-badge)](https://www.npmjs.com/package/inquirer) [![Ora](https://img.shields.io/badge/Ora-Green?style=for-the-badge)](https://www.npmjs.com/package/ora) [![fs-extra](https://img.shields.io/badge/fs-extra-Blue?style=for-the-badge)](https://www.npmjs.com/package/fs-extra) [![Globby](https://img.shields.io/badge/Globby-Blue?style=for-the-badge)](https://www.npmjs.com/package/globby) [![Dotenv](https://img.shields.io/badge/Dotenv-Blue?style=for-the-badge)](https://www.npmjs.com/package/dotenv) [![Prompts](https://img.shields.io/badge/Prompts-Blue?style=for-the-badge)](https://www.npmjs.com/package/prompts) [![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git)


## Architecture Overview

```mermaid
graph TD
    A[getProjectFiles] --> B(parseCode);
    B --> C(summarizeTree);
    C --> D(buildPrompt);
    D --> E[generateReadme];
    A --> F[getGitInfo];
    F --> D;
```

## File Structure

```mermaid
graph TD
    A[ReadMe-wizard] --> B(bin);
    A --> C(lib);
    C --> D[generateReadme.js];
    B --> E[index.js];
    A --> F[package.json];

```

## Features

*   Generates READMEs using Google Generative AI.
*   Interactive setup with Inquirer for customizable prompts.
*   Parses project files using Tree-sitter for code analysis.
*   Includes ASCII art using Figlet for a visually appealing experience.
*   Provides real-time feedback during the generation process using Ora.
*   Integrates with Git repositories using Simple Git to extract project information.


## Installation

### Prerequisites

```bash
# Ensure Node.js >=14 is installed.  Check with:
node -v
```

### Setup

```bash
# Clone the repository:
git clone https://github.com/PIYUSH1SAINI/ReadMe-wizard.git
cd ReadMe-wizard
# Install dependencies:
npm install
```

### Installation Options

#### Production (Global)

```bash
npm install -g .
```

#### Development (Local)

```bash
npm link
```
Complete Setup steps first, then choose one installation option.


## Usage

### Execution Options

#### Run Locally

```bash
node lib/generateReadme.js
```
For testing without global installation.


#### Run Globally

```bash
make-readme
```
This requires global installation (see Production Installation above).


## Scripts

```bash
{
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License

## Credits

PIYUSH1SAINI

@google/genai, @google/generative-ai, chalk, dotenv, figlet, fs-extra, globby, inquirer, ora, prompts, simple-git, tree-sitter, tree-sitter-javascript

    

<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
    <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1753459910/ReadMe-wizard-logo_ouhi2h.png" alt="ReadMe Wizard Logo" width="300"/>
    </a>
