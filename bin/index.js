#!/usr/bin/env node

const generateReadme = require("../lib/generateReadme");

// Get command-line arguments after "make-readme"
const userInput = process.argv.slice(2).join(" ");
// console.log(`User input: ${userInput}`);

generateReadme(userInput);
