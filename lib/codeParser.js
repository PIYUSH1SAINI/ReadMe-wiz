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
const PHP = require("tree-sitter-php");
const Go = require("tree-sitter-go");
const CSharp = require("tree-sitter-c-sharp");
const Rust = require("tree-sitter-rust");

async function getProjectFiles() {
  const entries = await globby([
    "**/*.{js,ts,jsx,tsx,py,java,html,css,rb,php,go,cs,rs,cpp,vue}",
    "!node_modules",
    "!dist",
    "!build",
  ]);
  return entries;
}

function parseCode(filePath) {
  try {
    const code = fs.readFileSync(filePath, "utf8");
    const parser = new Parser();
    const ext = path.extname(filePath).toLowerCase();
    const languageMap = {
      ".js": JavaScript,
      ".ts": JavaScript,
      ".jsx": JavaScript,
      ".tsx": JavaScript,
      ".java": Java,
      ".py": Python,
      ".html": HTML,
      ".css": CSS,
      ".rb": Ruby,
      ".php": PHP,
      ".go": Go,
      ".cs": CSharp,
      ".rs": Rust,
      ".cpp": require("tree-sitter-cpp"),
      ".vue": JavaScript,
    };
    if (!languageMap[ext]) return null;
    parser.setLanguage(languageMap[ext]);
    const tree = parser.parse(code);
    return summarizeTree(tree.rootNode, code, ext);
  } catch {
    return null;
  }
}

function summarizeTree(root, code, ext) {
  const summaries = [];
  const MAX_SUMMARIES_PER_FILE = 15;

  const nodeTypes = {
    ".js": ["function_declaration", "class_declaration"],
    ".ts": ["function_declaration", "class_declaration"],
    ".jsx": ["function_declaration", "class_declaration"],
    ".tsx": ["function_declaration", "class_declaration"],
    ".vue": ["function_declaration", "class_declaration"],
    ".java": ["method_declaration", "class_declaration"],
    ".py": ["function_definition", "class_definition"],
    ".html": ["element"],
    ".css": ["rule_set"],
    ".rb": ["method", "class"],
    ".php": ["function_definition", "class_declaration"],
    ".go": ["function_declaration", "type_declaration"],
    ".cs": ["method_declaration", "class_declaration"],
    ".rs": ["function_item", "struct_item"],
    ".cpp": ["function_definition", "class_specifier"],
  };

  const typeLabels = {
    function_declaration: "Function",
    class_declaration: "Class",
    method_declaration: "Method",
    function_definition: "Function",
    class_definition: "Class",
    element: "HTML Tag",
    rule_set: "CSS Selector",
    method: "Method",
    class: "Class",
    type_declaration: "Type",
    function_item: "Function",
    struct_item: "Struct",
  };

  const nodes = root.descendantsOfType(nodeTypes[ext] || []);
  for (let i = 0; i < Math.min(nodes.length, MAX_SUMMARIES_PER_FILE); i++) {
    const node = nodes[i];
    const nameNode = node.childForFieldName(
      node.type === "element" ? "start_tag" : "name"
    );
    const finalNameNode =
      node.type === "element"
        ? nameNode?.childForFieldName("tag_name")
        : nameNode;

    if (finalNameNode) {
      const name = code.slice(finalNameNode.startIndex, finalNameNode.endIndex);
      summaries.push(`${typeLabels[node.type] || node.type}: ${name}`);
    }
  }
  return summaries;
}

module.exports = { getProjectFiles, parseCode, summarizeTree };
