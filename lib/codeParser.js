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

// Enhanced node types with more granular parsing
const nodeTypes = {
  ".js": [
    "function_declaration",
    "class_declaration",
    "method_definition",
    "export_statement",
    "import_statement",
    "variable_declarator",
    "call_expression",
  ],
  ".ts": [
    "function_declaration",
    "class_declaration",
    "interface_declaration",
    "type_alias_declaration",
    "enum_declaration",
    "decorator",
    "import_statement",
  ],
  ".jsx": [
    "function_declaration",
    "class_declaration",
    "jsx_element",
    "jsx_opening_element",
  ],
  ".tsx": [
    "function_declaration",
    "class_declaration",
    "interface_declaration",
    "jsx_element",
    "jsx_opening_element",
  ],
  ".java": [
    "method_declaration",
    "class_declaration",
    "interface_declaration",
    "enum_declaration",
    "annotation_declaration",
    "import_declaration",
  ],
  ".py": [
    "function_definition",
    "class_definition",
    "decorated_definition",
    "import_statement",
    "call",
  ],
  ".html": ["element", "start_tag", "script_element", "style_element"],
  ".css": ["rule_set", "qualified_rule", "at_rule", "keyframes"],
  ".rb": ["method", "class", "module", "require"],
  ".php": [
    "function_definition",
    "class_declaration",
    "namespace_use_declaration",
  ],
  ".go": ["function_declaration", "type_declaration", "import_spec"],
  ".cs": [
    "method_declaration",
    "class_declaration",
    "namespace_declaration",
    "using_directive",
  ],
  ".rs": ["function_item", "struct_item", "mod_item", "use_declaration"],
  ".cpp": [
    "function_definition",
    "class_specifier",
    "namespace_definition",
    "using_directive",
  ],
};

// PHP language object handling
let PHP;
try {
  PHP = PHPModule?.default || PHPModule?.language || PHPModule;
  if (!PHP) {
    throw new Error("PHP parser not available");
  }
} catch (err) {
  console.log("ℹ️ PHP parsing support is coming soon!");
  PHP = null;
}

// Enhanced CSS parsing with more detailed information
function parseCSSFallback(code) {
  const rules = [];
  const ruleMatches = code.matchAll(/([^{]+)\s*{([^}]+)}/g);
  for (const match of ruleMatches) {
    const selector = match[1].trim();
    const properties = match[2].trim();
    if (selector) {
      rules.push(
        `CSS Rule: ${selector} with ${
          properties.split(";").filter((p) => p.trim()).length
        } properties`
      );
    }
  }
  return rules;
}

// Enhanced Vue parsing with component analysis
function parseVueComponent(code) {
  const results = [];

  // Template analysis
  const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/i);
  if (templateMatch) {
    const templateContent = templateMatch[1];
    const elementCount = (templateContent.match(/<\w+/g) || []).length;
    results.push(`Vue Template: ${elementCount} elements`);
  }

  // Script analysis
  const scriptMatch = code.match(/<script\b[^>]*>([\s\S]*?)<\/script>/i);
  if (scriptMatch) {
    const scriptContent = scriptMatch[1];
    const componentNameMatch = scriptContent.match(
      /name\s*:\s*["']([^"']+)["']/
    );
    const componentName = componentNameMatch
      ? componentNameMatch[1]
      : "Anonymous";

    const methodMatches = scriptContent.matchAll(/(\w+)\s*\([^)]*\)\s*{/g);
    const methods = [];
    for (const match of methodMatches) {
      if (!["if", "for", "while", "catch"].includes(match[1])) {
        methods.push(match[1]);
      }
    }

    results.push(
      `Vue Component: ${componentName} with ${methods.length} methods`
    );
    if (methods.length > 0) {
      results.push(
        `Methods: ${methods.slice(0, 5).join(", ")}${
          methods.length > 5 ? "..." : ""
        }`
      );
    }
  }

  // Style analysis
  const styleMatch = code.match(/<style\b[^>]*>([\s\S]*?)<\/style>/i);
  if (styleMatch) {
    const styleContent = styleMatch[1];
    const ruleCount = (styleContent.match(/[^{]+\s*{/g) || []).length;
    results.push(`Vue Styles: ${ruleCount} CSS rules`);
  }

  return results;
}

async function getProjectFiles() {
  const entries = await globby([
    "**/*.{js,ts,jsx,tsx,py,java,html,css,rb,php,go,cs,rs,cpp,vue}",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/build/**",
    "!**/test/**",
    "!**/tests/**",
    "!**/__tests__/**",
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

    // Special handling for CSS files
    if (ext === ".css") {
      const fallbackResults = parseCSSFallback(code);
      if (fallbackResults.length > 0) {
        return fallbackResults;
      }
    }

    // Special handling for Vue files
    if (ext === ".vue") {
      return parseVueComponent(code);
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

    return summary;
  } catch (err) {
    console.error(`Error parsing ${filePath}: ${err.message}`);
    return null;
  }
}

function summarizeTree(root, code, ext) {
  const summaries = [];
  const MAX_SUMMARIES_PER_FILE = 25;

  const typeLabels = {
    function_declaration: "Function",
    class_declaration: "Class",
    method_definition: "Method",
    export_statement: "Export",
    import_statement: "Import",
    variable_declarator: "Variable",
    call_expression: "Function Call",
    interface_declaration: "Interface",
    type_alias_declaration: "Type Alias",
    enum_declaration: "Enum",
    decorated_definition: "Decorated",
    method_declaration: "Method",
    class_definition: "Class",
    element: "HTML Element",
    start_tag: "HTML Tag",
    script_element: "Script Tag",
    style_element: "Style Tag",
    rule_set: "CSS Rule",
    qualified_rule: "CSS Rule",
    at_rule: "@ Rule",
    keyframes: "@keyframes",
    method: "Method",
    class: "Class",
    module: "Module",
    require: "Require",
    type_declaration: "Type",
    function_item: "Function",
    struct_item: "Struct",
    mod_item: "Module",
    use_declaration: "Use",
    function_definition: "Function",
    class_specifier: "Class",
    namespace_definition: "Namespace",
    using_directive: "Using",
    jsx_element: "JSX Element",
    jsx_opening_element: "JSX Opening Element",
  };

  const getFunctionDetails = (node) => {
    const params = node
      .descendantsOfType(["formal_parameters", "parameters"])
      .map((p) => code.slice(p.startIndex, p.endIndex))
      .join(", ");
    const returns = node
      .descendantsOfType(["type_annotation", "return_type"])
      .map((t) => code.slice(t.startIndex, t.endIndex))
      .join(", ");
    return {
      params: params ? `(${params})` : "()",
      returns: returns ? ` → ${returns}` : "",
    };
  };

  const getClassDetails = (node) => {
    const modifiers = node
      .descendantsOfType("modifier")
      .map((m) => code.slice(m.startIndex, m.endIndex))
      .join(" ");
    return modifiers ? ` ${modifiers}` : "";
  };

  const nodes = root.descendantsOfType(nodeTypes[ext] || []);

  for (let i = 0; i < Math.min(nodes.length, MAX_SUMMARIES_PER_FILE); i++) {
    const node = nodes[i];
    const nodeType = getNodeType(node, ext);
    const label = typeLabels[nodeType] || nodeType;

    // Function/Method handling
    if (nodeType.includes("function") || nodeType.includes("method")) {
      const details = getFunctionDetails(node);
      const nameNode = node.childForFieldName("name");
      if (nameNode) {
        const name = code.slice(nameNode.startIndex, nameNode.endIndex);
        summaries.push(`${label}: ${name}${details.params}${details.returns}`);
        continue;
      }
    }

    // Class/Interface handling
    if (nodeType.includes("class") || nodeType.includes("interface")) {
      const nameNode = node.childForFieldName("name");
      if (nameNode) {
        const name = code.slice(nameNode.startIndex, nameNode.endIndex);
        const modifiers = getClassDetails(node);
        summaries.push(`${label}:${modifiers} ${name}`);
        continue;
      }
    }

    // JSX/HTML Elements
    if (nodeType.includes("jsx") || nodeType.includes("element")) {
      const nameNode =
        node.childForFieldName("name") || node.childForFieldName("tag_name");
      if (nameNode) {
        const name = code.slice(nameNode.startIndex, nameNode.endIndex);
        const attrs = node.descendantsOfType(["attribute", "jsx_attribute"]);
        summaries.push(
          `${label}: <${name}${
            attrs.length ? ` with ${attrs.length} attrs` : ""
          }>`
        );
        continue;
      }
    }

    // Default handling
    const nameNode =
      node.childForFieldName("name") ||
      node.childForFieldName("declarator")?.childForFieldName("name");
    if (nameNode) {
      const name = code.slice(nameNode.startIndex, nameNode.endIndex);
      summaries.push(`${label}: ${name}`);
    } else if (nodeType === "call_expression") {
      const funcNode = node.childForFieldName("function");
      if (funcNode) {
        const funcName = code.slice(funcNode.startIndex, funcNode.endIndex);
        summaries.push(`${label}: ${funcName}()`);
      }
    }
  }

  return summaries;
}

function getNodeType(node, ext) {
  // Special handling for C++ function definitions
  if (ext === ".cpp" && node.type === "function_definition") {
    return "function_definition";
  }
  return node.type;
}

module.exports = { getProjectFiles, parseCode, summarizeTree };
