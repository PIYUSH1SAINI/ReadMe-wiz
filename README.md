# ReadMe-wizard

> A command-line tool to generate README files using interactive prompts and code analysis.

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributors](#contributors)
- [License](#license)


## Description

ReadMe-wizard is a command-line tool built with Node.js that simplifies the creation of comprehensive README files.  It leverages interactive prompts to gather project information and analyzes your codebase to automatically generate sections such as project description and file structure. This tool streamlines the README creation process, ensuring consistent and informative documentation for your projects. The primary use case is automating the generation of high-quality README files, offering significant time savings for developers.  The unique value proposition lies in its combination of interactive prompts and code parsing capabilities to produce detailed and accurate README content.  The `make-readme` CLI command, defined in the `package.json`, provides the primary entry point to the application. Functions like `generateReadme` and `parseCode` play crucial roles in this process.

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-Green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![Inquirer.js](https://img.shields.io/badge/Inquirer.js-Yellow?style=for-the-badge&logo=javascript&logoColor=white)](https://www.npmjs.com/package/inquirer) [![Chalk](https://img.shields.io/badge/Chalk-White?style=for-the-badge&logo=javascript&logoColor=black)](https://www.npmjs.com/package/chalk) [![Figlet](https://img.shields.io/badge/Figlet-Orange?style=for-the-badge&logo=javascript&logoColor=white)](https://www.npmjs.com/package/figlet) [![fs-extra](https://img.shields.io/badge/fs--extra-Purple?style=for-the-badge&logo=javascript&logoColor=white)](https://www.npmjs.com/package/fs-extra) [![Globby](https://img.shields.io/badge/Globby-Blue?style=for-the-badge&logo=javascript&logoColor=white)](https://www.npmjs.com/package/globby) [![Ora](https://img.shields.io/badge/Ora-Green?style=for-the-badge&logo=javascript&logoColor=white)](https://www.npmjs.com/package/ora) [![Prompts](https://img.shields.io/badge/Prompts-Blue?style=for-the-badge&logo=javascript&logoColor=white)](https://www.npmjs.com/package/prompts) [![Simple-Git](https://img.shields.io/badge/Simple--Git-Purple?style=for-the-badge&logo=javascript&logoColor=white)](https://www.npmjs.com/package/simple-git) [![Tree-sitter](https://img.shields.io/badge/Tree--sitter-Orange?style=for-the-badge&logo=javascript&logoColor=white)](https://www.npmjs.com/package/tree-sitter) [![Google Generative AI](https://img.shields.io/badge/Google%20Generative%20AI-Blue?style=for-the-badge&logo=google&logoColor=white)](https://developers.generativeai.google/) [![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git)


## Architecture Overview

```mermaid
graph TD
    A[PromptBuilder] --> B(generateReadme);
    C[codeParser] --> B;
    D[gitUtils] --> B;
    E[uiHelpers] --> A;
    B --> F[Output README];
```

## File Structure

```mermaid
graph TD
    A[ReadMe-wizard] --> B(bin);
    A --> C(lib);
    C --> D(codeParser.js);
    C --> E(generateReadme.js);
    C --> F(gitUtils.js);
    C --> G(promptBuilder.js);
    C --> H(uiHelpers.js);
    A --> I(package.json);

```

## Features

*   **Interactive Prompts:** Guides users through a series of prompts to gather essential project details.
*   **Code Analysis:** Parses project files to automatically extract information about the codebase.
*   **Git Integration:** Retrieves information about the project's Git repository, including contributors.
*   **README Generation:** Dynamically generates a comprehensive README file based on gathered information.
*   **Customizable Output:** Allows users to tailor the generated README to their specific needs.
*   **Cross-Platform Compatibility:** Works seamlessly across different operating systems.


## Installation

### Prerequisites

*   Node.js >=14

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


## Contributors

<a href="https://github.com/PIYUSH1SAINI" target="_blank"><img src="https://avatars.githubusercontent.com/PIYUSH1SAINI?s=60&v=4" width="60" height="60" alt="@PIYUSH1SAINI" title="@PIYUSH1SAINI" style="border-radius: 50%; margin-right: 10px;" onerror="this.src='https://github.com/identicons/PIYUSH1SAINI.png'" /></a>


## License

MIT License


<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
      <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1753459910/ReadMe-wizard-logo_ouhi2h.png" alt="ReadMe Wizard Logo" width="300"/>
    </a>
