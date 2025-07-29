# ReadMe-wizard

> A command-line tool for generating professional README files using code analysis and AI assistance.

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
- [Contributors](#contributors)
- [License](#license)


## Description

ReadMe-wizard is a backend Node.js command-line application designed to automate the creation of comprehensive README files.  It leverages code analysis to understand project structure and utilizes AI to generate insightful descriptions. The primary use case is streamlining the README generation process, saving developers time and ensuring consistency.  The tool's unique value proposition lies in its ability to validate API keys and intelligently generate sections based on the codebase.  The `make-readme` command, defined in `package.json`, initiates the README generation process.


## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-Green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![Google Generative AI](https://img.shields.io/badge/Google%20Generative%20AI-Blue?style=for-the-badge&logo=google-cloud&logoColor=white)](https://cloud.google.com/generative-ai)
[![Inquirer.js](https://img.shields.io/badge/Inquirer.js-Dark%20Blue?style=for-the-badge&logo=inquirer.js&logoColor=white)](https://github.com/SBoudrias/Inquirer.js)
[![Chalk](https://img.shields.io/badge/Chalk-White?style=for-the-badge&logo=chalk&logoColor=black)](https://github.com/chalk/chalk)
[![✨ Made with ReadME Wizard](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wizard-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wizard.git)


## Architecture Overview

```mermaid
graph TD
    A[CLI Input] --> B(promptBuilder.js);
    B --> C(generateReadme.js);
    C --> D(codeParser.js);
    D --> E(gitUtils.js);
    C --> F(uiHelpers.js);
    C --> G[README Output];

```

## File Structure

```mermaid
graph TD
    A[ReadMe-wizard] --> B(bin/index.js);
    A --> C(lib);
    C --> D(codeParser.js);
    C --> E(generateReadme.js);
    C --> F(gitUtils.js);
    C --> G(promptBuilder.js);
    C --> H(uiHelpers.js);
    A --> I(package.json);

```

## Features

- Parses project code to extract relevant information.
- Uses AI to generate descriptive README sections.
- Interacts with Git to gather commit history and contributor data.
- Provides a user-friendly CLI experience.
- Validates Gemini API keys for AI interaction.
- Generates a well-formatted README.md file.


## Installation

### Prerequisites

- Node.js >=14

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

#### Global CLI

To generate a README file, run:

```bash
make-readme
```
The script will guide you through a series of prompts to customize the README.


## Contributors

<a href="https://github.com/PIYUSH1SAINI"><img src="https://avatars.githubusercontent.com/PIYUSH1SAINI?s=60&v=4" width="60" height="60" alt="@PIYUSH1SAINI" style="border-radius: 50%; margin-right: 10px;" onerror="this.src='https://github.com/identicons/PIYUSH1SAINI.png'" /></a>

## License

MIT License




<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
      <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1753459910/ReadMe-wizard-logo_ouhi2h.png" alt="ReadMe Wizard Logo" width="300"/>
    </a>
