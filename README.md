# ReadMe-wizard

> A command-line tool to generate README files using Google's generative AI.

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)


## Description

ReadMe-wizard is a command-line tool built with Node.js that leverages Google's Generative AI to create professional README files.  It simplifies the process of creating comprehensive documentation for software projects by automating the generation of various sections, such as descriptions, features, and installation instructions. The primary use case is to quickly generate a high-quality README, saving developers significant time and effort.  The tool utilizes the `@google/genai` and `@google/generative-ai` packages to access Google's powerful language model for content generation.  The `make-readme` command, defined in `package.json`, provides the user interface for this functionality.


## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Google Generative AI](https://img.shields.io/badge/Google%20Generative%20AI-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/generative-ai)
[![Chalk](https://img.shields.io/badge/Chalk-D8E0E4?style=for-the-badge&logo=chalk&logoColor=black)](https://www.npmjs.com/package/chalk)
[![Inquirer.js](https://img.shields.io/badge/Inquirer.js-95A5A6?style=for-the-badge&logo=inquirer.js&logoColor=white)](https://www.npmjs.com/package/inquirer)
[![Ora](https://img.shields.io/badge/Ora-FEDD02?style=for-the-badge&logo=ora&logoColor=black)](https://www.npmjs.com/package/ora)
[![fs-extra](https://img.shields.io/badge/fs--extra-007bff?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/fs-extra)
[![Globby](https://img.shields.io/badge/Globby-3498DB?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/globby)
[![Dotenv](https://img.shields.io/badge/dotenv-49B8F2?style=for-the-badge&logo=dotenv&logoColor=white)](https://www.npmjs.com/package/dotenv)
[![Figlet](https://img.shields.io/badge/Figlet-2ECC71?style=for-the-badge&logo=figlet&logoColor=white)](https://www.npmjs.com/package/figlet)
[![Prompts](https://img.shields.io/badge/Prompts-9B59B6?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/prompts)
[![Simple Git](https://img.shields.io/badge/simple--git-E74C3C?style=for-the-badge&logo=github&logoColor=white)](https://www.npmjs.com/package/simple-git)
[![Tree-sitter](https://img.shields.io/badge/tree--sitter-2980B9?style=for-the-badge&logo=github&logoColor=white)](https://github.com/tree-sitter/tree-sitter)
[![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git)


## Features

*   Generates a README.md file based on user prompts.
*   Utilizes Google's Generative AI for intelligent content creation.
*   Supports customization of various README sections.
*   Provides a user-friendly command-line interface.
*   Handles various programming languages and project structures.
*   Produces well-formatted and professional README output.


## Installation

### Prerequisites

*   Node.js version >=14

### Setup

```bash
git clone https://github.com/PIYUSH1SAINI/ReadMe-wizard.git
cd ReadMe-wizard
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
node bin/index.js
```

#### Run Globally

```bash
make-readme
```


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.


## License

MIT License


## Credits

PIYUSH1SAINI

@google/genai, @google/generative-ai, chalk, dotenv, figlet, fs-extra, globby, inquirer, ora, prompts, simple-git, tree-sitter, tree-sitter-c-sharp, tree-sitter-cpp, tree-sitter-css, tree-sitter-go, tree-sitter-html, tree-sitter-java, tree-sitter-javascript, tree-sitter-php, tree-sitter-python, tree-sitter-ruby, tree-sitter-rust

## Contributors

<a href="https://github.com/PIYUSH1SAINI" target="_blank">
  <img src="https://github.com/PIYUSH1SAINI.png" width="60" height="60" style="border-radius: 50%; margin-right: 10px;" alt="@PIYUSH1SAINI" title="@PIYUSH1SAINI" />
</a>



<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
<img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1753459910/ReadMe-wizard-logo_ouhi2h.png" alt="ReadMe Wizard Logo" width="300"/>
</a>
