const fs = require("fs");
const path = require("path");
const globby = require("globby");
const Parser = require("tree-sitter");
const JavaScript = require("tree-sitter-javascript");
const Java = require("tree-sitter-java");
const Python = require("tree-sitter-python");
const HTML = require("tree-sitter-html");
const CSS = require("tree-sitter-css");
const Ruby = require("tree-sitter-ruby");
const PHPModule = require("tree-sitter-php");
const Go = require("tree-sitter-go");
const CSharp = require("tree-sitter-c-sharp");
const Rust = require("tree-sitter-rust");
const TypeScript = require("tree-sitter-typescript").typescript;
const TSX = require("tree-sitter-typescript").tsx;
const CPP = require("tree-sitter-cpp");

// Define nodeTypes at the top level
const nodeTypes = {
  ".js": ["function_declaration", "class_declaration"],
  ".ts": ["function_declaration", "class_declaration"],
  ".jsx": ["function_declaration", "class_declaration"],
  ".tsx": ["function_declaration", "class_declaration"],
  ".java": ["method_declaration", "class_declaration"],
  ".py": ["function_definition", "class_definition"],
  ".html": ["element", "start_tag"],
  ".css": ["rule_set", "qualified_rule", "at_rule"],
  ".rb": ["method", "class"],
  ".php": ["function_definition", "class_declaration"],
  ".go": ["function_declaration", "type_declaration"],
  ".cs": ["method_declaration", "class_declaration"],
  ".rs": ["function_item", "struct_item"],
  ".cpp": ["function_definition", "function_declarator", "class_specifier"],
};

// PHP language object handling with user-friendly message
let PHP;
try {
  PHP = PHPModule?.default || PHPModule?.language || PHPModule;
  if (!PHP) {
    throw new Error("PHP parser not available");
  }
} catch (err) {
  console.log("ℹ️  PHP parsing support is coming soon!");
  PHP = null;
}

// Enhanced CSS parsing fallback
function parseCSSFallback(code) {
  const rules = [];
  // Simple rule matching for basic CSS
  const ruleMatches = code.matchAll(/([^{]+)\s*{([^}]+)}/g);
  for (const match of ruleMatches) {
    const selector = match[1].trim();
    if (selector) {
      rules.push(`CSS Rule: ${selector}`);
    }
  }
  return rules;
}

// Enhanced Vue parsing
function parseVueComponent(code) {
  const results = [];
  // Check for export default
  if (code.includes("export default")) {
    const componentNameMatch = code.match(/name\s*:\s*["']([^"']+)["']/);
    if (componentNameMatch) {
      results.push(`Vue Component: ${componentNameMatch[1]}`);
    } else {
      results.push("Vue Component: Anonymous");
    }
  }

  // Find methods
  const methodMatches = code.matchAll(/(\w+)\s*\([^)]*\)\s*{/g);
  for (const match of methodMatches) {
    if (!["if", "for", "while"].includes(match[1])) {
      results.push(`Vue Method: ${match[1]}`);
    }
  }

  return results;
}

async function getProjectFiles() {
  const entries = await globby([
    "**/*.{js,ts,jsx,tsx,py,java,html,css,rb,php,go,cs,rs,cpp,vue}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/build/**",
  ]);
  return entries;
}

function parseCode(filePath) {
  try {
    const code = fs.readFileSync(filePath, "utf8");
    const parser = new Parser();
    const ext = path.extname(filePath).toLowerCase();

    // Special handling for PHP files
    if (ext === ".php") {
      return [
        "ℹ️ PHP support is coming soon! This file will be properly parsed in a future update.",
      ];
    }

    const languageMap = {
      ".js": JavaScript,
      ".ts": TypeScript,
      ".jsx": JavaScript,
      ".tsx": TSX,
      ".java": Java,
      ".py": Python,
      ".html": HTML,
      ".css": CSS,
      ".rb": Ruby,
      ".php": PHP,
      ".go": Go,
      ".cs": CSharp,
      ".rs": Rust,
      ".cpp": CPP,
    };

    // Special handling for CSS fallback
    if (ext === ".css") {
      const fallbackResults = parseCSSFallback(code);
      if (fallbackResults.length > 0) {
        return fallbackResults;
      }
    }

    // Special handling for Vue files
    if (ext === ".vue") {
      const scriptMatch = code.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
      if (scriptMatch) {
        const scriptContent = scriptMatch[1];
        const vueResults = parseVueComponent(scriptContent);
        if (vueResults.length > 0) {
          return vueResults;
        }
      }
      return [];
    }

    // Special case: .vue files
    if (ext === ".vue") {
      const scriptMatch = code.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
      if (scriptMatch) {
        const scriptContent = scriptMatch[1];
        // Check if it's TypeScript
        const isTS =
          scriptMatch[0].includes('lang="ts"') ||
          scriptMatch[0].includes("lang='ts'") ||
          scriptMatch[0].includes("lang=ts");

        const lang = isTS ? TypeScript : JavaScript;
        parser.setLanguage(lang);
        const tree = parser.parse(scriptContent);
        const result = summarizeTree(
          tree.rootNode,
          scriptContent,
          isTS ? ".ts" : ".js"
        );
        if (result.length === 0) {
          console.warn(
            `⚠️ ${path.basename(
              filePath
            )} → No extractable items found in Vue script`
          );
        }
        return result;
      }
      console.warn(
        `⚠️ ${path.basename(filePath)} → No <script> tag found in Vue file`
      );
      return [];
    }

    const language = languageMap[ext];
    if (!language) {
      console.warn(`No parser available for ${ext} files`);
      return null;
    }

    try {
      parser.setLanguage(language);
    } catch (err) {
      console.error(`❌ Invalid language object for ${ext}: ${err.message}`);
      return null;
    }

    const tree = parser.parse(code);
    const summary = summarizeTree(tree.rootNode, code, ext);

    // if (!summary.length) {
    //   console.warn(
    //     `⚠️ ${path.basename(filePath)} → No extractable items found ` +
    //       `(searched for: ${(nodeTypes[ext] || []).join(", ")})`
    //   );
    // }

    return summary;
  } catch (err) {
    console.error(`Error parsing ${filePath}: ${err.message}`);
    return null;
  }
}

function summarizeTree(root, code, ext) {
  const summaries = [];
  const MAX_SUMMARIES_PER_FILE = 15;

  const typeLabels = {
    function_declaration: "Function",
    class_declaration: "Class",
    method_declaration: "Method",
    function_definition: "Function",
    class_definition: "Class",
    element: "HTML Element",
    start_tag: "HTML Tag",
    rule_set: "CSS Rule",
    qualified_rule: "CSS Rule",
    at_rule: "@ Rule",
    method: "Method",
    class: "Class",
    type_declaration: "Type",
    function_item: "Function",
    struct_item: "Struct",
    function_declarator: "Function",
    class_specifier: "Class",
  };

  const nodes = root.descendantsOfType(nodeTypes[ext] || []);

  for (let i = 0; i < Math.min(nodes.length, MAX_SUMMARIES_PER_FILE); i++) {
    const node = nodes[i];
    const nodeType = getNodeType(node, ext);

    if (nodeType === "element" || nodeType === "start_tag") {
      const nameNode =
        node.childForFieldName("name") || node.childForFieldName("tag_name");
      if (nameNode) {
        const name = code.slice(nameNode.startIndex, nameNode.endIndex);
        summaries.push(`${typeLabels[nodeType] || "Element"}: ${name}`);
      } else {
        summaries.push(
          `${typeLabels[nodeType] || "Element"}: <${node.text
            .slice(0, 50)
            .replace(/\n/g, "")}...>`
        );
      }
    } else if (nodeType === "rule_set" || nodeType === "qualified_rule") {
      const selectors = node.descendantsOfType("selector");
      if (selectors.length > 0) {
        const selectorText = selectors
          .map((s) => code.slice(s.startIndex, s.endIndex).trim())
          .join(", ");
        summaries.push(`CSS Rule: ${selectorText}`);
      }
    } else if (nodeType === "function_definition" && ext === ".cpp") {
      // Special handling for C++ function definitions
      const declarator = node.childForFieldName("declarator");
      if (declarator) {
        const funcName = declarator.childForFieldName("name");
        if (funcName) {
          const name = code.slice(funcName.startIndex, funcName.endIndex);
          summaries.push(`Function: ${name}`);
        } else {
          // Fallback for C++ functions without a name node
          const funcText = code
            .slice(node.startIndex, node.endIndex)
            .split("{")[0]
            .trim();
          summaries.push(`Function: ${funcText}`);
        }
      }
    } else {
      const nameNode =
        node.childForFieldName("name") ||
        node.childForFieldName("declarator")?.childForFieldName("name");

      if (nameNode) {
        const name = code.slice(nameNode.startIndex, nameNode.endIndex);
        summaries.push(`${typeLabels[nodeType] || nodeType}: ${name}`);
      }
    }
  }

  return summaries;
}

function getNodeType(node, ext) {
  if (ext === ".cpp" && node.type === "function_definition") {
    return "function_definition";
  }
  return node.type;
}

module.exports = { getProjectFiles, parseCode, summarizeTree };
