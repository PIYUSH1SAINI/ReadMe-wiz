const { execSync } = require("child_process");
const simpleGit = require("simple-git");

function extractGitHubUsername(email) {
  const match = email.match(/^.*\+(.+)@users\.noreply\.github\.com$/);
  return match ? match[1] : null;
}

function getContributorCounts() {
  try {
    const output = execSync('git log --format="%aN|%aE"', { encoding: "utf8" });
    const userMap = new Map();

    output
      .trim()
      .split("\n")
      .forEach((line) => {
        const [name, email] = line.split("|");
        const key = `${name}|${email}`;
        const usernameFromEmail = extractGitHubUsername(email);
        const isNameValidGitHubHandle = /^[a-zA-Z0-9-]+$/.test(name.trim());
        const likelyUsername = isNameValidGitHubHandle ? name.trim() : null;
        const username = usernameFromEmail || likelyUsername;

        if (!username) return;

        if (!userMap.has(username)) {
          userMap.set(username, {
            name,
            email,
            count: 1,
            username,
            isReliable: !!usernameFromEmail,
          });
        } else {
          userMap.get(username).count++;
        }
      });

    return Array.from(userMap.values());
  } catch (err) {
    console.warn("⚠️ Could not retrieve Git contributors:", err.message);
    return [];
  }
}

async function getGitInfo() {
  const git = simpleGit();
  try {
    const config = await git.listConfig();
    const user = config.all["user.name"] || "Unknown Author";
    const remote = config.all["remote.origin.url"] || "";
    return { user, repo: remote.split("/").pop().replace(".git", ""), remote };
  } catch {
    return { user: "Unknown Author", repo: "unknown", remote: "" };
  }
}

module.exports = {
  getContributorCounts,
  getGitInfo,
  extractGitHubUsername,
};
