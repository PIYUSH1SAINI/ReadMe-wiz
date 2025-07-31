# ReadMe-wizard

> A CLI tool to generate README files for software projects.  Parses code and utilizes AI to generate a comprehensive README.

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [Features](#features)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Usage](#usage)
  - [Execution Options](#execution-options)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)


## Description

ReadMe-wizard is a command-line tool built with Node.js that automates the creation of comprehensive README files for software projects. It leverages AI through the `@google/generative-ai` library to generate descriptions and summarizes codebases. The tool parses various programming languages (including C++, C#, CSS, Go, HTML, Java, JavaScript, JSX, PHP, Python, Ruby, Rust, TypeScript, and Vue.js) to extract key information, such as functions, classes, and methods.  The generated READMEs are designed to be informative and user-friendly, suitable for both technical and non-technical audiences.  The `make-readme` command from the CLI facilitates the generation of these README files.

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-Green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![Inquirer.js](https://img.shields.io/badge/Inquirer.js-Blue?style=for-the-badge&logo=inquirer.js&logoColor=white)](https://www.npmjs.com/package/inquirer) [![Google Generative AI](https://img.shields.io/badge/Google%20Generative%20AI-Blue?style=for-the-badge&logo=google&logoColor=white)](https://developers.generativeai.google/) [![Chalk](https://img.shields.io/badge/Chalk-Yellow?style=for-the-badge&logo=chalk&logoColor=white)](https://www.npmjs.com/package/chalk) [![Tree-sitter](https://img.shields.io/badge/Tree--sitter-Purple?style=for-the-badge&logo=treesitter&logoColor=white)](https://github.com/tree-sitter/tree-sitter) [![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git)


## Architecture Overview

```mermaid
graph TD
    A[Code Parser] --> B(Generate Readme);
    C[Prompt Builder] --> B;
    D[Git Utils] --> B;
    E[UI Helpers] --> A;
    F[runParserTests] --> A;

```

## File Structure

```mermaid
graph TD
    A[package.json] --> B(bin);
    B --> C[index.js];
    A --> D(lib);
    D --> E[codeParser.js];
    D --> F[generateReadme.js];
    D --> G[gitUtils.js];
    D --> H[promptBuilder.js];
    D --> I[uiHelpers.js];
    A --> J(test);
    J --> K[sample files];

```

## Features

* **Multi-language Support:** Parses code from various languages (C++, C#, CSS, Go, HTML, Java, JavaScript, JSX, PHP, Python, Ruby, Rust, TypeScript, Vue.js).
* **AI-Powered Description Generation:** Leverages AI to create concise and informative project descriptions.
* **Git Integration:** Extracts contributor information and commit counts directly from Git repositories.
* **Interactive Prompts:** Uses Inquirer.js for interactive prompts during README generation.
* **Code Summarization:** Provides a summary of the project's code structure.
* **Customizable Output:** Allows for tailoring the generated README.


## Installation

### Prerequisites

* Node.js >=14

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/PIYUSH1SAINI/ReadMe-wizard.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ReadMe-wizard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Execution Options

#### Global CLI Execution:

To generate a README, run the following command from your project's root directory (ensure you have installed the package globally using `npm install -g .`):


```bash
make-readme
```

This will prompt you for the necessary information and generate a README.md file.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Contributors

<a href="https://github.com/PIYUSH1SAINI" target="_blank"><img src="https://avatars.githubusercontent.com/PIYUSH1SAINI?s=60&v=4" width="60" height="60" alt="@PIYUSH1SAINI" title="@PIYUSH1SAINI" style="border-radius: 50%; margin-right: 10px;" onerror="this.src='https://github.com/identicons/PIYUSH1SAINI.png'" /></a>

## License

MIT License




<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
      <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1753459910/ReadMe-wizard-logo_ouhi2h.png" alt="ReadMe Wizard Logo" width="300"/>
    </a>
