> ⚠️ This is a CLI tool. Please install it globally using:
> `npm install -g readme-wiz`

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

| Command                                  | Description                                                                                     |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `make-readme`                            | Creates a new README file using default settings. Overwrites existing README.                   |
| `make-readme --new`                      | Creates a completely new README file. Overwrites existing README.                               |
| `make-readme --new "some user requests"` | Creates a new README file incorporating specified user requests. Overwrites existing README.    |
| `make-readme "some user requests"`       | Updates an existing README file with specified user requests. Creates a new one if none exists. |

## 🧪 Requirements

- Node.js >=14
- Google Gemini API Key (set in .env)

## Contributors

<a href="https://github.com/PIYUSH1SAINI" target="_blank"><img src="https://avatars.githubusercontent.com/PIYUSH1SAINI?s=60&v=4" width="60" height="60" alt="@PIYUSH1SAINI" title="@PIYUSH1SAINI" style="border-radius: 50%; margin-right: 10px;" onerror="this.src='https://github.com/identicons/PIYUSH1SAINI.png'" /></a>

---

<a href="https://github.com/PIYUSH1SAINI/ReadMe-wiz.git" target="_blank">
      <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1754320207/ReadMe-wiz-logo_k3uq6w.png" alt="ReadMe Wiz Logo" width="300"/>
    </a>
