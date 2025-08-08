# ReadMe-wiz

> A command-line tool to generate README files for software projects, leveraging code analysis and Git information.

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

ReadMe-wiz is a command-line tool built with Node.js that automates the creation of professional README files for software projects. It analyzes your project's codebase, extracts relevant information from your Git repository, and uses this data to generate a comprehensive and well-structured README.md file. This streamlines the documentation process, ensuring consistent and informative documentation for all your projects. The core functionality relies on parsing various programming languages (including C++, C#, CSS, Go, HTML, Java, JavaScript, JSX, PHP, Python, Ruby, Rust, TypeScript, and Vue.js) to extract key structural elements like functions, classes, and methods. The `generateReadme` function in `lib/generateReadme.js` orchestrates the process, utilizing other modules like `codeParser` for code analysis and `gitUtils` for Git information retrieval. The `make-readme` command, defined in `package.json`, provides a convenient CLI interface for users.

## Tech Stack

[![Node.js](https://img.shields.io/badge/Node.js-Green?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/) [![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://www.javascript.com/) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![inquirer](https://img.shields.io/badge/inquirer-grey?style=for-the-badge&logo=inquirer&logoColor=white)](https://www.npmjs.com/package/inquirer) [![Chalk](https://img.shields.io/badge/Chalk-white?style=for-the-badge&logo=chalk&logoColor=black)](https://www.npmjs.com/package/chalk) [![tree-sitter](https://img.shields.io/badge/tree--sitter-grey?style=for-the-badge&logo=tree-sitter&logoColor=white)](https://github.com/tree-sitter/tree-sitter) [![C++](https://img.shields.io/badge/C%2B%2B-00599C?style=for-the-badge&logo=c%2B%2B&logoColor=white)](https://isocpp.org/) [![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white)](https://learn.microsoft.com/en-us/dotnet/csharp/) [![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/) [![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev/) [![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/) [![Java](https://img.shields.io/badge/java-%23ED8B00?style=for-the-badge&logo=java&logoColor=white)](https://www.java.com/en/) [![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/) [![Python](https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/) [![Ruby](https://img.shields.io/badge/ruby-CC342D?style=for-the-badge&logo=ruby&logoColor=white)](https://www.ruby-lang.org/en/) [![Rust](https://img.shields.io/badge/rust-%2300599C?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/) [![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/) [![✨ Made with ReadME Wiz](https://img.shields.io/badge/✨%20Made%20with-ReadME%20Wiz-blueviolet?style=for-the-badge&logo=markdown&logoColor=white)](https://github.com/PIYUSH1SAINI/ReadMe-wiz.git)

## Architecture Overview

```mermaid
graph TD
    A[CLI] --> B(generateReadme);
    B --> C(codeParser);
    B --> D(gitUtils);
    B --> E(promptBuilder);
    B --> F(uiHelpers);
    C --> G{Code Files};
    D --> H[Git Repo];
    E --> I[User Prompts];
    F --> J[Console Output];

```

## File Structure

```mermaid
graph TD
    A[ReadMe-wiz] --> B(bin);
    A --> C(lib);
    A --> D(test);
    B --> E["index.js"];
    C --> F["codeParser.js"];
    C --> G["generateReadme.js"];
    C --> H["gitUtils.js"];
    C --> I["promptBuilder.js"];
    C --> J["uiHelpers.js"];
    D --> K["sample.*"];
    A --> L["package.json"];
    A --> M["runParserTests.js"];

```

## Features

- **Automated README Generation:** Creates a comprehensive README.md file based on code and Git information.
- **Multi-Language Support:** Parses code from various programming languages (C++, C#, CSS, Go, HTML, Java, JavaScript, JSX, PHP, Python, Ruby, Rust, TypeScript, Vue.js).
- **Git Integration:** Extracts contributor information and repository details from your Git history.
- **Interactive Prompts:** Guides users through the process with clear prompts for customization.
- **Customizable Output:** Allows for tailoring the generated README to specific project requirements.
- **Command-Line Interface:** Provides a simple and efficient way to generate READMEs via the `make-readme` command.

## Installation

### Prerequisites

> [!NOTE]
> Node.js >=14 and npm are required for ReadMe-wiz. Ensure you have these installed before proceeding.

### Setup

1. **Global CLI Installation**

   ```bash
   npm install -g readme-wiz
   ```

2. **Clone Repository**
   ```bash
   git clone https://github.com/PIYUSH1SAINI/ReadMe-wiz.git
   cd ReadMe-wiz
   npm install
   ```

> [!TIP]
> Use `npm install -g readme-wiz` for the quickest setup.

## Usage

### Execution Options

> [!IMPORTANT]
> Ensure that you have a project directory with code files and a `.git` repository before running ReadMe-wiz.

#### Global CLI Execution

To generate a README.md file, navigate to your project's root directory and run:

```bash
make-readme
```

This command will create or update a README file in the current directory.

The following options are available:

1. **`make-readme`**: This command creates a new README file using default settings. If a README already exists, it will overwrite it.

2. **`make-readme --new`**: This command creates a completely new README file. If a README already exists, it will be overwritten.

3. **`make-readme --new "some user requests"`**: This command creates a new README file incorporating the specified user requests. The requests should be a description of the desired content for the README. If a README already exists, it will be overwritten.

4. **`make-readme "some user requests"`**: This command updates an existing README file with the specified user requests. The requests should be a description of the desired content changes for the README. If no README file exists, a new one will be created.

## Testing

This project includes a test suite for the multilanguage feature. The tests are located in the `test` folder. To run the tests, execute the following command:

```bash
node runParserTests.js
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on GitHub.

## Contributors

<a href="https://github.com/PIYUSH1SAINI" target="_blank"><img src="https://avatars.githubusercontent.com/PIYUSH1SAINI?s=60&v=4" width="60" height="60" alt="@PIYUSH1SAINI" title="@PIYUSH1SAINI" style="border-radius: 50%; margin-right: 10px;" onerror="this.src='https://github.com/identicons/PIYUSH1SAINI.png'" /></a>

## License

MIT License

<a href="https://github.com/PIYUSH1SAINI/ReadMe-wiz.git" target="_blank">
      <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1754320207/ReadMe-wiz-logo_k3uq6w.png" alt="ReadMe Wiz Logo" width="300"/>
    </a>
