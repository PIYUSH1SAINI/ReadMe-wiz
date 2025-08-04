# readme-wiz

> 🧙 A CLI to auto-generate professional `README.md` files using AI and code analysis.

## ✨ Features

- Parses code in multiple languages to extract project insights.
- Uses AI to generate markdown-formatted `README.md` files.
- Easily configurable via prompts or flags.
- Supports Git-based contributor detection.

## 🚀 Installation

```bash
npm install -g readme-wiz
```

## 🛠️ Usage

Generate a new README file in the current directory:

```bash
make-readme
```

The following options are available:

1. **`make-readme`**: This command creates a new README file using default settings. If a README already exists, it will overwrite it.

2. **`make-readme --new`**: This command creates a completely new README file. If a README already exists, it will be overwritten.

3. **`make-readme --new "some user requests"`**: This command creates a new README file incorporating the specified user requests. The requests should be a description of the desired content for the README. If a README already exists, it will be overwritten.

4. **`make-readme "some user requests"`**: This command updates an existing README file with the specified user requests. The requests should be a description of the desired content changes for the README. If no README file exists, a new one will be created.

## 🧪 Requirements

- Node.js >=14
- Google Gemini API Key (set in .env)
