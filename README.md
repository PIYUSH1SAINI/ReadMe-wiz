# ReadMe-wizard

> A command-line tool to generate README files for your projects.  Utilizes code analysis and AI assistance for comprehensive documentation.


## 📚 Table of Contents

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

ReadMe-wizard is a command-line tool built using Node.js that automates the creation of comprehensive README files for software projects.  It leverages code analysis to extract key information from your project's source code and utilizes AI to generate informative descriptions and summaries. The primary use case is to simplify and expedite the README creation process, enhancing project documentation quality and reducing manual effort. The tool's unique value proposition lies in its ability to parse various programming languages and generate detailed documentation, including sections on features, installation, and usage. The `make-readme` command from the `bin` entry in `package.json` executes the core functionality.  Key functions like `generateReadme`, `parseCode`, and `buildPrompt` contribute to the automation process.


## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Inquirer.js](https://img.shields.io/badge/Inquirer.js-e5d717?style=for-the-badge&logo=inquirer.js&logoColor=black)](https://www.npmjs.com/package/inquirer)
[![Chalk](https://img.shields.io/badge/Chalk-D32F2F?style=for-the-badge&logo=chalk&logoColor=white)](https://www.npmjs.com/package/chalk)
[![tree-sitter](https://img.shields.io/badge/tree--sitter-F87171?style=for-the-badge&logo=tree-sitter&logoColor=white)](https://github.com/tree-sitter/tree-sitter)
[![Simple Git](https://img.shields.io/badge/simple--git-5185f7?style=for-the-badge&logo=github&logoColor=white)](https://github.com/steveukx/git-js)
[![Google Generative AI](https://img.shields.io/badge/Google%20Generative%20AI-4285f4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/generative-ai)
[![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git)


## Architecture Overview

```mermaid
graph TD
    A[CLI Input] --> B(promptBuilder);
    B --> C(codeParser);
    C --> D(generateReadme);
    D --> E[README.md Output];
    C --> F(gitUtils);
    F --> D;

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
    J --> K[sample.*];

```

## Features

*   Parses various programming languages (C++, C#, CSS, Go, HTML, Java, Javascript, JSX, PHP, Python, Ruby, Rust, Typescript, TSX, Vue) to extract code information.
*   Generates a structured README.md file including sections for Description, Tech Stack, Installation, Usage, and Contributing.
*   Uses Git integration to extract contributor information and commit history.
*   Provides a customizable prompt-based interface for user input.
*   Supports both simple and detailed README generation.
*   Integrates with Google's Generative AI for enhanced content generation (with API key).

## Installation

### Prerequisites

*   Node.js >=14

### Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/PIYUSH1SAINI/ReadMe-wizard.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd ReadMe-wizard
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```


## Usage

### Execution Options

The primary command is `make-readme`.  A second command allows for a custom user request to be appended to the `make-readme` command. For example:


```bash
make-readme "Add a section on supported languages"
```

This will generate the README file with additional information based on the specified request.


```bash
make-readme
```

This will generate the README file using default settings.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.


## Contributors

<a href="https://github.com/PIYUSH1SAINI" target="_blank"><img src="https://avatars.githubusercontent.com/PIYUSH1SAINI?s=60&v=4" width="60" height="60" alt="@PIYUSH1SAINI" title="@PIYUSH1SAINI" style="border-radius: 50%; margin-right: 10px;" onerror="this.src='https://github.com/identicons/PIYUSH1SAINI.png'" /></a>


## License

MIT License


<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
      <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1753459910/ReadMe-wizard-logo_ouhi2h.png" alt="ReadMe Wizard Logo" width="300"/>
    </a>
