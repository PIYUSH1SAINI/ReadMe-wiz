# ReadMe-wiz

> A command-line tool to generate README files for software projects, analyzing code and leveraging AI.

## 📚 Table of Contents

- [Description](#description)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
- [Usage](#usage)
  - [Execution Options](#execution-options)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [File Structure](#file-structure)
- [Features](#features)
- [Testing](#testing)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)

## Description

ReadMe-wiz is a command-line tool built with Node.js that simplifies the process of creating professional README files for software projects. It leverages AI to generate comprehensive documentation by analyzing your project's codebase, including various programming languages, HTML, CSS, and Vue.js components. Using the `make-readme` command, developers can quickly generate a high-quality README file, saving time and ensuring consistency across projects. The core functionality relies on parsing the project files to extract key information and then utilizes AI to structure and generate the README content. The `validateGeminiApiKey` function, for instance, ensures secure API usage.


## Installation

### Prerequisites

- Node.js >=14

### Setup

1.  Install via npm:
    ```bash
    npm install -g readme-wiz
    ```

2.  You can then use the `make-readme` command as described in the Usage section.


## Usage

### Execution Options

#### Global CLI

To generate a README file for your project, run:

```bash
make-readme
```

This command will create or update a README file in the current directory.

The following options are available:

1. **`make-readme`**: This command creates a new README file using default settings. If a README already exists, it will overwrite it.

2. **`make-readme --new`**: This command creates a completely new README file. If a README already exists, it will be overwritten.

3. **`make-readme --new "some user requests"`**: This command creates a new README file incorporating the specified user requests. The requests should be a description of the desired content for the README. If a README already exists, it will be overwritten.

4. **`make-readme "some user requests"`**: This command updates an existing README file with the specified user requests. The requests should be a description of the desired content changes for the README. If no README file exists, a new one will be created.

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://www.javascript.com/) [![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![C++](https://img.shields.io/badge/c%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)](https://www.cplusplus.com/) [![C#](https://img.shields.io/badge/c%23-%23239120.svg?style=for-the-badge&logo=c-sharp&logoColor=white)](https://learn.microsoft.com/en-us/dotnet/csharp/) [![Go](https://img.shields.io/badge/go-%2300ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/) [![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/) [![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/) [![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/) [![Python](https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/) [![Ruby](https://img.shields.io/badge/ruby-CC342B?style=for-the-badge&logo=ruby&logoColor=white)](https://www.ruby-lang.org/en/) [![Rust](https://img.shields.io/badge/rust-%2300599C.svg?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/) [![Vue.js](https://img.shields.io/badge/vue-%2341B883.svg?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/) [![✨ Made with ReadME Wiz](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wiz-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wiz.git)

## Architecture Overview

```mermaid
graph TD
    A[Code Parser] --> B(README Generator);
    C[Prompt Builder] --> B;
    D[Git Utils] --> B;
    E[UI Helpers] --> A;
```

## File Structure

```mermaid
graph TD
    A[package.json] --> B{lib};
    B --> C[codeParser.js];
    B --> D[generateReadme.js];
    B --> E[gitUtils.js];
    B --> F[promptBuilder.js];
    B --> G[uiHelpers.js];
    A --> H{bin};
    H --> I[index.js];
    A --> J{test};
```

## Features

- Parses code from various languages (C++, C#, Go, HTML, Java, JavaScript, JSX, PHP, Python, Ruby, Rust, TypeScript, TSX, Vue.js) to extract relevant information.
- Generates a structured README.md file including sections like Description, Tech Stack, and Installation.
- Utilizes AI for enhanced content generation and improved readability.
- Supports Git integration to extract contributor information.
- Provides a user-friendly command-line interface (`make-readme`).
- Includes API key validation for secure usage.

## Testing

This project includes a test suite for the multilanguage feature. The tests are located in the `test` folder. To run the tests, execute the following command:

```bash
node runParserTests.js
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Contributors

<a href="https://github.com/PIYUSH1SAINI" target="_blank"><img src="https://avatars.githubusercontent.com/PIYUSH1SAINI?s=60&v=4" width="60" height="60" alt="@PIYUSH1SAINI" title="@PIYUSH1SAINI" style="border-radius: 50%; margin-right: 10px;" onerror="this.src='https://github.com/identicons/PIYUSH1SAINI.png'" /></a>

## License

MIT License

<a href="https://github.com/PIYUSH1SAINI/ReadMe-wiz.git" target="_blank">
      <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1754320207/ReadMe-wiz-logo_k3uq6w.png" alt="ReadMe Wiz Logo" width="300"/>
    </a>
