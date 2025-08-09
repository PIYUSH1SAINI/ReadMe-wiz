# ReadMe-wiz

> A command-line tool for generating README files. Utilizes code parsing and prompts to create comprehensive documentation.

[![Version](https://img.shields.io/npm/v/readme-wiz?style=for-the-badge)](https://www.npmjs.com/package/readme-wiz)
[![License](https://img.shields.io/npm/l/readme-wiz?style=for-the-badge)](https://github.com/PIYUSH1SAINI/ReadMe-wiz)
[![Downloads](https://img.shields.io/npm/dm/readme-wiz?style=for-the-badge)](https://www.npmjs.com/package/readme-wiz)
[![GitHub Stars](https://img.shields.io/github/stars/PIYUSH1SAINI/ReadMe-wiz?style=for-the-badge)](https://github.com/PIYUSH1SAINI/ReadMe-wiz)

## 📚 Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Contributors](#contributors)
- [License](#license)

## Description

ReadMe-wiz is a command-line tool designed to simplify the process of generating comprehensive README files for software projects. It leverages code parsing capabilities to extract key information from your project's source code, then uses prompts to gather additional details and generate a polished README.md. The `make-readme` CLI command, defined in the `package.json` file, provides a user-friendly interface for generating READMEs. The tool supports a wide range of programming languages, demonstrated by its ability to parse various file types in the test directory. Key functions like `generateReadme` and `parseCode` highlight its core functionality.

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Inquirer.js](https://img.shields.io/badge/Inquirer.js-e36913?style=for-the-badge&logo=inquirer.js&logoColor=white)](https://www.npmjs.com/package/inquirer)
[![Chalk](https://img.shields.io/badge/Chalk-D32323?style=for-the-badge&logo=chalk&logoColor=white)](https://www.npmjs.com/package/chalk)
[![Tree-sitter](https://img.shields.io/badge/Tree--sitter-007ACC?style=for-the-badge&logo=treeritter&logoColor=white)](https://tree-sitter.github.io/)
[![Google Generative AI](https://img.shields.io/badge/Google%20Generative%20AI-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/vertex-ai/generative-ai)
[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://www.javascript.com/)
[![C++](https://img.shields.io/badge/c%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)](https://isocpp.org/)
[![C#](https://img.shields.io/badge/c%23-5C2D91?style=for-the-badge&logo=c-sharp&logoColor=white)](https://learn.microsoft.com/en-us/dotnet/csharp/)
[![CSS](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![Go](https://img.shields.io/badge/go-%2300ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/)
[![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![Java](https://img.shields.io/badge/java-%23ED8B00?style=for-the-badge&logo=java&logoColor=white)](https://www.java.com/)
[![PHP](https://img.shields.io/badge/php-%23777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![Python](https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Ruby](https://img.shields.io/badge/ruby-%23CC342B?style=for-the-badge&logo=ruby&logoColor=white)](https://www.ruby-lang.org/en/)
[![Rust](https://img.shields.io/badge/rust-%2300599C?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vue.js](https://img.shields.io/badge/vue-%2341B883?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![✨ Made with ReadME Wiz](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wiz-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wiz.git)

## Architecture Overview

```mermaid
graph TD
    A[PromptBuilder] --> B(generateReadme);
    C[codeParser] --> B;
    D[gitUtils] --> B;
    E[uiHelpers] --> A;
    B --> F[README.md];

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
    J --> K["sample.*"];

```

## Features

- Parses various programming languages (C++, C#, CSS, Go, HTML, Java, JavaScript, JSX, PHP, Python, Ruby, Rust, TypeScript, TSX, Vue) to extract code information.
- Generates a README.md file based on parsed code and user input.
- Uses prompts to guide the user through the README creation process.
- Utilizes Git integration to fetch contributor information.
- Supports API key validation (for example, `validateGeminiApiKey`).
- Provides a user-friendly CLI interface via `make-readme`.

## Installation

### Prerequisites

> [!NOTE]
> Node.js >=14 is required for compatibility. Ensure you have Node.js and npm installed.

### Setup

1.  **Global CLI Installation**: Install the CLI tool globally.

    ```bash
    npm install -g readme-wiz
    ```

2.  **Clone Repository**: Clone the repository and install dependencies.
    ```bash
    git clone https://github.com/PIYUSH1SAINI/ReadMe-wiz.git
    cd ReadMe-wiz
    npm install
    ```

> [!TIP]
> Use `npm install -g readme-wiz` for the quickest setup.

## Usage

### Execution Options

#### Global CLI

> [!IMPORTANT]
> Ensure that you have cloned the repository and run `npm install` before using the CLI.

To generate a README, simply run:

```bash
make-readme
```

The following options are available:

| Command             | Description                                                                          |
|----------------------|--------------------------------------------------------------------------------------|
| `make-readme`        | Creates a new README file using default settings. Overwrites existing README.       |
| `make-readme --new`  | Creates a completely new README file. Overwrites existing README.                    |
| `make-readme --new "some user requests"` | Creates a new README file incorporating specified user requests. Overwrites existing README. |
| `make-readme "some user requests"` | Updates an existing README file with specified user requests. Creates a new one if none exists. |


## Testing

This project includes a test suite for the multilanguage feature. The tests are located in the `test` folder. To run the tests, execute the following command:

```bash
node runParserTests.js
```

## Contributors

<a href="https://github.com/PIYUSH1SAINI" target="_blank"><img src="https://avatars.githubusercontent.com/PIYUSH1SAINI?s=60&v=4" width="60" height="60" alt="@PIYUSH1SAINI" title="@PIYUSH1SAINI" style="border-radius: 50%; margin-right: 10px;" onerror="this.src='https://github.com/identicons/PIYUSH1SAINI.png'" /></a>

## License

MIT License

This software is licensed under the MIT License. See the LICENSE file for details.

<a href="https://github.com/PIYUSH1SAINI/ReadMe-wiz.git" target="_blank">
      <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1754320207/ReadMe-wiz-logo_k3uq6w.png" alt="ReadMe Wiz Logo" width="300"/>
    </a>
