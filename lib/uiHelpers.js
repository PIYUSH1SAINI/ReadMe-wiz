//lib/uiHelpers.js
const chalk = require("chalk");
const figlet = require("figlet");
const { promisify } = require("util");
const figletAsync = promisify(figlet.text);

// Color helpers
const purple = chalk.hex("#9b59b6");
const boldPurple = purple.bold;
const success = chalk.green.bold;
const error = chalk.red.bold;
const info = chalk.cyan;
const highlight = chalk.yellowBright;

// Wizard head ASCII (styled)
const wizardAscii = chalk.magentaBright(`
       ,     _
      /|    | |
    _/_\\_   >_<
   .-\\-/.    |
  /  | | \\_  |
  \\ \\| |\\__(/
  /(\`---')   |
 / /     \\   |
_.'  \\'-'/   |
\`---'\`=-='  '  
`);

async function showWelcomeScreen() {
  const asciiArt = await figletAsync("ReadMe Wiz", {
    font: "Standard",
    horizontalLayout: "default",
    verticalLayout: "default",
  });

  console.clear();
  console.log(purple(asciiArt));
  console.log(wizardAscii);
  console.log(purple("━".repeat(79)));
  console.log(
    `${highlight("✨ Welcome to")} ${boldPurple("ReadMe Wiz")} ${highlight(
      "Setup!"
    )} ✨`
  );
  console.log(
    info(
      "\nTo generate awesome READMEs, we need your Google Generative AI API key.\n"
    )
  );
  console.log(`🔮 ${boldPurple("Steps to Get Started:")}\n`);
  console.log(
    ` 1️⃣ Get your API key from: ${chalk.underline(
      "https://makersuite.google.com/app/apikey"
    )}\n`
  );
  console.log(
    ` 2️⃣ Paste it below — we'll validate it and save it in a ${chalk.cyan(
      ".env"
    )} file.\n`
  );
}

module.exports = {
  showWelcomeScreen,
  colors: { purple, boldPurple, success, error, info, highlight },
  wizardAscii,
};
