const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const ora = require("ora").default;
const prompts = require("prompts");
const globby = require("globby");
const {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} = require("@google/generative-ai");

// Import our modules
const codeParser = require("./codeParser");
const gitUtils = require("./gitUtils");
const uiHelpers = require("./uiHelpers");
const { highlight, success, error } = uiHelpers.colors;
const promptBuilder = require("./promptBuilder");

const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

const MODEL = "gemini-1.5-flash"; // UPDATED model name

async function validateGeminiApiKey(apiKey) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL,
    });
    await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "ping" }] }],
    });
    return { valid: true };
  } catch (err) {
    if (
      err.message.includes("503") ||
      err.message.includes("model is overloaded")
    ) {
      return { valid: false, reason: "overload" };
    }
    return { valid: false, reason: "invalid" };
  }
}

async function handleApiKeySetup() {
  await uiHelpers.showWelcomeScreen();

  let apiKey = "";

  while (true) {
    const response = await prompts({
      type: "text",
      name: "apiKey",
      message: "🔑 Paste your Gemini API key here:",
      validate: (value) =>
        value.trim() ? true : "API key cannot be empty. Please try again.",
    });

    if (!response.apiKey) {
      console.log(error("\n❌ No API key provided. Exiting...\n"));
      process.exit(1);
    }

    apiKey = response.apiKey.trim();
    const result = await validateGeminiApiKey(apiKey);

    if (result.valid) {
      fs.writeFileSync(envPath, `GEMINI_API_KEY=${apiKey}\n`, {
        encoding: "utf8",
      });
      dotenv.config({ path: envPath });

      console.log(success("\n✅ API key validated and saved to .env file!"));
      break;
    }

    if (result.reason === "overload") {
      fs.writeFileSync(envPath, `GEMINI_API_KEY=${apiKey}\n`, {
        encoding: "utf8",
      });
      dotenv.config({ path: envPath });

      console.log(
        highlight("\n⚠️  The Gemini model is currently overloaded (503).")
      );
      console.log(
        uiHelpers.colors.info(
          "💡 Your API key has been saved, but you'll need to try again later when the service is available.\n"
        )
      );
      break;
    }

    console.log(error("❌ Invalid API key. Please try again.\n"));
    console.log(uiHelpers.colors.info("🔍 Possible reasons:"));
    console.log(" • The key you entered is incorrect or expired.");
    console.log(
      " • You haven't enabled Generative AI access in your Google account."
    );
    console.log(" • Your account may not have billing or quota enabled.\n");
    console.log(success("✅ Solution:"));
    console.log(" • Go to https://makersuite.google.com/app/apikey");
    console.log(
      " • Ensure you're logged in and have access to the Gemini API."
    );
    console.log(" • Generate a new API key and paste it below.\n");
  }
}

async function generateReadme(userInput = "") {
  if (!fs.existsSync(envPath) || !process.env.GEMINI_API_KEY) {
    await handleApiKeySetup();
  } else {
    const isValid = await validateGeminiApiKey(process.env.GEMINI_API_KEY);
    if (!isValid) {
      console.log(
        error("❌ Existing API key is invalid. Please enter a new one.\n")
      );
      await handleApiKeySetup();
    }
  }

  let modifyExisting = false;
  let existingReadmeContent = "";
  let userCustomPrompt = "";

  if (userInput) {
    if (userInput === "--new") {
      userCustomPrompt = "";
    } else if (userInput.startsWith("--new ")) {
      userCustomPrompt = userInput.slice(6).trim();
    } else {
      userCustomPrompt = userInput.trim();
      const readmePath = path.join(process.cwd(), "README.md");
      if (fs.existsSync(readmePath)) {
        existingReadmeContent = fs.readFileSync(readmePath, "utf8");
        if (existingReadmeContent.trim().length > 0) {
          modifyExisting = true;
        }
      }
    }
  } else {
    userCustomPrompt = "";
  }

  const spinner = ora({
    text: `🧙‍♂️✨ ${
      modifyExisting
        ? "Updating existing README..."
        : "Generating new README..."
    }`,
    color: "magenta",
  }).start();

  try {
    const [gitInfo, contributors, allFiles] = await Promise.all([
      gitUtils.getGitInfo(),
      gitUtils.getContributorCounts(),
      globby([
        "**/*.{js,ts,jsx,tsx,py,java,html,css,rb,php,go,cs,rs,cpp,vue}",
        "!node_modules/**",
        "!dist/**",
        "!build/**",
      ]),
    ]);

    const importantFiles = allFiles.filter(
      (file) =>
        /(package\.json|main\.|index\.|app\.|src\/|config\.|router\.|app\.|server\.)/i.test(
          file
        ) || file.split("/").length <= 2
    );

    const otherFiles = allFiles
      .filter((file) => !importantFiles.includes(file))
      .slice(0, 25);

    const filesToParse = [...importantFiles, ...otherFiles];

    const codeInsights = [];
    for (const file of filesToParse) {
      const summary = codeParser.parseCode(file);
      if (summary && summary.length) {
        codeInsights.push(
          `📄 ${file}\n${summary.map((s) => `- ${s}`).join("\n")}`
        );
      }
    }

    const prompt = await promptBuilder(
      gitInfo,
      contributors,
      filesToParse,
      codeInsights,
      userCustomPrompt,
      modifyExisting,
      existingReadmeContent
    );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 4000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ],
    });

    let result;
    try {
      result = await model.generateContentStream({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
    } catch (err) {
      const errMsg = err.message || "";

      if (errMsg.includes("503") || errMsg.toLowerCase().includes("overload")) {
        spinner.fail(error("❌ Gemini API Overloaded"));
        console.log(highlight("🚫  503 Service Unavailable"));
        console.log(uiHelpers.colors.info("⏳  Try again in a few minutes."));
        process.exit(1);
      }

      if (
        errMsg.includes("429") &&
        errMsg.toLowerCase().includes("quota") &&
        errMsg.toLowerCase().includes("exceeded")
      ) {
        spinner.fail(error("❌ Gemini API Quota Exceeded"));
        console.log(
          highlight(
            "\n⚠️ Your current Gemini API key has exceeded its daily quota limit."
          )
        );
        console.log(
          uiHelpers.colors.info("💡 Free-tier keys allow only 50 requests/day.")
        );
        console.log(success("👉 Please enter a new Gemini API key below:\n"));

        let isValidKey = false;
        while (!isValidKey) {
          const response = await prompts({
            type: "text",
            name: "apiKey",
            message: "🔑 New Gemini API key:",
            validate: (value) =>
              value.trim()
                ? true
                : "API key cannot be empty. Please try again.",
          });

          const newKey = response.apiKey?.trim();
          if (!newKey) {
            console.log(error("❌ No key entered. Exiting..."));
            process.exit(1);
          }

          const result = await validateGeminiApiKey(newKey);
          if (result.valid) {
            fs.writeFileSync(envPath, `GEMINI_API_KEY=${newKey}\n`, {
              encoding: "utf8",
            });
            dotenv.config({ path: envPath });
            console.log(success("✅ API key saved successfully.\n"));
            isValidKey = true;
          } else {
            console.log(error("❌ Invalid API key. Please try again.\n"));
          }
        }

        await generateReadme(userInput);
        return;
      }

      spinner.fail("❌ An error occurred during README generation.");
      console.error(errMsg);
      process.exit(1);
    }

    const writeStream = fs.createWriteStream("README.md");
    writeStream.on("error", (err) => {
      spinner.fail("❌ Failed to write README.md");
      console.error(err);
      process.exit(1);
    });

    for await (const chunk of result.stream) {
      const text = chunk.text?.();
      if (typeof text === "string") {
        writeStream.write(text);
      }
    }

    const badgeImage = `\n\n<a href="https://github.com/PIYUSH1SAINI/ReadMe-wiz.git" target="_blank">
      <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1754320207/ReadMe-wiz-logo_k3uq6w.png" alt="ReadMe Wiz Logo" width="300"/>
    </a>\n`;

    if (!modifyExisting) {
      writeStream.write(badgeImage);
    }

    writeStream.end(() => {
      spinner.succeed("✅ README.md generated successfully!");
    });
  } catch (err) {
    spinner.fail("❌ An error occurred during README generation.");
    console.error(err.message || err);
    process.exit(1);
  }
}

module.exports = generateReadme;
