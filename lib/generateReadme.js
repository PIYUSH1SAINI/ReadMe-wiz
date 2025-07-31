const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const ora = require("ora").default;
const prompts = require("prompts");
const globby = require("globby");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Import our modules
const codeParser = require("./codeParser");
const gitUtils = require("./gitUtils");
const uiHelpers = require("./uiHelpers");
const { highlight, success, error } = uiHelpers.colors;
const promptBuilder = require("./promptBuilder");

const envPath = path.join(__dirname, "..", ".env");
dotenv.config({ path: envPath });

const MODEL = "models/gemini-1.5-flash";

async function validateGeminiApiKey(apiKey) {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: MODEL });
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
      console.log(
        uiHelpers.colors.error("\n❌ No API key provided. Exiting...\n")
      );
      process.exit(1);
    }

    apiKey = response.apiKey.trim();
    const result = await validateGeminiApiKey(apiKey);

    if (result.valid) {
      fs.writeFileSync(envPath, `GEMINI_API_KEY=${apiKey}\n`, {
        encoding: "utf8",
      });
      dotenv.config({ path: envPath });

      console.log(
        uiHelpers.colors.success(
          "\n✅ API key validated and saved to .env file!"
        )
      );
      break;
    }

    if (result.reason === "overload") {
      // Save the key anyway
      fs.writeFileSync(envPath, `GEMINI_API_KEY=${apiKey}\n`, {
        encoding: "utf8",
      });
      dotenv.config({ path: envPath });

      console.log(
        uiHelpers.colors.highlight(
          "\n⚠️  The Gemini model is currently overloaded (503)."
        )
      );
      console.log(
        uiHelpers.colors.info(
          "💡 Your API key has been saved, but you'll need to try again later when the service is available.\n"
        )
      );
      break;
    }

    // Invalid key
    console.log(
      uiHelpers.colors.error("❌ Invalid API key. Please try again.\n")
    );
    console.log(uiHelpers.colors.info("🔍 Possible reasons:"));
    console.log(" • The key you entered is incorrect or expired.");
    console.log(
      " • You haven't enabled Generative AI access in your Google account."
    );
    console.log(" • Your account may not have billing or quota enabled.\n");
    console.log(uiHelpers.colors.success("✅ Solution:"));
    console.log(" • Go to https://makersuite.google.com/app/apikey");
    console.log(
      " • Ensure you're logged in and have access to the Gemini API."
    );
    console.log(" • Generate a new API key and paste it below.\n");
  }
}

async function generateReadme() {
  // Step 1: Check for API key and validate/setup if needed
  if (!fs.existsSync(envPath) || !process.env.GEMINI_API_KEY) {
    await handleApiKeySetup();
  } else {
    // Verify existing API key is still valid
    const isValid = await validateGeminiApiKey(process.env.GEMINI_API_KEY);
    if (!isValid) {
      console.log(
        uiHelpers.colors.error(
          "❌ Existing API key is invalid. Please enter a new one.\n"
        )
      );
      await handleApiKeySetup();
    }
  }

  // Step 2: Proceed with generation
  const spinner = ora({
    text: "🧙‍♂️✨ Generating your README...",
    color: "magenta",
  }).start();

  try {
    // Get all needed data
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

    // Prioritize important files
    const importantFiles = allFiles.filter(
      (file) =>
        /(package\.json|main\.|index\.|app\.|src\/|config\.|router\.|app\.|server\.)/i.test(
          file
        ) || file.split("/").length <= 2 // Files in root or one level deep
    );

    // Get other files (up to 25 to stay within limits)
    const otherFiles = allFiles
      .filter((file) => !importantFiles.includes(file))
      .slice(0, 25);

    const filesToParse = [...importantFiles, ...otherFiles];

    // Parse code files
    const codeInsights = [];
    for (const file of filesToParse) {
      const summary = codeParser.parseCode(file);
      if (summary && summary.length) {
        codeInsights.push(
          `📄 ${file}\n${summary.map((s) => `- ${s}`).join("\n")}`
        );
      }
    }

    // Build and send prompt
    const prompt = await promptBuilder(
      gitInfo,
      contributors,
      filesToParse,
      codeInsights
    );
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL });

    let result;
    try {
      result = await model.generateContentStream({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
    } catch (err) {
      const errMsg = err.message || "";
      const isQuotaError =
        errMsg.includes("429") &&
        errMsg.toLowerCase().includes("quota") &&
        errMsg.toLowerCase().includes("exceeded");

      // Debug print actual error response for clarity
      // console.log(uiHelpers.colors.error("\n🚨 Gemini API Error Response:"));
      // console.dir(err, { depth: null });

      if (errMsg.includes("503") || errMsg.toLowerCase().includes("overload")) {
        spinner.fail(uiHelpers.colors.error("❌ Gemini API Overloaded"));
        console.log(uiHelpers.colors.highlight("🚫  503 Service Unavailable"));
        console.log(uiHelpers.colors.info("⏳  Try again in a few minutes."));
        process.exit(1);
      }

      if (isQuotaError) {
        spinner.fail(uiHelpers.colors.error("❌ Gemini API Quota Exceeded"));
        console.log(
          uiHelpers.colors.highlight(
            "\n⚠️ Your current Gemini API key has exceeded its daily quota limit."
          )
        );
        console.log(
          uiHelpers.colors.info("💡 Free-tier keys allow only 50 requests/day.")
        );
        console.log(
          uiHelpers.colors.success(
            "👉 Please enter a new Gemini API key below:\n"
          )
        );

        const response = await prompts({
          type: "text",
          name: "apiKey",
          message: "🔑 New Gemini API key:",
          validate: (value) =>
            value.trim() ? true : "API key cannot be empty. Please try again.",
        });

        const newKey = response.apiKey?.trim();

        if (!newKey) {
          console.log(uiHelpers.colors.error("❌ No key entered. Exiting..."));
          process.exit(1);
        }

        const result = await validateGeminiApiKey(newKey);

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
            console.log(
              uiHelpers.colors.error("❌ No key entered. Exiting...")
            );
            process.exit(1);
          }

          const result = await validateGeminiApiKey(newKey);

          if (result.valid) {
            fs.writeFileSync(envPath, `GEMINI_API_KEY=${newKey}\n`, {
              encoding: "utf8",
            });
            dotenv.config({ path: envPath }); // reload the new key into process.env
            console.log(
              uiHelpers.colors.success("✅ API key saved successfully.\n")
            );
            isValidKey = true;
          } else {
            console.log(
              uiHelpers.colors.error("❌ Invalid API key. Please try again.\n")
            );
          }
        }

        // Re-attempt README generation after setting new key
        await generateReadme();
        return;
      }

      spinner.fail("❌ An error occurred during README generation.");
      console.error(errMsg);
      process.exit(1);
    }

    // Write results
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

    // Add badge at the end
    const badgeImage = `\n\n<a href="https://github.com/PIYUSH1SAINI/ReadMe-wizard.git" target="_blank">
      <img src="https://res.cloudinary.com/dy1znaiby/image/upload/v1753459910/ReadMe-wizard-logo_ouhi2h.png" alt="ReadMe Wizard Logo" width="300"/>
    </a>\n`;

    writeStream.write(badgeImage);
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
