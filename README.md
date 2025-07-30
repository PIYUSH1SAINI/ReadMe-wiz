# ReadMe-wizard

> A CLI tool to generate README files for software projects using interactive prompts and code analysis.

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
    - [Global CLI](#global-cli)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)


## Description

ReadMe-wizard is a command-line interface (CLI) tool built with Node.js that simplifies the process of creating comprehensive README files for software projects.  It leverages interactive prompts to gather project information and utilizes code analysis to automatically generate sections such as a project description and features list.  The tool validates Gemini API keys (if provided), ensuring proper configuration before generating the final README.md file. Its primary use case is automating the tedious task of README creation, significantly reducing development overhead.


## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-Green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Inquirer.js](https://img.shields.io/badge/Inquirer.js-Blue?style=for-the-badge&logo=inquirer.js&logoColor=white)](https://www.npmjs.com/package/inquirer)
[![Chalk](https://img.shields.io/badge/Chalk-White?style=for-the-badge&logo=chalk&logoColor=black)](https://www.npmjs.com/package/chalk)
[![Figlet](https://img.shields.io/badge/Figlet-White?style=for-the-badge&logo=figlet&logoColor=black)](https://www.npmjs.com/package/figlet)
[![fs-extra](https://img.shields.io/badge/fs--extra-Orange?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/fs-extra)
[![Globby](https://img.shields.io/badge/Globby-Purple?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/globby)
[![Ora](https://img.shields.io/badge/Ora-Yellow?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/ora)
[![Prompts](https://img.shields.io/badge/Prompts-Pink?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/prompts)
[![Simple Git](https://img.shields.io/badge/Simple%20Git-Cyan?style=for-the-badge&logo=github&logoColor=white)](https://www.npmjs.com/package/simple-git)
[![Tree-sitter](https://img.shields.io/badge/Tree--sitter-Grey?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tree-sitter/tree-sitter)
[![Google Generative AI](https://img.shields.io/badge/Google%20Generative%20AI-Green?style=for-the-badge&logo=google&logoColor=white)](https://cloud.google.com/generative-ai)
[![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git)


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
    A[bin] --> B{index.js};
    A --> C[lib];
    C --> D{codeParser.js};
    C --> E{generateReadme.js};
    C --> F{gitUtils.js};
    C --> G{promptBuilder.js};
    C --> H{uiHelpers.js};
    A --> I[package.json];

```

## Features

*   Interactive prompts for gathering project information.
*   Code analysis to automatically populate README sections.
*   Gemini API key validation for enhanced functionality.
*   Generation of a comprehensive README.md file.
*   Support for various programming languages through tree-sitter integration.
*   User-friendly CLI experience.

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

#### Global CLI

To generate a README file, run the following command:

```bash
make-readme
```

The tool will guide you through a series of interactive prompts to gather the necessary information for your README.


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Contributors

<a href="https://github.com/PIYUSH1SAINI" target="_blank"><img src="https://avatars.githubusercontent.com/PIYUSH1SAINI?s=60&v=4" width="60" height="60" alt="@PIYUSH1SAINI" title="@PIYUSH1SAINI" style="border-radius: 50%; margin-right: 10px;" onerror="this.src='https://github.com/identicons/PIYUSH1SAINI.png'" /></a>

## License

MIT License


<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
      <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1753459910/ReadMe-wizard-logo_ouhi2h.png" alt="ReadMe Wizard Logo" width="300"/>
    </a>
