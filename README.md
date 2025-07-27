# ReadMe-wizard

> A command-line tool to generate README files using generative AI.

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributors](#contributors)
- [License](#license)


## Description

ReadMe-wizard is a command-line tool built with Node.js that leverages generative AI to create comprehensive README files for software projects.  It simplifies the process of creating well-structured and informative documentation by automating the generation of key sections, including descriptions, features, and installation instructions. The primary use case is to accelerate project onboarding and collaboration by providing high-quality README files without manual effort. Its unique value lies in its ability to adapt to various project contexts and generate customized README content based on project specifics.  The `make-readme` command, defined in `package.json`, executes the main functionality.

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-Green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Inquirer.js](https://img.shields.io/badge/Inquirer.js-Yellow?style=for-the-badge&logo=inquirer.js&logoColor=white)](https://www.npmjs.com/package/inquirer)
[![Google Generative AI](https://img.shields.io/badge/Google%20Generative%20AI-Blue?style=for-the-badge&logo=google&logoColor=white)](https://developers.generativeai.google/)
[![Chalk](https://img.shields.io/badge/Chalk-BlueViolet?style=for-the-badge&logo=chalk&logoColor=white)](https://www.npmjs.com/package/chalk)
[![Figlet](https://img.shields.io/badge/Figlet-LightGray?style=for-the-badge&logo=figlet&logoColor=white)](https://www.npmjs.com/package/figlet)
[![fs-extra](https://img.shields.io/badge/fs--extra-Orange?style=for-the-badge&logo=fs-extra&logoColor=white)](https://www.npmjs.com/package/fs-extra)
[![Globby](https://img.shields.io/badge/Globby-Purple?style=for-the-badge&logo=globby&logoColor=white)](https://www.npmjs.com/package/globby)
[![Ora](https://img.shields.io/badge/Ora-Teal?style=for-the-badge&logo=ora&logoColor=white)](https://www.npmjs.com/package/ora)
[![Prompts](https://img.shields.io/badge/Prompts-Pink?style=for-the-badge&logo=prompts&logoColor=white)](https://www.npmjs.com/package/prompts)
[![Simple-Git](https://img.shields.io/badge/Simple--Git-Cyan?style=for-the-badge&logo=simple-git&logoColor=white)](https://www.npmjs.com/package/simple-git)
[![Tree-Sitter](https://img.shields.io/badge/Tree--Sitter-Lime?style=for-the-badge&logo=tree-sitter&logoColor=white)](https://github.com/tree-sitter/tree-sitter)
[![DotEnv](https://img.shields.io/badge/DotEnv-Brown?style=for-the-badge&logo=dotenv&logoColor=white)](https://www.npmjs.com/package/dotenv)
[![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git)


## Features

*   Generates a README.md file using generative AI.
*   Prompts the user for project details through an interactive CLI interface.
*   Includes sections such as Description, Installation, Usage, and Features.
*   Customizable output based on user input.
*   Supports various programming languages and project types.
*   Uses advanced prompts to tailor the generated content to specific project needs.


## Installation

### Prerequisites

- Node.js >=14

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
