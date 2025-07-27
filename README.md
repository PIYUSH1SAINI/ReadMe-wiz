# ReadMe-wizard

> A CLI tool to generate README files using Google's Generative AI.

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)


## Description

ReadMe-wizard is a command-line interface (CLI) tool built with Node.js that leverages Google's Generative AI to automatically generate comprehensive README files for software projects.  It analyzes project files, extracts key information, and uses AI to create a well-structured and informative README. This simplifies the documentation process for developers, saving them valuable time and effort. The primary use case is automating the creation of high-quality README files, and its unique value lies in its ability to intelligently synthesize project details and generate human-readable descriptions, thanks to functions like `validateGeminiApiKey`, `getGitInfo`, `getProjectFiles`, `parseCode`, `summarizeTree`, `buildPrompt`, and the core `generateReadme` function. The `make-readme` command, defined in the `package.json`, provides a convenient way to utilize the tool.

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![Google Generative AI](https://img.shields.io/badge/Google%20Generative%20AI-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/generative-ai) [![Chalk](https://img.shields.io/badge/Chalk-D32323?style=for-the-badge&logo=chalk&logoColor=white)](https://github.com/chalk/chalk) [![Inquirer.js](https://img.shields.io/badge/Inquirer.js-000000?style=for-the-badge&logo=inquirer.js&logoColor=white)](https://github.com/SBoudrias/Inquirer.js) [![Ora](https://img.shields.io/badge/Ora-FFD700?style=for-the-badge&logo=ora&logoColor=white)](https://github.com/sindresorhus/ora) [![Prompts](https://img.shields.io/badge/Prompts-26A9E0?style=for-the-badge&logo=prompts&logoColor=white)](https://github.com/terkelg/prompts) [![Simple Git](https://img.shields.io/badge/Simple%20Git-282C34?style=for-the-badge&logo=simple-git&logoColor=white)](https://github.com/steveukx/git-js) [![fs-extra](https://img.shields.io/badge/fs--extra-A1B56C?style=for-the-badge&logo=fs-extra&logoColor=white)](https://github.com/jprichardson/node-fs-extra) [![Globby](https://img.shields.io/badge/Globby-795548?style=for-the-badge&logo=globby&logoColor=white)](https://github.com/sindresorhus/globby) [![Tree-sitter](https://img.shields.io/badge/Tree--sitter-333333?style=for-the-badge&logo=tree-sitter&logoColor=white)](https://github.com/tree-sitter/tree-sitter) [![Dotenv](https://img.shields.io/badge/dotenv-007bff?style=for-the-badge&logo=dotenv&logoColor=white)](https://github.com/motdotd/dotenv) [![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git)


## Architecture Overview

```mermaid
graph TD
    A[CLI Input] --> B(generateReadme);
    B --> C{Google Generative AI};
    C --> D[README.md Output];
    B --> E[getProjectFiles];
    E --> F[File System];
    B --> G[parseCode];
    G --> H[Tree-sitter];
    B --> I[getGitInfo];
    I --> J[Git Repository];
    B --> K[buildPrompt];
    K --> C;

```

## File Structure

```mermaid
graph TD
    A[ReadMe-wizard] --> B(bin);
    B --> C[index.js];
    A --> D(lib);
    D --> E[generateReadme.js];
    A --> F[package.json];
    
```

## Features

* **Generative AI Integration:** Leverages Google's Generative AI for intelligent README content creation.
* **Project File Analysis:** Parses project files to extract key information such as file structure, code snippets, and dependencies.
* **Git Integration:** Retrieves project information from the Git repository.
* **Customizable Prompts:** Allows for fine-tuning the generated README content through customizable prompts.
* **API Key Validation:** Ensures the provided Gemini API key is valid before proceeding.
* **CLI Interface:** Provides a user-friendly command-line interface for easy operation.

## Installation

### Prerequisites

* Node.js version >=14

```bash
node -v
```

### Setup

1. Clone the repository:

```bash
git clone https://github.com/PIYUSH1SAINI/ReadMe-wizard.git
cd ReadMe-wizard
```

2. Install dependencies:

```bash
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


## Usage

### Execution Options

#### Run Locally

```bash
node lib/generateReadme.js
```

#### Run Globally

```bash
make-readme
```


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT License




<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
<img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1753459910/ReadMe-wizard-logo_ouhi2h.png" alt="ReadMe Wizard Logo" width="300"/>
</a>
