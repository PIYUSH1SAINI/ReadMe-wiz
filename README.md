


<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
  <img src="https://raw.githubusercontent.com/PIYUSH1SAINI/ReadMe-wizard/refs/heads/main/ReadMe-wizard-logo.png?token=GHSAT0AAAAAADGBCSQVTLERT4EGN774JVGC2EDQQDA" alt="ReadMe Wizard Logo" width="300"/>
</a>

# ⚡ ReadMe-wizard

> A command-line tool to generate README.md files based on project structure and code analysis.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)


## 📚 Table of Contents

- [⚙️ Features](#️-features)
- [🧱 Project Structure](#-project-structure)
- [🚀 Installation & Usage](#-installation--usage)
- [🧪 Code Overview](#-code-overview)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)


---

## ⚙️ Features

* **Automated README Generation:** Creates a comprehensive README.md file based on your project's code and structure.
* **Code Analysis:**  Analyzes JavaScript code to extract function names and descriptions (currently basic, could be enhanced with more sophisticated parsing).
* **Project Structure Recognition:** Identifies key project files and folders.
* **Customizable Template:** Uses a template to ensure consistency and structure.  The template can be easily modified.
* **CLI Interface:**  Easy to use via the command line.


---

## 🧱 Project Structure

```
ReadMe-wizard/
├── bin/
│   └── index.js       // Main entry point for the CLI application
└── lib/
    └── generateReadme.js // Core logic for README generation
```

---

## 🚀 Installation & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/[YOUR_GITHUB_USERNAME]/ReadMe-wizard.git
   cd ReadMe-wizard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the script:**  (Currently, this requires a pre-defined template; future iterations will allow for more flexibility)

   ```bash
   node bin/index.js
   ```

   This will generate a `README.md` file in the current directory.  Further options for customizing the output (e.g., specifying a different output file) will be added in future releases.


---

## 🧪 Code Overview

The core logic resides in `lib/generateReadme.js`. This module contains the following functions:

* **`getGitInfo()`:** Extracts basic Git information (author, repository URL - currently placeholder).  This needs to be implemented to retrieve actual information.
* **`getProjectFiles()`:** Lists the files and folders in the project directory.
* **`parseCode()`:** Performs a basic analysis of the JavaScript files to identify functions (currently very rudimentary;  consider using a proper AST parser for more robust analysis).
* **`summarizeTree()`:** Organizes project files into a structured format suitable for README generation.
* **`buildPrompt()`:**  (To be implemented)  Constructs prompts for user input to customize the README.
* **`generateReadme()`:**  Uses the extracted information and a template to generate the README.md file.


---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.  Before contributing, please ensure you have read and followed our [CONTRIBUTING.md](CONTRIBUTING.md) guidelines (this file needs to be created).


---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. (This LICENSE file should be created.)



<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
  <img src="https://raw.githubusercontent.com/PIYUSH1SAINI/ReadMe-wizard/refs/heads/main/ReadMe-wizard-logo.png?token=GHSAT0AAAAAADGBCSQVTLERT4EGN774JVGC2EDQQDA" alt="ReadMe Wizard Logo" width="300"/>
</a>

