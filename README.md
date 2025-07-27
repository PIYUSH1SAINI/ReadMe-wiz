# ReadMe-wizard

> A CLI tool for generating professional README files using AI.  Effortlessly create comprehensive documentation for your projects.

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
- [Credits](#credits)


## Description

ReadMe-wizard is a command-line interface (CLI) tool designed to automate the creation of high-quality README files for software projects. Leveraging the power of Google's Generative AI, it guides you through an interactive process to gather project information and intelligently generates a comprehensive README.  The tool utilizes functions such as `validateGeminiApiKey` for secure API access and `buildPrompt` for crafting effective prompts for the AI model, ensuring accurate and relevant documentation.  Using the `make-readme` command (defined in `package.json`), you can quickly generate a well-structured README, enhancing your project's clarity and professionalism.

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-Green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![Google Generative AI](https://img.shields.io/badge/Google%20Generative%20AI-Blue?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/generative-ai) [![Chalk](https://img.shields.io/badge/Chalk-Green?style=for-the-badge&logo=chalk&logoColor=white)](https://github.com/chalk/chalk) [![Dotenv](https://img.shields.io/badge/Dotenv-Green?style=for-the-badge&logo=dotenv&logoColor=white)](https://github.com/motdotd/dotenv) [![Figlet](https://img.shields.io/badge/Figlet-Green?style=for-the-badge&logo=figlet&logoColor=white)](https://github.com/patorjk/figlet) [![Fs-extra](https://img.shields.io/badge/Fs--extra-Green?style=for-the-badge&logo=npm&logoColor=white)](https://github.com/jprichardson/node-fs-extra) [![Globby](https://img.shields.io/badge/Globby-Green?style=for-the-badge&logo=npm&logoColor=white)](https://github.com/sindresorhus/globby) [![Inquirer](https://img.shields.io/badge/Inquirer-Green?style=for-the-badge&logo=inquirer&logoColor=white)](https://github.com/enquirer/enquirer) [![Ora](https://img.shields.io/badge/Ora-Green?style=for-the-badge&logo=ora&logoColor=white)](https://github.com/sindresorhus/ora) [![Prompts](https://img.shields.io/badge/Prompts-Green?style=for-the-badge&logo=npm&logoColor=white)](https://github.com/terkelg/prompts) [![Simple Git](https://img.shields.io/badge/Simple%20Git-Green?style=for-the-badge&logo=github&logoColor=white)](https://github.com/steveukx/git-js) [![Tree Sitter](https://img.shields.io/badge/Tree%20Sitter-Green?style=for-the-badge&logo=treesitter&logoColor=white)](https://github.com/tree-sitter/tree-sitter) [![Tree Sitter Javascript](https://img.shields.io/badge/Tree%20Sitter%20Javascript-Green?style=for-the-badge&logo=javascript&logoColor=white)](https://github.com/tree-sitter/tree-sitter-javascript) [![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git)


## Architecture Overview

```mermaid
graph TD
    A[Input] --> B(generateReadme);
    B --> C[AI Prompt];
    C --> D(Google Generative AI);
    D --> E[README Output];
    E --> F[File System];
```

## File Structure

```mermaid
graph TD
    A[.] --> B["lib"];
    B --> C["generateReadme.js"];
    A --> D["bin"];
    D --> E["index.js"];
    A --> F["package.json"];
```

## Features

*   Generates README files using AI-powered content generation.
*   Interactive CLI experience using Inquirer for user input.
*   Parses code using Tree-sitter for code-related insights in the README.
*   Uses Figlet to display ASCII art enhancing the user experience.
*   Provides real-time feedback and progress updates using Ora.
*   Integrates with Git to fetch project information.


## Installation

### Prerequisites

```bash
node >=14
npm
```

### Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/PIYUSH1SAINI/ReadMe-wizard.git
    cd ReadMe-wizard
    ```
2.  Install dependencies:
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

Requires global installation.


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
